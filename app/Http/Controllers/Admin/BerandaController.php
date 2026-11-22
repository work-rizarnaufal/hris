<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class BerandaController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::today()->toDateString();

        $totalEmployees = Employee::where('status', '!=', 'Non-Aktif')->count();
        $activeMariuk = Employee::where('status', 'Aktif')
            ->whereHas('location', fn ($q) => $q->where('code', 'MRK'))
            ->count();
        $activeCimalaka = Employee::where('status', 'Aktif')
            ->whereHas('location', fn ($q) => $q->where('code', 'CML'))
            ->count();

        // Presensi riil hari ini dari database
        $attendances = Attendance::with(['employee.location', 'employee.shift', 'location'])
            ->whereDate('date', $today)
            ->orderBy('check_in_time', 'desc')
            ->get()
            ->map(function ($att) {
                return [
                    'id' => $att->id,
                    'nip' => $att->employee?->nip ?? '-',
                    'name' => $att->employee?->name ?? 'Karyawan',
                    'role' => $att->employee?->role ?? ($att->employee?->position ?? '-'),
                    'division' => $att->employee?->division ?? '-',
                    'location' => $att->location?->name ?? ($att->employee?->location?->name ?? 'Lokasi'),
                    'group' => $att->employee?->shift_group ?? '-',
                    'shift' => $att->employee?->shift?->name ?? 'Non-Shift',
                    'time' => $att->check_in_time ? substr($att->check_in_time, 0, 5).' WIB' : '—',
                    'status' => $att->status,
                    'statusClass' => match (strtolower($att->status)) {
                        'hadir' => 'status-hadir',
                        'terlambat' => 'status-terlambat',
                        'izin', 'sakit' => 'status-izin',
                        'cuti' => 'status-cuti',
                        default => 'status-alpha',
                    },
                ];
            });

        // 7 Hari Terakhir untuk Chart Tren Mingguan
        $startDate = Carbon::today()->subDays(6)->toDateString();
        $weeklyAttendances = Attendance::whereBetween('date', [$startDate, $today])->get();

        $dayNames = [
            0 => 'Minggu',
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
        ];

        $weeklyTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dateStr = $date->toDateString();
            $dayName = $dayNames[$date->dayOfWeek];

            $dayRecords = $weeklyAttendances->filter(function ($item) use ($dateStr) {
                $d = is_string($item->date) ? substr($item->date, 0, 10) : $item->date->toDateString();

                return $d === $dateStr;
            });

            $weeklyTrend[] = [
                'day' => $dayName,
                'hadir' => $dayRecords->where('status', 'Hadir')->count(),
                'terlambat' => $dayRecords->where('status', 'Terlambat')->count(),
                'izin' => $dayRecords->whereIn('status', ['Izin', 'Sakit', 'Cuti'])->count(),
            ];
        }

        // Ringkasan Rasio Kehadiran per Site Operasional
        $siteSummary = [
            [
                'name' => 'Lokasi Mariuk',
                'total' => $activeMariuk,
                'present' => $attendances->where('location', 'Lokasi Mariuk')->whereIn('status', ['Hadir', 'Terlambat'])->count(),
                'late' => $attendances->where('location', 'Lokasi Mariuk')->where('status', 'Terlambat')->count(),
                'percent' => $activeMariuk > 0
                    ? (int) round(($attendances->where('location', 'Lokasi Mariuk')->whereIn('status', ['Hadir', 'Terlambat'])->count() / $activeMariuk) * 100)
                    : 0,
            ],
            [
                'name' => 'Lokasi Cimalaka',
                'total' => $activeCimalaka,
                'present' => $attendances->where('location', 'Lokasi Cimalaka')->whereIn('status', ['Hadir', 'Terlambat'])->count(),
                'late' => $attendances->where('location', 'Lokasi Cimalaka')->where('status', 'Terlambat')->count(),
                'percent' => $activeCimalaka > 0
                    ? (int) round(($attendances->where('location', 'Lokasi Cimalaka')->whereIn('status', ['Hadir', 'Terlambat'])->count() / $activeCimalaka) * 100)
                    : 0,
            ],
        ];

        return Inertia::render('Admin/Beranda/Beranda', [
            'metrics' => [
                'totalEmployees' => $totalEmployees,
                'activeMariuk' => $activeMariuk,
                'activeCimalaka' => $activeCimalaka,
            ],
            'attendances' => $attendances->values()->all(),
            'weeklyTrend' => $weeklyTrend,
            'siteSummary' => $siteSummary,
        ]);
    }
}
