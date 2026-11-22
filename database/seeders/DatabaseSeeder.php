<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            LocationSeeder::class,
            ShiftSeeder::class,
            SystemSettingSeeder::class,
            // HolidaySeeder::class, // Kalender hari libur nasional diinput manual nanti
            EmployeeSeeder::class,
            // AttendanceSeeder::class, // Presensi diimpor manual/real dari log mesin fingerprint
        ]);
    }
}
