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
    return Inertia::render('Admin/Beranda/Beranda');
})->name('admin.beranda');

// 2. Manajemen Karyawan (Core HR)
Route::get('/karyawan', function () {
    return Inertia::render('Admin/Karyawan/DataKaryawan');
})->name('admin.karyawan');

Route::get('/organisasi', function () {
    return Inertia::render('Admin/Organisasi/OrganisasiJabatan');
})->name('admin.organisasi');

// 3. Waktu & Kehadiran (Time & Attendance)
Route::get('/kehadiran', function () {
    return Inertia::render('Admin/Kehadiran/CatatanKehadiran');
})->name('admin.kehadiran');

Route::get('/jadwal', function () {
    return Inertia::render('Admin/Jadwal/JadwalShift');
})->name('admin.jadwal');

Route::get('/lembur', function () {
    return Inertia::render('Admin/Lembur/LemburOvertime');
})->name('admin.lembur');

// 4. Cuti & Perizinan (Leave Management)
Route::get('/cuti', function () {
    return Inertia::render('Admin/Cuti/PengajuanCutiIzin');
})->name('admin.cuti');

Route::get('/saldo-cuti', function () {
    return Inertia::render('Admin/SaldoCuti/SaldoKuotaCuti');
})->name('admin.saldo-cuti');

// 5. Penggajian (Payroll)
Route::get('/payroll', function () {
    return Inertia::render('Admin/Payroll/PenggajianPeriode');
})->name('admin.payroll');

Route::get('/slip-gaji', function () {
    return Inertia::render('Admin/SlipGaji/SlipGaji');
})->name('admin.slip-gaji');

// 6. Laporan & Analitik
Route::get('/laporan', function () {
    return Inertia::render('Admin/Laporan/LaporanRekap');
})->name('admin.laporan');

// 7. Pengaturan & Audit
Route::get('/pengaturan', function () {
    return Inertia::render('Admin/Pengaturan/PengaturanSistem');
})->name('admin.pengaturan');

Route::get('/audit', function () {
    return Inertia::render('Admin/Audit/LogAudit');
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
        return Inertia::render('User/RingkasanPublik');
    })->name('dashboard');
});

Route::get('/ringkasan-publik', function () {
    return Inertia::render('User/RingkasanPublik');
})->name('publik.ringkasan');
