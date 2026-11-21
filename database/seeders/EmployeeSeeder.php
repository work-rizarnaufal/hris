<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Location;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $defaultPassword = Hash::make('password');

        // 1. Akun Super Administrator HCGA
        User::updateOrCreate(
            ['email' => 'admin@nusantaraperkasa.co.id'],
            [
                'name' => 'Bambang Trihatmodjo, S.H., M.M.',
                'password' => $defaultPassword,
                'role' => 'super_admin',
                'nip' => 'HC-ADMIN',
                'phone' => '0812-9988-7711',
                'is_active' => true,
            ]
        );

        // 2. Akun Supervisor Site (Nabiel F - CEO Cimalaka)
        User::updateOrCreate(
            ['email' => 'nabiel.f@nusantaraperkasa.co.id'],
            [
                'name' => 'NABIEL F',
                'password' => $defaultPassword,
                'role' => 'supervisor',
                'nip' => 'HC-0001',
                'phone' => null,
                'is_active' => true,
            ]
        );

        // 3. Akun Karyawan Lapangan (Abdul Saepudin - Mariuk)
        User::updateOrCreate(
            ['email' => 'abdul.saepudin@nusantaraperkasa.co.id'],
            [
                'name' => 'Abdul Saepudin',
                'password' => $defaultPassword,
                'role' => 'karyawan',
                'nip' => 'HC-0027',
                'phone' => null,
                'is_active' => true,
            ]
        );

        $shiftPagi = Shift::where('code', 'PAGI_12H')->first();
        $shiftMalam = Shift::where('code', 'MALAM_12H')->first();
        $shiftOffice = Shift::where('code', 'OFFICE_8H')->first();
        $locMariuk = Location::where('code', 'MRK')->first();
        $locCimalaka = Location::where('code', 'CML')->first();

        $shifts = [
            'PAGI_12H' => $shiftPagi?->id,
            'MALAM_12H' => $shiftMalam?->id,
            'OFFICE_8H' => $shiftOffice?->id,
        ];

        $locations = [
            'MRK' => $locMariuk?->id,
            'CML' => $locCimalaka?->id,
        ];

        $jsonPath = database_path('data/karyawan.json');
        if (File::exists($jsonPath)) {
            $employees = json_decode(File::get($jsonPath), true);
        } else {
            $employees = [];
        }

        foreach ($employees as $data) {
            Employee::updateOrCreate(
                ['nip' => $data['nip']],
                [
                    'biometric_pin' => (string) $data['biometric_pin'],
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'] ?? null,
                    'role_title' => $data['role_title'],
                    'division' => $data['division'],
                    'location_id' => $locations[$data['location_code']] ?? null,
                    'shift_id' => $shifts[$data['shift_code']] ?? null,
                    'shift_group' => $data['shift_group'],
                    'employment_status' => $data['employment_status'],
                    'status' => $data['status'] ?? 'Aktif',
                    'join_date' => $data['join_date'],
                    'leave_quota' => $data['leave_quota'] ?? 12,
                ]
            );
        }
    }
}
