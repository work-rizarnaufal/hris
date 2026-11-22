import React from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function AttendanceDateRibbon({
  selectedDate,
  defaultDate,
  formattedDateTitle,
  shiftSettings,
  onDateChange,
  onResetToday,
  onSelectDate,
}) {
  const isToday = selectedDate === defaultDate;

  return (
    <div className="mb-6 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left: Active Day Header & Status Badge */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-navy/5 text-navy border border-navy/10 flex items-center justify-center shrink-0">
          <CalendarDays className="w-5 h-5 text-navy" />
        </div>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base font-bold text-navy tracking-tight">
              {formattedDateTitle}
            </h2>
            {isToday ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Hari Operasional Aktif
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                Arsip Presensi
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Roster 9 Jam: {shiftSettings?.shiftPagiName || 'Shift Pagi'} ({shiftSettings?.shiftPagiIn || '08:00'}–{shiftSettings?.shiftPagiOut || '17:00'}) & {shiftSettings?.shiftMalamName || 'Shift Malam'} ({shiftSettings?.shiftMalamIn || '20:00'}–{shiftSettings?.shiftMalamOut || '05:00'}) · Lokasi Mariuk & Cimalaka
          </p>
        </div>
      </div>

      {/* Right: Segmented Stepper & Custom Date Input */}
      <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
        <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/70">
          <button
            type="button"
            onClick={() => onDateChange(-1)}
            className="h-8 px-2.5 rounded-md text-slate-600 hover:text-navy hover:bg-white text-xs font-medium transition-all flex items-center gap-1"
            title="Hari Sebelumnya"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kemarin</span>
          </button>

          <button
            type="button"
            onClick={onResetToday}
            className={`h-8 px-3 rounded-md text-xs font-semibold transition-all ${
              isToday
                ? 'bg-white text-navy shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-navy hover:bg-white/60'
            }`}
          >
            Hari Ini
          </button>

          <button
            type="button"
            onClick={() => onDateChange(1)}
            className="h-8 px-2.5 rounded-md text-slate-600 hover:text-navy hover:bg-white text-xs font-medium transition-all flex items-center gap-1"
            title="Hari Berikutnya"
          >
            <span className="hidden sm:inline">Besok</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative inline-flex items-center">
          <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            type="date"
            aria-label="Pilih tanggal spesifik"
            value={selectedDate}
            onChange={(e) => e.target.value && onSelectDate(e.target.value)}
            className="h-9 pl-8 pr-3 text-xs font-medium bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 cursor-pointer focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
          />
        </div>
      </div>
    </div>
  );
}
