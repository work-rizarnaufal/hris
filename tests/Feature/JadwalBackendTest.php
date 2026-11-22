<?php

namespace Tests\Feature;

use App\Models\Employee;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class JadwalBackendTest extends TestCase
{
    use RefreshDatabase;

    public function test_jadwal_page_renders_with_database_data(): void
    {
        $this->seed();

        $response = $this->get('/jadwal');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Jadwal/JadwalShift')
            ->has('dbEmployees', 86)
            ->has('dbLocations')
            ->has('dbShifts')
        );
    }

    public function test_can_update_individual_employee_group(): void
    {
        $this->seed();

        $emp = Employee::first();

        $response = $this->put("/jadwal/employee/{$emp->id}/group", [
            'group' => 'Grup A',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('employees', [
            'id' => $emp->id,
            'shift_group' => 'Grup A',
        ]);
    }

    public function test_can_bulk_update_employee_groups(): void
    {
        $this->seed();

        $employees = Employee::take(3)->get();
        $ids = $employees->pluck('id')->toArray();

        $response = $this->post('/jadwal/bulk-update-group', [
            'employee_ids' => $ids,
            'group' => 'Grup B',
        ]);

        $response->assertSessionHas('success');
        foreach ($ids as $id) {
            $this->assertDatabaseHas('employees', [
                'id' => $id,
                'shift_group' => 'Grup B',
            ]);
        }
    }

    public function test_can_swap_groups_between_group_a_and_group_b(): void
    {
        $this->seed();

        $empA = Employee::first();
        $empB = Employee::skip(1)->first();

        $empA->update(['shift_group' => 'Grup A']);
        $empB->update(['shift_group' => 'Grup B']);

        $response = $this->post('/jadwal/swap-group');

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('employees', [
            'id' => $empA->id,
            'shift_group' => 'Grup B',
        ]);
        $this->assertDatabaseHas('employees', [
            'id' => $empB->id,
            'shift_group' => 'Grup A',
        ]);
    }

    public function test_swap_group_returns_warning_when_both_groups_are_empty(): void
    {
        $this->seed();

        Employee::query()->update(['shift_group' => 'Belum Ditetapkan']);

        $response = $this->post('/jadwal/swap-group');

        $response->assertSessionHas('warning');
    }
}
