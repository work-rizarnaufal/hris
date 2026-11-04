import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Award,
  TrendingUp,
  Building,
  UserCheck,
  Eye,
  Calendar,
  X,
  Sparkles,
  Info,
} from 'lucide-react';
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
  PageHeader,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  TableToolbar,
  TableSearch,
  TableFilterGroup,
  TableSelect,
} from '@/components/ui';
import { colors } from '@/config/theme.js';
import RaporIndividu from './Partials/RaporIndividu.jsx';

// Periode Evaluasi Tersedia
const AVAILABLE_PERIODS = [
  { value: '2026-11', label: 'November 2026 (Berjalan)' },
  { value: '2026-10', label: 'Oktober 2026' },
  { value: '2026-09', label: 'September 2026' },
];

// Data Agregasi Evaluasi Kehadiran Karyawan (12 Karyawan HCGA)
const EVALUATION_DATASET = [
  {
    id: 1,
    name: 'Budi Santoso',
    nip: 'HC-0101',
    role: 'Senior Operator Lapangan',
    division: 'Operasional & Lapangan',
    location: 'Pabrik A (Sidoarjo)',
    workDays: 22,
    presentDays: 22,
    lateCount: 0,
    totalLateMinutes: 0,
    leaveDays: 0,
    alpaDays: 0,
    score: 100,
    status: 'Sangat Baik',
    actionRecommendation: 'Pertahankan Performa (Nominasi Best Attendance)',
    incidents: [
      { date: '01 Nov 2026', type: 'Tepat Waktu', detail: 'Hadir 06:50 WIB (Jadwal 07:00)' },
      { date: '03 Nov 2026', type: 'Tepat Waktu', detail: 'Hadir 06:48 WIB (Jadwal 07:00)' },
    ],
  },
  {
    id: 2,
    name: 'Siti Rahmawati',
    nip: 'HC-0102',
    role: 'HCGA Specialist',
    division: 'Human Capital & GA',
    location: 'Kantor Utama (Surabaya)',
    workDays: 22,
    presentDays: 22,
    lateCount: 0,
    totalLateMinutes: 0,
    leaveDays: 0,
    alpaDays: 0,
    score: 100,
    status: 'Sangat Baik',
    actionRecommendation: 'Pertahankan Performa (Nominasi Best Attendance)',
    incidents: [
      { date: '02 Nov 2026', type: 'Tepat Waktu', detail: 'Hadir 07:45 WIB (Jadwal 08:00)' },
    ],
  },
  {
    id: 3,
    name: 'Ahmad Fauzi',
    nip: 'HC-0103',
    role: 'Operator Forklift Utama',
    division: 'Logistik & Gudang',
    location: 'Gudang B (Rungkut)',
    workDays: 22,
    presentDays: 21,
    lateCount: 2,
    totalLateMinutes: 28,
    leaveDays: 1,
    alpaDays: 0,
    score: 91,
    status: 'Disiplin Baik',
    actionRecommendation: 'Bimbingan supervisor terkait ketepatan shift 2',
    incidents: [
      { date: '02 Nov 2026', type: 'Terlambat', detail: '18 Menit - Terkendala armada logistik' },
      { date: '04 Nov 2026', type: 'Terlambat', detail: '10 Menit - Hujan deras kawasan Rungkut' },
      { date: '10 Nov 2026', type: 'Cuti Tahunan', detail: '1 Hari (Disetujui HCGA)' },
    ],
  },
  {
    id: 4,
    name: 'Dewi Anggraini',
    nip: 'HC-0104',
    role: 'Quality Assurance Inspector',
    division: 'Operasional & Lapangan',
    location: 'Pabrik A (Sidoarjo)',
    workDays: 22,
    presentDays: 22,
    lateCount: 1,
    totalLateMinutes: 12,
    leaveDays: 0,
    alpaDays: 0,
    score: 96,
    status: 'Sangat Baik',
    actionRecommendation: 'Kepatuhan baik, toleransi keterlambatan wajar',
    incidents: [
      { date: '03 Nov 2026', type: 'Terlambat', detail: '12 Menit - Pemeriksaan gerbang pabrik' },
    ],
  },
  {
    id: 5,
    name: 'Hendra Wijaya',
    nip: 'HC-0105',
    role: 'Danru Keamanan & K3',
    division: 'Security & Safety',
    location: 'Site Operasional (Gresik)',
    workDays: 22,
    presentDays: 22,
    lateCount: 0,
    totalLateMinutes: 0,
    leaveDays: 0,
    alpaDays: 0,
    score: 100,
    status: 'Sangat Baik',
    actionRecommendation: 'Keteladanan kedisiplinan tingkat regu keamanan',
    incidents: [
      { date: '01 Nov 2026', type: 'Tepat Waktu', detail: 'Hadir 06:15 WIB (Serah terima piket)' },
    ],
  },
  {
    id: 6,
    name: 'Rina Marlina',
    nip: 'HC-0106',
    role: 'Staf Administrasi Payroll',
    division: 'Human Capital & GA',
    location: 'Kantor Utama (Surabaya)',
    workDays: 22,
    presentDays: 17,
    lateCount: 0,
    totalLateMinutes: 0,
    leaveDays: 5,
    alpaDays: 0,
    score: 93,
    status: 'Disiplin Baik',
    actionRecommendation: 'Sedang menjalani cuti resmi terencana (Cuti Melahirkan)',
    incidents: [
      { date: '01 Nov - 05 Nov 2026', type: 'Cuti Resmi', detail: 'Surat Izin Cuti No: HC/CT/26/1102' },
    ],
  },
  {
    id: 7,
    name: 'Eko Prasetyo',
    nip: 'HC-0107',
    role: 'Teknisi Maintenance Mesin',
    division: 'Operasional & Lapangan',
    location: 'Pabrik A (Sidoarjo)',
    workDays: 22,
    presentDays: 20,
    lateCount: 4,
    totalLateMinutes: 75,
    leaveDays: 1,
    alpaDays: 1,
    score: 68,
    status: 'Peringatan / SP',
    actionRecommendation: 'Penerbitan Surat Teguran Disiplin (SP-1) & Konseling',
    incidents: [
      { date: '02 Nov 2026', type: 'Terlambat', detail: '25 Menit - Masalah transportasi' },
      { date: '05 Nov 2026', type: 'Terlambat', detail: '30 Menit - Tanpa kabar awal' },
      { date: '09 Nov 2026', type: 'Alpa (Tanpa Keterangan)', detail: 'Tidak hadir tanpa izin supervisor' },
      { date: '12 Nov 2026', type: 'Terlambat', detail: '20 Menit' },
    ],
  },
  {
    id: 8,
    name: 'Maya Indah Lestari',
    nip: 'HC-0108',
    role: 'Koordinator Gudang Bahan Baku',
    division: 'Logistik & Gudang',
    location: 'Gudang B (Rungkut)',
    workDays: 22,
    presentDays: 21,
    lateCount: 1,
    totalLateMinutes: 14,
    leaveDays: 1,
    alpaDays: 0,
    score: 94,
    status: 'Disiplin Baik',
    actionRecommendation: 'Kinerja stabil, koordinasi kehadiran rapi',
    incidents: [
      { date: '04 Nov 2026', type: 'Terlambat', detail: '14 Menit - Macet frontage Ahmad Yani' },
      { date: '11 Nov 2026', type: 'Izin Sakit', detail: '1 Hari (Surat Keterangan Dokter Terlampir)' },
    ],
  },
  {
    id: 9,
    name: 'Joko Susilo',
    nip: 'HC-0109',
    role: 'Anggota Patroli Keamanan',
    division: 'Security & Safety',
    location: 'Pabrik A (Sidoarjo)',
    workDays: 22,
    presentDays: 20,
    lateCount: 3,
    totalLateMinutes: 48,
    leaveDays: 2,
    alpaDays: 0,
    score: 82,
    status: 'Perlu Pembinaan',
    actionRecommendation: 'Teguran lisan Danru dan evaluasi rotasi pos jaga',
    incidents: [
      { date: '03 Nov 2026', type: 'Terlambat', detail: '15 Menit - Pergantian perlengkapan' },
      { date: '06 Nov 2026', type: 'Terlambat', detail: '20 Menit - Hujan lebat' },
      { date: '13 Nov 2026', type: 'Terlambat', detail: '13 Menit' },
    ],
  },
  {
    id: 10,
    name: 'Dian Kusuma',
    nip: 'HC-0110',
    role: 'IT Support & Sistem HRIS',
    division: 'Human Capital & GA',
    location: 'Kantor Utama (Surabaya)',
    workDays: 22,
    presentDays: 22,
    lateCount: 1,
    totalLateMinutes: 8,
    leaveDays: 0,
    alpaDays: 0,
    score: 97,
    status: 'Sangat Baik',
    actionRecommendation: 'Kedisiplinan sangat baik, responsivitas sistem prima',
    incidents: [
      { date: '05 Nov 2026', type: 'Terlambat', detail: '8 Menit (Toleransi sistem)' },
    ],
  },
  {
    id: 11,
    name: 'Wahyu Hidayat',
    nip: 'HC-0111',
    role: 'Operator Mesin CNC Milling',
    division: 'Operasional & Lapangan',
    location: 'Pabrik A (Sidoarjo)',
    workDays: 22,
    presentDays: 21,
    lateCount: 3,
    totalLateMinutes: 42,
    leaveDays: 1,
    alpaDays: 0,
    score: 84,
    status: 'Perlu Pembinaan',
    actionRecommendation: 'Pengawasan kehadiran awal shift 1 mesin perkakas',
    incidents: [
      { date: '02 Nov 2026', type: 'Terlambat', detail: '14 Menit' },
      { date: '04 Nov 2026', type: 'Terlambat', detail: '16 Menit' },
      { date: '08 Nov 2026', type: 'Terlambat', detail: '12 Menit' },
    ],
  },
  {
    id: 12,
    name: 'Nurul Aini',
    nip: 'HC-0112',
    role: 'Petugas Inventory & Stok',
    division: 'Logistik & Gudang',
    location: 'Gudang B (Rungkut)',
    workDays: 22,
    presentDays: 22,
    lateCount: 0,
    totalLateMinutes: 0,
    leaveDays: 0,
    alpaDays: 0,
    score: 100,
    status: 'Sangat Baik',
    actionRecommendation: 'Pertahankan Performa (Nominasi Best Attendance)',
    incidents: [
      { date: '01 Nov 2026', type: 'Tepat Waktu', detail: 'Hadir 06:55 WIB' },
    ],
  },
];

export default function LaporanRekap() {
  const [activeTab, setActiveTab] = useState('organisasi'); // 'organisasi' | 'individu'
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState('2026-11');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Karyawan terpilih untuk tab Rapor Individu
  const selectedEmployee = useMemo(() => {
    return EVALUATION_DATASET.find((e) => e.id === selectedEmployeeId) || EVALUATION_DATASET[0];
  }, [selectedEmployeeId]);

  // Daftar Divisi Unik
  const divisions = useMemo(() => {
    const list = Array.from(new Set(EVALUATION_DATASET.map((item) => item.division)));
    return ['ALL', ...list];
  }, []);

  // Filter Data
  const filteredData = useMemo(() => {
    return EVALUATION_DATASET.filter((emp) => {
      const matchDivision = selectedDivision === 'ALL' || emp.division === selectedDivision;
      const matchStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;
      const matchSearch =
        searchQuery === '' ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDivision && matchStatus && matchSearch;
    });
  }, [selectedDivision, selectedStatus, searchQuery]);

  // Statistik Ringkasan Evaluasi
  const summaryStats = useMemo(() => {
    const totalEmployees = EVALUATION_DATASET.length;
    const totalPossibleDays = totalEmployees * 22;
    const totalPresentDays = EVALUATION_DATASET.reduce((acc, curr) => acc + curr.presentDays, 0);
    const totalLateIncidents = EVALUATION_DATASET.reduce((acc, curr) => acc + curr.lateCount, 0);
    const totalLateMinutes = EVALUATION_DATASET.reduce((acc, curr) => acc + curr.totalLateMinutes, 0);
    const totalAlpa = EVALUATION_DATASET.reduce((acc, curr) => acc + curr.alpaDays, 0);

    const attendanceRate = ((totalPresentDays / totalPossibleDays) * 100).toFixed(1);
    const perfectCount = EVALUATION_DATASET.filter((e) => e.score === 100).length;
    const warningCount = EVALUATION_DATASET.filter((e) => e.status === 'Peringatan / SP').length;
    const coachingCount = EVALUATION_DATASET.filter((e) => e.status === 'Perlu Pembinaan').length;

    return {
      attendanceRate,
      totalLateIncidents,
      totalLateMinutes,
      totalAlpa,
      perfectCount,
      warningCount,
      coachingCount,
      totalEmployees,
    };
  }, []);

  // Data Grafik Per Divisi
  const divisionChartData = useMemo(() => {
    const divMap = {};
    EVALUATION_DATASET.forEach((emp) => {
      if (!divMap[emp.division]) {
        divMap[emp.division] = { division: emp.division, totalScore: 0, count: 0, totalLate: 0 };
      }
      divMap[emp.division].totalScore += emp.score;
      divMap[emp.division].totalLate += emp.lateCount;
      divMap[emp.division].count += 1;
    });

    return Object.values(divMap).map((d) => ({
      name: d.division.replace('& Lapangan', '').replace('& Safety', '').trim(),
      fullName: d.division,
      avgScore: Math.round(d.totalScore / d.count),
      totalLate: d.totalLate,
      karyawan: d.count,
    }));
  }, []);

  // Top Performers (100% On-Time) & Perhatian Khusus
  const topPerformers = useMemo(() => {
    return EVALUATION_DATASET.filter((e) => e.score === 100);
  }, []);

  const warningList = useMemo(() => {
    return EVALUATION_DATASET.filter((e) => e.status === 'Peringatan / SP' || e.status === 'Perlu Pembinaan');
  }, []);

  // Fungsi Ekspor Excel
  const handleExportExcel = () => {
    const exportRows = filteredData.map((emp, index) => ({
      No: index + 1,
      NIP: emp.nip,
      'Nama Karyawan': emp.name,
      Divisi: emp.division,
      Jabatan: emp.role,
      Lokasi: emp.location,
      'Hari Kerja': emp.workDays,
      'Total Hadir': emp.presentDays,
      '% Kehadiran': `${((emp.presentDays / emp.workDays) * 100).toFixed(1)}%`,
      'Frekuensi Terlambat': emp.lateCount,
      'Total Menit Terlambat': emp.totalLateMinutes,
      'Cuti/Izin': emp.leaveDays,
      Alpa: emp.alpaDays,
      'Skor Kedisiplinan': `${emp.score}%`,
      'Status Evaluasi': emp.status,
      'Rekomendasi Tindakan': emp.actionRecommendation,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Evaluasi Kehadiran');

    // Auto-fit column widths
    const colWidths = [
      { wch: 4 },  // No
      { wch: 12 }, // NIP
      { wch: 22 }, // Nama
      { wch: 24 }, // Divisi
      { wch: 24 }, // Jabatan
      { wch: 22 }, // Lokasi
      { wch: 10 }, // Hari Kerja
      { wch: 10 }, // Hadir
      { wch: 12 }, // % Kehadiran
      { wch: 12 }, // Frek Telat
      { wch: 14 }, // Menit Telat
      { wch: 10 }, // Cuti
      { wch: 8 },  // Alpa
      { wch: 12 }, // Skor
      { wch: 18 }, // Status
      { wch: 35 }, // Rekomendasi
    ];
    worksheet['!cols'] = colWidths;

    const periodLabel = selectedPeriod.replace('-', '_');
    XLSX.writeFile(workbook, `Evaluasi_Kehadiran_HCGA_${periodLabel}.xlsx`);
  };

  const resetFilters = () => {
    setSelectedDivision('ALL');
    setSelectedStatus('ALL');
    setSearchQuery('');
  };

  // Helper Badge Status
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Sangat Baik':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 inline" />
            Sangat Baik
          </Badge>
        );
      case 'Disiplin Baik':
        return (
          <Badge className="bg-sky-50 text-sky-700 border-sky-200 font-medium">
            <CheckCircle2 className="w-3 h-3 mr-1 text-sky-600 inline" />
            Disiplin Baik
          </Badge>
        );
      case 'Perlu Pembinaan':
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-600 inline" />
            Perlu Pembinaan
          </Badge>
        );
      case 'Peringatan / SP':
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-medium">
            <ShieldAlert className="w-3 h-3 mr-1 text-rose-600 inline" />
            Peringatan / SP
          </Badge>
        );
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <>
      <Head title="Evaluasi & Laporan Kehadiran" />

      {/* Header Halaman dengan Pemilihan Periode & Ekspor */}
      <PageHeader
        eyebrow="MODUL HCGA ANALYTICS & DISCIPLINE"
        title="Laporan & Evaluasi Kehadiran"
        subtitle="Analisis kepatuhan kerja, scoring kedisiplinan berkala, peringatan dini indisipliner, dan rekap evaluasi bulanan."
        actions={
          <div className="flex items-center gap-2.5">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
              <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="text-xs font-semibold text-navy bg-transparent border-0 focus:ring-0 cursor-pointer p-0 pr-4"
              >
                {AVAILABLE_PERIODS.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              className="gap-1.5 border-emerald-600/30 text-emerald-800 hover:bg-emerald-50 bg-white"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Ekspor Rekap (XLSX)</span>
            </Button>
          </div>
        }
      />

      {/* Tab Switcher: Rekap Organisasi vs Rapor Individu */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('organisasi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'organisasi'
              ? 'bg-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-navy hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Rekap & Analitik Organisasi</span>
          <Badge className={activeTab === 'organisasi' ? 'bg-white/20 text-white font-mono text-[10px]' : 'bg-slate-200 text-slate-700 text-[10px]'}>
            {EVALUATION_DATASET.length}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('individu')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'individu'
              ? 'bg-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-navy hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Rapor Kehadiran Individu</span>
          {selectedEmployee && (
            <span className={`text-[11px] font-normal ${activeTab === 'individu' ? 'text-[#c4a266]' : 'text-slate-400'}`}>
              • {selectedEmployee.name}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'organisasi' ? (
        <div className="space-y-6">
        {/* Banner Prinsip Operasional Ringkas HCGA */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <div className="w-6 h-6 rounded-lg bg-navy/10 text-navy flex items-center justify-center font-bold text-[11px]">
              HC
            </div>
            <span>
              <strong>Evaluasi Terpadu:</strong> Perhitungan skor disiplin dihitung otomatis dari kehadiran efektif, frekuensi keterlambatan, dan riwayat absensi tanpa keterangan (Alpa).
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge className="bg-navy/5 text-navy border-navy/20 text-[10px]">
              Target Kehadiran: ≥ 95%
            </Badge>
            <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
              Toleransi Terlambat: Maks 2x/Bulan
            </Badge>
          </div>
        </div>

        {/* 4 Kartu KPI Utama Evaluasi Kehadiran */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Visual Analytics & Top Highlight Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grafik Skor Disiplin Antar Divisi */}
          <Card className="lg:col-span-2 border-slate-200 shadow-2xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#c4a266]" />
                    Rata-rata Skor Kedisiplinan per Divisi
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Perbandingan skor kepatuhan kehadiran pada periode {selectedPeriod}
                  </CardDescription>
                </div>
                <Badge variant="neutral" className="text-[10px]">
                  Skala 0 - 100%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={divisionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <YAxis
                      domain={[50, 100]}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      unit="%"
                    />
                    <Tooltip
                      formatter={(val, name, item) => [
                        `${val}% (Total ${item.payload.totalLate}x telat)`,
                        'Rata-rata Skor',
                      ]}
                      labelFormatter={(label, items) => items?.[0]?.payload?.fullName || label}
                      contentStyle={{
                        backgroundColor: '#10273f',
                        borderColor: '#10273f',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="avgScore" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {divisionChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.avgScore >= 95 ? '#10273f' : entry.avgScore >= 90 ? '#39609e' : '#c4a266'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Panel Sorotan Kinerja: Top Stars & Early Warning */}
          <div className="space-y-4">
            {/* Top Attendance Performers */}
            <Card className="border-slate-200 shadow-2xs">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-xs font-bold text-navy flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Keteladanan Sempurna (100%)
                  </span>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                    {topPerformers.length} Orang
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 space-y-2">
                {topPerformers.slice(0, 3).map((emp) => (
                  <div
                    key={emp.id}
                    className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{emp.name}</p>
                      <p className="text-[11px] text-slate-500">{emp.division}</p>
                    </div>
                    <Badge className="bg-emerald-600 text-white text-[10px]">
                      Nihil Telat
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Early Warning Disiplin */}
            <Card className="border-slate-200 shadow-2xs">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-xs font-bold text-navy flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-rose-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Panggilan / Pembinaan Khusus
                  </span>
                  <Badge className="bg-rose-100 text-rose-800 text-[10px]">
                    {warningList.length} Orang
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 space-y-2">
                {warningList.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => { setSelectedEmployeeId(emp.id); setActiveTab('individu'); }}
                    className="p-2 rounded-lg bg-rose-50/40 border border-rose-200 hover:bg-rose-50 cursor-pointer transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">{emp.name}</span>
                        <span className="text-[10px] text-slate-500">({emp.nip})</span>
                      </div>
                      <p className="text-[11px] text-rose-700 font-medium">
                        {emp.lateCount}x Terlambat ({emp.totalLateMinutes} mnt)
                        {emp.alpaDays > 0 && ` • ${emp.alpaDays}x Alpa`}
                      </p>
                    </div>
                    {renderStatusBadge(emp.status)}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabel Master Evaluasi Kehadiran */}
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-navy" />
                Matriks Evaluasi Kedisiplinan Karyawan
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Rekapitulasi performa kepatuhan, frekuensi keterlambatan, dan skor disiplin kerja karyawan periode {selectedPeriod}.
              </CardDescription>
            </div>
            <Badge variant="neutral" className="text-xs self-start sm:self-auto font-medium">
              Total {filteredData.length} Karyawan
            </Badge>
          </CardHeader>

          {/* Atomic Table Toolbar & Filter Group */}
          <TableToolbar>
            <TableSearch
              placeholder="Cari berdasarkan nama karyawan, NIP, atau jabatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <TableFilterGroup>
              {/* Filter Divisi */}
              <TableSelect
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                title="Filter Divisi"
              >
                <option value="ALL">Semua Divisi</option>
                {divisions.filter((d) => d !== 'ALL').map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </TableSelect>

              {/* Filter Status Evaluasi */}
              <TableSelect
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                title="Filter Status Evaluasi"
              >
                <option value="ALL">Semua Status</option>
                <option value="Sangat Baik">Sangat Baik</option>
                <option value="Disiplin Baik">Disiplin Baik</option>
                <option value="Perlu Pembinaan">Perlu Pembinaan</option>
                <option value="Peringatan / SP">Peringatan / SP</option>
              </TableSelect>

              {/* Tombol Reset Filter */}
              {(searchQuery || selectedDivision !== 'ALL' || selectedStatus !== 'ALL') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-9 px-3 text-xs text-slate-600 hover:text-navy gap-1.5 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filter</span>
                </Button>
              )}
            </TableFilterGroup>
          </TableToolbar>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">No</TableHead>
                  <TableHead>Karyawan</TableHead>
                  <TableHead>Divisi & Lokasi</TableHead>
                  <TableHead className="text-center">Kehadiran (Hadir/Hari)</TableHead>
                  <TableHead className="text-center">Keterlambatan</TableHead>
                  <TableHead className="text-center">Cuti / Sakit</TableHead>
                  <TableHead className="text-center">Alpa</TableHead>
                  <TableHead className="text-center">Skor Disiplin</TableHead>
                  <TableHead className="text-center">Status Evaluasi</TableHead>
                  <TableHead className="text-right pr-4">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableEmpty colSpan={10} message="Tidak ada data evaluasi karyawan yang cocok dengan kriteria filter." />
                ) : (
                  filteredData.map((emp, index) => {
                    const attendancePct = ((emp.presentDays / emp.workDays) * 100).toFixed(0);
                    return (
                      <TableRow key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                        <TableCell className="text-center font-medium text-slate-500 text-xs">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-bold text-navy text-xs">{emp.name}</p>
                            <p className="text-[11px] text-slate-500">{emp.nip} • {emp.role}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs text-slate-800 font-medium">{emp.division}</p>
                          <p className="text-[11px] text-slate-500">{emp.location}</p>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-block">
                            <span className="font-bold text-xs text-slate-900">
                              {emp.presentDays} / {emp.workDays}
                            </span>
                            <span className="text-[11px] text-slate-500 ml-1">
                              ({attendancePct}%)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {emp.lateCount > 0 ? (
                            <span className="font-semibold text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {emp.lateCount}x ({emp.totalLateMinutes} mnt)
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">0x</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center text-xs text-slate-700">
                          {emp.leaveDays > 0 ? `${emp.leaveDays} hari` : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {emp.alpaDays > 0 ? (
                            <Badge className="bg-rose-100 text-rose-800 border-rose-300 font-bold text-[10px]">
                              {emp.alpaDays} Alpa
                            </Badge>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span
                              className={`font-bold text-xs ${
                                emp.score >= 95
                                  ? 'text-emerald-700'
                                  : emp.score >= 85
                                  ? 'text-sky-700'
                                  : emp.score >= 70
                                  ? 'text-amber-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              {emp.score}%
                            </span>
                            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                              <div
                                className={`h-full rounded-full ${
                                  emp.score >= 95
                                    ? 'bg-emerald-500'
                                    : emp.score >= 85
                                    ? 'bg-sky-500'
                                    : emp.score >= 70
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${emp.score}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {renderStatusBadge(emp.status)}
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEmployeeId(emp.id);
                              setActiveTab('individu');
                            }}
                            className="h-7 text-xs px-2.5 gap-1.5 text-navy border-slate-300 hover:bg-slate-100"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#c4a266]" />
                            <span>Buka Rapor</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Footer Table Info */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <div>
                Menampilkan <strong>{filteredData.length}</strong> dari total <strong>{EVALUATION_DATASET.length}</strong> karyawan pada periode {selectedPeriod}
              </div>
              <div className="text-[11px] text-slate-400">
                Pembaruan terakhir: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      ) : (
        <RaporIndividu
          employee={selectedEmployee}
          allEmployees={EVALUATION_DATASET}
          onSelectEmployee={setSelectedEmployeeId}
          selectedPeriod={selectedPeriod}
          onBackToOrganization={() => setActiveTab('organisasi')}
        />
      )}
      
    </>
  );
}
