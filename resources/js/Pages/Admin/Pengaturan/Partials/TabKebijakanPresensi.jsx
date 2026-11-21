import React from 'react';
import { Clock, Sliders } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Input,
  TableSelect,
} from '@/components/ui';

export default function TabKebijakanPresensi({
  attendanceSettings,
  setAttendanceSettings,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Card 1: Batas Waktu & Toleransi */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#c4a266]" />
            Parameter Waktu Kehadiran
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Batas toleransi masuk, kepulangan lebih awal, dan durasi kerja mingguan standar.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Toleransi Keterlambatan Masuk (Menit)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="60"
                  value={attendanceSettings.lateToleranceMinutes}
                  onChange={(e) =>
                    setAttendanceSettings({
                      ...attendanceSettings,
                      lateToleranceMinutes: Number(e.target.value),
                    })
                  }
                  className="h-9 text-xs bg-white text-slate-800 font-mono w-32"
                />
                <span className="text-xs text-slate-500">
                  menit paska jam shift dimulai (tidak dihitung denda keterlambatan)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Batas Buka Check-In Lebih Awal (Menit)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="15"
                  max="180"
                  value={attendanceSettings.earlyCheckInMinutes}
                  onChange={(e) =>
                    setAttendanceSettings({
                      ...attendanceSettings,
                      earlyCheckInMinutes: Number(e.target.value),
                    })
                  }
                  className="h-9 text-xs bg-white text-slate-800 font-mono w-32"
                />
                <span className="text-xs text-slate-500">
                  menit sebelum shift aktif (karyawan dapat mulai check-in masuk)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Toleransi Pulang Lebih Cepat (Menit)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="30"
                  value={attendanceSettings.earlyDepartureToleranceMinutes}
                  onChange={(e) =>
                    setAttendanceSettings({
                      ...attendanceSettings,
                      earlyDepartureToleranceMinutes: Number(e.target.value),
                    })
                  }
                  className="h-9 text-xs bg-white text-slate-800 font-mono w-32"
                />
                <span className="text-xs text-slate-500">
                  menit sebelum jam pulang (0 = wajib sesuai jam kerja)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kewajiban Jam Kerja Minimal Mingguan
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="30"
                  max="60"
                  value={attendanceSettings.weeklyMinHours}
                  onChange={(e) =>
                    setAttendanceSettings({
                      ...attendanceSettings,
                      weeklyMinHours: Number(e.target.value),
                    })
                  }
                  className="h-9 text-xs bg-white text-slate-800 font-mono w-32"
                />
                <span className="text-xs text-slate-500">
                  jam per minggu (Regulasi Depnaker: 40 jam kerja)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Validasi Swafoto / Selfie Wajah
                </p>
                <p className="text-[11px] text-slate-500">
                  Karyawan wajib mengunggah foto selfie saat presensi melalui ponsel
                </p>
              </div>
              <input
                type="checkbox"
                checked={attendanceSettings.requireSelfie}
                onChange={(e) =>
                  setAttendanceSettings({
                    ...attendanceSettings,
                    requireSelfie: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-navy focus:ring-navy border-slate-300 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Anti-Fake GPS / Mock Location Detection
                </p>
                <p className="text-[11px] text-slate-500">
                  Tolak presensi secara otomatis jika aplikasi GPS palsu terdeteksi
                </p>
              </div>
              <input
                type="checkbox"
                checked={attendanceSettings.preventMockGps}
                onChange={(e) =>
                  setAttendanceSettings({
                    ...attendanceSettings,
                    preventMockGps: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-navy focus:ring-navy border-slate-300 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-slate-800">
                    Validasi Radius Geofence Lokasi
                  </p>
                  <Badge className={
                    attendanceSettings.enableGeofence !== false
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold py-0'
                      : 'bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-bold py-0'
                  }>
                    {attendanceSettings.enableGeofence !== false ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Batasi presensi mobile hanya dalam radius koordinat site Mariuk & Cimalaka (Dapat diatur detail di Tab Geofencing)
                </p>
              </div>
              <input
                type="checkbox"
                checked={attendanceSettings.enableGeofence !== false}
                onChange={(e) =>
                  setAttendanceSettings({
                    ...attendanceSettings,
                    enableGeofence: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-navy focus:ring-navy border-slate-300 cursor-pointer"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Parameter Lembur & Kuota Cuti */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#c4a266]" />
            Parameter Lembur & Kuota Cuti
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Koefisien upah lembur reguler dan hak jatah cuti tahunan karyawan.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ambang Batas Minimum Durasi Lembur (Menit)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="30"
                  max="120"
                  value={attendanceSettings.minOvertimeMinutes}
                  onChange={(e) =>
                    setAttendanceSettings({
                      ...attendanceSettings,
                      minOvertimeMinutes: Number(e.target.value),
                    })
                  }
                  className="h-9 text-xs bg-white text-slate-800 font-mono w-32"
                />
                <span className="text-xs text-slate-500">
                  menit (durasi lembur di bawah nilai ini diabaikan)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pengali Lembur Jam Ke-1
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={attendanceSettings.overtimeFirstHourRate}
                  onChange={(e) =>
                    setAttendanceSettings({
                      ...attendanceSettings,
                      overtimeFirstHourRate: Number(e.target.value),
                    })
                  }
                  className="h-9 text-xs bg-white text-slate-800 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Standar Depnaker: 1.5x upah per jam
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pengali Lembur Jam Ke-2+
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={attendanceSettings.overtimeSubsequentHourRate}
                  onChange={(e) =>
                    setAttendanceSettings({
                      ...attendanceSettings,
                      overtimeSubsequentHourRate: Number(e.target.value),
                    })
                  }
                  className="h-9 text-xs bg-white text-slate-800 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Standar Depnaker: 2.0x upah per jam
                </span>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hak Kuota Cuti Tahunan Standar (Hari/Tahun)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="6"
                  max="24"
                  value={attendanceSettings.standardAnnualLeaveDays}
                  onChange={(e) =>
                    setAttendanceSettings({
                      ...attendanceSettings,
                      standardAnnualLeaveDays: Number(e.target.value),
                    })
                  }
                  className="h-9 text-xs bg-white text-slate-800 font-mono w-32"
                />
                <span className="text-xs text-slate-500">
                  hari kerja per tahun masa bakti penuh
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Batas Kedaluwarsa Sisa Cuti Tahunan
              </label>
              <TableSelect
                value={attendanceSettings.leaveExpiryPeriod}
                onChange={(e) =>
                  setAttendanceSettings({
                    ...attendanceSettings,
                    leaveExpiryPeriod: e.target.value,
                  })
                }
                className="h-9 text-xs text-slate-700"
                containerClassName="w-full"
              >
                <option value="31 Maret (Tahun Berikutnya)">
                  31 Maret Tahun Berikutnya (3 Bulan Grace Period)
                </option>
                <option value="30 Juni (Tahun Berikutnya)">
                  30 Juni Tahun Berikutnya (6 Bulan Grace Period)
                </option>
                <option value="31 Desember (Akhir Tahun Berjalan)">
                  31 Desember (Hangus pada akhir tahun kalender berjalan)
                </option>
              </TableSelect>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Notifikasi Pengingat Jadwal Shift Otomatis
                </p>
                <p className="text-[11px] text-slate-500">
                  Kirim notifikasi pengingat 1 jam sebelum shift dimulai ke personil dinas
                </p>
              </div>
              <input
                type="checkbox"
                checked={attendanceSettings.autoNotifyShiftReminder}
                onChange={(e) =>
                  setAttendanceSettings({
                    ...attendanceSettings,
                    autoNotifyShiftReminder: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-navy focus:ring-navy border-slate-300 cursor-pointer"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
