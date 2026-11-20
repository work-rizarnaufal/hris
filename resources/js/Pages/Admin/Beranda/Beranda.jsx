import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CalendarDays,
  Layers,
  ArrowUpRight,
  Plus,
  FileSpreadsheet,
  Building,
  UserCheck,
  ShieldCheck,
  MapPin,
  CalendarCheck,
  ChevronRight,
  Sparkles,
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

// Data tren kehadiran 6 hari kerja terakhir (sinkron dengan basis 12 personel operasional)
const weeklyTrendData = [
  { day: 'Senin', hadir: 11, terlambat: 1, izin: 0 },
  { day: 'Selasa', hadir: 12, terlambat: 0, izin: 0 },
  { day: 'Rabu', hadir: 11, terlambat: 1, izin: 0 },
  { day: 'Kamis', hadir: 12, terlambat: 0, izin: 0 },
  { day: 'Jumat', hadir: 10, terlambat: 1, izin: 1 },
  { day: 'Sabtu', hadir: 11, terlambat: 1, izin: 0 },
];

// Data log presensi terkini hari ini (sinkron dengan master 12 karyawan HCGA)
const recentAttendance = [
  {
    id: 1,
    nip: 'HC-0101',
    name: 'Budi Santoso',
    role: 'Senior Operator Lapangan',
    division: 'Operasional & Lapangan',
    location: 'Pabrik A (Sidoarjo)',
    shift: 'Shift 1 (07:00 - 15:00)',
    time: '06:48 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 5,
    nip: 'HC-0105',
    name: 'Hendra Wijaya',
    role: 'Koordinator Keamanan Pabrik',
    division: 'Security & Safety',
    location: 'Pabrik A (Sidoarjo)',
    shift: 'Shift 1 (07:00 - 15:00)',
    time: '06:38 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 2,
    nip: 'HC-0102',
    name: 'Siti Rahmawati',
    role: 'HCGA Specialist',
    division: 'Human Capital & GA',
    location: 'Kantor Utama (Surabaya)',
    shift: 'Office (08:00 - 17:00)',
    time: '07:42 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 4,
    nip: 'HC-0104',
    name: 'Dewi Anggraini',
    role: 'Quality Assurance Inspector',
    division: 'Operasional & Lapangan',
    location: 'Pabrik A (Sidoarjo)',
    shift: 'Shift 1 (07:00 - 15:00)',
    time: '06:55 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 3,
    nip: 'HC-0103',
    name: 'Ahmad Fauzi',
    role: 'Operator Forklift Utama',
    division: 'Logistik & Gudang',
    location: 'Gudang B (Rungkut)',
    shift: 'Shift 2 (15:00 - 23:00)',
    time: '07:18 WIB',
    status: 'Terlambat (18m)',
    statusClass: 'status-terlambat',
  },
  {
    id: 6,
    nip: 'HC-0106',
    name: 'Rina Marlina',
    role: 'Staf Administrasi Payroll',
    division: 'Human Capital & GA',
    location: 'Kantor Utama (Surabaya)',
    shift: 'Office (08:00 - 17:00)',
    time: '—',
    status: 'Izin Resmi',
    statusClass: 'status-izin',
  },
];

// Ringkasan performa divisi (berdasarkan pembagian 12 personel aktif)
const divisionSummary = [
  { name: 'Operasional & Lapangan', total: 4, present: 4, late: 0, percent: 100 },
  { name: 'Security & Safety', total: 3, present: 3, late: 0, percent: 100 },
  { name: 'Logistik & Gudang', total: 3, present: 3, late: 1, percent: 100 },
  { name: 'Human Capital & GA', total: 2, present: 1, late: 0, percent: 50 },
];

export default function Beranda() {
  const now = new Date();

  // Format tanggal formal Indonesia
  const currentDateFormatted = useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }).format(now);
  }, []);

  // Deteksi status jadwal shift rotasi 2-grup hari ini
  const shiftStatusToday = useMemo(() => {
    const day = now.getDay(); // 0 = Minggu, 1 = Senin, ..., 5 = Jumat, 6 = Sabtu
    if (day === 0) {
      return {
        label: 'Hari Minggu — Libur Bersama Operasional',
        desc: 'Seluruh lini operasional pabrik dan staf kantor libur reguler (OFF).',
        activeGroup: 'Semua Lini Libur',
        badgeVariant: 'secondary',
        badgeText: 'Reguler OFF',
      };
    }

    // Pola Baku HRIS: Senin, Rabu, Jumat = Grup A dinas | Selasa, Kamis, Sabtu = Grup B dinas
    if (day === 1 || day === 3 || day === 5) {
      return {
        label: 'Grup Operasional A (Dinas Aktif)',
        desc: 'Shift 1 (07:00 - 15:00 WIB) & Shift 2 (15:00 - 23:00 WIB) • Grup B Libur Pasca-Dinas (OFF) • Kantor Normal Office (08:00 - 17:00 WIB)',
        activeGroup: 'Grup A',
        badgeVariant: 'default',
        badgeText: 'Pola Roster Grup A',
      };
    }

    return {
      label: 'Grup Operasional B (Dinas Aktif)',
      desc: 'Shift 1 (07:00 - 15:00 WIB) & Shift 2 (15:00 - 23:00 WIB) • Grup A Libur Pasca-Dinas (OFF) • Kantor Normal Office (08:00 - 17:00 WIB)',
      activeGroup: 'Grup B',
      badgeVariant: 'default',
      badgeText: 'Pola Roster Grup B',
    };
  }, []);

  return (
    <>
      <Head title="Beranda Eksekutif HRIS" />

      {/* Header Utama dengan Tanggal & Akses Cepat */}
      <PageHeader
        eyebrow="PORTAL HCGA WORKFORCE ATTENDANCE"
        title="Ringkasan Operasional & Kehadiran"
        subtitle={`Monitoring kedisiplinan dan absensi harian area kerja operasional — ${currentDateFormatted}.`}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/kehadiran"
              className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-md text-xs font-semibold bg-[#10273f] text-white hover:bg-[#1a3a5c] shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#c4a266]" />
              <span>Input Kehadiran</span>
            </Link>
            <Link
              href="/laporan"
              className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-md text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-navy shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Ekspor Laporan</span>
            </Link>
          </div>
        }
      />

      {/* 4 Kartu KPI Kehadiran Real-Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total Karyawan Aktif */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Total Personel Aktif
              </div>
              <div className="text-3xl font-bold font-display text-navy">
                12 <span className="text-sm font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>100% terdata PKWT/PKWTT</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <Users className="w-5 h-5 text-navy" />
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
                91.7%
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#398872]" />
                <span>11 dari 12 personel hadir dinas</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#eef7f1] flex items-center justify-center text-[#398872] shrink-0">
              <UserCheck className="w-5 h-5 text-[#398872]" />
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
                1 <span className="text-sm font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ac8848]" />
                <span>Ahmad Fauzi (18m terlambat)</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#fcf6e9] flex items-center justify-center text-[#ac8848] shrink-0">
              <Clock className="w-5 h-5 text-[#ac8848]" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Izin / Legalitas Ketidakhadiran */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Tidak Hadir (Legalitas)
              </div>
              <div className="text-3xl font-bold font-display text-[#1d3046]">
                1 <span className="text-sm font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                <span>1 Izin Resmi, 0 Sakit, 0 Alpha</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#eff5fa] flex items-center justify-center text-[#698eb0] shrink-0">
              <AlertTriangle className="w-5 h-5 text-[#698eb0]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banner Informasi Shift Operasional Hari Ini */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#f7f2e8] border border-[#c4a266]/30 flex items-center justify-center text-[#c4a266] shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm text-navy flex items-center gap-2">
              <span>Rotasi Shift Hari Ini: <strong>{shiftStatusToday.label}</strong></span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#f7f2e8] text-[#ab874b] border border-[#c4a266]/40">
                {shiftStatusToday.badgeText}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {shiftStatusToday.desc}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <Link
            href="/jadwal"
            className="text-xs font-semibold text-navy hover:text-[#c4a266] flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#c4a266]/50 bg-slate-50/70 hover:bg-white"
          >
            <span>Matriks Roster Lengkap</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Baris Pintasan Cepat Alur Kerja (Quick Nav) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Link
          href="/kehadiran"
          className="group p-3.5 bg-white border border-slate-200/90 rounded-xl hover:border-[#c4a266]/60 hover:shadow-sm transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-navy group-hover:text-[#c4a266] transition-colors">
                Log Kehadiran
              </div>
              <div className="text-[10px] text-slate-400">Input & cek presensi</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#c4a266] transition-colors" />
        </Link>

        <Link
          href="/jadwal"
          className="group p-3.5 bg-white border border-slate-200/90 rounded-xl hover:border-[#c4a266]/60 hover:shadow-sm transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f7f2e8] text-[#ab874b] flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-navy group-hover:text-[#c4a266] transition-colors">
                Jadwal & Shift
              </div>
              <div className="text-[10px] text-slate-400">Roster rotasi 2-grup</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#c4a266] transition-colors" />
        </Link>

        <Link
          href="/karyawan"
          className="group p-3.5 bg-white border border-slate-200/90 rounded-xl hover:border-[#c4a266]/60 hover:shadow-sm transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-navy flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-navy group-hover:text-[#c4a266] transition-colors">
                Data Karyawan
              </div>
              <div className="text-[10px] text-slate-400">Master 12 personel</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#c4a266] transition-colors" />
        </Link>

        <Link
          href="/laporan"
          className="group p-3.5 bg-white border border-slate-200/90 rounded-xl hover:border-[#c4a266]/60 hover:shadow-sm transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-navy group-hover:text-[#c4a266] transition-colors">
                Laporan & Rekap
              </div>
              <div className="text-[10px] text-slate-400">Evaluasi & dossier</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#c4a266] transition-colors" />
        </Link>
      </div>

      {/* Grid Grafik Tren Mingguan & Rekap Divisi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Kolom 1 & 2: Grafik Kehadiran Mingguan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base text-navy">Tren Kehadiran Mingguan</CardTitle>
                <CardDescription className="text-xs">
                  Statistik komparasi personel hadir tepat waktu vs terlambat (basis 12 personel)
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 self-start sm:self-auto">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#398872] inline-block" />
                  Hadir Tepat Waktu
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
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#718096' }} domain={[0, 14]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#10273f',
                      borderColor: '#193750',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                    itemStyle={{ color: '#ffffff' }}
                    labelStyle={{ color: '#c4a266', fontWeight: 'bold', marginBottom: '4px' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="hadir" fill="#398872" radius={[4, 4, 0, 0]} maxBarSize={32} name="Hadir Tepat Waktu" />
                  <Bar dataKey="terlambat" fill="#c4a266" radius={[4, 4, 0, 0]} maxBarSize={32} name="Terlambat Masuk" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Kolom 3: Performa Kehadiran per Divisi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-navy">Performa Kehadiran Divisi</CardTitle>
            <CardDescription className="text-xs">Rasio kehadiran harian per unit kerja</CardDescription>
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
                      backgroundColor: div.percent === 100 ? '#398872' : div.percent >= 75 ? '#c4a266' : '#698eb0',
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100 mt-4">
              <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Total Jadwal Operasional Hari Ini</span>
                <span className="font-bold text-navy">12 Personel Terjadwal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Aktivitas Presensi Terkini Hari Ini */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base text-navy">Log Presensi Terkini Hari Ini</CardTitle>
            <CardDescription className="text-xs">
              Check-in real-time karyawan beserta verifikasi shift dan status keterlambatan
            </CardDescription>
          </div>
          <Link
            href="/kehadiran"
            className="text-xs font-semibold text-navy hover:text-[#c4a266] inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Buka Seluruh Catatan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>KARYAWAN</TableHead>
                <TableHead>DIVISI</TableHead>
                <TableHead>LOKASI KERJA</TableHead>
                <TableHead>SHIFT TERJADWAL</TableHead>
                <TableHead className="text-center">WAKTU CHECK-IN</TableHead>
                <TableHead className="text-center">STATUS PRESENSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAttendance.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-navy font-bold text-xs flex items-center justify-center shrink-0">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong className="block text-xs font-semibold text-slate-900">{item.name}</strong>
                        <span className="text-[11px] text-slate-500">{item.nip} • {item.role}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 text-xs">{item.division}</TableCell>
                  <TableCell className="text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.location}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">{item.shift}</TableCell>
                  <TableCell className="text-center">
                    <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80">
                      {item.time}
                    </span>
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
