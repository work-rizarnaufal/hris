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
        // 1. Akun Super Administrator Nabiel
        User::updateOrCreate(
            ['email' => 'nabiel@hrd.com'],
            [
                'name' => 'Nabiel',
                'password' => Hash::make('nabiel123'),
                'role' => 'super_admin',
                'nip' => 'HC-0001',
                'phone' => null,
                'is_active' => true,
            ]
        );

        $shiftPagi = Shift::where('code', 'PAGI')->first();
        $shiftMalam = Shift::where('code', 'MALAM')->first();
        $shiftOffice = Shift::where('code', 'OFFICE')->first();
        $locMariuk = Location::where('code', 'MRK')->first();
        $locCimalaka = Location::where('code', 'CML')->first();

        $locations = [
            'MRK' => $locMariuk?->id ?? 1,
            'CML' => $locCimalaka?->id ?? 2,
            'MARIUK' => $locMariuk?->id ?? 1,
            'CIMALAKA' => $locCimalaka?->id ?? 2,
        ];

        $cleanJsonPath = database_path('data/data_karyawan_clean.json');
        if (File::exists($cleanJsonPath)) {
            $rawEmployees = json_decode(File::get($cleanJsonPath), true);
            $mariukCount = 0;
            $cimalakaCount = 0;

            foreach ($rawEmployees as $row) {
                $idRaw = trim((string) ($row['ID'] ?? ''));
                if ($idRaw === '') {
                    continue;
                }
                $nikRaw = trim((string) ($row['NIK'] ?? $idRaw));
                $nameRaw = trim((string) ($row['Nama di perangkat absensi'] ?? ''));
                if ($nameRaw === '') {
                    $depan = trim((string) ($row['Nama Depan'] ?? ''));
                    $belakang = trim((string) ($row['Nama Belakang'] ?? ''));
                    $nameRaw = trim($depan.' '.$belakang);
                }

                $kantorRaw = strtoupper(trim((string) ($row['Kantor'] ?? '')));
                $locId = ($kantorRaw === 'MARIUK') ? $locations['MARIUK'] : $locations['CIMALAKA'];
                if ($locId === 1) {
                    $mariukCount++;
                } else {
                    $cimalakaCount++;
                }

                $jabatanRaw = trim((string) ($row['Jabatan'] ?? 'Staff'));
                $roleTitle = $jabatanRaw ?: 'Staff';
                $joinDate = trim((string) ($row['Tanggal Bergabung'] ?? ''));
                $nip = is_numeric($idRaw) ? sprintf('HC-%04d', (int) $idRaw) : 'HC-'.$idRaw;

                Employee::updateOrCreate(
                    ['nip' => $nip],
                    [
                        'biometric_pin' => $idRaw,
                        'nik' => $nikRaw,
                        'name' => $nameRaw,
                        'email' => null,
                        'phone' => trim((string) ($row['WhatsApp'] ?? '')) ?: null,
                        'role_title' => $roleTitle,
                        'division' => null, // KOSONG SESUAI INSTRUKSI
                        'location_id' => $locId,
                        'shift_id' => null,
                        'shift_group' => 'Belum Ditetapkan',
                        'employment_status' => 'PKWTT',
                        'status' => 'Aktif',
                        'join_date' => $joinDate ?: null,
                        'leave_quota' => 12,
                    ]
                );
            }

            Location::where('id', 1)->update(['assigned_count' => $mariukCount]);
            Location::where('id', 2)->update(['assigned_count' => $cimalakaCount]);
        }
    }
}
