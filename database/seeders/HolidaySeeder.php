<?php

namespace Database\Seeders;

use App\Models\Holiday;
use Illuminate\Database\Seeder;

class HolidaySeeder extends Seeder
{
    public function run(): void
    {
        $holidays = [
            [
                'date' => '2026-01-01',
                'day_name' => 'Kamis',
                'name' => 'Tahun Baru 2026 Masehi',
                'category' => 'Libur Nasional',
                'deducts_leave' => false,
                'operational_note' => 'Seluruh operasional pabrik dan kantor libur',
            ],
            [
                'date' => '2026-01-16',
                'day_name' => 'Jumat',
                'name' => "Isra Mi'raj Nabi Muhammad SAW",
                'category' => 'Libur Nasional',
                'deducts_leave' => false,
                'operational_note' => 'Libur resmi keagamaan nasional',
            ],
            [
                'date' => '2026-02-17',
                'day_name' => 'Selasa',
                'name' => 'Tahun Baru Imlek 2577 Kongzili',
                'category' => 'Libur Nasional',
                'deducts_leave' => false,
                'operational_note' => 'Libur resmi nasional',
            ],
            [
                'date' => '2026-03-20',
                'day_name' => 'Jumat',
                'name' => 'Hari Suci Nyepi (Tahun Baru Saka 1948)',
                'category' => 'Libur Nasional',
                'deducts_leave' => false,
                'operational_note' => 'Libur resmi nasional',
            ],
            [
                'date' => '2026-03-23',
                'day_name' => 'Senin',
                'name' => 'Hari Raya Idul Fitri 1447 H (Hari Pertama)',
                'category' => 'Libur Nasional',
                'deducts_leave' => false,
                'operational_note' => 'Hari raya keagamaan nasional',
            ],
            [
                'date' => '2026-03-24',
                'day_name' => 'Selasa',
                'name' => 'Hari Raya Idul Fitri 1447 H (Hari Kedua)',
                'category' => 'Libur Nasional',
                'deducts_leave' => false,
                'operational_note' => 'Hari raya keagamaan nasional',
            ],
            [
                'date' => '2026-03-25',
                'day_name' => 'Rabu',
                'name' => 'Cuti Bersama Hari Raya Idul Fitri',
                'category' => 'Cuti Bersama',
                'deducts_leave' => false,
                'operational_note' => 'Cuti bersama pemerintah Republik Indonesia',
            ],
            [
                'date' => '2026-05-01',
                'day_name' => 'Jumat',
                'name' => 'Hari Buruh Internasional (May Day)',
                'category' => 'Libur Nasional',
                'deducts_leave' => false,
                'operational_note' => 'Libur resmi ketenagakerjaan',
            ],
            [
                'date' => '2026-05-14',
                'day_name' => 'Kamis',
                'name' => 'Kenaikan Yesus Kristus',
                'category' => 'Libur Nasional',
                'deducts_leave' => false,
                'operational_note' => 'Libur resmi keagamaan nasional',
            ],
            [
                'date' => '2026-05-27',
                'day_name' => 'Rabu',
                'name' => 'Hari Raya Idul Adha 1447 H',
                'category' => 'Libur Nasional',
                'deducts_leave' => false,
                'operational_note' => 'Libur resmi keagamaan nasional',
            ],
            [
                'date' => '2026-06-01',
                'day_name' => 'Senin',
                'name' => 'Hari Lahir Pancasila',
                'category' => 'Libur Nasional',
                'deducts_leave' => false,
                'operational_note' => 'Libur resmi kenegaraan',
            ],
            [
                'date' => '2026-08-17',
                'day_name' => 'Senin',
                'name' => 'Hari Kemerdekaan Republik Indonesia Ke-81',
                'category' => 'Libur Nasional',
                'deducts_leave' => false,
                'operational_note' => 'Peringatan HUT Kemerdekaan RI',
            ],
        ];

        foreach ($holidays as $h) {
            Holiday::updateOrCreate(['date' => $h['date']], $h);
        }
    }
}
