<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Location;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    /**
     * Tampilkan halaman evaluasi & laporan kehadiran analitik HCGA terhubung database riil.
     */
    public function index(Request $request): Response
    {
        $period = $request->query('period', '2026-11');

        $employees = Employee::with(['location', 'shift'])
            ->where('status', '!=', 'Non-Aktif')
            ->orderBy('id', 'asc')
            ->get();

        $locations = Location::where('status', 'Aktif')->get();

        // Rentang tanggal bulan pada periode yang dipilih
        $periodDate = Carbon::parse($period.'-01');
        $startOfMonth = $periodDate->copy()->startOfMonth()->toDateString();
        $endOfMonth = $periodDate->copy()->endOfMonth()->toDateString();

        // Rentang 6 bulan untuk tren histori performa individu
        $sixMonthsAgo = $periodDate->copy()->subMonths(5)->startOfMonth()->toDateString();
        $sixMonthsAttendances = Attendance::with(['employee', 'location'])
            ->whereBetween('date', [$sixMonthsAgo, $endOfMonth])
            ->get();

        $attendances = $sixMonthsAttendances->filter(fn ($a) => $a->date >= $startOfMonth && $a->date <= $endOfMonth);

        $evaluations = $employees->map(function ($emp) use ($attendances, $sixMonthsAttendances, $periodDate) {
            $empAttendances = $attendances->where('employee_id', $emp->id);

            $isGroupA = ($emp->shift_group === 'Grup A');
            $isGroupB = ($emp->shift_group === 'Grup B');
            $workDays = ($isGroupA || $isGroupB) ? 15 : 22;

            $presentDays = $empAttendances->filter(fn ($a) => in_array(strtolower($a->status), ['hadir', 'terlambat']))->count();
            $lateRecords = $empAttendances->filter(fn ($a) => strtolower($a->status) === 'terlambat');
            $lateCount = $lateRecords->count();
            $totalLateMinutes = (int) $lateRecords->sum('late_minutes');
            $izinDays = $empAttendances->filter(fn ($a) => strtolower($a->status) === 'izin')->count();
            $sakitDays = $empAttendances->filter(fn ($a) => strtolower($a->status) === 'sakit')->count();
            $cutiDays = $empAttendances->filter(fn ($a) => strtolower($a->status) === 'cuti')->count();
            $leaveDays = $izinDays + $sakitDays + $cutiDays;
            $alpaDays = $empAttendances->filter(fn ($a) => in_array(strtolower($a->status), ['alpha', 'alpa']))->count();

            // Kalkulasi Skor Kedisiplinan & Status
            if ($presentDays === 0 && $leaveDays === 0 && $alpaDays === 0) {
                $score = 0;
                $status = 'Belum Ada Data';
                $actionRecommendation = 'Belum ada rekaman presensi pada periode aktif. Verifikasi jadwal kerja dan mesin biometric.';
            } else {
                $scoreDeductions = ($lateCount * 2) + ($alpaDays * 15) + (int) floor($totalLateMinutes / 15);
                $score = max(50, min(100, 100 - $scoreDeductions));

                $status = match (true) {
                    $score >= 95 => 'Sangat Baik',
                    $score >= 85 => 'Disiplin Baik',
                    $score >= 70 => 'Perlu Pembinaan',
                    default => 'Peringatan / SP',
                };

                $actionRecommendation = match ($status) {
                    'Sangat Baik' => 'Pertahankan Performa (Nominasi Best Attendance)',
                    'Disiplin Baik' => 'Kinerja baik, tingkatkan ketepatan waktu check-in',
                    'Perlu Pembinaan' => 'Bimbingan supervisor terkait konsistensi shift kerja',
                    default => 'Penerbitan Surat Peringatan (SP-1) & Konseling Disiplin',
                };
            }

            // Riwayat Insiden Pelanggaran & Legalitas Kehadiran
            $incidents = $empAttendances->filter(fn ($a) => in_array(strtolower($a->status), ['terlambat', 'izin', 'sakit', 'cuti', 'alpha', 'alpa']))
                ->map(function ($a) {
                    $dateCarbon = $a->date instanceof CarbonInterface
                        ? $a->date
                        : Carbon::parse($a->date);
                    $statusStr = ucfirst(strtolower($a->status));
                    if ($statusStr === 'Alpa') {
                        $statusStr = 'Alpha';
                    }

                    return [
                        'date' => $dateCarbon->locale('id')->isoFormat('DD MMM Y'),
                        'type' => $statusStr,
                        'detail' => strtolower($a->status) === 'terlambat'
                            ? "{$a->late_minutes} Menit - ".($a->notes ?: 'Keterlambatan jam masuk')
                            : ($a->notes ?: 'Tercatat dalam log sistem'),
                    ];
                })
                ->values()
                ->toArray();

            // Catatan presensi harian di bulan berjalan
            $dailyAttendances = $empAttendances->map(function ($a) {
                $dateStr = $a->date instanceof CarbonInterface
                    ? $a->date->format('Y-m-d')
                    : substr((string) $a->date, 0, 10);
                $statusStr = ucfirst(strtolower($a->status));
                if ($statusStr === 'Alpa') {
                    $statusStr = 'Alpha';
                }

                return [
                    'date' => $dateStr,
                    'status' => $statusStr,
                    'check_in_time' => $a->check_in_time ? substr($a->check_in_time, 0, 5) : null,
                    'check_out_time' => $a->check_out_time ? substr($a->check_out_time, 0, 5) : null,
                    'late_minutes' => (int) $a->late_minutes,
                    'notes' => $a->notes,
                ];
            })->values()->toArray();

            // Hitung tren riwayat 6 bulan riil
            $monthlyHistory = [];
            for ($i = 5; $i >= 0; $i--) {
                $m = $periodDate->copy()->subMonths($i);
                $mKey = $m->format('Y-m');
                $mLabel = $m->locale('id')->isoFormat('MMM');
                $mStart = $m->copy()->startOfMonth()->toDateString();
                $mEnd = $m->copy()->endOfMonth()->toDateString();

                $mEmpAtt = $sixMonthsAttendances
                    ->where('employee_id', $emp->id)
                    ->filter(function ($a) use ($mStart, $mEnd) {
                        $d = $a->date instanceof CarbonInterface
                            ? $a->date->format('Y-m-d')
                            : substr((string) $a->date, 0, 10);

                        return $d >= $mStart && $d <= $mEnd;
                    });

                $mPresent = $mEmpAtt->filter(fn ($a) => in_array(strtolower($a->status), ['hadir', 'terlambat']))->count();
                $mLate = $mEmpAtt->filter(fn ($a) => strtolower($a->status) === 'terlambat')->count();
                $mLateMinutes = (int) $mEmpAtt->filter(fn ($a) => strtolower($a->status) === 'terlambat')->sum('late_minutes');
                $mAlpa = $mEmpAtt->filter(fn ($a) => in_array(strtolower($a->status), ['alpha', 'alpa']))->count();

                if ($mPresent === 0 && $mAlpa === 0) {
                    $mScore = 100;
                } else {
                    $mScoreDeduction = ($mLate * 2) + ($mAlpa * 15) + (int) floor($mLateMinutes / 15);
                    $mScore = max(50, min(100, 100 - $mScoreDeduction));
                }

                $monthlyHistory[] = [
                    'month' => $mLabel,
                    'period' => $mKey,
                    'score' => $mScore,
                ];
            }

            $locationName = $emp->location?->name
                ?? ($emp->location_id === 1 ? 'Lokasi Mariuk' : 'Lokasi Cimalaka');

            return [
                'id' => $emp->id,
                'name' => $emp->name,
                'nip' => $emp->nip,
                'role' => $emp->role ?? ($emp->position ?? '-'),
                'division' => $emp->division ?? '-',
                'location' => $locationName,
                'location_id' => $emp->location_id,
                'group' => $emp->shift_group ?? ($emp->group ?? 'Grup A'),
                'baseShift' => $emp->shift?->name ?? 'Shift Pagi (08:00 - 17:00)',
                'shiftCode' => $emp->shift?->code ?? 'PAGI',
                'workDays' => $workDays,
                'presentDays' => $presentDays,
                'lateCount' => $lateCount,
                'totalLateMinutes' => $totalLateMinutes,
                'izinDays' => $izinDays,
                'sakitDays' => $sakitDays,
                'cutiDays' => $cutiDays,
                'leaveDays' => $leaveDays,
                'alpaDays' => $alpaDays,
                'score' => $score,
                'status' => $status,
                'actionRecommendation' => $actionRecommendation,
                'incidents' => $incidents,
                'dailyAttendances' => $dailyAttendances,
                'monthlyHistory' => $monthlyHistory,
            ];
        });

        return Inertia::render('Admin/Laporan/LaporanRekap', [
            'dbEmployees' => $employees,
            'dbLocations' => $locations,
            'evaluations' => $evaluations,
            'activePeriod' => $period,
        ]);
    }
}
