<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\Location;
use App\Models\Shift;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KaryawanBackendTest extends TestCase
{
    use RefreshDatabase;

    public function test_karyawan_page_renders_with_employees(): void
    {
        $this->seed();

        $response = $this->get('/karyawan');

        $response->assertStatus(200);
        $this->assertDatabaseCount('employees', 86);
        $this->assertDatabaseHas('employees', [
            'nip' => 'HC-0027',
            'name' => 'Abdul Saepudin',
        ]);
    }

    public function test_can_add_new_employee(): void
    {
        $this->seed();

        $loc = Location::first();
        $shift = Shift::first();

        $payload = [
            'nip' => 'HC-0999',
            'name' => 'Karyawan Baru Test',
            'email' => 'test.karyawan@nusantaraperkasa.co.id',
            'phone' => '0812-9999-8888',
            'role_title' => 'Operator Lapangan Trainee',
            'division' => 'Operasional & Lapangan',
            'location_id' => $loc?->id,
            'shift_id' => $shift?->id,
            'shift_group' => 'Grup A',
            'employment_status' => 'PKWT',
            'status' => 'Aktif',
        ];

        $response = $this->post('/karyawan', $payload);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('employees', [
            'nip' => 'HC-0999',
            'name' => 'Karyawan Baru Test',
        ]);
    }

    public function test_can_add_employee_with_auto_generated_nip_and_string_attributes(): void
    {
        $this->seed();

        $payload = [
            'name' => 'Karyawan Otomatis NIP',
            'role' => 'Teknisi Listrik Lapangan',
            'division' => 'Operasional & Lapangan',
            'location' => 'Lokasi Cimalaka',
            'group' => 'Grup B',
            'scheduleCategory' => 'Shift Malam (12 Jam)',
            'status' => 'Aktif',
        ];

        $response = $this->post('/karyawan', $payload);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('employees', [
            'name' => 'Karyawan Otomatis NIP',
            'location_id' => 2,
            'shift_id' => 2,
            'shift_group' => 'Grup B',
        ]);
    }

    public function test_can_update_employee(): void
    {
        $this->seed();

        $emp = Employee::where('nip', 'HC-0027')->firstOrFail();

        $payload = [
            'nip' => $emp->nip,
            'name' => 'Abdul Saepudin Updated',
            'role' => 'Supervisor Lapangan',
            'division' => 'Operasional & Lapangan',
            'location' => 'Lokasi Mariuk',
            'group' => 'Grup A',
            'scheduleCategory' => 'Shift Pagi (12 Jam)',
            'status' => 'Aktif',
        ];

        $response = $this->put("/karyawan/{$emp->id}", $payload);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('employees', [
            'id' => $emp->id,
            'name' => 'Abdul Saepudin Updated',
            'role_title' => 'Supervisor Lapangan',
        ]);
    }

    public function test_can_delete_employee(): void
    {
        $this->seed();

        $emp = Employee::where('nip', 'HC-0027')->firstOrFail();

        $response = $this->delete("/karyawan/{$emp->id}");

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('employees', [
            'id' => $emp->id,
        ]);
        $this->assertDatabaseCount('employees', 85);
    }

    public function test_can_batch_import_employees(): void
    {
        $this->seed();

        $batch = [
            [
                'nip' => 'HC-0888',
                'biometric_pin' => '888',
                'name' => 'Personel Impor 1',
                'role' => 'Operator QC',
                'division' => 'Operasional & Lapangan',
                'location' => 'Lokasi Mariuk',
                'group' => 'Grup A',
                'scheduleCategory' => 'Shift Pagi (12 Jam)',
                'status' => 'Aktif',
            ],
            [
                'nip' => 'HC-0889',
                'biometric_pin' => '889',
                'name' => 'Personel Impor 2',
                'role' => 'Security Site',
                'division' => 'Security & Safety',
                'location' => 'Lokasi Cimalaka',
                'group' => 'Grup B',
                'scheduleCategory' => 'Shift Malam (12 Jam)',
                'status' => 'Aktif',
            ],
        ];

        $response = $this->post('/karyawan/batch-import', ['employees' => $batch]);

        $response->assertSessionHas('success');
        $this->assertDatabaseCount('employees', 88);
        $this->assertDatabaseHas('employees', [
            'nip' => 'HC-0888',
            'name' => 'Personel Impor 1',
            'location_id' => 1,
        ]);
        $this->assertDatabaseHas('employees', [
            'nip' => 'HC-0889',
            'name' => 'Personel Impor 2',
            'location_id' => 2,
        ]);
    }
}
