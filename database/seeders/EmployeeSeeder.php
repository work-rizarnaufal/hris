<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Location;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Database\Seeder;
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
                'nip' => 'HC-0001',
                'phone' => '0812-9988-7711',
                'is_active' => true,
            ]
        );

        $shiftPagi = Shift::where('code', 'PAGI_12H')->first();
        $shiftMalam = Shift::where('code', 'MALAM_12H')->first();
        $locMariuk = Location::where('code', 'MRK')->first();
        $locCimalaka = Location::where('code', 'CML')->first();

        // 2. Data Master 12 Karyawan Lapangan & Site
        $employees = [
            // --- LOKASI MARIUK (6 Personel) ---
            [
                'nip' => 'HC-0101',
                'biometric_pin' => '101',
                'name' => 'Budi Santoso',
                'email' => 'budi.santoso@nusantaraperkasa.co.id',
                'phone' => '0812-3456-7801',
                'role_title' => 'Senior Operator Lapangan',
                'division' => 'Operasional & Lapangan',
                'location_id' => $locMariuk?->id,
                'shift_id' => $shiftPagi?->id,
                'shift_group' => 'Grup A',
                'employment_status' => 'PKWTT',
                'status' => 'Aktif',
                'join_date' => '2022-03-01',
                'leave_quota' => 12,
                'create_user' => true,
                'user_role' => 'karyawan',
            ],
            [
                'nip' => 'HC-0104',
                'biometric_pin' => '104',
                'name' => 'Dewi Anggraini',
                'email' => 'dewi.anggraini@nusantaraperkasa.co.id',
                'phone' => '0812-3456-7804',
                'role_title' => 'Quality Assurance Inspector',
                'division' => 'Operasional & Lapangan',
                'location_id' => $locMariuk?->id,
                'shift_id' => $shiftPagi?->id,
                'shift_group' => 'Grup A',
                'employment_status' => 'PKWTT',
                'status' => 'Aktif',
                'join_date' => '2023-01-15',
                'leave_quota' => 12,
                'create_user' => false,
            ],
            [
                'nip' => 'HC-0105',
                'biometric_pin' => '105',
                'name' => 'Hendra Wijaya',
                'email' => 'hendra.wijaya@nusantaraperkasa.co.id',
                'phone' => '0812-3456-7805',
                'role_title' => 'Danru Keamanan & K3',
                'division' => 'Security & Safety',
                'location_id' => $locMariuk?->id,
                'shift_id' => $shiftMalam?->id,
                'shift_group' => 'Grup A',
                'employment_status' => 'PKWTT',
                'status' => 'Aktif',
                'join_date' => '2021-08-10',
                'leave_quota' => 10,
                'create_user' => false,
            ],
            [
                'nip' => 'HC-0103',
                'biometric_pin' => '103',
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad.fauzi@nusantaraperkasa.co.id',
                'phone' => '0812-3456-7803',
                'role_title' => 'Operator Forklift Utama',
                'division' => 'Logistik & Gudang',
                'location_id' => $locMariuk?->id,
                'shift_id' => $shiftPagi?->id,
                'shift_group' => 'Grup B',
                'employment_status' => 'PKWT',
                'status' => 'Aktif',
                'join_date' => '2023-06-01',
                'leave_quota' => 12,
                'create_user' => false,
            ],
            [
                'nip' => 'HC-0107',
                'biometric_pin' => '107',
                'name' => 'Eko Prasetyo',
                'email' => 'eko.prasetyo@nusantaraperkasa.co.id',
                'phone' => '0812-3456-7807',
                'role_title' => 'Teknisi Maintenance Mesin',
                'division' => 'Operasional & Lapangan',
                'location_id' => $locMariuk?->id,
                'shift_id' => $shiftPagi?->id,
                'shift_group' => 'Grup B',
                'employment_status' => 'PKWTT',
                'status' => 'Aktif',
                'join_date' => '2022-11-20',
                'leave_quota' => 11,
                'create_user' => false,
            ],
            [
                'nip' => 'HC-0109',
                'biometric_pin' => '109',
                'name' => 'Joko Susilo',
                'email' => 'joko.susilo@nusantaraperkasa.co.id',
                'phone' => '0812-3456-7809',
                'role_title' => 'Anggota Patroli Keamanan',
                'division' => 'Security & Safety',
                'location_id' => $locMariuk?->id,
                'shift_id' => $shiftMalam?->id,
                'shift_group' => 'Grup B',
                'employment_status' => 'PKWT',
                'status' => 'Aktif',
                'join_date' => '2024-02-01',
                'leave_quota' => 12,
                'create_user' => false,
            ],

            // --- LOKASI CIMALAKA (6 Personel) ---
            [
                'nip' => 'HC-0102',
                'biometric_pin' => '202',
                'name' => 'Siti Rahmawati',
                'email' => 'siti.rahmawati@nusantaraperkasa.co.id',
                'phone' => '0812-3456-7802',
                'role_title' => 'Supervisor Operasional Site',
                'division' => 'Operasional & Lapangan',
                'location_id' => $locCimalaka?->id,
                'shift_id' => $shiftPagi?->id,
                'shift_group' => 'Grup A',
                'employment_status' => 'PKWTT',
                'status' => 'Aktif',
                'join_date' => '2020-05-15',
                'leave_quota' => 14,
                'create_user' => true,
                'user_role' => 'supervisor',
            ],
            [
                'nip' => 'HC-0111',
                'biometric_pin' => '211',
                'name' => 'Wahyu Hidayat',
                'email' => 'wahyu.hidayat@nusantaraperkasa.co.id',
                'phone' => '0812-3456-7811',
                'role_title' => 'Operator Mesin Produksi',
                'division' => 'Operasional & Lapangan',
                'location_id' => $locCimalaka?->id,
                'shift_id' => $shiftPagi?->id,
                'shift_group' => 'Grup A',
                'employment_status' => 'PKWT',
                'status' => 'Aktif',
                'join_date' => '2023-09-01',
                'leave_quota' => 12,
                'create_user' => false,
            ],
            [
                'nip' => 'HC-0110',
                'biometric_pin' => '210',
                'name' => 'Dian Kusuma',
                'email' => 'dian.kusuma@nusantaraperkasa.co.id',
                'phone' => '0812-3456-7810',
                'role_title' => 'Petugas Keamanan Site',
                'division' => 'Security & Safety',
                'location_id' => $locCimalaka?->id,
                'shift_id' => $shiftMalam?->id,
                'shift_group' => 'Grup A',
                'employment_status' => 'PKWTT',
                'status' => 'Aktif',
                'join_date' => '2022-07-10',
                'leave_quota' => 12,
                'create_user' => false,
            ],
            [
                'nip' => 'HC-0106',
                'biometric_pin' => '206',
                'name' => 'Rina Marlina',
                'email' => 'rina.marlina@nusantaraperkasa.co.id',
                'phone' => '0812-3456-7806',
                'role_title' => 'Koordinator Gudang & Logistik',
                'division' => 'Logistik & Gudang',
                'location_id' => $locCimalaka?->id,
                'shift_id' => $shiftPagi?->id,
                'shift_group' => 'Grup B',
                'employment_status' => 'PKWTT',
                'status' => 'Aktif',
                'join_date' => '2021-12-01',
                'leave_quota' => 10,
                'create_user' => false,
            ],
            [
                'nip' => 'HC-0108',
                'biometric_pin' => '208',
                'name' => 'Maya Indah Lestari',
                'email' => 'maya.indah@nusantaraperkasa.co.id',
                'phone' => '0812-3456-7808',
                'role_title' => 'Operator QC Lapangan',
                'division' => 'Operasional & Lapangan',
                'location_id' => $locCimalaka?->id,
                'shift_id' => $shiftPagi?->id,
                'shift_group' => 'Grup B',
                'employment_status' => 'PKWT',
                'status' => 'Cuti',
                'join_date' => '2023-04-15',
                'leave_quota' => 8,
                'create_user' => false,
            ],
            [
                'nip' => 'HC-0112',
                'biometric_pin' => '212',
                'name' => 'Nurul Aini',
                'email' => 'nurul.aini@nusantaraperkasa.co.id',
                'phone' => '0812-3456-7812',
                'role_title' => 'Petugas Inventory Stok',
                'division' => 'Logistik & Gudang',
                'location_id' => $locCimalaka?->id,
                'shift_id' => $shiftMalam?->id,
                'shift_group' => 'Grup B',
                'employment_status' => 'PKWT',
                'status' => 'Aktif',
                'join_date' => '2024-01-10',
                'leave_quota' => 12,
                'create_user' => false,
            ],
        ];

        foreach ($employees as $data) {
            $userId = null;
            if (! empty($data['create_user'])) {
                $user = User::updateOrCreate(
                    ['email' => $data['email']],
                    [
                        'name' => $data['name'],
                        'password' => $defaultPassword,
                        'role' => $data['user_role'] ?? 'karyawan',
                        'nip' => $data['nip'],
                        'phone' => $data['phone'],
                        'is_active' => true,
                    ]
                );
                $userId = $user->id;
            }

            Employee::updateOrCreate(
                ['nip' => $data['nip']],
                [
                    'user_id' => $userId,
                    'biometric_pin' => $data['biometric_pin'] ?? null,
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'],
                    'role_title' => $data['role_title'],
                    'division' => $data['division'],
                    'location_id' => $data['location_id'],
                    'shift_id' => $data['shift_id'],
                    'shift_group' => $data['shift_group'],
                    'employment_status' => $data['employment_status'],
                    'status' => $data['status'],
                    'join_date' => $data['join_date'],
                    'leave_quota' => $data['leave_quota'],
                ]
            );
        }
    }
}
