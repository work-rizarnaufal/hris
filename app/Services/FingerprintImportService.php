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
     * Shift Pagi : Buka absen 07:00, Kerja 08:00 - 17:00, Tutup absen 18:00 (lembur s/d malam)
     * Shift Malam: Buka absen 19:00, Kerja 20:00 - 05:00, Tutup absen 06:00 (lintas hari)
     */
    protected function pairScansIntoDailyRecords(
        array $timestamps,
        bool $isNightShift,
        int $toleranceMinutes,
        Employee $employee
    ): array {
        $records = [];

        // Kelompokkan timestamps per tanggal kalender scan
        $byDate = [];
        foreach ($timestamps as $t) {
            $byDate[$t->format('Y-m-d')][] = $t;
        }

        foreach ($byDate as $dateStr => $dayTimestamps) {
            usort($dayTimestamps, fn ($a, $b) => $a->timestamp <=> $b->timestamp);

            // 1. Scan dini hari (<= 06:15): Pulang dinas Shift Malam kemarin jika tidak ada scan pagi
            $earlyMorningOuts = array_filter($dayTimestamps, fn ($t) => $t->format('H:i') <= '06:15');
            $hasDaytimeScans = ! empty(array_filter($dayTimestamps, fn ($t) => $t->format('H:i') > '06:15' && $t->format('H:i') < '14:00'));

            if (! empty($earlyMorningOuts) && ! $hasDaytimeScans) {
                $prevDate = Carbon::parse($dateStr)->subDay()->format('Y-m-d');
                $lastOut = end($earlyMorningOuts)->format('H:i');

                $records[] = [
                    'employee_id' => $employee->id,
                    'employee_name' => $employee->name,
                    'nip' => $employee->nip,
                    'pin' => $employee->biometric_pin,
                    'biometric_pin' => $employee->biometric_pin,
                    'location_id' => $employee->location_id,
                    'location_name' => $employee->location?->name ?? 'Site',
                    'date' => $prevDate,
                    'shift_name' => 'Shift Malam (20:00 - 05:00)',
                    'check_in_time' => null,
                    'check_out_time' => $lastOut,
                    'late_minutes' => 0,
                    'status' => 'hadir',
                    'work_duration_hours' => 8.0,
                    'is_anomaly' => true,
                    'anomaly_reason' => 'Pulang Dinas Shift Malam (Tap Masuk di luar rentang file penarikan)',
                    'method' => 'fingerprint',
                ];
            }

            // 2. Scan pada hari aktif (> 06:15)
            $activeScans = array_values(array_filter($dayTimestamps, fn ($t) => $t->format('H:i') > '06:15'));
            if (empty($activeScans)) {
                continue;
            }

            $morningScans = array_values(array_filter($activeScans, fn ($t) => $t->format('H:i') < '14:00'));
            $departureScans = array_values(array_filter($activeScans, fn ($t) => $t->format('H:i') >= '14:00'));
            $isEveningOnly = empty($morningScans) && ! empty($departureScans) && ($departureScans[0]->format('H:i') >= '18:30');

            if ($isEveningOnly) {
                // Masuk dinas Shift Malam hari ini (menunggu scan pulang besok pagi)
                $firstIn = $departureScans[0]->format('H:i');
                [$inH, $inM] = explode(':', $firstIn);
                $inMin = ((int) $inH * 60) + (int) $inM;
                $targetMin = 20 * 60; // 20:00 WIB
                $late = max(0, $inMin - $targetMin);
                $status = ($late > $toleranceMinutes) ? 'terlambat' : 'hadir';

                $records[] = [
                    'employee_id' => $employee->id,
                    'employee_name' => $employee->name,
                    'nip' => $employee->nip,
                    'pin' => $employee->biometric_pin,
                    'biometric_pin' => $employee->biometric_pin,
                    'location_id' => $employee->location_id,
                    'location_name' => $employee->location?->name ?? 'Site',
                    'date' => $dateStr,
                    'shift_name' => 'Shift Malam (20:00 - 05:00)',
                    'check_in_time' => $firstIn,
                    'check_out_time' => null,
                    'late_minutes' => $late,
                    'status' => $status,
                    'work_duration_hours' => 0,
                    'is_anomaly' => false,
                    'anomaly_reason' => 'Sedang Berdinas Shift Malam (Menunggu scan pulang besok pagi 05:00-06:00)',
                    'method' => 'fingerprint',
                ];
            } else {
                // Shift Pagi (08:00 - 17:00)
                $firstIn = ! empty($morningScans) ? $morningScans[0]->format('H:i') : null;
                $lastOut = ! empty($departureScans) ? end($departureScans)->format('H:i') : null;

                $late = 0;
                $status = 'hadir';
                if ($firstIn) {
                    [$inH, $inM] = explode(':', $firstIn);
                    $inMin = ((int) $inH * 60) + (int) $inM;
                    $targetMin = 8 * 60; // 08:00 WIB
                    if ($inMin > ($targetMin + $toleranceMinutes)) {
                        $late = $inMin - $targetMin;
                        $status = 'terlambat';
                    }
                }

                $isAnomaly = false;
                $anomalyReason = null;
                if ($firstIn && ! $lastOut) {
                    $isAnomaly = true;
                    $anomalyReason = 'Lupa Scan Pulang (Missing Out)';
                } elseif (! $firstIn && $lastOut) {
                    $isAnomaly = true;
                    $anomalyReason = 'Lupa Scan Masuk (Missing In)';
                } elseif (! empty($departureScans) && end($departureScans)->format('H:i') >= '18:30') {
                    $anomalyReason = 'Hadir (Termasuk lembur dinas sore/malam s/d '.$lastOut.')';
                }

                $records[] = [
                    'employee_id' => $employee->id,
                    'employee_name' => $employee->name,
                    'nip' => $employee->nip,
                    'pin' => $employee->biometric_pin,
                    'biometric_pin' => $employee->biometric_pin,
                    'location_id' => $employee->location_id,
                    'location_name' => $employee->location?->name ?? 'Site',
                    'date' => $dateStr,
                    'shift_name' => 'Shift Pagi (08:00 - 17:00)',
                    'check_in_time' => $firstIn,
                    'check_out_time' => $lastOut,
                    'late_minutes' => $late,
                    'status' => $status,
                    'work_duration_hours' => ($firstIn && $lastOut) ? 8.0 : 0,
                    'is_anomaly' => $isAnomaly,
                    'anomaly_reason' => $anomalyReason,
                    'method' => 'fingerprint',
                ];
            }
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
                    'notes' => ! empty($row['anomaly_reason']) ? 'Fingerprint: '.$row['anomaly_reason'] : 'Presensi biometric fingerprint site',
                ]
            );
            $savedCount++;
        }

        return $savedCount;
    }
}
