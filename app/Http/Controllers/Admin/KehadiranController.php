<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Location;
use App\Models\Shift;
use App\Services\FingerprintImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KehadiranController extends Controller
{
    public function index(Request $request): Response
    {
        $employees = Employee::with(['location', 'shift'])
            ->orderBy('id', 'asc')
            ->get();

        $locations = Location::where('status', 'Aktif')->get();
        $shifts = Shift::where('is_active', true)->get();

        $attendances = Attendance::with(['employee', 'location'])
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('Admin/Kehadiran/CatatanKehadiran', [
            'dbEmployees' => $employees,
            'dbLocations' => $locations,
            'dbShifts' => $shifts,
            'dbAttendances' => $attendances,
        ]);
    }

    /**
     * Halaman Meja Kerja Impor & Review Log Fingerprint.
     */
    public function imporView(Request $request): Response
    {
        $employees = Employee::with(['location', 'shift'])
            ->where('status', 'Aktif')
            ->orderBy('id', 'asc')
            ->get();

        $locations = Location::where('status', 'Aktif')->get();
        $shifts = Shift::where('is_active', true)->get();

        return Inertia::render('Admin/Kehadiran/ImporFingerprint', [
            'dbEmployees' => $employees,
            'dbLocations' => $locations,
            'dbShifts' => $shifts,
        ]);
    }

    /**
     * Catat presensi manual oleh admin (lupa absen, koreksi, surat izin).
     */
    public function storeManual(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'date' => ['required', 'date'],
            'check_in_time' => ['nullable', 'string'],
            'check_out_time' => ['nullable', 'string'],
            'status' => ['required', 'string'],
            'late_minutes' => ['nullable', 'integer'],
            'notes' => ['required', 'string', 'max:255'],
        ]);

        $employee = Employee::find($validated['employee_id']);

        Attendance::updateOrCreate(
            [
                'employee_id' => $validated['employee_id'],
                'date' => $validated['date'],
            ],
            [
                'check_in_time' => $validated['check_in_time'] ?? null,
                'check_out_time' => $validated['check_out_time'] ?? null,
                'status' => $validated['status'],
                'late_minutes' => $validated['late_minutes'] ?? 0,
                'work_duration_hours' => ($validated['check_in_time'] && $validated['check_out_time']) ? 8.0 : 0,
                'location_id' => $employee?->location_id,
                'method' => 'manual_admin',
                'notes' => 'Manual Admin: '.$validated['notes'],
            ]
        );

        return back()->with('success', "Catatan presensi manual untuk {$employee?->name} berhasil disimpan.");
    }

    /**
     * Catat presensi massal cepat untuk sejumlah karyawan.
     */
    public function storeMass(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'check_in_time' => ['required', 'string'],
            'employee_ids' => ['required', 'array'],
            'employee_ids.*' => ['exists:employees,id'],
        ]);

        $employees = Employee::whereIn('id', $validated['employee_ids'])->get();

        foreach ($employees as $employee) {
            $shift = $employee->shift;
            $checkOut = $shift?->end_time ? substr($shift->end_time, 0, 5) : '17:00';

            Attendance::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'date' => $validated['date'],
                ],
                [
                    'check_in_time' => $validated['check_in_time'],
                    'check_out_time' => $checkOut,
                    'status' => 'hadir',
                    'late_minutes' => 0,
                    'work_duration_hours' => 8.0,
                    'location_id' => $employee->location_id,
                    'method' => 'manual_admin',
                    'notes' => 'Presensi Massal Admin',
                ]
            );
        }

        return back()->with('success', "Berhasil mencatat presensi massal untuk {$employees->count()} karyawan.");
    }

    /**
     * Hapus catatan presensi.
     */
    public function destroy(Attendance $attendance): RedirectResponse
    {
        $name = $attendance->employee?->name ?? 'Karyawan';
        $attendance->delete();

        return back()->with('success', "Catatan presensi untuk {$name} berhasil dihapus.");
    }

    /**
     * Preview parse data fingerprint log sebelum commit ke DB.
     */
    public function previewFingerprint(Request $request, FingerprintImportService $service): JsonResponse
    {
        $request->validate([
            'location_id' => ['required', 'exists:locations,id'],
            'scans' => ['required', 'array'],
        ]);

        $result = $service->parseScans($request->input('scans'), (int) $request->input('location_id'));

        return response()->json($result);
    }

    /**
     * Commit penyimpanan hasil impor log fingerprint ke database.
     */
    public function commitFingerprint(Request $request, FingerprintImportService $service): RedirectResponse
    {
        $request->validate([
            'records' => ['required', 'array'],
            'batch_id' => ['required', 'string'],
        ]);

        $count = $service->commitRecords($request->input('records'), $request->input('batch_id'));

        return redirect()->route('admin.kehadiran')->with('success', "Berhasil menyimpan {$count} data presensi biometric fingerprint ke database.");
    }

    /**
     * Hubungkan PIN biometric mesin baru ke karyawan di HRIS.
     */
    public function linkBiometricPin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'biometric_pin' => ['required', 'string', 'max:50'],
        ]);

        $employee = Employee::findOrFail($validated['employee_id']);
        $employee->update(['biometric_pin' => $validated['biometric_pin']]);

        return response()->json([
            'success' => true,
            'message' => "PIN biometric {$validated['biometric_pin']} berhasil dihubungkan ke {$employee->name}.",
        ]);
    }
}
