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
     * @param  array<int, array{pin: string|int, timestamp: string, verify_mode?: string|int}>  $rawScans
     * @return array{ready: array, anomalies: array, unmapped_pins: array, total_scans: int}
     */
    public function parseScans(array $rawScans, int $locationId): array
    {
        $toleranceMinutes = (int) data_get(
            SystemSetting::getByKey('attendance_policy', []),
            'lateToleranceMinutes',
            15
        );

        $employees = Employee::with(['shift'])
            ->where('location_id', $locationId)
            ->get();

        // Map by biometric_pin, with fallback to numeric NIP
        $empByPin = [];
        foreach ($employees as $emp) {
            $pin = (string) ($emp->biometric_pin ?? preg_replace('/\D/', '', $emp->nip));
            $empByPin[$pin] = $emp;
        }

        // 1. Group scans by PIN & clean/sort timestamps
        $scansByPin = [];
        foreach ($rawScans as $scan) {
            $pin = trim((string) ($scan['pin'] ?? ''));
            $ts = trim((string) ($scan['timestamp'] ?? ''));
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
            // Check if employee mapped
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
            $shiftCategory = $employee->shift?->code ?? 'PAGI_12H';
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

            if ($isNightShift) {
                // Shift Malam (19:00 - 07:00).
                // Scans between 17:00 - 23:59 belong to date T as In.
                // Scans between 00:00 - 10:00 belong to date (T-1) as Out.
                if ($hour >= 17) {
                    $dutyDate = $t->format('Y-m-d');
                    $grouped[$dutyDate]['in'][] = $t;
                } elseif ($hour <= 10) {
                    $prevDate = $t->copy()->subDay()->format('Y-m-d');
                    $grouped[$prevDate]['out'][] = $t;
                } else {
                    // Midday scan: group by current date
                    $dutyDate = $t->format('Y-m-d');
                    $grouped[$dutyDate]['in'][] = $t;
                }
            } else {
                // Shift Pagi (07:00 - 19:00)
                $dutyDate = $t->format('Y-m-d');
                if ($hour < 12) {
                    $grouped[$dutyDate]['in'][] = $t;
                } else {
                    $grouped[$dutyDate]['out'][] = $t;
                }
            }
        }

        foreach ($grouped as $date => $slots) {
            $inScans = $slots['in'] ?? [];
            $outScans = $slots['out'] ?? [];

            $firstIn = ! empty($inScans) ? $inScans[0]->format('H:i') : null;
            $lastOut = ! empty($outScans) ? end($outScans)->format('H:i') : null;

            $isAnomaly = false;
            $anomalyReason = null;

            if ($firstIn && ! $lastOut) {
                $isAnomaly = true;
                $anomalyReason = 'Lupa Scan Pulang (Missing Out)';
            } elseif (! $firstIn && $lastOut) {
                $isAnomaly = true;
                $anomalyReason = 'Lupa Scan Masuk (Missing In)';
            }

            // Calculate Tardiness
            $lateMinutes = 0;
            $status = 'hadir';

            $targetInHour = $isNightShift ? 19 : 7;
            $shiftName = $isNightShift ? 'Shift Malam (12 Jam)' : 'Shift Pagi (12 Jam)';

            if ($firstIn) {
                [$inH, $inM] = explode(':', $firstIn);
                $inTotalMinutes = ((int) $inH * 60) + (int) $inM;
                $targetTotalMinutes = ($targetInHour * 60);

                if ($isNightShift && (int) $inH < 12) {
                    $inTotalMinutes += (24 * 60);
                }

                $diff = $inTotalMinutes - $targetTotalMinutes;
                if ($diff > $toleranceMinutes) {
                    $lateMinutes = $diff;
                    $status = 'terlambat';
                }
            }

            // Work duration
            $workDuration = 0;
            if ($firstIn && $lastOut) {
                $workDuration = 12.0; // Standard 12-hour factory shift
            }

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
                    'notes' => ! empty($row['anomaly_reason']) ? 'Fingerprint: '.$row['anomaly_reason'] : 'Presensi biometric fingerprint site',
                ]
            );
            $savedCount++;
        }

        return $savedCount;
    }
}
