<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Location;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FingerprintAndManualAttendanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_kehadiran_page_renders_with_db_data(): void
    {
        $this->seed();

        $response = $this->get('/kehadiran');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Kehadiran/CatatanKehadiran')
            ->has('dbEmployees', 86)
            ->has('dbLocations')
            ->has('dbShifts')
        );
    }

    public function test_admin_can_record_manual_attendance_override(): void
    {
        $this->seed();

        $employee = Employee::first();

        $payload = [
            'employee_id' => $employee->id,
            'date' => '2026-11-22',
            'check_in_time' => '07:05',
            'check_out_time' => '19:10',
            'status' => 'Hadir',
            'late_minutes' => 0,
            'notes' => 'Karyawan lupa tap fingerprint karena terburu-buru serah terima pos jaga',
        ];

        $response = $this->post('/kehadiran/manual', $payload);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('attendances', [
            'employee_id' => $employee->id,
            'date' => '2026-11-22 00:00:00',
            'method' => 'manual_admin',
            'check_in_time' => '07:05',
            'check_out_time' => '19:10',
        ]);
    }

    public function test_fingerprint_service_can_parse_and_preview_scans(): void
    {
        $this->seed();

        $mariuk = Location::where('code', 'MRK')->first();

        $payload = [
            'location_id' => $mariuk->id,
            'scans' => [
                ['pin' => '27', 'timestamp' => '2026-11-21 06:48:00'],
                ['pin' => '27', 'timestamp' => '2026-11-21 06:48:30'], // duplicate scan < 5 min
                ['pin' => '27', 'timestamp' => '2026-11-21 17:15:00'],
                ['pin' => '30', 'timestamp' => '2026-11-21 07:22:00'], // anomaly single punch
                ['pin' => '9999', 'timestamp' => '2026-11-21 07:00:00'], // unmapped PIN
            ],
        ];

        $response = $this->postJson('/kehadiran/preview-fingerprint', $payload);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'ready',
            'anomalies',
            'unmapped',
            'total_scans',
        ]);

        $json = $response->json();
        $this->assertNotEmpty($json['ready']);
        $this->assertEquals('27', $json['ready'][0]['pin']);
        $this->assertEquals('06:48', $json['ready'][0]['check_in_time']);
        $this->assertEquals('17:15', $json['ready'][0]['check_out_time']);

        $this->assertNotEmpty($json['anomalies']);
        $this->assertEquals('30', $json['anomalies'][0]['pin']);

        $this->assertNotEmpty($json['unmapped']);
        $this->assertEquals('9999', $json['unmapped'][0]['pin']);
    }

    public function test_fingerprint_commit_records_to_database(): void
    {
        $this->seed();

        $mariuk = Location::where('code', 'MRK')->first();
        $employee = Employee::where('biometric_pin', '27')->first();

        $records = [
            [
                'employee_id' => $employee->id,
                'location_id' => $mariuk->id,
                'date' => '2026-11-21',
                'check_in_time' => '06:48',
                'check_out_time' => '17:15',
                'status' => 'Hadir',
                'late_minutes' => 0,
                'notes' => 'Impor log mesin sidik jari Mariuk',
            ],
        ];

        $response = $this->post('/kehadiran/commit-fingerprint', [
            'batch_id' => 'BATCH-TEST-MARIUK-01',
            'records' => $records,
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('attendances', [
            'employee_id' => $employee->id,
            'import_batch_id' => 'BATCH-TEST-MARIUK-01',
            'method' => 'fingerprint',
            'check_in_time' => '06:48',
            'check_out_time' => '17:15',
        ]);
    }

    public function test_admin_can_link_unmapped_biometric_pin_to_employee(): void
    {
        $this->seed();

        $employee = Employee::where('nip', 'HC-0027')->first();

        $response = $this->postJson('/kehadiran/link-biometric-pin', [
            'employee_id' => $employee->id,
            'biometric_pin' => '8888',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $employee->refresh();
        $this->assertEquals('8888', $employee->biometric_pin);
    }

    public function test_admin_can_record_mass_attendance(): void
    {
        $this->seed();

        $employees = Employee::take(3)->get();
        $employeeIds = $employees->pluck('id')->toArray();

        $response = $this->post('/kehadiran/mass', [
            'date' => '2026-11-22',
            'check_in_time' => '08:00',
            'employee_ids' => $employeeIds,
        ]);

        $response->assertSessionHas('success');

        foreach ($employeeIds as $id) {
            $this->assertDatabaseHas('attendances', [
                'employee_id' => $id,
                'date' => '2026-11-22 00:00:00',
                'status' => 'hadir',
                'check_in_time' => '08:00',
                'method' => 'manual_admin',
            ]);
        }
    }

    public function test_admin_can_delete_attendance_record(): void
    {
        $this->seed();

        $employee = Employee::first();

        $attendance = Attendance::create([
            'employee_id' => $employee->id,
            'date' => '2026-11-22',
            'status' => 'hadir',
            'check_in_time' => '08:00',
            'check_out_time' => '17:00',
            'method' => 'manual_admin',
        ]);

        $response = $this->delete('/kehadiran/'.$attendance->id);

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('attendances', [
            'id' => $attendance->id,
        ]);
    }
}
