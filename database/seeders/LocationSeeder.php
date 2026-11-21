<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            [
                'id' => 1,
                'name' => 'Lokasi Mariuk',
                'code' => 'MRK',
                'type' => 'Site Operasional & Pabrik Mariuk',
                'latitude' => -6.48512,
                'longitude' => 107.82145,
                'radius_meters' => 120,
                'assigned_count' => 6,
                'status' => 'Aktif',
                'address' => 'Kawasan Industri & Operasional Mariuk, Subang',
            ],
            [
                'id' => 2,
                'name' => 'Lokasi Cimalaka',
                'code' => 'CML',
                'type' => 'Site Operasional & Gudang Cimalaka',
                'latitude' => -6.81234,
                'longitude' => 107.93512,
                'radius_meters' => 120,
                'assigned_count' => 6,
                'status' => 'Aktif',
                'address' => 'Kawasan Operasional Cimalaka, Sumedang',
            ],
        ];

        foreach ($locations as $loc) {
            Location::updateOrCreate(['id' => $loc['id']], $loc);
        }
    }
}
