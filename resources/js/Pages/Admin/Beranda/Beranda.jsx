import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowUpRight,
  Plus,
  FileSpreadsheet,
  Building,
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
  Legend,
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
import { colors } from '@/config/theme.js';

// Dummy data kehadiran mingguan
const weeklyTrendData = [
  { day: 'Sen', hadir: 46, terlambat: 2, absen: 0 },
  { day: 'Sel', hadir: 45, terlambat: 3, absen: 0 },
  { day: 'Rab', hadir: 47, terlambat: 1, absen: 0 },
  { day: 'Kam', hadir: 48, terlambat: 0, absen: 0 },
  { day: 'Jum', hadir: 44, terlambat: 4, absen: 0 },
  { day: 'Sab', hadir: 46, terlambat: 2, absen: 0 },
];

// Dummy data presensi terkini (hari ini)
const recentAttendance = [
  {
    id: 1,
    nip: 'HC-0101',
    name: 'Budi Santoso',
    role: 'Staf Operasional',
    division: 'Operasional & Lapangan',
    shift: 'Shift 1 (07:00 - 15:00)',
    time: '06:51 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 2,
    nip: 'HC-0102',
    name: 'Siti Rahmawati',
    role: 'HCGA Officer',
    division: 'Human Capital & GA',
    shift: 'General (08:00 - 17:00)',
    time: '07:48 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 3,
    nip: 'HC-0103',
    name: 'Ahmad Fauzi',
    role: 'Operator Forklift',
    division: 'Logistik & Gudang',
    shift: 'Shift 1 (07:00 - 15:00)',
    time: '07:18 WIB',
    status: 'Terlambat (18m)',
    statusClass: 'status-terlambat',
  },
  {
    id: 4,
    nip: 'HC-0104',
    name: 'Dewi Anggraini',
    role: 'Quality Assurance',
    division: 'Operasional & Lapangan',
    shift: 'Shift 1 (07:00 - 15:00)',
    time: '06:58 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 5,
    nip: 'HC-0105',
    name: 'Hendra Wijaya',
    role: 'Koordinator Keamanan',
    division: 'Security & Safety',
    shift: 'Shift 1 (07:00 - 15:00)',
    time: '06:40 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 6,
    nip: 'HC-0106',
    name: 'Rina Marlina',
    role: 'Administrasi Payroll',
    division: 'Human Capital & GA',
    shift: 'General (08:00 - 17:00)',
    time: '-',
    status: 'Izin Resmi',
    statusClass: 'status-izin',
  },
];

// Ringkasan per divisi
const divisionSummary = [
  { name: 'Operasional & Lapangan', total: 24, present: 24, percent: 100 },
  { name: 'Human Capital & GA', total: 8, present: 7, percent: 87.5 },
  { name: 'Logistik & Gudang', total: 10, present: 9, percent: 90 },
  { name: 'Security & Safety', total: 6, present: 6, percent: 100 },
];

export default function Beranda() {
  const currentDateFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date());

  return (
    <>
      <Head title="Beranda" />

      {/* Page Header dengan Quick Actions */}
      <PageHeader
        eyebrow="PORTAL HCGA ATTENDANCE SYSTEM"
        title="Ringkasan Operasional & Kehadiran"
        subtitle={`Monitoring kedisiplinan dan absensi harian area kerja operasional — ${currentDateFormatted}.`}
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
                48 <span className="text-sm font-normal text-slate-400">orang</span>
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
                95.8%
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#398872]" />
                <span>46 dari 48 personel telah hadir</span>
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
                2 <span className="text-sm font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ac8848]" />
                <span>Akumulasi: 28 menit</span>
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
                2 <span className="text-sm font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                <span>1 Izin, 1 Sakit, 0 Alpha</span>
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
              Jam Kerja: 07:00 - 15:00 WIB • Grup B bertugas pada Shift Siang (15:00 - 23:00 WIB)
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
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#718096' }} domain={[0, 50]} />
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
                <span className="font-semibold text-navy">48 Sesi</span>
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
              <TableRow>
                <TableHead>KARYAWAN</TableHead>
                <TableHead>DIVISI</TableHead>
                <TableHead>SHIFT KERJA</TableHead>
                <TableHead>WAKTU MASUK</TableHead>
                <TableHead>STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAttendance.map((item) => (
                <TableRow key={item.id}>
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
                  <TableCell className="font-medium text-slate-700">{item.division}</TableCell>
                  <TableCell className="text-slate-500">{item.shift}</TableCell>
                  <TableCell>
                    <Text variant="code">{item.time}</Text>
                  </TableCell>
                  <TableCell>
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

