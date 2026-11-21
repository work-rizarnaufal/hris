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

class KaryawanController extends Controller
{
    public function index(): Response
    {
        $employees = Employee::with(['location', 'shift'])
            ->orderBy('id', 'asc')
            ->get();

        $locations = Location::where('status', 'Aktif')->get();
        $shifts = Shift::where('is_active', true)->get();

        return Inertia::render('Admin/Karyawan/DataKaryawan', [
            'employees' => $employees,
            'availableLocations' => $locations,
            'availableShifts' => $shifts,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nip' => ['required', 'string', 'max:50', 'unique:employees,nip'],
            'name' => ['required', 'string', 'max:150'],
            'email' => ['nullable', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'role_title' => ['required', 'string', 'max:100'],
            'division' => ['required', 'string', 'max:100'],
            'location_id' => ['nullable', 'exists:locations,id'],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'shift_group' => ['required', 'string'],
            'employment_status' => ['required', 'string'],
            'status' => ['required', 'string'],
        ]);

        Employee::create($validated);

        return back()->with('success', 'Data karyawan baru berhasil ditambahkan.');
    }

    public function update(Request $request, Employee $karyawan): RedirectResponse
    {
        $validated = $request->validate([
            'nip' => ['required', 'string', 'max:50', 'unique:employees,nip,'.$karyawan->id],
            'name' => ['required', 'string', 'max:150'],
            'email' => ['nullable', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'role_title' => ['required', 'string', 'max:100'],
            'division' => ['required', 'string', 'max:100'],
            'location_id' => ['nullable', 'exists:locations,id'],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'shift_group' => ['required', 'string'],
            'employment_status' => ['required', 'string'],
            'status' => ['required', 'string'],
        ]);

        $karyawan->update($validated);

        return back()->with('success', 'Profil dan data karyawan berhasil diperbarui.');
    }

    public function destroy(Employee $karyawan): RedirectResponse
    {
        $karyawan->delete();

        return back()->with('success', 'Data karyawan berhasil dihapus dari sistem.');
    }
}
