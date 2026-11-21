<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Services\FingerprintImportService;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = database_path('data/scans_report.json');
        if (! file_exists($filePath)) {
            return;
        }

        $rawScans = json_decode(file_get_contents($filePath), true);
        if (empty($rawScans)) {
            return;
        }

        $service = app(FingerprintImportService::class);
        $location = Location::first();
        $locationId = $location ? $location->id : 1;

        $parsed = $service->parseScans($rawScans, $locationId);
        $allRecords = array_merge($parsed['ready'], $parsed['anomalies']);

        if (! empty($allRecords)) {
            $service->commitRecords($allRecords, 'BATCH-INITIAL-REAL-LOG');
        }
    }
}
