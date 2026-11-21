<?php

namespace Database\Seeders;

use App\Models\Shift;
use Illuminate\Database\Seeder;

class ShiftSeeder extends Seeder
{
    public function run(): void
    {
        $shifts = [
            [
                'id' => 1,
                'name' => 'Shift Pagi (08:00 - 17:00)',
                'code' => 'PAGI',
                'start_time' => '08:00',
                'end_time' => '17:00',
                'duration_hours' => 9,
                'type' => 'regular',
                'is_active' => true,
            ],
            [
                'id' => 2,
                'name' => 'Shift Malam (20:00 - 05:00)',
                'code' => 'MALAM',
                'start_time' => '20:00',
                'end_time' => '05:00',
                'duration_hours' => 9,
                'type' => 'night',
                'is_active' => true,
            ],
            [
                'id' => 3,
                'name' => 'Non-Shift Kantor (08:00 - 17:00)',
                'code' => 'OFFICE',
                'start_time' => '08:00',
                'end_time' => '17:00',
                'duration_hours' => 9,
                'type' => 'office',
                'is_active' => true,
            ],
        ];

        foreach ($shifts as $s) {
            Shift::updateOrCreate(['id' => $s['id']], $s);
        }
    }
}
