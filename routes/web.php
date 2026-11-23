<?php

use App\Http\Controllers\Admin\BerandaController;
use App\Http\Controllers\Admin\JadwalController;
use App\Http\Controllers\Admin\KaryawanController;
use App\Http\Controllers\Admin\KehadiranController;
use App\Http\Controllers\Admin\LaporanController;
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Redirection awal: jika sudah login ke beranda, jika belum ke login
Route::get('/', function () {
    return Auth::check() ? redirect('/beranda') : redirect('/login');
});

// Rute Tamu (Guest-Only): Pengguna yang sudah login diarahkan ke /beranda
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Rute Keluar (Logout)
Route::match(['get', 'post'], '/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

// Rute Modul Administrator HRIS (Dilindungi Autentikasi Laravel)
Route::middleware('auth')->group(function () {
    Route::get('/beranda', [BerandaController::class, 'index'])->name('admin.beranda');

    Route::get('/karyawan', [KaryawanController::class, 'index'])->name('admin.karyawan');
    Route::post('/karyawan', [KaryawanController::class, 'store'])->name('admin.karyawan.store');
    Route::post('/karyawan/batch-import', [KaryawanController::class, 'batchImport'])->name('admin.karyawan.batchImport');
    Route::put('/karyawan/{karyawan}', [KaryawanController::class, 'update'])->name('admin.karyawan.update');
    Route::delete('/karyawan/{karyawan}', [KaryawanController::class, 'destroy'])->name('admin.karyawan.destroy');

    Route::get('/pengaturan', [PengaturanController::class, 'index'])->name('admin.pengaturan');
    Route::put('/pengaturan/settings/{key}', [PengaturanController::class, 'updateSetting'])->name('admin.pengaturan.updateSetting');

    // Rute Modul Operasional & Staging
    Route::get('/organisasi', function () {
        return Inertia::render('Admin/Organisasi/OrganisasiJabatan');
    })->name('admin.organisasi');

    Route::get('/kehadiran', [KehadiranController::class, 'index'])->name('admin.kehadiran');
    Route::post('/kehadiran/manual', [KehadiranController::class, 'storeManual'])->name('admin.kehadiran.manual');
    Route::post('/kehadiran/mass', [KehadiranController::class, 'storeMass'])->name('admin.kehadiran.mass');
    Route::delete('/kehadiran/{attendance}', [KehadiranController::class, 'destroy'])->name('admin.kehadiran.destroy');
    Route::post('/kehadiran/preview-fingerprint', [KehadiranController::class, 'previewFingerprint'])->name('admin.kehadiran.previewFingerprint');
    Route::post('/kehadiran/commit-fingerprint', [KehadiranController::class, 'commitFingerprint'])->name('admin.kehadiran.commitFingerprint');
    Route::post('/kehadiran/link-biometric-pin', [KehadiranController::class, 'linkBiometricPin'])->name('admin.kehadiran.linkBiometricPin');

    Route::get('/jadwal', [JadwalController::class, 'index'])->name('admin.jadwal');
    Route::put('/jadwal/employee/{employee}/group', [JadwalController::class, 'updateGroup'])->name('admin.jadwal.updateGroup');
    Route::post('/jadwal/bulk-update-group', [JadwalController::class, 'bulkUpdateGroup'])->name('admin.jadwal.bulkUpdateGroup');
    Route::post('/jadwal/swap-group', [JadwalController::class, 'swapGroup'])->name('admin.jadwal.swapGroup');

    Route::get('/lembur', function () {
        return Inertia::render('Admin/Lembur/LemburOvertime');
    })->name('admin.lembur');

    Route::get('/cuti', function () {
        return Inertia::render('Admin/Cuti/PengajuanCutiIzin');
    })->name('admin.cuti');

    Route::get('/saldo-cuti', function () {
        return Inertia::render('Admin/SaldoCuti/SaldoKuotaCuti');
    })->name('admin.saldo-cuti');

    Route::get('/payroll', function () {
        return Inertia::render('Admin/Payroll/PenggajianPeriode');
    })->name('admin.payroll');

    Route::get('/slip-gaji', function () {
        return Inertia::render('Admin/SlipGaji/SlipGaji');
    })->name('admin.slip-gaji');

    Route::get('/laporan', [LaporanController::class, 'index'])->name('admin.laporan');

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
});

// Rute Modul User / Portal Publik (Terbuka untuk umum / presensi mandiri)
Route::prefix('user')->name('user.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('User/RingkasanPublik');
    })->name('dashboard');
});
