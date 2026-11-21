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
                'description' => 'Konfigurasi rotasi jam kerja shift 12 jam continuous',
                'value' => [
                    'shiftPagiName' => 'Shift Pagi (12 Jam)',
                    'shiftPagiIn' => '07:00',
                    'shiftPagiOut' => '19:00',
                    'shiftMalamName' => 'Shift Malam (12 Jam)',
                    'shiftMalamIn' => '19:00',
                    'shiftMalamOut' => '07:00',
                    'tukarShiftHour' => '07:00 Pagi & 19:00 Malam',
                    'durationHours' => 12,
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
