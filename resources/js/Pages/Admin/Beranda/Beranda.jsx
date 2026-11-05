import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  Plus,
  FileSpreadsheet,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  PageHeader,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Text,
} from '@/components/ui';
import { useActiveSite, matchesActiveSite } from '@/services/systemSettings.js';

// Master data presensi terkini (12 Karyawan HCGA di Site A & Site B)
const ALL_RECENT_ATTENDANCE = [
  {
    id: 1,
    nip: 'HC-0101',
    name: 'Budi Santoso',
    role: 'Senior Operator Lapangan',
    division: 'Operasional & Lapangan',
    location: 'SITE A CIMALAKA',
    shift: 'Shift 1 (07:00 - 15:00)',
    time: '06:51 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 2,
    nip: 'HC-0102',
    name: 'Siti Rahmawati',
    role: 'HCGA Specialist',
    division: 'Human Capital & GA',
    location: 'SITE A CIMALAKA',
    shift: 'General (08:00 - 17:00)',
    time: '07:48 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 3,
    nip: 'HC-0103',
    name: 'Ahmad Fauzi',
    role: 'Operator Forklift Utama',
    division: 'Logistik & Gudang',
    location: 'SITE A CIMALAKA',
    shift: 'Shift 1 (07:00 - 15:00)',
    time: '07:18 WIB',
    status: 'Terlambat (18m)',
    statusClass: 'status-terlambat',
  },
  {
    id: 4,
    nip: 'HC-0104',
    name: 'Dewi Anggraini',
    role: 'Quality Assurance Inspector',
    division: 'Operasional & Lapangan',
    location: 'SITE A CIMALAKA',
    shift: 'Shift 1 (07:00 - 15:00)',
    time: '06:58 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 5,
    nip: 'HC-0105',
    name: 'Hendra Wijaya',
    role: 'Danru Keamanan & K3',
    division: 'Security & Safety',
    location: 'SITE A CIMALAKA',
    shift: 'Shift 1 (07:00 - 15:00)',
    time: '06:40 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 6,
    nip: 'HC-0106',
    name: 'Rina Marlina',
    role: 'Staf Administrasi Payroll',
    division: 'Human Capital & GA',
    location: 'SITE A CIMALAKA',
    shift: 'General (08:00 - 17:00)',
    time: '-',
    status: 'Izin Resmi',
    statusClass: 'status-izin',
  },
  {
    id: 7,
    nip: 'HC-0107',
    name: 'Eko Prasetyo',
    role: 'Teknisi Maintenance Mesin',
    division: 'Operasional & Lapangan',
    location: 'SITE B PASEH',
    shift: 'Shift 2 (15:00 - 23:00)',
    time: '14:50 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 8,
    nip: 'HC-0108',
    name: 'Maya Indah Lestari',
    role: 'Koordinator Gudang Bahan Baku',
    division: 'Logistik & Gudang',
    location: 'SITE B PASEH',
    shift: 'General (08:00 - 17:00)',
    time: '07:55 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 9,
    nip: 'HC-0109',
    name: 'Joko Susilo',
    role: 'Anggota Patroli Keamanan',
    division: 'Security & Safety',
    location: 'SITE B PASEH',
    shift: 'Shift 2 (15:00 - 23:00)',
    time: '14:50 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 10,
    nip: 'HC-0110',
    name: 'Dian Kusuma',
    role: 'IT Support & Sistem HRIS',
    division: 'Human Capital & GA',
    location: 'SITE B PASEH',
    shift: 'General (08:00 - 17:00)',
    time: '08:24 WIB',
    status: 'Terlambat (24m)',
    statusClass: 'status-terlambat',
  },
  {
    id: 11,
    nip: 'HC-0111',
    name: 'Wahyu Hidayat',
    role: 'Operator Mesin CNC Milling',
    division: 'Operasional & Lapangan',
    location: 'SITE B PASEH',
    shift: 'Shift 1 (07:00 - 15:00)',
    time: '-',
    status: 'Alpha',
    statusClass: 'status-alpha',
  },
  {
    id: 12,
    nip: 'HC-0112',
    name: 'Nurul Aini',
    role: 'Petugas Inventory & Stok',
    division: 'Logistik & Gudang',
    location: 'SITE B PASEH',
    shift: 'Shift 1 (07:00 - 15:00)',
    time: '-',
    status: 'Sakit',
    statusClass: 'status-sakit',
  },
];

export default function Beranda() {
  const activeSite = useActiveSite();

  const currentDateFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date());

  // Filter presensi hari ini sesuai site aktif
  const recentAttendance = useMemo(() => {
    return ALL_RECENT_ATTENDANCE.filter((item) =>
      matchesActiveSite(item.location, activeSite?.id)
    );
  }, [activeSite]);

  // Statistik Real-time Beranda
  const kpiStats = useMemo(() => {
    const total = recentAttendance.length;
    const hadir = recentAttendance.filter(
      (i) => i.status === 'Hadir' || i.status.startsWith('Terlambat')
    ).length;
    const tepatWaktu = recentAttendance.filter((i) => i.status === 'Hadir').length;
    const terlambat = recentAttendance.filter((i) => i.status.startsWith('Terlambat')).length;
    const legalAbsence = recentAttendance.filter(
      (i) => i.status.includes('Izin') || i.status.includes('Sakit')
    ).length;
    const alpha = recentAttendance.filter((i) => i.status === 'Alpha').length;
    const rate = total > 0 ? ((hadir / total) * 100).toFixed(1) : '0.0';

    return { total, hadir, tepatWaktu, terlambat, legalAbsence, alpha, rate };
  }, [recentAttendance]);

  // Ringkasan performa per divisi
  const divisionSummary = useMemo(() => {
    const map = {};
    recentAttendance.forEach((item) => {
      if (!map[item.division]) {
        map[item.division] = { name: item.division, total: 0, present: 0 };
      }
      map[item.division].total += 1;
      if (item.status === 'Hadir' || item.status.startsWith('Terlambat')) {
        map[item.division].present += 1;
      }
    });

    const entries = Object.values(map);
    if (entries.length === 0) {
      return [
        { name: 'Operasional & Lapangan', total: 0, present: 0, percent: 0 },
        { name: 'Human Capital & GA', total: 0, present: 0, percent: 0 },
        { name: 'Logistik & Gudang', total: 0, present: 0, percent: 0 },
        { name: 'Security & Safety', total: 0, present: 0, percent: 0 },
      ];
    }

    return entries.map((d) => ({
      ...d,
      percent: d.total > 0 ? Math.round((d.present / d.total) * 100) : 0,
    }));
  }, [recentAttendance]);

  // Tren mingguan diskalakan dengan site aktif
  const weeklyTrendData = useMemo(() => {
    const scale = activeSite?.id === 'all' ? 1 : 0.5;
    return [
      { day: 'Sen', hadir: Math.round(46 * scale), terlambat: Math.max(1, Math.round(2 * scale)), absen: 0 },
      { day: 'Sel', hadir: Math.round(45 * scale), terlambat: Math.max(1, Math.round(3 * scale)), absen: 0 },
      { day: 'Rab', hadir: Math.round(47 * scale), terlambat: Math.max(1, Math.round(1 * scale)), absen: 0 },
      { day: 'Kam', hadir: Math.round(48 * scale), terlambat: 0, absen: 0 },
      { day: 'Jum', hadir: Math.round(44 * scale), terlambat: Math.max(1, Math.round(4 * scale)), absen: 0 },
      { day: 'Sab', hadir: Math.round(46 * scale), terlambat: Math.max(1, Math.round(2 * scale)), absen: 0 },
    ];
  }, [activeSite]);

  return (
    <>
      <Head title="Beranda" />

      {/* Page Header dengan Quick Actions */}
      <PageHeader
        eyebrow={`PORTAL HCGA ATTENDANCE SYSTEM ${activeSite?.id !== 'all' ? `· ${activeSite?.code || ''}` : ''}`}
        title="Ringkasan Operasional & Kehadiran"
        subtitle={`Monitoring kedisiplinan dan absensi harian area ${activeSite?.name || 'Operasional'} — ${currentDateFormatted}.`}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/kehadiran" className="button primary">
              <Plus className="w-4 h-4" />
              <span>Input Kehadiran</span>
            </Link>
            <Link href="/laporan" className="button secondary">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Laporan</span>
            </Link>
          </div>
        }
      />

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total Karyawan Aktif */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Total Personel Aktif
              </div>
              <div className="text-3xl font-bold font-display text-navy">
                {kpiStats.total} <span className="text-sm font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>100% terdaftar dalam roster</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Tingkat Kehadiran Hari Ini */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Tingkat Kehadiran
              </div>
              <div className="text-3xl font-bold font-display text-[#398872]">
                {kpiStats.rate}%
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#398872]" />
                <span>{kpiStats.hadir} dari {kpiStats.total} personel telah hadir</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#eef7f1] flex items-center justify-center text-[#398872] shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Keterlambatan */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Terlambat Masuk
              </div>
              <div className="text-3xl font-bold font-display text-[#ac8848]">
                {kpiStats.terlambat} <span className="text-sm font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ac8848]" />
                <span>Deviasi jam masuk shift</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#fcf6e9] flex items-center justify-center text-[#ac8848] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Izin / Sakit / Alpha */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Tidak Hadir (Legalitas)
              </div>
              <div className="text-3xl font-bold font-display text-[#1d3046]">
                {kpiStats.legalAbsence + kpiStats.alpha} <span className="text-sm font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                <span>{kpiStats.legalAbsence} Izin/Sakit, {kpiStats.alpha} Alpha</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#eff5fa] flex items-center justify-center text-[#698eb0] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Baris Informasi Shift Operasional Hari Ini */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#f7f2e8] border border-[#c4a266]/30 flex items-center justify-center text-[#c4a266] shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm text-navy flex items-center gap-2">
              <span>Rotasi Shift Aktif: <strong>Grup A (Shift Pagi)</strong></span>
              <Badge variant="outline" className="border-[#c4a266]/40 text-[#ab874b] bg-[#f7f2e8]">
                Roster 2-Grup
              </Badge>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Jam Kerja: 07:00 - 15:00 WIB • Grup B bertugas pada Shift Malam (15:00 - 23:00 WIB)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href="/jadwal"
            className="text-xs font-medium text-navy hover:text-[#c4a266] flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            <span>Lihat Roster Lengkap</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid Grafik Tren Mingguan & Rekap Divisi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Kolom 1 & 2: Grafik Kehadiran Mingguan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base text-navy">Tren Kehadiran Mingguan</CardTitle>
                <CardDescription className="text-xs">
                  Statistik komparasi personel hadir, terlambat, dan absen selama 6 hari kerja terakhir
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#398872] inline-block" />
                  Hadir
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#c4a266] inline-block" />
                  Terlambat
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f7" />
                  <XAxis dataKey="day" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fontSize: 12, fill: '#718096' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#718096' }} domain={[0, activeSite?.id === 'all' ? 50 : 25]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#10273f',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    cursor={{ fill: '#f7fafc' }}
                  />
                  <Bar dataKey="hadir" fill="#398872" radius={[4, 4, 0, 0]} maxBarSize={40} name="Hadir Tepat Waktu" />
                  <Bar dataKey="terlambat" fill="#c4a266" radius={[4, 4, 0, 0]} maxBarSize={40} name="Terlambat Masuk" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Kolom 3: Performa Kehadiran per Divisi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-navy">Performa Divisi</CardTitle>
            <CardDescription className="text-xs">Tingkat kehadiran hari ini per unit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {divisionSummary.map((div) => (
              <div key={div.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-700">{div.name}</span>
                  <span className="font-semibold text-navy">
                    {div.present}/{div.total} ({div.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${div.percent}%`,
                      backgroundColor: div.percent === 100 ? '#398872' : '#c4a266',
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100 mt-4">
              <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Total Jadwal Shift Hari Ini</span>
                <span className="font-semibold text-navy">{kpiStats.total} Sesi</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Aktivitas Presensi Hari Ini */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base text-navy">Aktivitas Presensi Hari Ini</CardTitle>
            <CardDescription className="text-xs">
              Log check-in terkini karyawan beserta waktu dan status verifikasi sistem
            </CardDescription>
          </div>
          <Link
            href="/kehadiran"
            className="text-xs font-medium text-navy hover:text-[#c4a266] inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Buka Semua Catatan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-200">
                <TableHead className="min-w-[200px] text-[11px] font-bold text-slate-700 tracking-wider">KARYAWAN</TableHead>
                <TableHead className="min-w-[160px] text-[11px] font-bold text-slate-700 tracking-wider">DIVISI & LOKASI</TableHead>
                <TableHead className="min-w-[150px] text-[11px] font-bold text-slate-700 tracking-wider">SHIFT KERJA</TableHead>
                <TableHead className="w-28 text-center text-[11px] font-bold text-slate-700 tracking-wider">WAKTU MASUK</TableHead>
                <TableHead className="w-32 text-center text-[11px] font-bold text-slate-700 tracking-wider">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAttendance.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <TableCell>
                    <div className="person">
                      <div className="avatar small font-bold text-slate-700">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong className="block text-xs font-semibold text-slate-900">{item.name}</strong>
                        <Text variant="caption" color="muted">{item.nip} • {item.role}</Text>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-slate-700 block">{item.division}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{item.location}</span>
                  </TableCell>
                  <TableCell className="text-slate-600 text-xs">{item.shift}</TableCell>
                  <TableCell className="text-center font-mono text-xs">
                    <Text variant="code">{item.time}</Text>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`badge ${item.statusClass}`}>
                      <i />
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
