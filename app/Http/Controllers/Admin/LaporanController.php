<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Location;
use Carbon\Carbon;
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
        $startOfMonth = Carbon::parse($period.'-01')->startOfMonth()->toDateString();
        $endOfMonth = Carbon::parse($period.'-01')->endOfMonth()->toDateString();

        $attendances = Attendance::with(['employee', 'location'])
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->get();

        $evaluations = $employees->map(function ($emp) use ($attendances) {
            $empAttendances = $attendances->where('employee_id', $emp->id);

            $workDays = 22; // Standar 22 hari kerja efektif per bulan
            $presentDays = $empAttendances->whereIn('status', ['Hadir', 'Terlambat'])->count();
            $lateRecords = $empAttendances->where('status', 'Terlambat');
            $lateCount = $lateRecords->count();
            $totalLateMinutes = (int) $lateRecords->sum('late_minutes');
            $izinDays = $empAttendances->where('status', 'Izin')->count();
            $sakitDays = $empAttendances->where('status', 'Sakit')->count();
            $cutiDays = $empAttendances->where('status', 'Cuti')->count();
            $leaveDays = $izinDays + $sakitDays + $cutiDays;
            $alpaDays = $empAttendances->where('status', 'Alpha')->count();

            // Kalkulasi Skor Kedisiplinan (0 - 100%)
            $scoreDeductions = ($lateCount * 2) + ($alpaDays * 15) + (int) floor($totalLateMinutes / 15);
            $score = max(50, 100 - $scoreDeductions);

            // Klasifikasi Status Evaluasi Disiplin
            $status = match (true) {
                $score >= 95 => 'Sangat Baik',
                $score >= 85 => 'Disiplin Baik',
                $score >= 70 => 'Perlu Pembinaan',
                default => 'Peringatan / SP',
            };

            // Rekomendasi Tindakan Manajemen HCGA
            $actionRecommendation = match ($status) {
                'Sangat Baik' => 'Pertahankan Performa (Nominasi Best Attendance)',
                'Disiplin Baik' => 'Kinerja baik, tingkatkan ketepatan waktu check-in',
                'Perlu Pembinaan' => 'Bimbingan supervisor terkait konsistensi shift kerja',
                default => 'Penerbitan Surat Peringatan (SP-1) & Konseling Disiplin',
            };

            // Riwayat Insiden Pelanggaran & Legalitas Kehadiran
            $incidents = $empAttendances->filter(fn ($a) => in_array($a->status, ['Terlambat', 'Izin', 'Sakit', 'Cuti', 'Alpha']))
                ->map(fn ($a) => [
                    'date' => Carbon::parse($a->date)->locale('id')->isoFormat('DD MMM Y'),
                    'type' => $a->status,
                    'detail' => $a->status === 'Terlambat'
                        ? "{$a->late_minutes} Menit - ".($a->notes ?: 'Terkendala jam masuk')
                        : ($a->notes ?: 'Tercatat dalam log sistem'),
                ])
                ->values()
                ->toArray();

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
