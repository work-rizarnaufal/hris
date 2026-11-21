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
        $this->assertDatabaseCount('employees', 12);
        $this->assertDatabaseHas('employees', [
            'nip' => 'HC-0101',
            'name' => 'Budi Santoso',
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
}
