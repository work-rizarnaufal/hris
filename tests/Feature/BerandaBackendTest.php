<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Location;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BerandaBackendTest extends TestCase
{
    use RefreshDatabase;

    public function test_beranda_page_renders_with_real_database_metrics_and_empty_attendances(): void
    {
        $this->seed();

        $response = $this->get('/beranda');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Beranda/Beranda')
            ->has('metrics.totalEmployees')
            ->has('metrics.activeMariuk')
            ->has('metrics.activeCimalaka')
            ->has('attendances')
            ->has('weeklyTrend')
            ->has('siteSummary')
            ->where('metrics.totalEmployees', 86)
            ->where('metrics.activeMariuk', 35)
            ->where('metrics.activeCimalaka', 51)
        );
    }

    public function test_beranda_displays_real_attendance_when_recorded(): void
    {
        $this->seed();

        $employee = Employee::first();
        $location = Location::first();
        $today = Carbon::today()->toDateString();

        Attendance::create([
            'employee_id' => $employee->id,
            'location_id' => $location->id,
            'date' => $today,
            'check_in_time' => '07:55:00',
            'status' => 'Hadir',
            'method' => 'manual_admin',
            'notes' => 'Presensi test',
        ]);

        $response = $this->get('/beranda');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Beranda/Beranda')
            ->has('attendances', 1)
            ->where('attendances.0.nip', $employee->nip)
            ->where('attendances.0.name', $employee->name)
            ->where('attendances.0.status', 'Hadir')
        );
    }
}
