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
                'name' => 'Shift Pagi (12 Jam)',
                'code' => 'PAGI_12H',
                'start_time' => '07:00',
                'end_time' => '19:00',
                'duration_hours' => 12,
                'type' => '12_hours',
                'is_active' => true,
            ],
            [
                'id' => 2,
                'name' => 'Shift Malam (12 Jam)',
                'code' => 'MALAM_12H',
                'start_time' => '19:00',
                'end_time' => '07:00',
                'duration_hours' => 12,
                'type' => '12_hours',
                'is_active' => true,
            ],
            [
                'id' => 3,
                'name' => 'Non-Shift Kantor (8 Jam)',
                'code' => 'OFFICE_8H',
                'start_time' => '08:00',
                'end_time' => '17:00',
                'duration_hours' => 8,
                'type' => '8_hours',
                'is_active' => true,
            ],
        ];

        foreach ($shifts as $s) {
            Shift::updateOrCreate(['id' => $s['id']], $s);
        }
    }
}
