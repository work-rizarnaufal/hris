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
  CalendarCheck,
  X,
  Sparkles,
  Info,
  Printer,
  MapPin,
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
  PrintButton,
  PrintPreviewModal,
  ReportHeader,
  ReportMetaGrid,
  ReportSignature,
} from '@/components/ui';
import { colors } from '@/config/theme.js';
import { useActiveSite, matchesActiveSite } from '@/services/systemSettings.js';
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
    location: 'SITE A CIMALAKA',
    group: 'Grup A',
    shiftCode: 'S1',
    baseShift: 'Shift 1 (07:00 - 15:00)',
    workDays: 15,
    presentDays: 15,
    lateCount: 0,
    totalLateMinutes: 0,
    izinDays: 0,
    sakitDays: 0,
    cutiDays: 0,
    leaveDays: 0,
    alpaDays: 0,
    score: 100,
    status: 'Sangat Baik',
    actionRecommendation: 'Pertahankan Performa (Nominasi Best Attendance)',
    incidents: [
      { date: '02 Nov 2026', type: 'Tepat Waktu', detail: 'Hadir 06:50 WIB (Jadwal 07:00)' },
      { date: '04 Nov 2026', type: 'Tepat Waktu', detail: 'Hadir 06:48 WIB (Tukar shift dengan Ahmad Fauzi disetujui)' },
    ],
  },
  {
    id: 2,
    name: 'Siti Rahmawati',
    nip: 'HC-0102',
    role: 'HCGA Specialist',
    division: 'Human Capital & GA',
    location: 'SITE A CIMALAKA',
    group: 'Non-Shift',
    shiftCode: 'NON',
    baseShift: 'Normal Office (08:00 - 17:00)',
    workDays: 21,
    presentDays: 21,
    lateCount: 0,
    totalLateMinutes: 0,
    izinDays: 0,
    sakitDays: 0,
    cutiDays: 0,
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
    location: 'SITE A CIMALAKA',
    group: 'Grup B',
    shiftCode: 'S2',
    baseShift: 'Shift 2 (15:00 - 23:00)',
    workDays: 15,
    presentDays: 14,
    lateCount: 2,
    totalLateMinutes: 28,
    izinDays: 0,
    sakitDays: 0,
    cutiDays: 1,
    leaveDays: 1,
    alpaDays: 0,
    score: 91,
    status: 'Disiplin Baik',
    actionRecommendation: 'Bimbingan supervisor terkait ketepatan shift 2',
    incidents: [
      { date: '03 Nov 2026', type: 'Terlambat', detail: '18 Menit - Terkendala armada logistik' },
      { date: '05 Nov 2026', type: 'Terlambat', detail: '10 Menit - Hujan lebat kawasan operasional' },
      { date: '11 Nov 2026', type: 'Cuti', detail: '1 Hari - Cuti Tahunan (Disetujui HCGA)' },
    ],
  },
  {
    id: 4,
    name: 'Dewi Anggraini',
    nip: 'HC-0104',
    role: 'Quality Assurance Inspector',
    division: 'Operasional & Lapangan',
    location: 'SITE A CIMALAKA',
    group: 'Grup A',
    shiftCode: 'S1',
    baseShift: 'Shift 1 (07:00 - 15:00)',
    workDays: 15,
    presentDays: 15,
    lateCount: 1,
    totalLateMinutes: 12,
    izinDays: 0,
    sakitDays: 0,
    cutiDays: 0,
    leaveDays: 0,
    alpaDays: 0,
    score: 96,
    status: 'Sangat Baik',
    actionRecommendation: 'Kepatuhan baik, toleransi keterlambatan wajar',
    incidents: [
      { date: '04 Nov 2026', type: 'Terlambat', detail: '12 Menit - Pemeriksaan gerbang pabrik' },
    ],
  },
  {
    id: 5,
    name: 'Hendra Wijaya',
    nip: 'HC-0105',
    role: 'Danru Keamanan & K3',
    division: 'Security & Safety',
    location: 'SITE A CIMALAKA',
    group: 'Grup A',
    shiftCode: 'S1',
    baseShift: 'Shift 1 (07:00 - 15:00)',
    workDays: 15,
    presentDays: 15,
    lateCount: 0,
    totalLateMinutes: 0,
    izinDays: 0,
    sakitDays: 0,
    cutiDays: 0,
    leaveDays: 0,
    alpaDays: 0,
    score: 100,
    status: 'Sangat Baik',
    actionRecommendation: 'Keteladanan kedisiplinan tingkat regu keamanan',
    incidents: [
      { date: '02 Nov 2026', type: 'Tepat Waktu', detail: 'Hadir 06:15 WIB (Serah terima piket)' },
    ],
  },
  {
    id: 6,
    name: 'Rina Marlina',
    nip: 'HC-0106',
    role: 'Staf Administrasi Payroll',
    division: 'Human Capital & GA',
    location: 'SITE A CIMALAKA',
    group: 'Non-Shift',
    shiftCode: 'NON',
    baseShift: 'Normal Office (08:00 - 17:00)',
    workDays: 21,
    presentDays: 16,
    lateCount: 0,
    totalLateMinutes: 0,
    izinDays: 0,
    sakitDays: 0,
    cutiDays: 5,
    leaveDays: 5,
    alpaDays: 0,
    score: 93,
    status: 'Disiplin Baik',
    actionRecommendation: 'Sedang menjalani cuti resmi terencana (Cuti Melahirkan)',
    incidents: [
      { date: '02 Nov 2026', type: 'Cuti', detail: 'Cuti Melahirkan (Hari ke-1)' },
      { date: '03 Nov 2026', type: 'Cuti', detail: 'Cuti Melahirkan (Hari ke-2)' },
      { date: '04 Nov 2026', type: 'Cuti', detail: 'Cuti Melahirkan (Hari ke-3)' },
      { date: '05 Nov 2026', type: 'Cuti', detail: 'Cuti Melahirkan (Hari ke-4)' },
      { date: '06 Nov 2026', type: 'Cuti', detail: 'Cuti Melahirkan (Hari ke-5)' },
    ],
  },
  {
    id: 7,
    name: 'Eko Prasetyo',
    nip: 'HC-0107',
    role: 'Teknisi Maintenance Mesin',
    division: 'Operasional & Lapangan',
    location: 'SITE B PASEH',
    group: 'Grup B',
    shiftCode: 'S2',
    baseShift: 'Shift 2 (15:00 - 23:00)',
    workDays: 15,
    presentDays: 13,
    lateCount: 4,
    totalLateMinutes: 75,
    izinDays: 0,
    sakitDays: 1,
    cutiDays: 0,
    leaveDays: 1,
    alpaDays: 1,
    score: 68,
    status: 'Peringatan / SP',
    actionRecommendation: 'Penerbitan Surat Teguran Disiplin (SP-1) & Konseling',
    incidents: [
      { date: '03 Nov 2026', type: 'Terlambat', detail: '20 Menit - Masalah transportasi' },
      { date: '05 Nov 2026', type: 'Terlambat', detail: '25 Menit - Tanpa kabar awal' },
      { date: '07 Nov 2026', type: 'Sakit', detail: '1 Hari - Sakit demam (Surat Dokter)' },
      { date: '09 Nov 2026', type: 'Alpa', detail: '1 Hari - Tidak hadir tanpa izin supervisor' },
      { date: '11 Nov 2026', type: 'Terlambat', detail: '15 Menit - Kendala mesin pabrik' },
      { date: '17 Nov 2026', type: 'Terlambat', detail: '15 Menit - Keterlambatan pergantian shift 2' },
    ],
  },
  {
    id: 8,
    name: 'Maya Indah Lestari',
    nip: 'HC-0108',
    role: 'Koordinator Gudang Bahan Baku',
    division: 'Logistik & Gudang',
    location: 'SITE B PASEH',
    group: 'Non-Shift',
    shiftCode: 'NON',
    baseShift: 'Normal Office (08:00 - 17:00)',
    workDays: 21,
    presentDays: 20,
    lateCount: 1,
    totalLateMinutes: 14,
    izinDays: 0,
    sakitDays: 1,
    cutiDays: 0,
    leaveDays: 1,
    alpaDays: 0,
    score: 94,
    status: 'Disiplin Baik',
    actionRecommendation: 'Kinerja stabil, koordinasi kehadiran rapi',
    incidents: [
      { date: '04 Nov 2026', type: 'Terlambat', detail: '14 Menit - Macet frontage Ahmad Yani' },
      { date: '11 Nov 2026', type: 'Sakit', detail: '1 Hari (Surat Keterangan Dokter Terlampir)' },
    ],
  },
  {
    id: 9,
    name: 'Joko Susilo',
    nip: 'HC-0109',
    role: 'Anggota Patroli Keamanan',
    division: 'Security & Safety',
    location: 'SITE B PASEH',
    group: 'Grup B',
    shiftCode: 'S2',
    baseShift: 'Shift 2 (15:00 - 23:00)',
    workDays: 15,
    presentDays: 13,
    lateCount: 3,
    totalLateMinutes: 48,
    izinDays: 1,
    sakitDays: 1,
    cutiDays: 0,
    leaveDays: 2,
    alpaDays: 0,
    score: 82,
    status: 'Perlu Pembinaan',
    actionRecommendation: 'Teguran lisan Danru dan evaluasi rotasi pos jaga',
    incidents: [
      { date: '03 Nov 2026', type: 'Terlambat', detail: '15 Menit - Pergantian perlengkapan' },
      { date: '05 Nov 2026', type: 'Terlambat', detail: '20 Menit - Hujan lebat' },
      { date: '09 Nov 2026', type: 'Izin', detail: '1 Hari - Urusan keluarga mendesak' },
      { date: '11 Nov 2026', type: 'Sakit', detail: '1 Hari - Sakit flu & demam' },
      { date: '13 Nov 2026', type: 'Terlambat', detail: '13 Menit' },
    ],
  },
  {
    id: 10,
    name: 'Dian Kusuma',
    nip: 'HC-0110',
    role: 'IT Support & Sistem HRIS',
    division: 'Human Capital & GA',
    location: 'SITE B PASEH',
    group: 'Non-Shift',
    shiftCode: 'NON',
    baseShift: 'Normal Office (08:00 - 17:00)',
    workDays: 21,
    presentDays: 21,
    lateCount: 1,
    totalLateMinutes: 8,
    izinDays: 0,
    sakitDays: 0,
    cutiDays: 0,
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
    location: 'SITE B PASEH',
    group: 'Grup A',
    shiftCode: 'S1',
    baseShift: 'Shift 1 (07:00 - 15:00)',
    workDays: 15,
    presentDays: 14,
    lateCount: 3,
    totalLateMinutes: 42,
    izinDays: 1,
    sakitDays: 0,
    cutiDays: 0,
    leaveDays: 1,
    alpaDays: 0,
    score: 84,
    status: 'Perlu Pembinaan',
    actionRecommendation: 'Pengawasan kehadiran awal shift 1 mesin perkakas',
    incidents: [
      { date: '02 Nov 2026', type: 'Terlambat', detail: '14 Menit' },
      { date: '04 Nov 2026', type: 'Terlambat', detail: '16 Menit' },
      { date: '08 Nov 2026', type: 'Terlambat', detail: '12 Menit' },
      { date: '10 Nov 2026', type: 'Izin', detail: '1 Hari - Keperluan keluarga mendesak' },
    ],
  },
  {
    id: 12,
    name: 'Nurul Aini',
    nip: 'HC-0112',
    role: 'Petugas Inventory & Stok',
    division: 'Logistik & Gudang',
    location: 'SITE B PASEH',
    group: 'Grup A',
    shiftCode: 'S1',
    baseShift: 'Shift 1 (07:00 - 15:00)',
    workDays: 15,
    presentDays: 15,
    lateCount: 0,
    totalLateMinutes: 0,
    izinDays: 0,
    sakitDays: 0,
    cutiDays: 0,
    leaveDays: 0,
    alpaDays: 0,
    score: 100,
    status: 'Sangat Baik',
    actionRecommendation: 'Pertahankan Performa (Nominasi Best Attendance)',
    incidents: [
      { date: '02 Nov 2026', type: 'Tepat Waktu', detail: 'Hadir 06:55 WIB' },
    ],
  },
];

// Data Rekapitulasi Presensi Harian Operasional (12 Personil HCGA Sinkron)
// Sinkron dengan Aturan JadwalShift.jsx: Pada 05 Nov 2026 (Kamis), Grup B & Non-Shift Masuk, Grup A Libur Roster (OFF)
const DAILY_ATTENDANCE_DATASET = [
  {
    id: 101,
    employeeId: 1,
    nip: 'HC-0101',
    name: 'Budi Santoso',
    role: 'Senior Operator Lapangan',
    division: 'Operasional & Lapangan',
    location: 'SITE A CIMALAKA',
    group: 'Grup A',
    shift: 'Shift 1: Pagi (07:00 - 15:00)',
    shiftCode: 'Shift 1',
    status: 'Libur',
    checkIn: '-',
    checkOut: '-',
    lateMinutes: 0,
    deviation: '-',
    notes: 'Jadwal Libur Roster Bergulir (OFF)',
  },
  {
    id: 102,
    employeeId: 2,
    nip: 'HC-0102',
    name: 'Siti Rahmawati',
    role: 'HCGA Specialist',
    division: 'Human Capital & GA',
    location: 'SITE A CIMALAKA',
    group: 'Non-Shift',
    shift: 'Reguler Kantor (08:00 - 17:00)',
    shiftCode: 'Reguler',
    status: 'Hadir',
    checkIn: '07:48 WIB',
    checkOut: '17:10 WIB',
    lateMinutes: 0,
    deviation: 'Tepat Waktu',
    notes: 'Penyusunan rekapitulasi evaluasi bulanan HCGA',
  },
  {
    id: 103,
    employeeId: 3,
    nip: 'HC-0103',
    name: 'Ahmad Fauzi',
    role: 'Operator Forklift Utama',
    division: 'Logistik & Gudang',
    location: 'SITE A CIMALAKA',
    group: 'Grup B',
    shift: 'Shift 2: Siang (14:00 - 22:00)',
    shiftCode: 'Shift 2',
    status: 'Terlambat',
    checkIn: '14:10 WIB',
    checkOut: '22:05 WIB',
    lateMinutes: 10,
    deviation: '+10 Menit',
    notes: 'Hujan lebat kawasan operasional (Jadwal Maintenance Turbin)',
  },
  {
    id: 104,
    employeeId: 4,
    nip: 'HC-0104',
    name: 'Dewi Anggraini',
    role: 'Quality Assurance Inspector',
    division: 'Operasional & Lapangan',
    location: 'SITE A CIMALAKA',
    group: 'Grup A',
    shift: 'Shift 1: Pagi (07:00 - 15:00)',
    shiftCode: 'Shift 1',
    status: 'Libur',
    checkIn: '-',
    checkOut: '-',
    lateMinutes: 0,
    deviation: '-',
    notes: 'Jadwal Libur Roster Bergulir (OFF)',
  },
  {
    id: 105,
    employeeId: 5,
    nip: 'HC-0105',
    name: 'Hendra Wijaya',
    role: 'Danru Keamanan & K3',
    division: 'Security & Safety',
    location: 'SITE A CIMALAKA',
    group: 'Grup A',
    shift: 'Shift 1: Pagi (07:00 - 15:00)',
    shiftCode: 'Shift 1',
    status: 'Libur',
    checkIn: '-',
    checkOut: '-',
    lateMinutes: 0,
    deviation: '-',
    notes: 'Jadwal Libur Roster Bergulir (OFF)',
  },
  {
    id: 106,
    employeeId: 6,
    nip: 'HC-0106',
    name: 'Rina Marlina',
    role: 'Staf Administrasi Payroll',
    division: 'Human Capital & GA',
    location: 'SITE A CIMALAKA',
    group: 'Non-Shift',
    shift: 'Reguler Kantor (08:00 - 17:00)',
    shiftCode: 'Reguler',
    status: 'Cuti',
    checkIn: '-',
    checkOut: '-',
    lateMinutes: 0,
    deviation: '-',
    notes: 'Cuti Resmi Melahirkan (Hari ke-4)',
  },
  {
    id: 107,
    employeeId: 7,
    nip: 'HC-0107',
    name: 'Eko Prasetyo',
    role: 'Teknisi Maintenance Mesin',
    division: 'Operasional & Lapangan',
    location: 'SITE B PASEH',
    group: 'Grup B',
    shift: 'Shift 2: Siang (14:00 - 22:00)',
    shiftCode: 'Shift 2',
    status: 'Terlambat',
    checkIn: '14:25 WIB',
    checkOut: '22:00 WIB',
    lateMinutes: 25,
    deviation: '+25 Menit',
    notes: 'Keterlambatan 25 Menit - Tanpa kabar awal (SP-1)',
  },
  {
    id: 108,
    employeeId: 8,
    nip: 'HC-0108',
    name: 'Maya Indah Lestari',
    role: 'Koordinator Gudang Bahan Baku',
    division: 'Logistik & Gudang',
    location: 'SITE B PASEH',
    group: 'Non-Shift',
    shift: 'Reguler Kantor (08:00 - 17:00)',
    shiftCode: 'Reguler',
    status: 'Hadir',
    checkIn: '07:55 WIB',
    checkOut: '17:02 WIB',
    lateMinutes: 0,
    deviation: 'Tepat Waktu',
    notes: 'Koordinasi suplai logistik bahan baku Site B',
  },
  {
    id: 109,
    employeeId: 9,
    nip: 'HC-0109',
    name: 'Joko Susilo',
    role: 'Anggota Patroli Keamanan',
    division: 'Security & Safety',
    location: 'SITE B PASEH',
    group: 'Grup B',
    shift: 'Shift 2: Siang (14:00 - 22:00)',
    shiftCode: 'Shift 2',
    status: 'Terlambat',
    checkIn: '14:20 WIB',
    checkOut: '22:05 WIB',
    lateMinutes: 20,
    deviation: '+20 Menit',
    notes: 'Terlambat 20 menit kendala hujan lebat di pos jaga',
  },
  {
    id: 110,
    employeeId: 10,
    nip: 'HC-0110',
    name: 'Dian Kusuma',
    role: 'IT Support & Sistem HRIS',
    division: 'Human Capital & GA',
    location: 'SITE B PASEH',
    group: 'Non-Shift',
    shift: 'Reguler Kantor (08:00 - 17:00)',
    shiftCode: 'Reguler',
    status: 'Terlambat',
    checkIn: '08:08 WIB',
    checkOut: '17:00 WIB',
    lateMinutes: 8,
    deviation: '+8 Menit',
    notes: 'Terlambat 8 Menit (Toleransi sistem HRIS)',
  },
  {
    id: 111,
    employeeId: 11,
    nip: 'HC-0111',
    name: 'Wahyu Hidayat',
    role: 'Operator Mesin CNC Milling',
    division: 'Operasional & Lapangan',
    location: 'SITE B PASEH',
    group: 'Grup A',
    shift: 'Shift 1: Pagi (07:00 - 15:00)',
    shiftCode: 'Shift 1',
    status: 'Libur',
    checkIn: '-',
    checkOut: '-',
    lateMinutes: 0,
    deviation: '-',
    notes: 'Jadwal Libur Roster Bergulir (OFF)',
  },
  {
    id: 112,
    employeeId: 12,
    nip: 'HC-0112',
    name: 'Nurul Aini',
    role: 'Petugas Inventory & Stok',
    division: 'Logistik & Gudang',
    location: 'SITE B PASEH',
    group: 'Grup A',
    shift: 'Shift 1: Pagi (07:00 - 15:00)',
    shiftCode: 'Shift 1',
    status: 'Libur',
    checkIn: '-',
    checkOut: '-',
    lateMinutes: 0,
    deviation: '-',
    notes: 'Jadwal Libur Roster Bergulir (OFF)',
  },
];

export default function LaporanRekap() {
  const [activeTab, setActiveTab] = useState('organisasi'); // 'organisasi' | 'harian' | 'individu'
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState('2026-11');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // State Khusus Tab Rekap Harian
  const [selectedDailyDate, setSelectedDailyDate] = useState('2026-11-05');
  const [selectedDailyShift, setSelectedDailyShift] = useState('ALL');
  const [selectedDailyStatus, setSelectedDailyStatus] = useState('ALL');
  const [searchDailyQuery, setSearchDailyQuery] = useState('');

  const [showPrintModal, setShowPrintModal] = useState(false);
  const activeSite = useActiveSite();

  // Dataset Sesuai Site Aktif (Bulanan)
  const siteDataset = useMemo(() => {
    return EVALUATION_DATASET.filter((emp) => matchesActiveSite(emp.location, activeSite.id));
  }, [activeSite]);

  // Dataset Sesuai Site Aktif (Harian)
  const dailySiteDataset = useMemo(() => {
    return DAILY_ATTENDANCE_DATASET.filter((emp) => matchesActiveSite(emp.location, activeSite.id));
  }, [activeSite]);

  // Karyawan terpilih untuk tab Rapor Kehadiran
  const selectedEmployee = useMemo(() => {
    return siteDataset.find((e) => e.id === selectedEmployeeId) || siteDataset[0] || EVALUATION_DATASET[0];
  }, [selectedEmployeeId, siteDataset]);

  // Daftar Divisi Unik (Bulanan)
  const divisions = useMemo(() => {
    const list = Array.from(new Set(EVALUATION_DATASET.map((item) => item.division)));
    return ['ALL', ...list];
  }, []);

  // Filter Data (Bulanan)
  const filteredData = useMemo(() => {
    return siteDataset.filter((emp) => {
      const matchDivision = selectedDivision === 'ALL' || emp.division === selectedDivision;
      const matchStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;
      const matchSearch =
        searchQuery === '' ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDivision && matchStatus && matchSearch;
    });
  }, [siteDataset, selectedDivision, selectedStatus, searchQuery]);

  // Filter Data (Harian)
  const filteredDailyData = useMemo(() => {
    return dailySiteDataset.filter((item) => {
      const matchShift = selectedDailyShift === 'ALL' || item.shiftCode === selectedDailyShift;
      const matchStatus = selectedDailyStatus === 'ALL' || item.status === selectedDailyStatus;
      const matchSearch =
        searchDailyQuery === '' ||
        item.name.toLowerCase().includes(searchDailyQuery.toLowerCase()) ||
        item.nip.toLowerCase().includes(searchDailyQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchDailyQuery.toLowerCase()) ||
        item.division.toLowerCase().includes(searchDailyQuery.toLowerCase());
      return matchShift && matchStatus && matchSearch;
    });
  }, [dailySiteDataset, selectedDailyShift, selectedDailyStatus, searchDailyQuery]);

  // Statistik Ringkasan Evaluasi Bulanan
  const summaryStats = useMemo(() => {
    const totalEmployees = siteDataset.length;
    const totalPossibleDays = siteDataset.reduce((acc, curr) => acc + (curr.workDays || 0), 0);
    const totalPresentDays = siteDataset.reduce((acc, curr) => acc + curr.presentDays, 0);
    const totalLateIncidents = siteDataset.reduce((acc, curr) => acc + curr.lateCount, 0);
    const totalLateMinutes = siteDataset.reduce((acc, curr) => acc + curr.totalLateMinutes, 0);
    const totalAlpa = siteDataset.reduce((acc, curr) => acc + curr.alpaDays, 0);

    const attendanceRate = totalPossibleDays > 0 ? ((totalPresentDays / totalPossibleDays) * 100).toFixed(1) : '0.0';
    const perfectCount = siteDataset.filter((e) => e.score === 100).length;
    const warningCount = siteDataset.filter((e) => e.status === 'Peringatan / SP').length;
    const coachingCount = siteDataset.filter((e) => e.status === 'Perlu Pembinaan').length;

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
  }, [siteDataset]);

  // Statistik Ringkasan Presensi Harian (Sinkron Roster Kerja)
  const dailySummaryStats = useMemo(() => {
    const totalPersonnel = dailySiteDataset.length;
    const liburCount = dailySiteDataset.filter((d) => d.status === 'Libur' || d.status === 'OFF').length;
    const scheduledPersonnel = totalPersonnel - liburCount;
    const presentCount = dailySiteDataset.filter((d) => d.status === 'Hadir' || d.status === 'Terlambat').length;
    const onTimeCount = dailySiteDataset.filter((d) => d.status === 'Hadir' && d.lateMinutes === 0).length;
    const lateCount = dailySiteDataset.filter((d) => d.status === 'Terlambat' || d.lateMinutes > 0).length;
    const totalLateMinutes = dailySiteDataset.reduce((acc, curr) => acc + (curr.lateMinutes || 0), 0);
    const cutiCount = dailySiteDataset.filter((d) => d.status === 'Cuti').length;
    const alpaCount = dailySiteDataset.filter((d) => d.status === 'Alpa' || d.status === 'Alpha').length;
    const absentCount = cutiCount + alpaCount;
    const attendanceRate = scheduledPersonnel > 0 ? ((presentCount / scheduledPersonnel) * 100).toFixed(1) : '0.0';

    return {
      totalPersonnel,
      scheduledPersonnel,
      liburCount,
      presentCount,
      onTimeCount,
      lateCount,
      totalLateMinutes,
      cutiCount,
      alpaCount,
      absentCount,
      attendanceRate,
    };
  }, [dailySiteDataset]);

  // Format Tanggal Indonesia
  const formatIndonesianDate = (dateString) => {
    if (!dateString) return '';
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        return date.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Data Grafik Per Divisi
  const divisionChartData = useMemo(() => {
    const divMap = {};
    siteDataset.forEach((emp) => {
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
  }, [siteDataset]);

  // Top Performers (100% On-Time) & Perhatian Khusus
  const topPerformers = useMemo(() => {
    return siteDataset.filter((e) => e.score === 100);
  }, [siteDataset]);

  const warningList = useMemo(() => {
    return siteDataset.filter((e) => e.status === 'Peringatan / SP' || e.status === 'Perlu Pembinaan');
  }, [siteDataset]);

  // Fungsi Ekspor Excel Bulanan
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

  // Fungsi Ekspor Excel Harian
  const handleExportDailyExcel = () => {
    const exportRows = filteredDailyData.map((item, index) => ({
      No: index + 1,
      NIP: item.nip,
      'Nama Karyawan': item.name,
      Jabatan: item.role,
      Divisi: item.division,
      Lokasi: item.location,
      'Shift Kerja': item.shift,
      'Jam Masuk': item.checkIn,
      'Jam Pulang': item.checkOut,
      Keterlambatan: item.lateMinutes > 0 ? `${item.lateMinutes} Menit` : 'Tepat Waktu',
      Status: item.status,
      'Keterangan Operasional': item.notes,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Presensi Harian');

    const colWidths = [
      { wch: 4 },
      { wch: 12 },
      { wch: 22 },
      { wch: 24 },
      { wch: 24 },
      { wch: 20 },
      { wch: 30 },
      { wch: 14 },
      { wch: 14 },
      { wch: 16 },
      { wch: 14 },
      { wch: 35 },
    ];
    worksheet['!cols'] = colWidths;

    const dateLabel = (selectedDailyDate || 'harian').replace(/-/g, '_');
    XLSX.writeFile(workbook, `Rekap_Presensi_Harian_${dateLabel}.xlsx`);
  };

  const resetFilters = () => {
    setSelectedDivision('ALL');
    setSelectedStatus('ALL');
    setSearchQuery('');
  };

  const resetDailyFilters = () => {
    setSelectedDailyShift('ALL');
    setSelectedDailyStatus('ALL');
    setSearchDailyQuery('');
  };

  // Helper Badge Status Evaluasi Bulanan
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

  // Helper Badge Status Presensi Harian
  const renderDailyStatusBadge = (status) => {
    switch (status) {
      case 'Hadir':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 inline" />
            Hadir
          </Badge>
        );
      case 'Terlambat':
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
            <Clock className="w-3 h-3 mr-1 text-amber-600 inline" />
            Terlambat
          </Badge>
        );
      case 'Cuti':
        return (
          <Badge className="bg-sky-50 text-sky-700 border-sky-200 font-medium">
            <Calendar className="w-3 h-3 mr-1 text-sky-600 inline" />
            Cuti
          </Badge>
        );
      case 'Izin':
      case 'Sakit':
        return (
          <Badge className="bg-purple-50 text-purple-700 border-purple-200 font-medium">
            <Info className="w-3 h-3 mr-1 text-purple-600 inline" />
            {status}
          </Badge>
        );
      case 'Alpa':
      case 'Alpha':
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-medium">
            <AlertTriangle className="w-3 h-3 mr-1 text-rose-600 inline" />
            Alpa
          </Badge>
        );
      case 'Libur':
      case 'OFF':
        return (
          <Badge className="bg-slate-100 text-slate-600 border-slate-200 font-medium">
            <RotateCcw className="w-3 h-3 mr-1 text-slate-500 inline" />
            Libur (OFF)
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
          <div className="flex items-center gap-2.5 print:hidden">
            {activeTab === 'organisasi' && (
              <>
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

                <PrintButton
                  label="Cetak Laporan Rekap"
                  onClick={() => setShowPrintModal(true)}
                />
              </>
            )}

            {activeTab === 'harian' && (
              <>
                <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
                  <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="date"
                    value={selectedDailyDate}
                    onChange={(e) => setSelectedDailyDate(e.target.value)}
                    className="text-xs font-semibold text-navy bg-transparent border-0 focus:ring-0 cursor-pointer p-0"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportDailyExcel}
                  className="gap-1.5 border-emerald-600/30 text-emerald-800 hover:bg-emerald-50 bg-white"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Ekspor Harian (XLSX)</span>
                </Button>

                <PrintButton
                  label="Cetak Rekap Harian"
                  onClick={() => setShowPrintModal(true)}
                />
              </>
            )}

            {activeTab === 'individu' && (
              <PrintButton
                label="Cetak Rapor Kehadiran"
                onClick={() => setShowPrintModal(true)}
              />
            )}
          </div>
        }
      />

      {/* Tab Switcher: Tab 1 Bulanan, Tab 2 Harian, Tab 3 Rapor */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 mb-6 overflow-x-auto no-scrollbar print:hidden">
        <button
          type="button"
          onClick={() => setActiveTab('organisasi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'organisasi'
              ? 'bg-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-navy hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Rekap Kehadiran Bulanan</span>
          <Badge className={activeTab === 'organisasi' ? 'bg-white/20 text-white font-mono text-[10px]' : 'bg-slate-200 text-slate-700 text-[10px]'}>
            {siteDataset.length} Karyawan
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('harian')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'harian'
              ? 'bg-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-navy hover:bg-slate-100'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Rekap Kehadiran Harian</span>
          <Badge className={activeTab === 'harian' ? 'bg-white/20 text-white font-mono text-[10px]' : 'bg-slate-200 text-slate-700 text-[10px]'}>
            {dailySiteDataset.length} Personil
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('individu')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'individu'
              ? 'bg-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-navy hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Rapor Kehadiran</span>
          {selectedEmployee && (
            <span className={`text-[11px] font-normal ${activeTab === 'individu' ? 'text-[#c4a266]' : 'text-slate-400'}`}>
              • {selectedEmployee.name}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'organisasi' && (
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
          <TableToolbar className="print:hidden">
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
                <TableRow className="bg-slate-50/80 border-b border-slate-200">
                  <TableHead className="w-12 text-center text-[11px] font-bold text-slate-700 tracking-wider">NO</TableHead>
                  <TableHead className="min-w-[190px] text-[11px] font-bold text-slate-700 tracking-wider">KARYAWAN</TableHead>
                  <TableHead className="min-w-[150px] text-[11px] font-bold text-slate-700 tracking-wider">DIVISI</TableHead>
                  <TableHead className="min-w-[140px] text-[11px] font-bold text-slate-700 tracking-wider">LOKASI</TableHead>
                  <TableHead className="text-center text-[11px] font-bold text-slate-700 tracking-wider w-36">KEHADIRAN</TableHead>
                  <TableHead className="text-center text-[11px] font-bold text-slate-700 tracking-wider w-28">TERLAMBAT</TableHead>
                  <TableHead className="text-center text-[11px] font-bold text-slate-700 tracking-wider w-28">CUTI / SAKIT</TableHead>
                  <TableHead className="text-center text-[11px] font-bold text-slate-700 tracking-wider w-20">ALPA</TableHead>
                  <TableHead className="text-center text-[11px] font-bold text-slate-700 tracking-wider w-28">SKOR DISIPLIN</TableHead>
                  <TableHead className="text-center text-[11px] font-bold text-slate-700 tracking-wider w-32">STATUS EVALUASI</TableHead>
                  <TableHead className="text-right pr-4 text-[11px] font-bold text-slate-700 tracking-wider w-20 print:hidden">AKSI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableEmpty colSpan={11} message="Tidak ada data evaluasi karyawan yang cocok dengan kriteria filter." />
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
                          <span className="font-medium text-slate-800 text-xs">{emp.division}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-slate-600 text-xs whitespace-nowrap">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{emp.location}</span>
                          </div>
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
                        <TableCell className="text-right pr-4 print:hidden">
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
            <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 print:bg-white print:border-slate-300">
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
      )}

      {activeTab === 'harian' && (
        <div className="space-y-6">
          {/* Banner Prinsip Operasional Presensi Harian */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700">
              <div className="w-6 h-6 rounded-lg bg-navy/10 text-navy flex items-center justify-center font-bold text-[11px] shrink-0">
                <CalendarCheck className="w-3.5 h-3.5 text-navy" />
              </div>
              <span>
                <strong>Rekapitulasi Presensi Operasional Harian:</strong> Pencatatan kehadiran real-time per shift, log masuk/pulang, deviasi jam kerja, serta monitoring personil operasional.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge className="bg-navy/5 text-navy border-navy/20 text-[10px]">
                {formatIndonesianDate(selectedDailyDate)}
              </Badge>
              <Badge className="bg-[#f7f2e8] text-[#8e6e30] border-[#c4a266]/30 text-[10px]">
                {activeSite.name}
              </Badge>
            </div>
          </div>

          {/* 4 Kartu KPI Ringkasan Harian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-slate-200 shadow-2xs">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total Personil Hadir
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-display text-navy">
                      {dailySummaryStats.presentCount}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      / {dailySummaryStats.scheduledPersonnel} Terjadwal ({dailySummaryStats.attendanceRate}%)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {dailySummaryStats.liburCount} personil jadwal libur roster (OFF)
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
                    Hadir Tepat Waktu
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-display text-[#c4a266]">
                      {dailySummaryStats.onTimeCount}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600 flex items-center">
                      <Sparkles className="w-3 h-3 mr-0.5 inline" /> Disiplin Prima
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Nihil keterlambatan shift
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
                    Keterlambatan Shift
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-display text-amber-600">
                      {dailySummaryStats.lateCount}
                    </span>
                    <span className="text-[11px] text-amber-700 font-medium">
                      ({dailySummaryStats.totalLateMinutes} menit)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Total akumulasi keterlambatan
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
                    Tidak Hadir (Cuti / Alpa)
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-display text-rose-600">
                      {dailySummaryStats.absentCount}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      ({dailySummaryStats.cutiCount} Cuti, {dailySummaryStats.alpaCount} Alpa)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Personil berhalangan operasional
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabel Master Presensi Harian */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-navy" />
                  Lembar Log Presensi & Shift Harian
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Daftar pencatatan presensi personil operasional dan staf per shift untuk tanggal {formatIndonesianDate(selectedDailyDate)}.
                </CardDescription>
              </div>
              <Badge variant="neutral" className="text-xs self-start sm:self-auto font-medium">
                Total {filteredDailyData.length} Personil
              </Badge>
            </CardHeader>

            {/* Atomic Table Toolbar & Filter Group */}
            <TableToolbar className="print:hidden">
              <TableSearch
                placeholder="Cari nama karyawan, NIP, atau divisi..."
                value={searchDailyQuery}
                onChange={(e) => setSearchDailyQuery(e.target.value)}
              />

              <TableFilterGroup>
                {/* Filter Shift */}
                <TableSelect
                  value={selectedDailyShift}
                  onChange={(e) => setSelectedDailyShift(e.target.value)}
                  title="Filter Shift Kerja"
                >
                  <option value="ALL">Semua Shift</option>
                  <option value="Shift 1">Shift 1 (Pagi)</option>
                  <option value="Shift 2">Shift 2 (Siang/Malam)</option>
                  <option value="Reguler">Reguler Kantor</option>
                </TableSelect>

                {/* Filter Status */}
                <TableSelect
                  value={selectedDailyStatus}
                  onChange={(e) => setSelectedDailyStatus(e.target.value)}
                  title="Filter Status Kehadiran"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="Hadir">Hadir</option>
                  <option value="Terlambat">Terlambat</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Alpa">Alpa</option>
                  <option value="Libur">Libur Roster (OFF)</option>
                </TableSelect>

                {/* Tombol Reset Filter */}
                {(searchDailyQuery || selectedDailyShift !== 'ALL' || selectedDailyStatus !== 'ALL') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetDailyFilters}
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
                  <TableRow className="bg-slate-50/80 border-b border-slate-200">
                    <TableHead className="w-12 text-center text-[11px] font-bold text-slate-700 tracking-wider">NO</TableHead>
                    <TableHead className="min-w-[190px] text-[11px] font-bold text-slate-700 tracking-wider">KARYAWAN</TableHead>
                    <TableHead className="min-w-[150px] text-[11px] font-bold text-slate-700 tracking-wider">DIVISI</TableHead>
                    <TableHead className="min-w-[140px] text-[11px] font-bold text-slate-700 tracking-wider">LOKASI</TableHead>
                    <TableHead className="min-w-[170px] text-[11px] font-bold text-slate-700 tracking-wider">SHIFT KERJA</TableHead>
                    <TableHead className="text-center text-[11px] font-bold text-slate-700 tracking-wider w-24">MASUK</TableHead>
                    <TableHead className="text-center text-[11px] font-bold text-slate-700 tracking-wider w-24">PULANG</TableHead>
                    <TableHead className="text-center text-[11px] font-bold text-slate-700 tracking-wider w-28">DEVIASI</TableHead>
                    <TableHead className="text-center text-[11px] font-bold text-slate-700 tracking-wider w-28">STATUS</TableHead>
                    <TableHead className="min-w-[180px] text-[11px] font-bold text-slate-700 tracking-wider">KETERANGAN</TableHead>
                    <TableHead className="text-right pr-4 text-[11px] font-bold text-slate-700 tracking-wider w-24 print:hidden">AKSI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDailyData.length === 0 ? (
                    <TableEmpty colSpan={11} message="Tidak ada personil yang cocok dengan kriteria filter presensi harian." />
                  ) : (
                    filteredDailyData.map((item, index) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <TableCell className="text-center font-medium text-slate-500 text-xs">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-bold text-navy text-xs">{item.name}</p>
                            <p className="text-[11px] text-slate-500">{item.nip} • {item.role}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-slate-800 text-xs">{item.division}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-slate-600 text-xs whitespace-nowrap">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-slate-700 font-medium">{item.shift}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-xs font-mono ${item.checkIn !== '-' ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
                            {item.checkIn}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-xs font-mono ${item.checkOut !== '-' ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
                            {item.checkOut}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.lateMinutes > 0 ? (
                            <span className="font-semibold text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {item.deviation}
                            </span>
                          ) : item.status === 'Hadir' ? (
                            <span className="text-xs text-emerald-700 font-medium">
                              {item.deviation}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {renderDailyStatusBadge(item.status)}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-slate-600 leading-relaxed">{item.notes}</span>
                        </TableCell>
                        <TableCell className="text-right pr-4 print:hidden">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEmployeeId(item.employeeId);
                              setActiveTab('individu');
                            }}
                            className="h-7 text-xs px-2.5 gap-1.5 text-navy border-slate-300 hover:bg-slate-100"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#c4a266]" />
                            <span>Buka Rapor</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Footer Table Info */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 print:bg-white print:border-slate-300">
                <div>
                  Menampilkan <strong>{filteredDailyData.length}</strong> dari total <strong>{dailySiteDataset.length}</strong> personil pada tanggal {formatIndonesianDate(selectedDailyDate)}
                </div>
                <div className="text-[11px] text-slate-400">
                  Sinkronisasi sistem: Real-time sync • {activeSite.name}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'individu' && (
        <RaporIndividu
          employee={selectedEmployee}
          allEmployees={siteDataset}
          onSelectEmployee={setSelectedEmployeeId}
          selectedPeriod={selectedPeriod}
          onBackToOrganization={() => setActiveTab('organisasi')}
          onOpenPrintModal={() => setShowPrintModal(true)}
        />
      )}

      {/* Modal Pratinjau & Cetak Dokumen Laporan Resmi (Komponen Atomik) */}
      <PrintPreviewModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        title={
          activeTab === 'organisasi'
            ? `Laporan Rekapitulasi Kehadiran (${AVAILABLE_PERIODS.find((p) => p.value === selectedPeriod)?.label || selectedPeriod})`
            : activeTab === 'harian'
            ? `Laporan Presensi Harian Operasional (${formatIndonesianDate(selectedDailyDate)})`
            : `Rapor Kehadiran Individu - ${selectedEmployee.name} (${selectedEmployee.nip})`
        }
        documentTitle={
          activeTab === 'organisasi'
            ? `LAPORAN REKAPITULASI KEHADIRAN BULANAN — ${AVAILABLE_PERIODS.find((p) => p.value === selectedPeriod)?.label || selectedPeriod}`
            : activeTab === 'harian'
            ? `LAPORAN REKAPITULASI PRESENSI HARIAN OPERASIONAL — ${formatIndonesianDate(selectedDailyDate)}`
            : `RAPOR EVALUASI KEDISIPLINAN INDIVIDU — ${selectedEmployee.name}`
        }
      >
        {activeTab === 'organisasi' && (
          <div>
            <ReportHeader
              documentTitle={`LAPORAN REKAPITULASI & EVALUASI KEHADIRAN BULANAN — ${AVAILABLE_PERIODS.find((p) => p.value === selectedPeriod)?.label || selectedPeriod}`}
              siteName={activeSite.name}
            />

            <ReportMetaGrid
              items={[
                {
                  label: 'Periode Evaluasi',
                  value: AVAILABLE_PERIODS.find((p) => p.value === selectedPeriod)?.label || selectedPeriod,
                },
                { label: 'Unit Operasional', value: activeSite.name },
                { label: 'Hari Kerja Efektif', value: '22 Hari Kerja' },
                { label: 'Total Personil', value: `${filteredData.length} Karyawan` },
              ]}
            />

            {/* Ringkasan Eksekutif KPI Laporan */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Rata-rata Kehadiran</p>
                <p className="text-base font-bold text-navy mt-0.5">{summaryStats.attendanceRate}%</p>
              </div>
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Hadir 100% (Teladan)</p>
                <p className="text-base font-bold text-[#c4a266] mt-0.5">{summaryStats.perfectCount} Orang</p>
              </div>
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Total Keterlambatan</p>
                <p className="text-base font-bold text-amber-600 mt-0.5">
                  {summaryStats.totalLateIncidents}x ({summaryStats.totalLateMinutes} mnt)
                </p>
              </div>
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Perhatian Disiplin / SP</p>
                <p className="text-base font-bold text-rose-600 mt-0.5">
                  {summaryStats.warningCount + summaryStats.coachingCount} Karyawan
                </p>
              </div>
            </div>

            {/* Tabel Data Rekapitulasi Cetak Laporan */}
            <table className="w-full text-[10px] border-collapse border border-slate-300 mb-4">
              <thead>
                <tr className="bg-slate-100 text-slate-800 uppercase font-bold text-[9px] border-b border-slate-300">
                  <th className="p-1.5 border border-slate-300 text-center w-7">NO</th>
                  <th className="p-1.5 border border-slate-300 text-left">NIP & NAMA</th>
                  <th className="p-1.5 border border-slate-300 text-left">JABATAN</th>
                  <th className="p-1.5 border border-slate-300 text-left">DIVISI</th>
                  <th className="p-1.5 border border-slate-300 text-left">LOKASI</th>
                  <th className="p-1.5 border border-slate-300 text-center">HADIR</th>
                  <th className="p-1.5 border border-slate-300 text-center">TELAT</th>
                  <th className="p-1.5 border border-slate-300 text-center">CUTI/IZIN</th>
                  <th className="p-1.5 border border-slate-300 text-center">ALPA</th>
                  <th className="p-1.5 border border-slate-300 text-center">SKOR</th>
                  <th className="p-1.5 border border-slate-300 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((emp, index) => (
                  <tr key={emp.id} className="border-b border-slate-200">
                    <td className="p-1.5 border border-slate-300 text-center text-slate-600">{index + 1}</td>
                    <td className="p-1.5 border border-slate-300 font-bold text-navy">
                      {emp.name} <span className="font-normal text-slate-500 text-[9px]">({emp.nip})</span>
                    </td>
                    <td className="p-1.5 border border-slate-300 text-slate-700">{emp.role}</td>
                    <td className="p-1.5 border border-slate-300 text-slate-700">{emp.division}</td>
                    <td className="p-1.5 border border-slate-300 text-slate-600">{emp.location}</td>
                    <td className="p-1.5 border border-slate-300 text-center font-semibold">
                      {emp.presentDays}/{emp.workDays} ({((emp.presentDays / emp.workDays) * 100).toFixed(0)}%)
                    </td>
                    <td className="p-1.5 border border-slate-300 text-center">
                      {emp.lateCount > 0 ? `${emp.lateCount}x (${emp.totalLateMinutes}m)` : '-'}
                    </td>
                    <td className="p-1.5 border border-slate-300 text-center">
                      {emp.leaveDays > 0 ? `${emp.leaveDays}h` : '-'}
                    </td>
                    <td className="p-1.5 border border-slate-300 text-center font-bold text-rose-600">
                      {emp.alpaDays > 0 ? `${emp.alpaDays}` : '-'}
                    </td>
                    <td className="p-1.5 border border-slate-300 text-center font-bold text-navy">
                      {emp.score}%
                    </td>
                    <td className="p-1.5 border border-slate-300 text-center font-medium">
                      {emp.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Lembar Pengesahan Resmi */}
            <ReportSignature
              signers={[
                {
                  role: 'Dibuat & Diverifikasi Oleh:',
                  title: 'Staf / Specialist HCGA',
                  name: 'Siti Rahmawati, S.Psi',
                  id: 'NIP: HC-0102',
                },
                {
                  role: 'Mengetahui & Menyetujui:',
                  title: 'Head of Human Capital & GA',
                  name: 'Bambang Wicaksono, M.M.',
                  id: 'Head of Operational & HC',
                },
              ]}
            />
          </div>
        )}

        {activeTab === 'harian' && (
          <div>
            <ReportHeader
              documentTitle="LAPORAN REKAPITULASI PRESENSI HARIAN OPERASIONAL"
              siteName={activeSite.name}
              printDate={formatIndonesianDate(selectedDailyDate)}
            />

            <ReportMetaGrid
              items={[
                { label: 'Tanggal Operasional', value: formatIndonesianDate(selectedDailyDate) },
                { label: 'Unit Operasional', value: activeSite.name },
                {
                  label: 'Filter Shift Terpilih',
                  value: selectedDailyShift === 'ALL' ? 'Semua Shift Operasional' : selectedDailyShift,
                },
                { label: 'Total Personil Terjadwal', value: `${filteredDailyData.length} Personil` },
              ]}
            />

            {/* Ringkasan Eksekutif KPI Harian */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Total Hadir</p>
                <p className="text-base font-bold text-navy mt-0.5">
                  {dailySummaryStats.presentCount} / {dailySummaryStats.totalPersonnel} Personil
                </p>
              </div>
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Tepat Waktu</p>
                <p className="text-base font-bold text-emerald-600 mt-0.5">
                  {dailySummaryStats.onTimeCount} Personil
                </p>
              </div>
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Terlambat</p>
                <p className="text-base font-bold text-amber-600 mt-0.5">
                  {dailySummaryStats.lateCount} Personil ({dailySummaryStats.totalLateMinutes} mnt)
                </p>
              </div>
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Berhalangan (Cuti/Alpa)</p>
                <p className="text-base font-bold text-rose-600 mt-0.5">
                  {dailySummaryStats.absentCount} Personil
                </p>
              </div>
            </div>

            {/* Tabel Data Rekapitulasi Presensi Harian Cetak */}
            <table className="w-full text-[10px] border-collapse border border-slate-300 mb-4">
              <thead>
                <tr className="bg-slate-100 text-slate-800 uppercase font-bold text-[9px] border-b border-slate-300">
                  <th className="p-1.5 border border-slate-300 text-center w-7">NO</th>
                  <th className="p-1.5 border border-slate-300 text-left">NIP & NAMA</th>
                  <th className="p-1.5 border border-slate-300 text-left">DIVISI</th>
                  <th className="p-1.5 border border-slate-300 text-left">LOKASI</th>
                  <th className="p-1.5 border border-slate-300 text-left">SHIFT KERJA</th>
                  <th className="p-1.5 border border-slate-300 text-center">MASUK</th>
                  <th className="p-1.5 border border-slate-300 text-center">PULANG</th>
                  <th className="p-1.5 border border-slate-300 text-center">DEVIASI</th>
                  <th className="p-1.5 border border-slate-300 text-center">STATUS</th>
                  <th className="p-1.5 border border-slate-300 text-left">KETERANGAN OPERASIONAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredDailyData.map((item, index) => (
                  <tr key={item.id} className="border-b border-slate-200">
                    <td className="p-1.5 border border-slate-300 text-center text-slate-600">{index + 1}</td>
                    <td className="p-1.5 border border-slate-300 font-bold text-navy">
                      {item.name} <span className="font-normal text-slate-500 text-[9px]">({item.nip})</span>
                    </td>
                    <td className="p-1.5 border border-slate-300 text-slate-700">{item.division}</td>
                    <td className="p-1.5 border border-slate-300 text-slate-600">{item.location}</td>
                    <td className="p-1.5 border border-slate-300 text-slate-700 font-medium">{item.shift}</td>
                    <td className="p-1.5 border border-slate-300 text-center font-mono">{item.checkIn}</td>
                    <td className="p-1.5 border border-slate-300 text-center font-mono">{item.checkOut}</td>
                    <td className="p-1.5 border border-slate-300 text-center">
                      {item.lateMinutes > 0 ? (
                        <span className="font-semibold text-amber-700">{item.deviation}</span>
                      ) : item.status === 'Hadir' ? (
                        <span className="text-emerald-700 font-medium">{item.deviation}</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-1.5 border border-slate-300 text-center font-semibold">
                      {item.status}
                    </td>
                    <td className="p-1.5 border border-slate-300 text-slate-600 text-[9px]">
                      {item.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Lembar Pengesahan Resmi 3 Pihak */}
            <ReportSignature
              columns={3}
              signers={[
                {
                  role: 'Dibuat Oleh (Danru / Pengawas):',
                  title: 'Danru Keamanan & K3 Lapangan',
                  name: 'Hendra Wijaya',
                  id: 'Danru Operasional Shift',
                },
                {
                  role: 'Diverifikasi Oleh (HCGA):',
                  title: 'Human Capital Specialist',
                  name: 'Siti Rahmawati, S.Psi',
                  id: 'NIP: HC-0102',
                },
                {
                  role: 'Mengetahui & Menyetujui:',
                  title: 'Head of Operations & Unit Head',
                  name: 'Bambang Wicaksono, M.M.',
                  id: 'Head of Operational & HC',
                },
              ]}
            />
          </div>
        )}

        {activeTab === 'individu' && (
          <div>
            <ReportHeader
              documentTitle={`RAPOR EVALUASI KEDISIPLINAN INDIVIDU — ${selectedEmployee.name}`}
              siteName={selectedEmployee.location}
            />

            <ReportMetaGrid
              items={[
                { label: 'Nama Karyawan', value: selectedEmployee.name },
                { label: 'Nomor Induk (NIP)', value: selectedEmployee.nip },
                { label: 'Jabatan / Posisi', value: selectedEmployee.role },
                { label: 'Divisi Kerja', value: selectedEmployee.division },
                { label: 'Lokasi Operasional', value: selectedEmployee.location },
                {
                  label: 'Periode Evaluasi',
                  value: AVAILABLE_PERIODS.find((p) => p.value === selectedPeriod)?.label || selectedPeriod,
                },
                { label: 'Skor Kedisiplinan', value: `${selectedEmployee.score}%` },
                { label: 'Status Disiplin', value: selectedEmployee.status },
              ]}
            />

            {/* Kotak Rekomendasi Tindakan Manajemen */}
            <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 mb-4 text-xs text-amber-950">
              <strong className="font-bold">Rekomendasi Tindakan Manajemen:</strong>{' '}
              <span className="text-amber-900">{selectedEmployee.actionRecommendation}</span>
            </div>

            {/* Matriks Ringkasan Presensi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 text-xs">
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Total Kehadiran</p>
                <p className="text-sm font-bold text-navy mt-0.5">
                  {selectedEmployee.presentDays} dari {selectedEmployee.workDays} Hari ({((selectedEmployee.presentDays / selectedEmployee.workDays) * 100).toFixed(0)}%)
                </p>
              </div>
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Keterlambatan</p>
                <p className="text-sm font-bold text-amber-700 mt-0.5">
                  {selectedEmployee.lateCount} Kali ({selectedEmployee.totalLateMinutes} Menit)
                </p>
              </div>
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Cuti & Alpa</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {selectedEmployee.leaveDays} Cuti / Izin • {selectedEmployee.alpaDays} Alpa
                </p>
              </div>
            </div>

            {/* Log Insiden & Catatan Pembinaan */}
            <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
              <div className="bg-slate-100 px-3 py-1.5 font-bold text-[11px] text-slate-800 border-b border-slate-200">
                Catatan Presensi & Log Pembinaan HCGA Periode Ini
              </div>
              <div className="p-3 text-xs space-y-1.5">
                {selectedEmployee.incidents && selectedEmployee.incidents.length > 0 ? (
                  selectedEmployee.incidents.map((inc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b border-slate-100 pb-1 last:border-0 last:pb-0"
                    >
                      <span className="font-semibold text-slate-800">
                        {inc.date} — {inc.type}
                      </span>
                      <span className="text-slate-600">{inc.detail}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic">
                    Tidak ada catatan indisipliner pada periode ini (Keteladanan Sempurna).
                  </p>
                )}
              </div>
            </div>

            {/* Lembar Pengesahan Rapor */}
            <ReportSignature
              columns={3}
              signers={[
                {
                  role: 'Karyawan Yang Bersangkutan:',
                  title: selectedEmployee.role,
                  name: selectedEmployee.name,
                  id: `NIP: ${selectedEmployee.nip}`,
                },
                {
                  role: 'Diverifikasi HCGA:',
                  title: 'Human Capital Specialist',
                  name: 'Siti Rahmawati, S.Psi',
                  id: 'NIP: HC-0102',
                },
                {
                  role: 'Atasan Langsung / Danru:',
                  title: 'Supervisor Unit',
                  name: 'Hendra Wijaya',
                  id: 'Danru / Koordinator',
                },
              ]}
            />
          </div>
        )}
      </PrintPreviewModal>
      
    </>
  );
}
