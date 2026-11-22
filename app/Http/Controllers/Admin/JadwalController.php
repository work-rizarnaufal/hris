<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Location;
use App\Models\Shift;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JadwalController extends Controller
{
    /**
     * Tampilkan halaman jadwal & roster shift karyawan operasional.
     */
    public function index(Request $request): Response
    {
        $employees = Employee::with(['location', 'shift'])
            ->orderBy('id', 'asc')
            ->get();

        $locations = Location::where('status', 'Aktif')->get();
        $shifts = Shift::where('is_active', true)->get();

        return Inertia::render('Admin/Jadwal/JadwalShift', [
            'dbEmployees' => $employees,
            'dbLocations' => $locations,
            'dbShifts' => $shifts,
        ]);
    }

    /**
     * Perbarui regu/grup kerja karyawan secara individual.
     */
    public function updateGroup(Request $request, Employee $employee): RedirectResponse
    {
        $validated = $request->validate([
            'group' => ['required', 'string', 'in:Grup A,Grup B,Belum Ditetapkan,Non-Shift'],
        ]);

        $employee->update(['shift_group' => $validated['group']]);

        return back()->with('success', "Grup kerja {$employee->name} berhasil diubah menjadi {$validated['group']}.");
    }

    /**
     * Pemindahan grup kerja karyawan secara massal (bulk).
     */
    public function bulkUpdateGroup(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_ids' => ['required', 'array', 'min:1'],
            'employee_ids.*' => ['exists:employees,id'],
            'group' => ['required', 'string', 'in:Grup A,Grup B,Belum Ditetapkan,Non-Shift'],
        ]);

        Employee::whereIn('id', $validated['employee_ids'])
            ->update(['shift_group' => $validated['group']]);

        $count = count($validated['employee_ids']);

        return back()->with('success', "Berhasil memindahkan {$count} karyawan ke {$validated['group']}.");
    }

    /**
     * Tukar rotasi seluruh karyawan antara Grup A dan Grup B.
     */
    public function swapGroup(): RedirectResponse
    {
        $groupA = Employee::where('shift_group', 'Grup A')->pluck('id')->toArray();
        $groupB = Employee::where('shift_group', 'Grup B')->pluck('id')->toArray();

        if (count($groupA) === 0 && count($groupB) === 0) {
            return back()->with('warning', 'Belum ada personil di Grup A maupun Grup B untuk ditukar. Tetapkan grup personil terlebih dahulu.');
        }

        // Gunakan nilai sementara agar tidak tumpang tindih
        Employee::whereIn('id', $groupA)->update(['shift_group' => 'TEMP_SWAP']);
        Employee::whereIn('id', $groupB)->update(['shift_group' => 'Grup A']);
        Employee::whereIn('id', $groupA)->update(['shift_group' => 'Grup B']);

        return back()->with('success', 'Rotasi siklus berhasil: Seluruh personil Grup A & Grup B berhasil ditukar jadwal gilirannya.');
    }
}
