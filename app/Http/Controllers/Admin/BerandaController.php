<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Inertia\Inertia;
use Inertia\Response;

class BerandaController extends Controller
{
    public function index(): Response
    {
        $totalEmployees = Employee::where('status', '!=', 'Non-Aktif')->count();
        $activeMariuk = Employee::where('status', 'Aktif')->whereHas('location', fn ($q) => $q->where('code', 'MRK'))->count();
        $activeCimalaka = Employee::where('status', 'Aktif')->whereHas('location', fn ($q) => $q->where('code', 'CML'))->count();

        return Inertia::render('Admin/Beranda/Beranda', [
            'metrics' => [
                'totalEmployees' => $totalEmployees,
                'activeMariuk' => $activeMariuk,
                'activeCimalaka' => $activeCimalaka,
            ],
        ]);
    }
}
