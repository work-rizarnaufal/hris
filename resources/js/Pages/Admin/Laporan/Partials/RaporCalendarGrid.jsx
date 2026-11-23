import React from 'react';
import { CalendarCheck, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
} from '@/components/ui';

// Helper membuat kalender harian dinamis berdasarkan periode dan data presensi riil database
export function generateCalendarDays(employee, selectedPeriod) {
  const days = [];
  const [yearStr, monthStr] = (selectedPeriod || '2026-11').split('-');
  const year = parseInt(yearStr, 10) || 2026;
  const month = parseInt(monthStr, 10) || 11; // 1-indexed

  const daysInMonth = new Date(year, month, 0).getDate();
  const incidents = employee.incidents || [];
  const dailyAttendances = employee.dailyAttendances || [];

  const isUnset = employee.group === 'Belum Ditetapkan' || !employee.group;
  const isNonShift = employee.group === 'Non-Shift';
  const isGroupA = employee.group === 'Grup A';
  const isGroupB = employee.group === 'Grup B';

  const isMalam =
    employee.shiftCode === 'MALAM' ||
    employee.baseShift?.toLowerCase().includes('malam') ||
    employee.role?.toLowerCase().includes('malam');

  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthShort = monthNamesShort[month - 1] || 'Nov';
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = d < 10 ? `0${d}` : `${d}`;
    const dateFormatted = `${dayStr} ${monthShort} ${year}`;
    const dateIso = `${year}-${String(month).padStart(2, '0')}-${dayStr}`;
    const dateObj = new Date(year, month - 1, d);
    const dayOfWeek = dateObj.getDay();

    const isWorkingRoster = isGroupA ? d % 2 === 1 : isGroupB ? d % 2 === 0 : dayOfWeek !== 0 && dayOfWeek !== 6;
    const realAtt = dailyAttendances.find((a) => {
      if (!a.date) return false;
      const attDate = typeof a.date === 'string' ? a.date.slice(0, 10) : '';
      return attDate === dateIso;
    });
    const incident = incidents.find((inc) => inc.date && inc.date.includes(`${dayStr} ${monthShort}`));

    let status = 'Libur';
    let detail = 'Libur Pasca-Dinas (Rotasi 24/7)';

    if (realAtt) {
      const rawStatus = (realAtt.status || '').toLowerCase();
      if (rawStatus === 'hadir') {
        status = 'Hadir';
        detail = `Masuk: ${realAtt.check_in_time || '-'} • Pulang: ${realAtt.check_out_time || '-'} (Tepat Waktu)`;
      } else if (rawStatus === 'terlambat') {
        status = 'Terlambat';
        detail = `Masuk: ${realAtt.check_in_time || '-'} (Terlambat ${realAtt.late_minutes} mnt) • Pulang: ${realAtt.check_out_time || '-'}`;
      } else if (rawStatus === 'alpha' || rawStatus === 'alpa') {
        status = 'Alpha';
        detail = realAtt.notes || 'Tidak hadir tanpa keterangan (Alpha)';
      } else if (rawStatus === 'izin') {
        status = 'Izin';
        detail = realAtt.notes || 'Izin dinas/pribadi resmi disetujui';
      } else if (rawStatus === 'sakit') {
        status = 'Sakit';
        detail = realAtt.notes || 'Sakit dengan surat keterangan dokter';
      } else if (rawStatus === 'cuti') {
        status = 'Cuti';
        detail = realAtt.notes || 'Cuti tahunan resmi disetujui';
      } else {
        status = realAtt.status;
        detail = realAtt.notes || 'Presensi tercatat';
      }
    } else if (incident) {
      const incType = (incident.type || '').toLowerCase();
      if (incType.includes('terlambat')) {
        status = 'Terlambat';
        detail = `${isMalam ? 'Shift Malam 20:00' : 'Shift Pagi 08:00'} - ${incident.detail}`;
      } else if (incType.includes('alpa') || incType.includes('alpha')) {
        status = 'Alpha';
        detail = incident.detail;
      } else if (incType.includes('cuti')) {
        status = 'Cuti';
        detail = incident.detail;
      } else if (incType.includes('sakit')) {
        status = 'Sakit';
        detail = incident.detail;
      } else if (incType.includes('izin')) {
        status = 'Izin';
        detail = incident.detail;
      }
    } else if (isUnset) {
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        status = 'Libur';
        detail = 'Libur Akhir Pekan (Grup Kerja Belum Ditetapkan)';
      } else {
        status = 'Belum Ditetapkan';
        detail = 'Grup kerja dan jadwal shift belum ditetapkan oleh Administrator';
      }
    } else if (isNonShift) {
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        status = 'Libur';
        detail = 'Libur Akhir Pekan (Sabtu/Minggu)';
      } else if (dateObj > todayStart) {
        status = 'Terjadwal';
        detail = 'Jadwal Staf Kantor (08:00 - 17:00 WIB)';
      } else {
        status = 'Belum Ada Log';
        detail = 'Staf Kantor (Belum ada rekaman log presensi)';
      }
    } else if (isWorkingRoster) {
      if (dateObj > todayStart) {
        status = 'Terjadwal';
        detail = isMalam ? 'Jadwal Shift Malam (20:00 - 05:00 WIB)' : 'Jadwal Shift Pagi (08:00 - 17:00 WIB)';
      } else {
        status = 'Belum Ada Log';
        detail = isMalam
          ? 'Jadwal Shift Malam (Belum ada rekaman log presensi)'
          : 'Jadwal Shift Pagi (Belum ada rekaman log presensi)';
      }
    } else {
      status = 'Libur';
      detail = 'Libur Pasca-Dinas (Rotasi 24/7)';
    }

    days.push({
      day: d,
      dateIso,
      dateFormatted,
      dayName: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][dayOfWeek],
      status,
      detail,
    });
  }

  return days;
}

export default function RaporCalendarGrid({
  calendarDays,
  selectedDay,
  onSelectDay,
  currentMonthLong,
  year,
  historyData,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Visual Kalender Presensi */}
      <Card className="lg:col-span-2 border-slate-200 shadow-2xs">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-[#c4a266]" />
                Matriks Presensi {calendarDays.length} Hari ({currentMonthLong} {year})
              </CardTitle>
              <CardDescription className="text-xs">
                Klik tanggal untuk melihat catatan absensi spesifik pada hari tersebut
              </CardDescription>
            </div>

            {/* Legenda Warna */}
            <div className="flex items-center gap-2 flex-wrap text-[10px]">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Tepat Waktu
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Terlambat
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Izin
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Sakit
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" /> Cuti
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Alpha
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" /> Terjadwal
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" /> Libur / Belum Ditetapkan
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          {/* Grid Hari */}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {calendarDays.map((dayItem) => {
              const isSelected = selectedDay?.day === dayItem.day;
              let bgStyle = 'bg-slate-50 border-slate-200 text-slate-400';
              let dotStyle = 'bg-slate-300';

              if (dayItem.status === 'Hadir') {
                bgStyle = 'bg-emerald-50 border-emerald-200 text-emerald-900';
                dotStyle = 'bg-emerald-500';
              } else if (dayItem.status === 'Terlambat') {
                bgStyle = 'bg-amber-50 border-amber-300 text-amber-900 font-semibold';
                dotStyle = 'bg-amber-500';
              } else if (dayItem.status === 'Alpha' || dayItem.status === 'Alpa') {
                bgStyle = 'bg-rose-50 border-rose-300 text-rose-900 font-bold';
                dotStyle = 'bg-rose-500';
              } else if (dayItem.status === 'Izin') {
                bgStyle = 'bg-sky-50 border-sky-300 text-sky-900';
                dotStyle = 'bg-sky-500';
              } else if (dayItem.status === 'Sakit') {
                bgStyle = 'bg-purple-50 border-purple-300 text-purple-900';
                dotStyle = 'bg-purple-500';
              } else if (dayItem.status === 'Cuti') {
                bgStyle = 'bg-teal-50 border-teal-300 text-teal-900';
                dotStyle = 'bg-teal-500';
              } else if (dayItem.status === 'Terjadwal') {
                bgStyle = 'bg-sky-50/70 border-sky-200 text-sky-800';
                dotStyle = 'bg-sky-400';
              } else if (dayItem.status === 'Belum Ada Log') {
                bgStyle = 'bg-slate-50 border-dashed border-slate-300 text-slate-500';
                dotStyle = 'bg-slate-400';
              } else if (dayItem.status === 'Belum Ditetapkan') {
                bgStyle = 'bg-slate-50/70 border-dashed border-slate-200 text-slate-400';
                dotStyle = 'bg-slate-300';
              } else if (dayItem.status === 'Libur') {
                bgStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                dotStyle = 'bg-slate-300';
              }

              return (
                <button
                  key={dayItem.day}
                  type="button"
                  onClick={() => onSelectDay(dayItem)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer relative ${bgStyle} ${
                    isSelected ? 'ring-2 ring-navy scale-105 shadow-sm' : 'hover:opacity-90'
                  }`}
                >
                  <span className="text-[10px] block opacity-75">{dayItem.dayName}</span>
                  <span className="text-base font-bold font-display block my-0.5">
                    {dayItem.day}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full mx-auto block ${dotStyle}`} />
                </button>
              );
            })}
          </div>

          {/* Panel Rincian Tanggal Terpilih */}
          {selectedDay ? (
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy text-white flex items-center justify-center font-bold">
                  {selectedDay.day}
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    {selectedDay.dateFormatted} ({selectedDay.dayName})
                  </p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Status: <strong>{selectedDay.status}</strong> • {selectedDay.detail}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectDay(null)}
                className="text-xs h-7 px-2 text-slate-500 hover:text-navy"
              >
                Tutup
              </Button>
            </div>
          ) : (
            <p className="text-center text-xs text-slate-400 mt-4 italic">
              Klik salah satu kotak tanggal di atas untuk melihat detail presensi.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Grafik Tren Kedisiplinan 6 Bulan Terakhir */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-navy flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#c4a266]" />
              Tren Disiplin 6 Bulan
            </span>
            <Badge variant="neutral" className="text-[10px]">
              Target ≥ 95%
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs">
            Histori skor kepatuhan kehadiran ({historyData[0]?.month || 'Jun'} - {historyData[historyData.length - 1]?.month || 'Nov'} {year})
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  unit="%"
                />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Skor Disiplin']}
                  contentStyle={{
                    backgroundColor: '#10273f',
                    borderColor: '#10273f',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {historyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.score > 0 ? (entry.score >= 95 ? '#10273f' : entry.score >= 85 ? '#39609e' : '#c4a266') : '#cbd5e1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 mt-2">
            Rata-rata semester:{' '}
            <strong>
              {historyData.length > 0 && historyData.some((h) => h.score > 0)
                ? `${(historyData.reduce((a, b) => a + b.score, 0) / historyData.length).toFixed(1)}%`
                : '0% (Belum Ada Data)'}
            </strong>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
