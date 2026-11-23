import React from 'react';
import {
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  HeartPulse,
  CalendarCheck,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui';

export default function RaporKpiCards({ employee, calendarDays = [] }) {
  // Hitung metrik tersinkronisasi langsung dari kalender presensi 30 hari untuk konsistensi visual 100%
  const onTimeDays = calendarDays.length > 0
    ? calendarDays.filter((d) => d.status === 'Hadir').length
    : (employee.onTimeDays ?? Math.max(0, (employee.presentDays || 0) - (employee.lateCount || 0)));

  const lateCount = calendarDays.length > 0
    ? calendarDays.filter((d) => d.status === 'Terlambat').length
    : (employee.lateCount || 0);

  const presentDays = calendarDays.length > 0
    ? (onTimeDays + lateCount)
    : (employee.presentDays || 0);

  const izinDays = calendarDays.length > 0
    ? calendarDays.filter((d) => d.status === 'Izin').length
    : (employee.izinDays ?? 0);

  const sakitDays = calendarDays.length > 0
    ? calendarDays.filter((d) => d.status === 'Sakit').length
    : (employee.sakitDays ?? 0);

  const cutiDays = calendarDays.length > 0
    ? calendarDays.filter((d) => d.status === 'Cuti').length
    : (employee.cutiDays ?? Math.max(0, (employee.leaveDays || 0) - izinDays - sakitDays));

  const alpaDays = calendarDays.length > 0
    ? calendarDays.filter((d) => d.status === 'Alpha' || d.status === 'Alpa').length
    : (employee.alpaDays || 0);

  const workDays = calendarDays.length > 0
    ? calendarDays.filter((d) => d.status !== 'Libur' && d.status !== 'Belum Ditetapkan').length
    : (employee.workDays || 0);

  const totalLateMinutes = employee.totalLateMinutes || 0;

  const cards = [
    {
      title: 'Total Kehadiran',
      value: presentDays,
      unit: `/ ${workDays} Hari`,
      subtext: `${workDays > 0 ? ((presentDays / workDays) * 100).toFixed(1) : 0}% Rasio Kehadiran`,
      color: 'text-navy',
      icon: UserCheck,
      iconBg: 'bg-slate-100 text-navy',
      hoverBorder: 'hover:border-slate-300',
    },
    {
      title: 'Tepat Waktu',
      value: onTimeDays,
      unit: 'Hari',
      subtext: `${presentDays > 0 ? ((onTimeDays / presentDays) * 100).toFixed(0) : 0}% Presensi Tepat`,
      color: 'text-[#398872]',
      icon: CheckCircle2,
      iconBg: 'bg-[#eef7f1] text-[#398872]',
      hoverBorder: 'hover:border-emerald-200',
    },
    {
      title: 'Terlambat',
      value: lateCount,
      unit: 'Kali',
      subtext: lateCount > 0 ? `${lateCount}x keterlambatan` : 'Disiplin sempurna',
      color: 'text-[#ac8848]',
      icon: Clock,
      iconBg: 'bg-[#fcf6e9] text-[#ac8848]',
      hoverBorder: 'hover:border-amber-200',
    },
    {
      title: 'Menit Terlambat',
      value: totalLateMinutes,
      unit: 'Mnt',
      subtext: lateCount > 0 ? `Rata-rata ${Math.round(totalLateMinutes / lateCount)} mnt/telat` : '0 mnt akumulasi',
      color: 'text-amber-600',
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-600',
      hoverBorder: 'hover:border-amber-300',
    },
    {
      title: 'Izin',
      value: izinDays,
      unit: 'Hari',
      subtext: izinDays > 0 ? 'Izin resmi disetujui' : 'Nihil izin pribadi',
      color: 'text-[#698eb0]',
      icon: Calendar,
      iconBg: 'bg-[#eff5fa] text-[#698eb0]',
      hoverBorder: 'hover:border-sky-200',
    },
    {
      title: 'Sakit',
      value: sakitDays,
      unit: 'Hari',
      subtext: sakitDays > 0 ? 'Surat dokter terlampir' : 'Kondisi fisik prima',
      color: 'text-[#ab7b9b]',
      icon: HeartPulse,
      iconBg: 'bg-[#f7f0f7] text-[#ab7b9b]',
      hoverBorder: 'hover:border-purple-200',
    },
    {
      title: 'Cuti',
      value: cutiDays,
      unit: 'Hari',
      subtext: cutiDays > 0 ? 'Potong cuti tahunan' : 'Saldo cuti utuh',
      color: 'text-[#489490]',
      icon: CalendarCheck,
      iconBg: 'bg-[#edf6f6] text-[#489490]',
      hoverBorder: 'hover:border-teal-200',
    },
    {
      title: 'Alpha',
      value: alpaDays,
      unit: 'Hari',
      subtext: alpaDays > 0 ? 'Mangkir tanpa izin' : 'Nihil pelanggaran',
      color: 'text-[#b36a74]',
      icon: ShieldAlert,
      iconBg: 'bg-[#fbf0f2] text-[#b36a74]',
      hoverBorder: 'hover:border-rose-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <Card key={idx} className={`border-slate-200 shadow-2xs transition-colors ${card.hoverBorder}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold font-display mt-1 ${card.color}`}>
                  {card.value} <span className="text-xs font-normal text-slate-400">{card.unit}</span>
                </p>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5 truncate">
                  {card.subtext}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ml-2 ${card.iconBg}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
