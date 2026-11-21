import React from 'react';
import { Clock, ArrowLeftRight } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Input,
} from '@/components/ui';

export default function TabJamKerjaShift({
  shiftSettings,
  setShiftSettings,
  locations = [],
}) {
  const mariukLoc = locations.find((l) => l.name.includes('Mariuk'));
  const cimalakaLoc = locations.find((l) => l.name.includes('Cimalaka'));
  const mariukCount = mariukLoc?.assignedCount ?? 35;
  const cimalakaCount = cimalakaLoc?.assignedCount ?? 51;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Card 1: Konfigurasi Jam Masuk/Pulang Shift Operasional */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#c4a266]" />
            Master Jam Kerja Shift Operasional
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Atur jam masuk, jam pulang, dan serah terima tugas (handover) untuk Shift Pagi dan Malam.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-5">
          {/* Shift Pagi */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Pengaturan Shift 1 (Pagi)
              </span>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-mono text-[10px]">
                Shift Pagi (08:00 - 17:00)
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Label Shift
                </label>
                <Input
                  type="text"
                  value={shiftSettings.shiftPagiName}
                  onChange={(e) =>
                    setShiftSettings({ ...shiftSettings, shiftPagiName: e.target.value })
                  }
                  className="h-9 text-xs bg-white text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Jam Masuk Pagi
                </label>
                <Input
                  type="time"
                  value={shiftSettings.shiftPagiIn}
                  onChange={(e) =>
                    setShiftSettings({ ...shiftSettings, shiftPagiIn: e.target.value })
                  }
                  className="h-9 text-xs bg-white text-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Jam Pulang Sore
                </label>
                <Input
                  type="time"
                  value={shiftSettings.shiftPagiOut}
                  onChange={(e) =>
                    setShiftSettings({ ...shiftSettings, shiftPagiOut: e.target.value })
                  }
                  className="h-9 text-xs bg-white text-slate-800 font-mono"
                />
              </div>
            </div>
            <p className="text-[11px] text-emerald-800">
              * Absen masuk dibuka mulai 07:00 WIB, absen pulang ditutup pukul 18:00 WIB.
            </p>
          </div>

          {/* Shift Malam */}
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                Pengaturan Shift 2 (Malam)
              </span>
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300 font-mono text-[10px]">
                Shift Malam (20:00 - 05:00)
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Label Shift
                </label>
                <Input
                  type="text"
                  value={shiftSettings.shiftMalamName}
                  onChange={(e) =>
                    setShiftSettings({ ...shiftSettings, shiftMalamName: e.target.value })
                  }
                  className="h-9 text-xs bg-white text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Jam Masuk Malam
                </label>
                <Input
                  type="time"
                  value={shiftSettings.shiftMalamIn}
                  onChange={(e) =>
                    setShiftSettings({ ...shiftSettings, shiftMalamIn: e.target.value })
                  }
                  className="h-9 text-xs bg-white text-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Jam Pulang Pagi
                </label>
                <Input
                  type="time"
                  value={shiftSettings.shiftMalamOut}
                  onChange={(e) =>
                    setShiftSettings({ ...shiftSettings, shiftMalamOut: e.target.value })
                  }
                  className="h-9 text-xs bg-white text-slate-800 font-mono"
                />
              </div>
            </div>
            <p className="text-[11px] text-indigo-800">
              * Absen masuk dibuka mulai 19:00 WIB, absen pulang ditutup pukul 06:00 WIB (lintas hari).
            </p>
          </div>

          {/* Serah Terima Tugas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Waktu Tukar Shift / Handover
              </label>
              <Input
                type="text"
                value={shiftSettings.tukarShiftHour}
                onChange={(e) =>
                  setShiftSettings({ ...shiftSettings, tukarShiftHour: e.target.value })
                }
                className="h-9 text-xs bg-white text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Baku: Jam 07:00 - 08:00 pagi dan 19:00 - 20:00 malam
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Durasi Kerja per Shift (Jam)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="8"
                  max="14"
                  value={shiftSettings.durationHours}
                  onChange={(e) =>
                    setShiftSettings({
                      ...shiftSettings,
                      durationHours: Number(e.target.value),
                    })
                  }
                  className="h-9 text-xs bg-white text-slate-800 font-mono w-28"
                />
                <span className="text-xs text-slate-500">Jam per giliran dinas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Panduan Operasional Non-Stop & Lokasi Kerja */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-[#c4a266]" />
            Aturan Operasional Non-Stop & Multi-Lokasi
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Pola kerja continuous 7 hari kerja tanpa libur operasional bagi Kelompok A & B.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="text-xs font-bold text-navy flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gold"></span>
              Prinsip Operasional 24/7 (Non-Stop 7 Hari Kerja)
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sistem operasional di <strong className="text-navy">Lokasi Mariuk</strong> dan{' '}
              <strong className="text-navy">Lokasi Cimalaka</strong> berjalan terus-menerus 7 hari per minggu (Senin sampai Minggu). Tidak ada hari libur pabrik/site. Karyawan menikmati libur (OFF) bergantian saat kelompoknya tidak bertugas.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hari Operasional Pabrik / Site
              </label>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                <span className="text-xs font-medium text-slate-800">
                  Operasional 7 Hari Penuh (Sabtu & Minggu Tetap Berjalan)
                </span>
                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                  AKTIF 24/7
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Model Rotasi Kelompok
              </label>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                <span className="text-xs font-medium text-slate-800">
                  Selang-Seling Berkelanjutan (Kelompok A ⇄ Kelompok B)
                </span>
                <Badge className="bg-navy text-white text-[10px] font-mono">
                  ROLLING FAIR
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Kelompok A masuk Senin, Kelompok B masuk Selasa, bergantian seterusnya. Jatah hari Minggu didapat adil bergantian setiap 2 minggu.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cakupan Lokasi Terdaftar
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white text-center">
                  <p className="text-xs font-bold text-navy">📍 Lokasi Mariuk</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{mariukCount} Personil Terdaftar</p>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white text-center">
                  <p className="text-xs font-bold text-navy">📍 Lokasi Cimalaka</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{cimalakaCount} Personil Terdaftar</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
