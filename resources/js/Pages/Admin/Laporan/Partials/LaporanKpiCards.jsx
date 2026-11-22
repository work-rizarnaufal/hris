import React from 'react';
import { CheckCircle2, Award, Clock, ShieldAlert, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';

export default function LaporanKpiCards({ summaryStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Rata-rata Kehadiran */}
      <Card className="border-slate-200 shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Rata-rata Kehadiran
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-display text-navy">
                {summaryStats.attendanceRate}%
              </span>
              <span className="text-[11px] font-medium text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5 inline" /> Target Terlampaui
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Dari total 22 hari kerja efektif
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Karyawan Hadir 100% */}
      <Card className="border-slate-200 shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Karyawan Hadir 100%
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-display text-[#c4a266]">
                {summaryStats.perfectCount}
              </span>
              <span className="text-[11px] text-slate-500">
                / {summaryStats.totalEmployees} Karyawan
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Kedisiplinan penuh tanpa telat
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#f7f2e8] text-[#c4a266] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Total Keterlambatan */}
      <Card className="border-slate-200 shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Keterlambatan
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-display text-amber-600">
                {summaryStats.totalLateIncidents}x
              </span>
              <span className="text-[11px] text-amber-700 font-medium">
                ({summaryStats.totalLateMinutes} menit)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Akumulasi seluruh unit kerja
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Perhatian Disiplin / SP */}
      <Card className="border-slate-200 shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Perhatian Disiplin / SP
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-display text-rose-600">
                {summaryStats.warningCount + summaryStats.coachingCount}
              </span>
              <span className="text-[11px] font-medium text-rose-600">
                ({summaryStats.warningCount} SP-1, {summaryStats.coachingCount} Pembinaan)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {summaryStats.totalAlpa} insiden alpa tercatat
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
