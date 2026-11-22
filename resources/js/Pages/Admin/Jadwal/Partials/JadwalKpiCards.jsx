import React from 'react';
import { Users, Clock, ArrowLeftRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';

export default function JadwalKpiCards({ stats, filterLocation }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Personel Terjadwal */}
      <Card className="border-slate-200 shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Personel Terjadwal
            </p>
            <p className="text-2xl font-bold font-display text-navy mt-1">
              {stats.total} <span className="text-sm font-normal text-slate-400">Personel</span>
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {filterLocation === 'ALL'
                ? `${stats.groupA} Grup A + ${stats.groupB} Grup B · ${stats.nonShift} Non-Shift`
                : `${stats.groupA} Grup A + ${stats.groupB} Grup B`}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-navy/5 text-navy flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Grup Operasional A */}
      <Card className="border-slate-200 shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Grup Operasional A
            </p>
            <p className="text-2xl font-bold font-display text-emerald-700 mt-1">
              {stats.groupA} <span className="text-sm font-normal text-slate-400">Personil</span>
            </p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Shift 9 Jam (08:00 - 17:00 & 20:00 - 05:00)
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Grup Operasional B */}
      <Card className="border-slate-200 shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Grup Operasional B
            </p>
            <p className="text-2xl font-bold font-display text-amber-700 mt-1">
              {stats.groupB} <span className="text-sm font-normal text-slate-400">Personil</span>
            </p>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">
              Shift 9 Jam (08:00 - 17:00 & 20:00 - 05:00)
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Jadwal Khusus & Tukar Shift */}
      <Card className="border-slate-200 shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Jadwal Khusus & Tukar Shift
            </p>
            <p className="text-2xl font-bold font-display text-purple-700 mt-1">
              {stats.totalExceptions + stats.totalManualSchedules}{' '}
              <span className="text-sm font-normal text-slate-400">Kasus</span>
            </p>
            <p className="text-[11px] text-purple-600 font-medium mt-0.5">
              Penyesuaian Jadwal & Rotasi Aktif
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
