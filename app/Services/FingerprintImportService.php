<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\SystemSetting;
use Carbon\Carbon;

class FingerprintImportService
{
    /**
     * Parse raw scan logs from fingerprint machine.
     *
     * @param  array<int, array>  $rawScans
     * @return array{ready: array, anomalies: array, unmapped: array, unmapped_pins: array, total_scans: int}
     */
    public function parseScans(array $rawScans, int $locationId): array
    {
        $toleranceMinutes = (int) data_get(
            SystemSetting::getByKey('attendance_policy', []),
            'lateToleranceMinutes',
            15
        );

        // Map by biometric_pin, with fallback to numeric NIP across all employees
        $allEmployees = Employee::with(['shift', 'location'])->get();
        $empByPin = [];
        foreach ($allEmployees as $emp) {
            $pin = (string) ($emp->biometric_pin ?? preg_replace('/\D/', '', $emp->nip));
            $empByPin[$pin] = $emp;
        }
        if ($locationId > 0) {
            foreach ($allEmployees->where('location_id', $locationId) as $emp) {
                $pin = (string) ($emp->biometric_pin ?? preg_replace('/\D/', '', $emp->nip));
                $empByPin[$pin] = $emp;
            }
        }

        // 1. Group scans by PIN & clean/sort timestamps
        $scansByPin = [];
        foreach ($rawScans as $scan) {
            $pin = trim((string) ($scan['pin'] ?? $scan['ID'] ?? $scan['id'] ?? ''));
            $ts = trim((string) ($scan['timestamp'] ?? ''));

            if (! $ts && ! empty($scan['Tanggal Absensi']) && ! empty($scan['Jam Absensi'])) {
                $ts = trim((string) ($scan['Tanggal Absensi'].' '.$scan['Jam Absensi']));
            }

            if (! $pin || ! $ts) {
                continue;
            }

            try {
                $carbon = Carbon::parse($ts);
                $scansByPin[$pin][] = $carbon;
            } catch (\Exception $e) {
                // Ignore invalid date format
            }
        }

        $ready = [];
        $anomalies = [];
        $unmappedPins = [];

        foreach ($scansByPin as $pin => $timestamps) {
            $employee = $empByPin[$pin] ?? null;

            if (! $employee) {
                $unmappedPins[] = [
                    'pin' => $pin,
                    'total_scans' => count($timestamps),
                    'sample_scan' => $timestamps[0]->format('Y-m-d H:i:s'),
                ];

                continue;
            }

            // Deduplicate scans: ignore duplicate scans within 5 minutes (300 seconds)
            usort($timestamps, fn ($a, $b) => $a->timestamp <=> $b->timestamp);
            $deduped = [];
            foreach ($timestamps as $t) {
                if (empty($deduped)) {
                    $deduped[] = $t;

                    continue;
                }
                $last = $deduped[count($deduped) - 1];
                if (($t->timestamp - $last->timestamp) >= 300) {
                    $deduped[] = $t;
                }
            }

            // Group scans into duty shifts
            $shiftCategory = $employee->shift?->code ?? 'PAGI';
            $isNightShift = str_contains(strtoupper($shiftCategory), 'MALAM');

            $pairedDays = $this->pairScansIntoDailyRecords($deduped, $isNightShift, $toleranceMinutes, $employee);

            foreach ($pairedDays as $record) {
                if ($record['is_anomaly']) {
                    $anomalies[] = $record;
                } else {
                    $ready[] = $record;
                }
            }
        }

        return [
            'ready' => $ready,
            'anomalies' => $anomalies,
            'unmapped' => $unmappedPins,
            'unmapped_pins' => $unmappedPins,
            'total_scans' => count($rawScans),
        ];
    }

    /**
     * Pair scans into daily attendance records.
     * Shift Pagi : Buka absen 07:00, Kerja 08:00 - 17:00, Tutup absen 18:00
     * Shift Malam: Buka absen 19:00, Kerja 20:00 - 05:00, Tutup absen 06:00 (lintas hari)
     */
    protected function pairScansIntoDailyRecords(
        array $timestamps,
        bool $isNightShift,
        int $toleranceMinutes,
        Employee $employee
    ): array {
        $records = [];
        $grouped = [];

        foreach ($timestamps as $t) {
            $hour = (int) $t->format('H');
            $timeStr = $t->format('H:i');

            // Cek apakah scan ini adalah scan shift malam atau shift pagi
            // Scan dini hari (04:00 - 06:30) selalu scan pulang dinas malam kemarin
            if ($timeStr <= '06:30') {
                $prevDate = $t->copy()->subDay()->format('Y-m-d');
                $grouped[$prevDate]['out'][] = $t;
                $grouped[$prevDate]['shift_type'] = 'MALAM';
            } elseif ($timeStr >= '18:30') {
                // Scan malam (18:30 ke atas) adalah scan masuk dinas malam hari ini
                $dutyDate = $t->format('Y-m-d');
                $grouped[$dutyDate]['in'][] = $t;
                $grouped[$dutyDate]['shift_type'] = 'MALAM';
            } else {
                // Scan pagi & sore (06:31 - 18:29) adalah dinas shift pagi
                $dutyDate = $t->format('Y-m-d');
                $grouped[$dutyDate]['shift_type'] = 'PAGI';

                if ($timeStr < '14:00') {
                    $grouped[$dutyDate]['in'][] = $t;
                } else {
                    $grouped[$dutyDate]['out'][] = $t;
                }
            }
        }

        foreach ($grouped as $date => $slots) {
            $inScans = $slots['in'] ?? [];
            $outScans = $slots['out'] ?? [];
            $shiftType = $slots['shift_type'] ?? ($isNightShift ? 'MALAM' : 'PAGI');
            $isNight = $shiftType === 'MALAM';

            $firstIn = ! empty($inScans) ? $inScans[0]->format('H:i') : null;
            $lastOut = ! empty($outScans) ? end($outScans)->format('H:i') : null;

            $isAnomaly = false;
            $anomalyReason = null;

            if ($firstIn && ! $lastOut) {
                // Jika shift malam masuk hari ini dan belum ada scan keluar besok pagi, status On Duty
                if ($isNight && $date === Carbon::today()->format('Y-m-d')) {
                    $isAnomaly = false;
                    $anomalyReason = 'Sedang Berdinas (Menunggu Scan Pulang Besok 05:00-06:00)';
                } else {
                    $isAnomaly = true;
                    $anomalyReason = 'Lupa Scan Pulang (Missing Out)';
                }
            } elseif (! $firstIn && $lastOut) {
                $isAnomaly = true;
                $anomalyReason = 'Lupa Scan Masuk (Missing In)';
            }

            // Calculate Tardiness
            $lateMinutes = 0;
            $status = 'hadir';

            $targetInHour = $isNight ? 20 : 8; // Shift Malam 20:00, Shift Pagi 08:00
            $shiftName = $isNight ? 'Shift Malam (20:00 - 05:00)' : 'Shift Pagi (08:00 - 17:00)';

            if ($firstIn) {
                [$inH, $inM] = explode(':', $firstIn);
                $inTotalMinutes = ((int) $inH * 60) + (int) $inM;
                $targetTotalMinutes = ($targetInHour * 60);

                if ($isNight && (int) $inH < 12) {
                    $inTotalMinutes += (24 * 60);
                }

                $diff = $inTotalMinutes - $targetTotalMinutes;
                if ($diff > $toleranceMinutes) {
                    $lateMinutes = $diff;
                    $status = 'terlambat';
                }
            }

            // Work duration standard 8 jam kerja efektif (9 jam jadwal)
            $workDuration = ($firstIn && $lastOut) ? 8.0 : 0;

            $records[] = [
                'employee_id' => $employee->id,
                'employee_name' => $employee->name,
                'nip' => $employee->nip,
                'pin' => $employee->biometric_pin,
                'biometric_pin' => $employee->biometric_pin,
                'location_id' => $employee->location_id,
                'location_name' => $employee->location?->name ?? 'Site',
                'date' => $date,
                'shift_name' => $shiftName,
                'check_in_time' => $firstIn,
                'check_out_time' => $lastOut,
                'late_minutes' => $lateMinutes,
                'status' => $status,
                'work_duration_hours' => $workDuration,
                'is_anomaly' => $isAnomaly,
                'anomaly_reason' => $anomalyReason,
                'method' => 'fingerprint',
            ];
        }

        return $records;
    }

    /**
     * Persist parsed records to the attendances table.
     *
     * @param  array<int, array>  $records
     * @return int Count of records saved
     */
    public function commitRecords(array $records, string $batchId): int
    {
        $savedCount = 0;

        foreach ($records as $row) {
            Attendance::updateOrCreate(
                [
                    'employee_id' => $row['employee_id'],
                    'date' => $row['date'],
                ],
                [
                    'check_in_time' => $row['check_in_time'] ?? null,
                    'check_out_time' => $row['check_out_time'] ?? null,
                    'status' => $row['status'] ?? 'hadir',
                    'late_minutes' => $row['late_minutes'] ?? 0,
                    'work_duration_hours' => $row['work_duration_hours'] ?? 0,
                    'location_id' => $row['location_id'] ?? null,
                    'method' => 'fingerprint',
                    'import_batch_id' => $batchId,
                    'notes' => ! empty($row['notes']) ? $row['notes'] : (! empty($row['anomaly_reason']) ? 'Fingerprint: '.$row['anomaly_reason'] : 'Presensi biometric fingerprint site'),
                ]
            );
            $savedCount++;
        }

        return $savedCount;
    }
}
