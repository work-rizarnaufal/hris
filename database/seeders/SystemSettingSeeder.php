<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'attendance_policy',
                'description' => 'Konfigurasi batas toleransi keterlambatan dan kebijakan presensi',
                'value' => [
                    'lateToleranceMinutes' => 15,
                    'earlyCheckInMinutes' => 60,
                    'earlyDepartureToleranceMinutes' => 0,
                    'weeklyMinHours' => 40,
                    'enableGeofence' => false,
                    'requireSelfie' => false,
                    'preventMockGps' => true,
                    'minOvertimeMinutes' => 60,
                    'standardAnnualLeaveDays' => 12,
                    'leaveExpiryPeriod' => '31 Maret (Tahun Berikutnya)',
                    'overtimeFirstHourRate' => 1.5,
                    'overtimeSubsequentHourRate' => 2.0,
                    'autoNotifyShiftReminder' => true,
                ],
            ],
            [
                'key' => 'shift_configuration',
                'description' => 'Konfigurasi rotasi jam kerja shift operasional (Pagi 08-17 & Malam 20-05)',
                'value' => [
                    'shiftPagiName' => 'Shift Pagi (08:00 - 17:00)',
                    'shiftPagiIn' => '08:00',
                    'shiftPagiOut' => '17:00',
                    'shiftMalamName' => 'Shift Malam (20:00 - 05:00)',
                    'shiftMalamIn' => '20:00',
                    'shiftMalamOut' => '05:00',
                    'tukarShiftHour' => '08:00 Pagi & 20:00 Malam',
                    'durationHours' => 9,
                    'operatingDaysPerWeek' => 7,
                    'rotationModel' => 'continuous_alternate',
                ],
            ],
            [
                'key' => 'company_profile',
                'description' => 'Data identitas korporat HCGA Nusantara Perkasa',
                'value' => [
                    'companyName' => 'PT Manufaktur Nusantara Perkasa Tbk',
                    'division' => 'Human Capital & General Affairs (HCGA)',
                    'registrationNumber' => 'NIB: 9120004561230',
                    'taxId' => '01.234.567.8-042.000',
                    'headOfficeAddress' => 'Jl. Rungkut Industri Raya No. 45, Surabaya, Jawa Timur 60293',
                    'phone' => '(031) 843-9821',
                    'officialEmail' => 'hcga-system@nusantaraperkasa.co.id',
                    'adminPicName' => 'Bambang Trihatmodjo, S.H., M.M.',
                    'adminPicRole' => 'Head of Human Capital & General Affairs',
                ],
            ],
        ];

        foreach ($settings as $item) {
            SystemSetting::updateOrCreate(['key' => $item['key']], $item);
        }
    }
}
