import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import * as XLSX from 'xlsx';
import {
  CalendarCheck,
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CalendarX2,
  Search,
  Filter,
  RotateCcw,
  FileSpreadsheet,
  Pencil,
  Trash2,
  Building,
  MapPin,
  Sparkles,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Input,
  PageHeader,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableEmpty,
  Text,
  TableToolbar,
  TableSearch,
  TableFilterGroup,
  TableSelect,
} from '@/components/ui';
import ModalFormPresensi from './Partials/ModalFormPresensi.jsx';
import ModalPresensiMassal from './Partials/ModalPresensiMassal.jsx';

// Data Induk Karyawan HCGA (Sinkron dengan DataKaryawan)
const MASTER_EMPLOYEES = [
  {
    id: 1,
    name: 'Budi Santoso',
    nip: 'HC-0101',
    role: 'Senior Operator Lapangan',
    division: 'Operasional & Lapangan',
    location: 'Pabrik A (Sidoarjo)',
    group: 'Grup A',
    scheduleCategory: 'Shift 1 (Pagi)',
    checkInTime: '07:00',
    checkOutTime: '15:00',
    status: 'Aktif',
  },
  {
    id: 2,
    name: 'Siti Rahmawati',
    nip: 'HC-0102',
    role: 'HCGA Specialist',
    division: 'Human Capital & GA',
    location: 'Kantor Utama (Surabaya)',
    group: 'Non-Shift',
    scheduleCategory: 'Normal Office',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    status: 'Aktif',
  },
  {
    id: 3,
    name: 'Ahmad Fauzi',
    nip: 'HC-0103',
    role: 'Operator Forklift Utama',
    division: 'Logistik & Gudang',
    location: 'Gudang B (Rungkut)',
    group: 'Grup B',
    scheduleCategory: 'Shift 2 (Siang)',
    checkInTime: '15:00',
    checkOutTime: '23:00',
    status: 'Aktif',
  },
  {
    id: 4,
    name: 'Dewi Anggraini',
    nip: 'HC-0104',
    role: 'Quality Assurance Inspector',
    division: 'Operasional & Lapangan',
    location: 'Pabrik A (Sidoarjo)',
    group: 'Grup A',
    scheduleCategory: 'Shift 1 (Pagi)',
    checkInTime: '07:00',
    checkOutTime: '15:00',
    status: 'Aktif',
  },
  {
    id: 5,
    name: 'Hendra Wijaya',
    nip: 'HC-0105',
    role: 'Danru Keamanan & K3',
    division: 'Security & Safety',
    location: 'Site Operasional (Gresik)',
    group: 'Grup A',
    scheduleCategory: 'Shift 1 (Pagi)',
    checkInTime: '06:30',
    checkOutTime: '14:30',
    status: 'Aktif',
  },
  {
    id: 6,
    name: 'Rina Marlina',
    nip: 'HC-0106',
    role: 'Staf Administrasi Payroll',
    division: 'Human Capital & GA',
    location: 'Kantor Utama (Surabaya)',
    group: 'Non-Shift',
    scheduleCategory: 'Normal Office',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    status: 'Cuti',
  },
  {
    id: 7,
    name: 'Eko Prasetyo',
    nip: 'HC-0107',
    role: 'Teknisi Maintenance Mesin',
    division: 'Operasional & Lapangan',
    location: 'Pabrik A (Sidoarjo)',
    group: 'Grup B',
    scheduleCategory: 'Shift 2 (Siang)',
    checkInTime: '15:00',
    checkOutTime: '23:00',
    status: 'Aktif',
  },
  {
    id: 8,
    name: 'Maya Indah Lestari',
    nip: 'HC-0108',
    role: 'Koordinator Gudang Bahan Baku',
    division: 'Logistik & Gudang',
    location: 'Gudang B (Rungkut)',
    group: 'Non-Shift',
    scheduleCategory: 'Normal Office',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    status: 'Aktif',
  },
  {
    id: 9,
    name: 'Joko Susilo',
    nip: 'HC-0109',
    role: 'Anggota Patroli Keamanan',
    division: 'Security & Safety',
    location: 'Pabrik A (Sidoarjo)',
    group: 'Grup B',
    scheduleCategory: 'Shift 2 (Siang)',
    checkInTime: '14:30',
    checkOutTime: '22:30',
    status: 'Aktif',
  },
  {
    id: 10,
    name: 'Dian Kusuma',
    nip: 'HC-0110',
    role: 'IT Support & Sistem HRIS',
    division: 'Human Capital & GA',
    location: 'Kantor Utama (Surabaya)',
    group: 'Non-Shift',
    scheduleCategory: 'Normal Office',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    status: 'Aktif',
  },
  {
    id: 11,
    name: 'Wahyu Hidayat',
    nip: 'HC-0111',
    role: 'Operator Mesin CNC Milling',
    division: 'Operasional & Lapangan',
    location: 'Pabrik A (Sidoarjo)',
    group: 'Grup A',
    scheduleCategory: 'Shift 1 (Pagi)',
    checkInTime: '07:00',
    checkOutTime: '15:00',
    status: 'Aktif',
  },
  {
    id: 12,
    name: 'Nurul Aini',
    nip: 'HC-0112',
    role: 'Petugas Inventory & Stok',
    division: 'Logistik & Gudang',
    location: 'Gudang B (Rungkut)',
    group: 'Grup A',
    scheduleCategory: 'Shift 1 (Pagi)',
    checkInTime: '07:00',
    checkOutTime: '15:00',
    status: 'Aktif',
  },
];

// Tanggal hari ini standar WIB (YYYY-MM-DD)
const getTodayDateString = () => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
};

const DEFAULT_DATE = getTodayDateString();

// Data Awal Presensi Operasional
const INITIAL_ATTENDANCES = [
  {
    id: 101,
    employeeId: 1,
    employeeName: 'Budi Santoso',
    nip: 'HC-0101',
    division: 'Operasional & Lapangan',
    role: 'Senior Operator Lapangan',
    date: DEFAULT_DATE,
    shift: 'Shift 1 (07:00 - 15:00)',
    status: 'Hadir',
    checkIn: '06:51',
    checkOut: '15:05',
    lateMinutes: 0,
    deviation: 'Tepat Waktu',
    notes: 'Shift pagi berjalan lancar',
  },
  {
    id: 102,
    employeeId: 2,
    employeeName: 'Siti Rahmawati',
    nip: 'HC-0102',
    division: 'Human Capital & GA',
    role: 'HCGA Specialist',
    date: DEFAULT_DATE,
    shift: 'Normal Office (08:00 - 17:00)',
    status: 'Hadir',
    checkIn: '07:48',
    checkOut: '17:10',
    lateMinutes: 0,
    deviation: 'Tepat Waktu',
    notes: 'Tugas rekrutmen internal',
  },
  {
    id: 103,
    employeeId: 3,
    employeeName: 'Ahmad Fauzi',
    nip: 'HC-0103',
    division: 'Logistik & Gudang',
    role: 'Operator Forklift Utama',
    date: DEFAULT_DATE,
    shift: 'Shift 2 (15:00 - 23:00)',
    status: 'Terlambat',
    checkIn: '15:18',
    checkOut: '23:05',
    lateMinutes: 18,
    deviation: '+18m',
    notes: 'Kendala macet jalur Rungkut',
  },
  {
    id: 104,
    employeeId: 4,
    employeeName: 'Dewi Anggraini',
    nip: 'HC-0104',
    division: 'Operasional & Lapangan',
    role: 'Quality Assurance Inspector',
    date: DEFAULT_DATE,
    shift: 'Shift 1 (07:00 - 15:00)',
    status: 'Hadir',
    checkIn: '06:55',
    checkOut: '15:00',
    lateMinutes: 0,
    deviation: 'Tepat Waktu',
    notes: 'Inspeksi jalur produksi A',
  },
  {
    id: 105,
    employeeId: 5,
    employeeName: 'Hendra Wijaya',
    nip: 'HC-0105',
    division: 'Security & Safety',
    role: 'Danru Keamanan & K3',
    date: DEFAULT_DATE,
    shift: 'Security Shift 1 (06:30 - 14:30)',
    status: 'Hadir',
    checkIn: '06:20',
    checkOut: '14:35',
    lateMinutes: 0,
    deviation: 'Tepat Waktu',
    notes: 'Serah terima pos jaga pagi',
  },
  {
    id: 106,
    employeeId: 6,
    employeeName: 'Rina Marlina',
    nip: 'HC-0106',
    division: 'Human Capital & GA',
    role: 'Staf Administrasi Payroll',
    date: DEFAULT_DATE,
    shift: 'Normal Office (08:00 - 17:00)',
    status: 'Cuti',
    checkIn: '-',
    checkOut: '-',
    lateMinutes: 0,
    deviation: '-',
    notes: 'Cuti tahunan (Disetujui HR)',
  },
  {
    id: 107,
    employeeId: 7,
    employeeName: 'Eko Prasetyo',
    nip: 'HC-0107',
    division: 'Operasional & Lapangan',
    role: 'Teknisi Maintenance Mesin',
    date: DEFAULT_DATE,
    shift: 'Shift 2 (15:00 - 23:00)',
    status: 'Hadir',
    checkIn: '14:50',
    checkOut: '23:00',
    lateMinutes: 0,
    deviation: 'Tepat Waktu',
    notes: 'Maintenance preventif mesin 3',
  },
  {
    id: 108,
    employeeId: 8,
    employeeName: 'Maya Indah Lestari',
    nip: 'HC-0108',
    division: 'Logistik & Gudang',
    role: 'Koordinator Gudang Bahan Baku',
    date: DEFAULT_DATE,
    shift: 'Normal Office (08:00 - 17:00)',
    status: 'Hadir',
    checkIn: '07:55',
    checkOut: '17:02',
    lateMinutes: 0,
    deviation: 'Tepat Waktu',
    notes: 'Pemeriksaan stok harian',
  },
  {
    id: 109,
    employeeId: 9,
    employeeName: 'Joko Susilo',
    nip: 'HC-0109',
    division: 'Security & Safety',
    role: 'Anggota Patroli Keamanan',
    date: DEFAULT_DATE,
    shift: 'Security Shift 2 (14:30 - 22:30)',
    status: 'Hadir',
    checkIn: '14:25',
    checkOut: '22:35',
    lateMinutes: 0,
    deviation: 'Tepat Waktu',
    notes: 'Patroli perimeter site B',
  },
  {
    id: 110,
    employeeId: 10,
    employeeName: 'Dian Kusuma',
    nip: 'HC-0110',
    division: 'Human Capital & GA',
    role: 'IT Support & Sistem HRIS',
    date: DEFAULT_DATE,
    shift: 'Normal Office (08:00 - 17:00)',
    status: 'Terlambat',
    checkIn: '08:24',
    checkOut: '17:00',
    lateMinutes: 24,
    deviation: '+24m',
    notes: 'Penanganan server lokal kantor',
  },
  {
    id: 111,
    employeeId: 11,
    employeeName: 'Wahyu Hidayat',
    nip: 'HC-0111',
    division: 'Operasional & Lapangan',
    role: 'Operator Mesin CNC Milling',
    date: DEFAULT_DATE,
    shift: 'Shift 1 (07:00 - 15:00)',
    status: 'Alpha',
    checkIn: '-',
    checkOut: '-',
    lateMinutes: 0,
    deviation: '-',
    notes: 'Tanpa konfirmasi kehadiran',
  },
  {
    id: 112,
    employeeId: 12,
    employeeName: 'Nurul Aini',
    nip: 'HC-0112',
    division: 'Logistik & Gudang',
    role: 'Petugas Inventory & Stok',
    date: DEFAULT_DATE,
    shift: 'Shift 1 (07:00 - 15:00)',
    status: 'Sakit',
    checkIn: '-',
    checkOut: '-',
    lateMinutes: 0,
    deviation: '-',
    notes: 'Surat keterangan sakit faskes',
  },
];

export default function CatatanKehadiran() {
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE);
  const [attendances, setAttendances] = useState(INITIAL_ATTENDANCES);
  const [employees] = useState(MASTER_EMPLOYEES);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDivision, setFilterDivision] = useState('ALL');
  const [filterShift, setFilterShift] = useState('ALL');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isMassOpen, setIsMassOpen] = useState(false);

  // Toast Notifikasi
  const [alertInfo, setAlertInfo] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlertInfo({ message, type });
    setTimeout(() => setAlertInfo(null), 3500);
  };

  // Navigasi Tanggal
  const handleDateChange = (daysDelta) => {
    const current = new Date(`${selectedDate}T00:00:00Z`);
    current.setUTCDate(current.getUTCDate() + daysDelta);
    const newDate = current.toISOString().slice(0, 10);
    setSelectedDate(newDate);
  };

  const handleResetToToday = () => {
    setSelectedDate(DEFAULT_DATE);
  };

  // Format Nama Hari & Tanggal Bahasa Indonesia
  const formattedDateTitle = useMemo(() => {
    if (!selectedDate) return '';
    try {
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(`${selectedDate}T00:00:00Z`));
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  // Data Presensi Sesuai Tanggal Terpilih
  const currentDayAttendances = useMemo(() => {
    return attendances.filter((att) => att.date === selectedDate);
  }, [attendances, selectedDate]);

  // Statistik Real-time Harian
  const stats = useMemo(() => {
    const totalScheduled = employees.length;
    const presentOnTime = currentDayAttendances.filter((a) => a.status === 'Hadir').length;
    const lateRecords = currentDayAttendances.filter((a) => a.status === 'Terlambat');
    const lateCount = lateRecords.length;
    const totalLateMinutes = lateRecords.reduce((sum, r) => sum + (r.lateMinutes || 0), 0);
    const permissionOrLeave = currentDayAttendances.filter(
      (a) => a.status === 'Izin' || a.status === 'Sakit' || a.status === 'Cuti'
    ).length;
    const alphaCount = currentDayAttendances.filter((a) => a.status === 'Alpha').length;

    // Karyawan belum presensi
    const recordedEmpIds = new Set(currentDayAttendances.map((a) => a.employeeId));
    const unrecordedCount = Math.max(0, totalScheduled - recordedEmpIds.size);

    const attendanceRate = totalScheduled > 0
      ? Math.round(((presentOnTime + lateCount) / totalScheduled) * 100)
      : 0;

    return {
      totalScheduled,
      presentOnTime,
      lateCount,
      totalLateMinutes,
      permissionOrLeave,
      alphaCount,
      unrecordedCount,
      attendanceRate,
    };
  }, [currentDayAttendances, employees]);

  // Filtered List Presensi
  const filteredAttendances = useMemo(() => {
    return currentDayAttendances.filter((rec) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        rec.employeeName.toLowerCase().includes(q) ||
        rec.nip.toLowerCase().includes(q) ||
        rec.role.toLowerCase().includes(q);

      // 2. Filter Status
      const matchStatus = filterStatus === 'ALL' || rec.status === filterStatus;

      // 3. Filter Divisi
      const matchDivision = filterDivision === 'ALL' || rec.division === filterDivision;

      // 4. Filter Shift
      const matchShift =
        filterShift === 'ALL' ||
        (filterShift === 'Shift 1' && rec.shift.includes('Shift 1')) ||
        (filterShift === 'Shift 2' && rec.shift.includes('Shift 2')) ||
        (filterShift === 'Normal' && rec.shift.includes('Normal'));

      return matchQuery && matchStatus && matchDivision && matchShift;
    });
  }, [currentDayAttendances, searchQuery, filterStatus, filterDivision, filterShift]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    filterStatus !== 'ALL' ||
    filterDivision !== 'ALL' ||
    filterShift !== 'ALL';

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterStatus('ALL');
    setFilterDivision('ALL');
    setFilterShift('ALL');
  };

  // CRUD Actions
  const handleOpenAdd = () => {
    setEditingData(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingData(record);
    setIsFormOpen(true);
  };

  const handleSaveRecord = (recordData) => {
    setAttendances((prev) => {
      const index = prev.findIndex(
        (a) => a.id === recordData.id || (a.employeeId === recordData.employeeId && a.date === recordData.date)
      );
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = { ...copy[index], ...recordData };
        return copy;
      }
      return [recordData, ...prev];
    });
    showAlert(`Catatan presensi untuk ${recordData.employeeName} berhasil disimpan.`);
  };

  const handleDeleteRecord = (id, name) => {
    if (confirm(`Hapus catatan kehadiran untuk ${name}?`)) {
      setAttendances((prev) => prev.filter((a) => a.id !== id));
      showAlert(`Catatan kehadiran ${name} berhasil dihapus.`, 'warning');
    }
  };

  // Presensi Massal
  const handleExecuteMass = ({ date, employees: targetEmps, checkInTime }) => {
    const newRecords = targetEmps.map((emp) => ({
      id: Date.now() + emp.id,
      employeeId: emp.id,
      employeeName: emp.name,
      nip: emp.nip,
      division: emp.division,
      role: emp.role,
      date,
      shift: emp.scheduleCategory || 'Shift 1 (07:00 - 15:00)',
      status: 'Hadir',
      checkIn: checkInTime,
      checkOut: emp.checkOutTime || '15:00',
      lateMinutes: 0,
      deviation: 'Tepat Waktu',
      notes: 'Presensi massal operasional',
    }));

    setAttendances((prev) => {
      // Hilangkan data lama untuk karyawan & tanggal yang sama
      const targetEmpIds = new Set(targetEmps.map((e) => e.id));
      const remaining = prev.filter(
        (a) => !(targetEmpIds.has(a.employeeId) && a.date === date)
      );
      return [...newRecords, ...remaining];
    });

    showAlert(`Berhasil mencatat presensi massal untuk ${targetEmps.length} karyawan.`);
  };

  // Ekspor Excel via SheetJS
  const handleExportExcel = () => {
    if (filteredAttendances.length === 0) {
      alert('Tidak ada data presensi yang sesuai untuk diekspor.');
      return;
    }

    const exportRows = filteredAttendances.map((rec, idx) => ({
      No: idx + 1,
      Tanggal: rec.date,
      NIP: rec.nip,
      'Nama Karyawan': rec.employeeName,
      Jabatan: rec.role,
      Divisi: rec.division,
      'Shift Kerja': rec.shift,
      'Jam Masuk': rec.checkIn,
      'Jam Pulang': rec.checkOut,
      'Keterlambatan (Menit)': rec.lateMinutes || 0,
      Deviasi: rec.deviation,
      'Status Kehadiran': rec.status,
      Keterangan: rec.notes,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Catatan Kehadiran');
    XLSX.writeFile(workbook, `Rekap_Kehadiran_HCGA_${selectedDate}.xlsx`);
    showAlert('File rekap kehadiran Excel berhasil diunduh.');
  };

  // Helper Helper Badge Status
  const getStatusBadge = (status) => {
    let className = 'status-hadir';
    if (status === 'Terlambat') className = 'status-terlambat';
    else if (status === 'Sakit') className = 'status-sakit';
    else if (status === 'Izin') className = 'status-izin';
    else if (status === 'Cuti') className = 'status-cuti';
    else if (status === 'Alpha') className = 'status-alpha';

    return (
      <span className={`badge ${className}`}>
        <i />
        {status}
      </span>
    );
  };

  return (
    <>
      <Head title="Catatan Kehadiran" />

      {/* Floating Alert Feedback */}
      {alertInfo && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 transition-all animate-in slide-in-from-top-3 ${
            alertInfo.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          {alertInfo.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <span className="text-xs font-medium">{alertInfo.message}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        eyebrow="WAKTU & KEHADIRAN"
        title="Catatan Kehadiran"
        subtitle="Monitoring log presensi harian, tracking absensi, dan jam masuk/pulang karyawan operasional."
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            className="gap-2 bg-white hover:bg-slate-50 text-slate-700"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor XLSX</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsMassOpen(true)}
            className="gap-2 bg-white hover:bg-slate-50 text-slate-700"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Presensi Massal</span>
          </Button>
          <Button
            variant="default"
            onClick={handleOpenAdd}
            className="gap-2 bg-navy hover:bg-navy/90 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Presensi</span>
          </Button>
        </div>
      </PageHeader>

      {/* Date Navigation Ribbon */}
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
              {selectedDate === DEFAULT_DATE ? (
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
              Roster Kerja: Shift 1 (07:00–15:00) · Normal (08:00–17:00) · Shift 2 (15:00–23:00)
            </p>
          </div>
        </div>

        {/* Right: Segmented Controller & Date Picker */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          {/* Segmented Stepper */}
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/70">
            <button
              type="button"
              onClick={() => handleDateChange(-1)}
              className="h-8 px-2.5 rounded-md text-slate-600 hover:text-navy hover:bg-white text-xs font-medium transition-all flex items-center gap-1"
              title="Hari Sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kemarin</span>
            </button>

            <button
              type="button"
              onClick={handleResetToToday}
              className={`h-8 px-3 rounded-md text-xs font-semibold transition-all ${
                selectedDate === DEFAULT_DATE
                  ? 'bg-white text-navy shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-navy hover:bg-white/60'
              }`}
            >
              Hari Ini
            </button>

            <button
              type="button"
              onClick={() => handleDateChange(1)}
              className="h-8 px-2.5 rounded-md text-slate-600 hover:text-navy hover:bg-white text-xs font-medium transition-all flex items-center gap-1"
              title="Hari Berikutnya"
            >
              <span className="hidden sm:inline">Besok</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clean Custom Date Input with Icon */}
          <div className="relative inline-flex items-center">
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="date"
              aria-label="Pilih tanggal spesifik"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="h-9 pl-8 pr-3 text-xs font-medium bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 cursor-pointer focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards (5 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
        {/* 1. Total Terjadwal */}
        <Card className="border border-slate-200/80 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-medium">Total Jadwal</span>
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-navy flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </span>
            </div>
            <strong className="text-2xl font-bold text-navy block tracking-tight">
              {stats.totalScheduled}
            </strong>
            <small className="text-[11px] text-slate-500 font-medium mt-1 block">
              Tingkat Kehadiran: <span className="text-emerald-700 font-bold">{stats.attendanceRate}%</span>
            </small>
          </CardContent>
        </Card>

        {/* 2. Tepat Waktu */}
        <Card className="border border-slate-200/80 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-medium">Tepat Waktu</span>
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
            <strong className="text-2xl font-bold text-emerald-800 block tracking-tight">
              {stats.presentOnTime}
            </strong>
            <small className="text-[11px] text-slate-500 font-medium mt-1 block">
              Check-in sesuai shift
            </small>
          </CardContent>
        </Card>

        {/* 3. Terlambat */}
        <Card className="border border-slate-200/80 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-medium">Terlambat</span>
              <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>
            <strong className="text-2xl font-bold text-amber-800 block tracking-tight">
              {stats.lateCount}
            </strong>
            <small className="text-[11px] text-amber-700 font-medium mt-1 block">
              Total {stats.totalLateMinutes} menit deviasi
            </small>
          </CardContent>
        </Card>

        {/* 4. Izin / Sakit / Cuti */}
        <Card className="border border-slate-200/80 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-medium">Izin / Cuti / Sakit</span>
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <CalendarX2 className="w-3.5 h-3.5" />
              </span>
            </div>
            <strong className="text-2xl font-bold text-blue-800 block tracking-tight">
              {stats.permissionOrLeave}
            </strong>
            <small className="text-[11px] text-slate-500 font-medium mt-1 block">
              Ketidakhadiran resmi
            </small>
          </CardContent>
        </Card>

        {/* 5. Alpha / Belum Presensi */}
        <Card className="border border-slate-200/80 shadow-sm col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-medium">Alpha / Mangkir</span>
              <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5" />
              </span>
            </div>
            <strong className="text-2xl font-bold text-rose-800 block tracking-tight">
              {stats.alphaCount}
            </strong>
            <small className="text-[11px] text-rose-700 font-medium mt-1 block">
              {stats.unrecordedCount > 0 ? `${stats.unrecordedCount} belum check-in` : 'Tanpa keterangan'}
            </small>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden border border-slate-200/90 shadow-xs">
        {/* Toolbar Pencarian & Filter Terstandarisasi */}
        <TableToolbar>
          <TableSearch
            placeholder="Cari berdasarkan nama karyawan, NIP, atau jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <TableFilterGroup>
            {/* Filter Status */}
            <TableSelect
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              title="Filter Status"
            >
              <option value="ALL">Semua Status</option>
              <option value="Hadir">Hadir</option>
              <option value="Terlambat">Terlambat</option>
              <option value="Izin">Izin</option>
              <option value="Sakit">Sakit</option>
              <option value="Cuti">Cuti</option>
              <option value="Alpha">Alpha</option>
            </TableSelect>

            {/* Filter Divisi */}
            <TableSelect
              value={filterDivision}
              onChange={(e) => setFilterDivision(e.target.value)}
              title="Filter Divisi"
            >
              <option value="ALL">Semua Divisi</option>
              <option value="Operasional & Lapangan">Operasional & Lapangan</option>
              <option value="Human Capital & GA">Human Capital & GA</option>
              <option value="Logistik & Gudang">Logistik & Gudang</option>
              <option value="Security & Safety">Security & Safety</option>
            </TableSelect>

            {/* Filter Shift */}
            <TableSelect
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              title="Filter Shift"
            >
              <option value="ALL">Semua Shift</option>
              <option value="Shift 1">Shift 1 (Pagi)</option>
              <option value="Shift 2">Shift 2 (Siang)</option>
              <option value="Normal">Normal Office</option>
            </TableSelect>

            {/* Reset Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5"
                title="Reset seluruh filter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
            )}
          </TableFilterGroup>
        </TableToolbar>

        {/* Tabel Catatan Kehadiran */}
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-200/80">
                <TableHead className="w-12 text-center text-xs font-semibold text-slate-600">
                  No
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[190px]">
                  Karyawan
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[140px]">
                  Divisi & Lokasi
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[140px]">
                  Shift Terjadwal
                </TableHead>
                <TableHead className="text-center text-xs font-semibold text-slate-600 w-24">
                  Jam Masuk
                </TableHead>
                <TableHead className="text-center text-xs font-semibold text-slate-600 w-24">
                  Jam Pulang
                </TableHead>
                <TableHead className="text-center text-xs font-semibold text-slate-600 w-24">
                  Keterlambatan
                </TableHead>
                <TableHead className="text-center text-xs font-semibold text-slate-600 w-24">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[140px]">
                  Keterangan
                </TableHead>
                <TableHead className="text-center text-xs font-semibold text-slate-600 w-20">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendances.length === 0 ? (
                <TableEmpty colSpan={10}>
                  <div className="py-12 text-center">
                    <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <strong className="text-sm font-semibold text-slate-700 block mb-1">
                      Tidak Ada Catatan Presensi
                    </strong>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                      {hasActiveFilters
                        ? 'Tidak ada data kehadiran yang cocok dengan kriteria filter yang Anda tentukan.'
                        : `Belum ada presensi yang dicatat untuk tanggal ${formattedDateTitle}.`}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      {hasActiveFilters ? (
                        <Button variant="outline" size="sm" onClick={handleResetFilters}>
                          Reset Filter
                        </Button>
                      ) : (
                        <Button variant="default" size="sm" onClick={handleOpenAdd} className="gap-1.5">
                          <Plus className="w-4 h-4" />
                          <span>Catat Presensi Sekarang</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </TableEmpty>
              ) : (
                filteredAttendances.map((rec, index) => {
                  const isLate = rec.status === 'Terlambat';
                  const isPresent = rec.status === 'Hadir';

                  return (
                    <TableRow
                      key={rec.id}
                      className="hover:bg-slate-50/60 transition-colors border-b border-slate-100"
                    >
                      {/* 1. No */}
                      <TableCell className="text-center text-xs text-slate-400 font-mono">
                        {index + 1}
                      </TableCell>

                      {/* 2. Karyawan */}
                      <TableCell>
                        <div className="min-w-0">
                          <strong className="text-xs font-semibold text-navy block truncate hover:text-amber-700 cursor-pointer">
                            {rec.employeeName}
                          </strong>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-mono">{rec.nip}</span>
                            <span>•</span>
                            <span className="truncate">{rec.role}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* 3. Divisi & Lokasi */}
                      <TableCell>
                        <div className="text-xs text-slate-700 font-medium">{rec.division}</div>
                      </TableCell>

                      {/* 4. Shift Terjadwal */}
                      <TableCell className="text-xs text-slate-600">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                          {rec.shift}
                        </span>
                      </TableCell>

                      {/* 5. Jam Masuk */}
                      <TableCell className="text-center">
                        {rec.checkIn && rec.checkIn !== '-' ? (
                          <Text
                            variant="code"
                            className={`font-semibold inline-block ${
                              isLate
                                ? 'text-amber-900 bg-amber-50 border border-amber-200/70'
                                : 'text-emerald-800 bg-emerald-50 border border-emerald-200/60'
                            }`}
                          >
                            {rec.checkIn} WIB
                          </Text>
                        ) : (
                          <span className="text-slate-400 font-mono text-xs">-</span>
                        )}
                      </TableCell>

                      {/* 6. Jam Pulang */}
                      <TableCell className="text-center">
                        {rec.checkOut && rec.checkOut !== '-' ? (
                          <Text
                            variant="code"
                            className="text-slate-700 bg-slate-100 border border-slate-200 font-semibold inline-block"
                          >
                            {rec.checkOut} WIB
                          </Text>
                        ) : (
                          <span className="text-slate-400 font-mono text-xs">-</span>
                        )}
                      </TableCell>

                      {/* 7. Keterlambatan */}
                      <TableCell className="text-center">
                        {isLate ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                            {rec.deviation}
                          </span>
                        ) : isPresent ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-emerald-700 bg-emerald-50/70">
                            Tepat Waktu
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </TableCell>

                      {/* 8. Status */}
                      <TableCell className="text-center">
                        {getStatusBadge(rec.status)}
                      </TableCell>

                      {/* 9. Keterangan */}
                      <TableCell className="text-xs text-slate-600 max-w-[200px] truncate" title={rec.notes}>
                        {rec.notes || '-'}
                      </TableCell>

                      {/* 10. Aksi */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(rec)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-navy hover:bg-slate-100 transition-colors"
                            title="Ubah presensi"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRecord(rec.id, rec.employeeName)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus presensi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Footer Info Card */}
        <div className="p-4 bg-slate-50/60 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>
            Menampilkan <strong>{filteredAttendances.length}</strong> dari{' '}
            <strong>{currentDayAttendances.length}</strong> catatan presensi terdaftar.
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#428a73]" /> Hadir ({stats.presentOnTime})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ac8848]" /> Terlambat ({stats.lateCount})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#b36a74]" /> Alpha ({stats.alphaCount})
            </span>
          </div>
        </div>
      </Card>

      {/* Modal Form Catat / Ubah Presensi */}
      <ModalFormPresensi
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveRecord}
        initialData={editingData}
        employees={employees}
        currentDate={selectedDate}
      />

      {/* Modal Presensi Massal */}
      <ModalPresensiMassal
        isOpen={isMassOpen}
        onClose={() => setIsMassOpen(false)}
        onExecute={handleExecuteMass}
        employees={employees}
        currentDate={selectedDate}
        existingAttendances={currentDayAttendances}
      />
    </>
  );
}
