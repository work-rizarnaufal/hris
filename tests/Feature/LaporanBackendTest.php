<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LaporanBackendTest extends TestCase
{
    use RefreshDatabase;

    public function test_laporan_page_renders_with_real_database_evaluations_for_all_employees(): void
    {
        $this->seed();

        $response = $this->get('/laporan');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Laporan/LaporanRekap')
            ->has('evaluations', 86)
            ->has('dbLocations', 2)
            ->has('activePeriod')
            ->where('evaluations.0.nip', fn ($nip) => str_starts_with($nip, 'HC-'))
            ->where('evaluations.0.name', fn ($name) => ! empty($name))
            ->where('evaluations.0.workDays', 22)
            ->where('evaluations.0.score', fn ($score) => $score >= 0 && $score <= 100)
        );
    }

    public function test_laporan_page_computes_attendance_metrics_accurately(): void
    {
        $this->seed();

        $employee = Employee::first();
        $currentMonth = Carbon::now()->format('Y-m');

        // Catat 1 presensi hadir tepat waktu di bulan berjalan
        Attendance::create([
            'employee_id' => $employee->id,
            'location_id' => $employee->location_id,
            'date' => $currentMonth.'-05',
            'check_in_time' => '07:55:00',
            'status' => 'Hadir',
            'method' => 'manual_admin',
        ]);

        // Catat 1 presensi terlambat 30 menit
        Attendance::create([
            'employee_id' => $employee->id,
            'location_id' => $employee->location_id,
            'date' => $currentMonth.'-06',
            'check_in_time' => '08:30:00',
            'status' => 'Terlambat',
            'late_minutes' => 30,
            'method' => 'manual_admin',
        ]);

        $response = $this->get('/laporan?period='.$currentMonth);

        $response->assertStatus(200);
        $response->assertInertia(function (Assert $page) use ($employee) {
            $page->component('Admin/Laporan/LaporanRekap')
                ->where('evaluations', function ($evaluations) use ($employee) {
                    $target = collect($evaluations)->firstWhere('id', $employee->id);
                    $this->assertNotNull($target);
                    $this->assertEquals(2, $target['presentDays']);
                    $this->assertEquals(1, $target['lateCount']);
                    $this->assertEquals(30, $target['totalLateMinutes']);

                    return true;
                });
        });
    }
}
