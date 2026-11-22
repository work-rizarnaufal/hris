import React from 'react';
import { Users, CheckCircle2, Clock, CalendarX2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';

export default function AttendanceKpiCards({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {/* 1. Total Terjadwal */}
      <Card className="border border-slate-200/80 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-medium">Total Jadwal</span>
            <span className="w-7 h-7 rounded-lg bg-slate-100 text-navy flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <strong className="text-2xl font-bold text-navy block tracking-tight">
            {stats.totalScheduled}
          </strong>
          <small className="text-[11px] text-slate-500 font-medium mt-1 block">
            Tingkat Kehadiran: <span className="text-emerald-700 font-bold">{stats.attendanceRate}%</span>
          </small>
        </CardContent>
      </Card>

      {/* 2. Tepat Waktu */}
      <Card className="border border-slate-200/80 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-medium">Tepat Waktu</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <strong className="text-2xl font-bold text-emerald-800 block tracking-tight">
            {stats.presentOnTime}
          </strong>
          <small className="text-[11px] text-slate-500 font-medium mt-1 block">
            Check-in sesuai shift
          </small>
        </CardContent>
      </Card>

      {/* 3. Terlambat */}
      <Card className="border border-slate-200/80 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-medium">Terlambat</span>
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <strong className="text-2xl font-bold text-amber-800 block tracking-tight">
            {stats.lateCount}
          </strong>
          <small className="text-[11px] text-amber-700 font-medium mt-1 block">
            Total {stats.totalLateMinutes} menit deviasi
          </small>
        </CardContent>
      </Card>

      {/* 4. Izin / Sakit / Cuti */}
      <Card className="border border-slate-200/80 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-medium">Izin / Cuti / Sakit</span>
            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <CalendarX2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <strong className="text-2xl font-bold text-blue-800 block tracking-tight">
            {stats.permissionOrLeave}
          </strong>
          <small className="text-[11px] text-slate-500 font-medium mt-1 block">
            Ketidakhadiran resmi
          </small>
        </CardContent>
      </Card>

      {/* 5. Alpha / Belum Presensi */}
      <Card className="border border-slate-200/80 shadow-sm col-span-2 md:col-span-1">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-medium">Alpha / Mangkir</span>
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <strong className="text-2xl font-bold text-rose-800 block tracking-tight">
            {stats.alphaCount}
          </strong>
          <small className="text-[11px] text-rose-700 font-medium mt-1 block">
            {stats.unrecordedCount > 0 ? `${stats.unrecordedCount} belum check-in` : 'Tanpa keterangan'}
          </small>
        </CardContent>
      </Card>
    </div>
  );
}
