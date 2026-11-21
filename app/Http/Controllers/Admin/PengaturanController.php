<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use App\Models\Location;
use App\Models\Shift;
use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanController extends Controller
{
    public function index(): Response
    {
        $settings = SystemSetting::all()->pluck('value', 'key');
        $locations = Location::all();
        $holidays = Holiday::orderBy('date', 'asc')->get();
        $shifts = Shift::all();

        return Inertia::render('Admin/Pengaturan/PengaturanSistem', [
            'dbSettings' => $settings,
            'dbLocations' => $locations,
            'dbHolidays' => $holidays,
            'dbShifts' => $shifts,
        ]);
    }

    public function updateSetting(Request $request, string $key): RedirectResponse
    {
        $validated = $request->validate([
            'value' => ['required', 'array'],
        ]);

        SystemSetting::setByKey($key, $validated['value']);

        return back()->with('success', "Pengaturan {$key} berhasil diperbarui.");
    }
}
