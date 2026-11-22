import React, { useState, useMemo } from 'react';
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
  Building2,
  UserCheck,
  MapPin,
  CalendarCheck,
  ChevronRight,
  CalendarX2,
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
  TableEmpty,
  Text,
} from '@/components/ui';

// Data tren kehadiran 7 hari kerja terakhir (sinkron dengan roster operasional 24/7 non-stop, 6 personel dinas per hari)
const weeklyTrendData = [
  { day: 'Senin', hadir: 6, terlambat: 0, izin: 0 },
  { day: 'Selasa', hadir: 5, terlambat: 1, izin: 0 },
  { day: 'Rabu', hadir: 6, terlambat: 0, izin: 0 },
  { day: 'Kamis', hadir: 6, terlambat: 0, izin: 0 },
  { day: 'Jumat', hadir: 5, terlambat: 1, izin: 0 },
  { day: 'Sabtu', hadir: 6, terlambat: 0, izin: 0 },
  { day: 'Minggu', hadir: 6, terlambat: 0, izin: 0 },
];

// Data log presensi terkini hari ini (12 personel: 6 Lokasi Mariuk & 6 Lokasi Cimalaka)
const masterRecentAttendance = [
  // --- LOKASI MARIUK (6 Personel) ---
  {
    id: 1,
    nip: 'HC-0101',
    name: 'Budi Santoso',
    role: 'Senior Operator Lapangan',
    division: 'Operasional & Lapangan',
    location: 'Lokasi Mariuk',
    group: 'Grup A',
    shift: 'Shift Pagi (08:00 - 17:00)',
    time: '07:48 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 2,
    nip: 'HC-0104',
    name: 'Dewi Anggraini',
    role: 'Quality Assurance Inspector',
    division: 'Operasional & Lapangan',
    location: 'Lokasi Mariuk',
    group: 'Grup A',
    shift: 'Shift Pagi (08:00 - 17:00)',
    time: '07:52 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 3,
    nip: 'HC-0105',
    name: 'Hendra Wijaya',
    role: 'Danru Keamanan & K3',
    division: 'Security & Safety',
    location: 'Lokasi Mariuk',
    group: 'Grup A',
    shift: 'Shift Malam (20:00 - 05:00)',
    time: '19:45 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 4,
    nip: 'HC-0103',
    name: 'Ahmad Fauzi',
    role: 'Operator Forklift Utama',
    division: 'Logistik & Gudang',
    location: 'Lokasi Mariuk',
    group: 'Grup B',
    shift: 'Shift Pagi (08:00 - 17:00)',
    time: '08:18 WIB',
    status: 'Terlambat (18m)',
    statusClass: 'status-terlambat',
  },
  {
    id: 5,
    nip: 'HC-0107',
    name: 'Eko Prasetyo',
    role: 'Teknisi Maintenance Mesin',
    division: 'Operasional & Lapangan',
    location: 'Lokasi Mariuk',
    group: 'Grup B',
    shift: 'Shift Pagi (08:00 - 17:00)',
    time: '07:50 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 6,
    nip: 'HC-0109',
    name: 'Joko Susilo',
    role: 'Anggota Patroli Keamanan',
    division: 'Security & Safety',
    location: 'Lokasi Mariuk',
    group: 'Grup B',
    shift: 'Shift Malam (20:00 - 05:00)',
    time: '19:50 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },

  // --- LOKASI CIMALAKA (6 Personel) ---
  {
    id: 7,
    nip: 'HC-0102',
    name: 'Siti Rahmawati',
    role: 'Supervisor Operasional Site',
    division: 'Operasional & Lapangan',
    location: 'Lokasi Cimalaka',
    group: 'Grup A',
    shift: 'Shift Pagi (08:00 - 17:00)',
    time: '07:45 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 8,
    nip: 'HC-0111',
    name: 'Wahyu Hidayat',
    role: 'Operator Mesin Produksi',
    division: 'Operasional & Lapangan',
    location: 'Lokasi Cimalaka',
    group: 'Grup A',
    shift: 'Shift Pagi (08:00 - 17:00)',
    time: '07:55 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 9,
    nip: 'HC-0110',
    name: 'Dian Kusuma',
    role: 'Petugas Keamanan Site',
    division: 'Security & Safety',
    location: 'Lokasi Cimalaka',
    group: 'Grup A',
    shift: 'Shift Malam (20:00 - 05:00)',
    time: '19:55 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 10,
    nip: 'HC-0106',
    name: 'Rina Marlina',
    role: 'Koordinator Gudang & Logistik',
    division: 'Logistik & Gudang',
    location: 'Lokasi Cimalaka',
    group: 'Grup B',
    shift: 'Shift Pagi (08:00 - 17:00)',
    time: '07:58 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
  {
    id: 11,
    nip: 'HC-0108',
    name: 'Maya Indah Lestari',
    role: 'Operator QC Lapangan',
    division: 'Operasional & Lapangan',
    location: 'Lokasi Cimalaka',
    group: 'Grup B',
    shift: 'Shift Pagi (08:00 - 17:00)',
    time: '—',
    status: 'Cuti Resmi',
    statusClass: 'status-cuti',
  },
  {
    id: 12,
    nip: 'HC-0112',
    name: 'Nurul Aini',
    role: 'Petugas Inventory Stok',
    division: 'Logistik & Gudang',
    location: 'Lokasi Cimalaka',
    group: 'Grup B',
    shift: 'Shift Malam (20:00 - 05:00)',
    time: '19:48 WIB',
    status: 'Hadir',
    statusClass: 'status-hadir',
  },
];

export default function Beranda() {
  const now = new Date();
  const [selectedLocation, setSelectedLocation] = useState('ALL'); // 'ALL' | 'Lokasi Mariuk' | 'Lokasi Cimalaka'

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

  // Deteksi status jadwal shift rotasi 2-kelompok non-stop 7 hari (24/7)
  const shiftStatusToday = useMemo(() => {
    // Pola bergulir kontinu 7 hari: Kelompok A Senin, B Selasa, A Rabu, B Kamis, A Jumat, B Sabtu, A Minggu...
    const startRef = new Date('2026-01-05T00:00:00Z'); // Acuan Senin Kelompok A
    const todayUtc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const diffDays = Math.floor((todayUtc - startRef) / (1000 * 60 * 60 * 24));
    const isGroupA = Math.abs(diffDays) % 2 === 0;

    const activeGroup = isGroupA ? 'Kelompok A' : 'Kelompok B';
    const offGroup = isGroupA ? 'Kelompok B' : 'Kelompok A';

    return {
      label: `${activeGroup} (Dinas Operasional 24/7)`,
      desc: `Shift Pagi (08:00 – 17:00 WIB) & Shift Malam (20:00 – 05:00 WIB) • Lokasi Mariuk & Lokasi Cimalaka • ${offGroup} Istirahat Pasca-Dinas (OFF) • Jam kerja reguler operasional`,
      activeGroup,
      badgeText: `Operasional 24/7 • ${activeGroup}`,
    };
  }, []);

  // Filter log presensi sesuai lokasi kerja yang dipilih
  const filteredRecentAttendance = useMemo(() => {
    if (selectedLocation === 'ALL') return masterRecentAttendance;
    return masterRecentAttendance.filter((item) => item.location === selectedLocation);
  }, [selectedLocation]);

  // Statistik Dinamis berdasarkan Lokasi
  const stats = useMemo(() => {
    const totalStaff = selectedLocation === 'ALL' ? 12 : 6;
    const records = filteredRecentAttendance;
    const presentCount = records.filter((r) => r.status === 'Hadir').length;
    const lateCount = records.filter((r) => r.status.includes('Terlambat')).length;
    const leaveCount = records.filter((r) => r.status.includes('Cuti') || r.status.includes('Izin')).length;
    const totalActiveDuty = presentCount + lateCount;
    const attendanceRate = totalStaff > 0 ? Math.round((totalActiveDuty / totalStaff) * 100) : 0;

    return {
      totalStaff,
      presentCount,
      lateCount,
      leaveCount,
      attendanceRate,
    };
  }, [filteredRecentAttendance, selectedLocation]);

  // Ringkasan Divisi Dinamis berdasarkan Lokasi Terpilih
  const divisionSummary = useMemo(() => {
    const divisions = [
      { name: 'Operasional & Lapangan', key: 'Operasional & Lapangan' },
      { name: 'Security & Safety', key: 'Security & Safety' },
      { name: 'Logistik & Gudang', key: 'Logistik & Gudang' },
    ];

    return divisions.map((d) => {
      const emps = filteredRecentAttendance.filter((r) => r.division === d.key);
      const total = emps.length;
      const present = emps.filter((r) => r.status === 'Hadir').length;
      const late = emps.filter((r) => r.status.includes('Terlambat')).length;
      const percent = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
      return {
        name: d.name,
        total,
        present: present + late,
        late,
        percent,
      };
    });
  }, [filteredRecentAttendance]);

  return (
    <>
      <Head title="Beranda Eksekutif HRIS" />

      {/* Header Utama dengan Tanggal, Segmented Location Switcher & Aksi Cepat */}
      <PageHeader
        eyebrow="PORTAL HCGA WORKFORCE ATTENDANCE"
        title="Ringkasan Operasional & Kehadiran"
        subtitle={`Monitoring kedisiplinan dan absensi harian area kerja operasional — ${currentDateFormatted}.`}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Segmented Location Switcher */}
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setSelectedLocation('ALL')}
                className={`h-8 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedLocation === 'ALL'
                    ? 'bg-white text-navy shadow-xs border border-slate-200/70 font-bold'
                    : 'text-slate-600 hover:text-navy hover:bg-white/60'
                }`}
                title="Tampilkan seluruh personil di semua lokasi"
              >
                <Building2 className="w-3.5 h-3.5 text-navy" />
                <span>Semua Lokasi</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500 font-mono">12</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLocation('Lokasi Mariuk')}
                className={`h-8 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedLocation === 'Lokasi Mariuk'
                    ? 'bg-white text-navy shadow-xs border border-slate-200/70 font-bold'
                    : 'text-slate-600 hover:text-navy hover:bg-white/60'
                }`}
                title="Filter khusus lokasi operasional Mariuk, Subang"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Mariuk</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500 font-mono">6</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLocation('Lokasi Cimalaka')}
                className={`h-8 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedLocation === 'Lokasi Cimalaka'
                    ? 'bg-white text-navy shadow-xs border border-slate-200/70 font-bold'
                    : 'text-slate-600 hover:text-navy hover:bg-white/60'
                }`}
                title="Filter khusus lokasi operasional Cimalaka, Sumedang"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>Cimalaka</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500 font-mono">6</span>
              </button>
            </div>

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
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekspor Laporan</span>
            </Link>
          </div>
        }
      />

      {/* 4 Kartu KPI Kehadiran Real-Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total Karyawan Aktif */}
        <Card className="hover:border-slate-300 transition-colors border-slate-200/80 shadow-2xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Total Personel {selectedLocation !== 'ALL' ? selectedLocation.replace('Lokasi ', '') : 'Aktif'}
              </div>
              <div className="text-3xl font-bold font-display text-navy tracking-tight">
                {stats.totalStaff} <span className="text-sm font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>
                  {selectedLocation === 'ALL'
                    ? '6 Mariuk + 6 Cimalaka (24/7)'
                    : '3 Kelompok A + 3 Kelompok B'}
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-navy/5 text-navy border border-navy/10 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-navy" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Tingkat Kehadiran Hari Ini */}
        <Card className="hover:border-slate-300 transition-colors border-slate-200/80 shadow-2xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Tingkat Kehadiran
              </div>
              <div className="text-3xl font-bold font-display text-[#398872] tracking-tight">
                {stats.attendanceRate}%
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#398872]" />
                <span>{stats.presentCount + stats.lateCount} dari {stats.totalStaff} personel dinas</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5 text-[#398872]" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Keterlambatan */}
        <Card className="hover:border-slate-300 transition-colors border-slate-200/80 shadow-2xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Terlambat Masuk
              </div>
              <div className="text-3xl font-bold font-display text-[#ac8848] tracking-tight">
                {stats.lateCount} <span className="text-sm font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ac8848]" />
                <span>{stats.lateCount > 0 ? 'Terdapat deviasi waktu' : 'Semua tepat waktu'}</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#ac8848]" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Izin / Legalitas Ketidakhadiran */}
        <Card className="hover:border-slate-300 transition-colors border-slate-200/80 shadow-2xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Tidak Hadir (Legalitas)
              </div>
              <div className="text-3xl font-bold font-display text-[#1d3046] tracking-tight">
                {stats.leaveCount} <span className="text-sm font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                <span>{stats.leaveCount > 0 ? `${stats.leaveCount} cuti resmi disetujui` : 'Nihil ketidakhadiran'}</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 border border-sky-200/60 flex items-center justify-center shrink-0">
              <CalendarX2 className="w-5 h-5 text-sky-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banner Informasi Shift Operasional Hari Ini */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#f7f2e8] border border-[#c4a266]/40 flex items-center justify-center text-[#ab874b] shrink-0">
            <Layers className="w-5 h-5 text-[#ab874b]" />
          </div>
          <div>
            <div className="font-bold text-sm text-navy flex items-center gap-2 flex-wrap">
              <span>Rotasi Shift Hari Ini: <strong>{shiftStatusToday.label}</strong></span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f7f2e8] text-[#ab874b] border border-[#c4a266]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ab874b] animate-pulse" />
                {shiftStatusToday.badgeText}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {shiftStatusToday.desc}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <Link
            href="/jadwal"
            className="text-xs font-semibold text-navy hover:text-[#c4a266] flex items-center gap-1.5 transition-colors px-3.5 py-2 rounded-lg border border-slate-200 hover:border-[#c4a266]/50 bg-slate-50/70 hover:bg-white shadow-2xs"
          >
            <span>Matriks Roster Lengkap</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Menu Pintasan Cepat Alur Kerja (Quick Nav Cards) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 rounded-full bg-[#c4a266]" />
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
              Menu Pintasan Alur Kerja
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Akses langsung modul operasional HCGA
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 1. Log Presensi */}
          <Link
            href="/kehadiran"
            className="group p-4 bg-white border border-slate-200/90 rounded-xl hover:border-[#c4a266]/70 hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                Hari Ini
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-navy group-hover:text-[#c4a266] transition-colors flex items-center justify-between">
                <span>Catatan Kehadiran</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#c4a266] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                Log presensi & jam kerja harian
              </p>
            </div>
          </Link>

          {/* 2. Jadwal & Shift Kerja */}
          <Link
            href="/jadwal"
            className="group p-4 bg-white border border-slate-200/90 rounded-xl hover:border-[#c4a266]/70 hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#f7f2e8] text-[#ab874b] border border-[#c4a266]/30 flex items-center justify-center shrink-0">
                <CalendarDays className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f7f2e8] text-[#ab874b] border border-[#c4a266]/40">
                Roster Shift
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-navy group-hover:text-[#c4a266] transition-colors flex items-center justify-between">
                <span>Jadwal & Shift Kerja</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#c4a266] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                Rotasi 2-kelompok (Pagi & Malam)
              </p>
            </div>
          </Link>

          {/* 3. Data Karyawan */}
          <Link
            href="/karyawan"
            className="group p-4 bg-white border border-slate-200/90 rounded-xl hover:border-[#c4a266]/70 hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-navy/5 text-navy border border-navy/10 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-navy" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                12 Personil
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-navy group-hover:text-[#c4a266] transition-colors flex items-center justify-between">
                <span>Data Karyawan</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#c4a266] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                Master Mariuk & Cimalaka
              </p>
            </div>
          </Link>

          {/* 4. Laporan & Evaluasi */}
          <Link
            href="/laporan"
            className="group p-4 bg-white border border-slate-200/90 rounded-xl hover:border-[#c4a266]/70 hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200/60">
                Ekspor XLSX
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-navy group-hover:text-[#c4a266] transition-colors flex items-center justify-between">
                <span>Laporan & Rekap</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#c4a266] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                Rapor disiplin & evaluasi bulanan
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Grid Grafik Tren Mingguan & Rekap Divisi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Kolom 1 & 2: Grafik Kehadiran Mingguan */}
        <Card className="lg:col-span-2 border-slate-200/80 shadow-2xs">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base text-navy font-bold">Tren Kehadiran Mingguan</CardTitle>
                <CardDescription className="text-xs">
                  Statistik personel hadir tepat waktu vs terlambat (6 personel dinas terjadwal per hari)
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
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#718096' }} domain={[0, 8]} ticks={[0, 2, 4, 6, 8]} />
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
        <Card className="border-slate-200/80 shadow-2xs">
          <CardHeader>
            <CardTitle className="text-base text-navy font-bold">Performa Kehadiran Divisi</CardTitle>
            <CardDescription className="text-xs">Rasio kehadiran harian per unit kerja operasional</CardDescription>
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
                <span>Roster Aktif Hari Ini</span>
                <span className="font-bold text-navy">
                  {selectedLocation === 'ALL'
                    ? '6 Personil (3 Mariuk, 3 Cimalaka)'
                    : `3 Personil ${selectedLocation.replace('Lokasi ', '')}`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Aktivitas Presensi Terkini Hari Ini */}
      <Card className="border border-slate-200/90 shadow-xs overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base text-navy font-bold">
                Log Presensi Terkini Hari Ini
              </CardTitle>
              <Badge variant="neutral" className="text-[11px] font-mono">
                {filteredRecentAttendance.length} Personil
              </Badge>
            </div>
            <CardDescription className="text-xs mt-0.5">
              Monitoring check-in real-time karyawan aktif beserta verifikasi shift operasional dan lokasi kerja
            </CardDescription>
          </div>
          <Link
            href="/kehadiran"
            className="text-xs font-semibold text-navy hover:text-[#c4a266] inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <span>Buka Seluruh Catatan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-200/80">
                <TableHead className="w-12 text-center text-xs font-semibold text-slate-600">
                  No
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[200px]">
                  Karyawan
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[150px]">
                  Divisi
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[140px]">
                  Lokasi Kerja
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[160px]">
                  Shift Terjadwal
                </TableHead>
                <TableHead className="text-center text-xs font-semibold text-slate-600 w-32">
                  Waktu Check-In
                </TableHead>
                <TableHead className="text-center text-xs font-semibold text-slate-600 w-32">
                  Status Presensi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecentAttendance.length === 0 ? (
                <TableEmpty colSpan={7}>
                  <div className="py-8 text-center text-xs text-slate-500">
                    Tidak ada catatan presensi aktif untuk filter lokasi ini.
                  </div>
                </TableEmpty>
              ) : (
                filteredRecentAttendance.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50/60 transition-colors border-b border-slate-100"
                  >
                    <TableCell className="text-center text-xs text-slate-400 font-mono">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-navy font-bold text-xs flex items-center justify-center shrink-0">
                          {item.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <strong className="block text-xs font-semibold text-navy truncate">
                            {item.name}
                          </strong>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {item.nip} • {item.role}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700 text-xs">
                      {item.division}
                    </TableCell>
                    <TableCell className="text-xs">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                          item.location === 'Lokasi Mariuk'
                            ? 'bg-amber-50 text-amber-800 border-amber-200/80'
                            : 'bg-indigo-50 text-indigo-800 border-indigo-200/80'
                        }`}
                      >
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{item.location}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200/70">
                        {item.shift}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Text
                        variant="code"
                        className="text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-semibold inline-block"
                      >
                        {item.time}
                      </Text>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`badge ${item.statusClass}`}>
                        <i />
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        {/* Footer Info Card */}
        <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>
            Menampilkan <strong>{filteredRecentAttendance.length}</strong> catatan presensi (
            {selectedLocation === 'ALL'
              ? 'Gabungan Mariuk & Cimalaka'
              : selectedLocation}
            ).
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#428a73]" /> Hadir ({stats.presentCount})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ac8848]" /> Terlambat ({stats.lateCount})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#698eb0]" /> Cuti / Izin ({stats.leaveCount})
            </span>
          </div>
        </div>
      </Card>
    </>
  );
}
