<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Redirection awal ke Beranda Admin
Route::get('/', function () {
    return redirect('/beranda');
});

// ==========================================
// RUTE STANDAR HRIS (ADMINISTRATOR)
// ==========================================

// 1. Dashboard Utama
Route::get('/beranda', function () {
    return Inertia::render('Admin/Beranda/Index');
})->name('admin.beranda');

// 2. Manajemen Karyawan (Core HR)
Route::get('/karyawan', function () {
    return Inertia::render('Admin/Karyawan/Index');
})->name('admin.karyawan');

Route::get('/organisasi', function () {
    return Inertia::render('Admin/Organisasi/Index');
})->name('admin.organisasi');

// 3. Waktu & Kehadiran (Time & Attendance)
Route::get('/kehadiran', function () {
    return Inertia::render('Admin/Kehadiran/Index');
})->name('admin.kehadiran');

Route::get('/jadwal', function () {
    return Inertia::render('Admin/Jadwal/Index');
})->name('admin.jadwal');

Route::get('/lembur', function () {
    return Inertia::render('Admin/Lembur/Index');
})->name('admin.lembur');

// 4. Cuti & Perizinan (Leave Management)
Route::get('/cuti', function () {
    return Inertia::render('Admin/Cuti/Index');
})->name('admin.cuti');

Route::get('/saldo-cuti', function () {
    return Inertia::render('Admin/SaldoCuti/Index');
})->name('admin.saldo-cuti');

// 5. Penggajian (Payroll)
Route::get('/payroll', function () {
    return Inertia::render('Admin/Payroll/Index');
})->name('admin.payroll');

Route::get('/slip-gaji', function () {
    return Inertia::render('Admin/SlipGaji/Index');
})->name('admin.slip-gaji');

// 6. Laporan & Analitik
Route::get('/laporan', function () {
    return Inertia::render('Admin/Laporan/Index');
})->name('admin.laporan');

// 7. Pengaturan & Audit
Route::get('/pengaturan', function () {
    return Inertia::render('Admin/Pengaturan/Index');
})->name('admin.pengaturan');

Route::get('/audit', function () {
    return Inertia::render('Admin/Audit/Index');
})->name('admin.audit');

// Prefix alias /admin/... untuk kompatibilitas
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.beranda');
    })->name('dashboard');

    Route::get('/beranda', function () {
        return redirect()->route('admin.beranda');
    });
});

// ==========================================
// RUTE MODUL USER / PORTAL PUBLIK
// ==========================================
Route::prefix('user')->name('user.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('User/Index');
    })->name('dashboard');
});

Route::get('/ringkasan-publik', function () {
    return Inertia::render('User/Index');
})->name('publik.ringkasan');
