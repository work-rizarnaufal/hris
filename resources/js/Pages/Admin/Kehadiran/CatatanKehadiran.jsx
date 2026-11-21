import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import * as XLSX from 'xlsx';
import { getShiftSettings } from '@/services/systemSettings.js';
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
  Fingerprint,
  UserCheck,
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
  TablePagination,
  Toast,
} from '@/components/ui';
import ModalFormPresensi from './Partials/ModalFormPresensi.jsx';
import ModalPresensiMassal from './Partials/ModalPresensiMassal.jsx';
import ModalImporFingerprint from './Partials/ModalImporFingerprint.jsx';

// Master data fallback kosong
const MASTER_EMPLOYEES = [];

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

// Data Awal Presensi Kosong
const INITIAL_ATTENDANCES = [];

export default function CatatanKehadiran({
  dbEmployees = [],
  dbLocations = [],
  dbShifts = [],
  dbAttendances = [],
}) {
  const defaultDate = useMemo(() => {
    if (dbAttendances && dbAttendances.length > 0) {
      const dates = dbAttendances.map((a) => (typeof a.date === 'string' ? a.date.slice(0, 10) : new Date(a.date).toISOString().slice(0, 10)));
      dates.sort().reverse();
      return dates[0];
    }
    return DEFAULT_DATE;
  }, [dbAttendances]);

  const [selectedDate, setSelectedDate] = useState(defaultDate);

  const initialEmployeesList = useMemo(() => {
    if (dbEmployees && dbEmployees.length > 0) {
      return dbEmployees.map((emp) => ({
        id: emp.id,
        name: emp.name,
        nip: emp.nip,
        biometricPin: emp.biometric_pin || emp.biometricPin || '-',
        role: emp.role || emp.position || '-',
        division: emp.division || '-',
        location: emp.location?.name || (emp.location_id === 1 ? 'Lokasi Mariuk' : 'Lokasi Cimalaka'),
        location_id: emp.location_id,
        group: emp.group || 'Grup A',
        scheduleCategory: emp.shift?.name || 'Shift Pagi (08:00 - 17:00)',
        checkInTime: emp.shift?.start_time ? emp.shift.start_time.slice(0, 5) : '08:00',
        checkOutTime: emp.shift?.end_time ? emp.shift.end_time.slice(0, 5) : '17:00',
        status: emp.status || 'Aktif',
      }));
    }
    return [];
  }, [dbEmployees]);

  const initialAttendancesList = useMemo(() => {
    if (dbAttendances && dbAttendances.length > 0) {
      return dbAttendances.map((att) => ({
        id: att.id,
        employeeId: att.employee_id,
        employeeName: att.employee?.name || '-',
        nip: att.employee?.nip || '-',
        division: att.employee?.division || '-',
        role: att.employee?.role || '-',
        location: att.location?.name || (att.location_id === 1 ? 'Lokasi Mariuk' : 'Lokasi Cimalaka'),
        location_id: att.location_id,
        group: att.employee?.group || 'Grup A',
        date: typeof att.date === 'string' ? att.date.slice(0, 10) : new Date(att.date).toISOString().slice(0, 10),
        shift: att.shift || att.employee?.shift?.name || 'Shift Pagi (08:00 - 17:00)',
        status: att.status ? (att.status.charAt(0).toUpperCase() + att.status.slice(1).toLowerCase()) : 'Hadir',
        checkIn: att.check_in_time ? att.check_in_time.slice(0, 5) : '-',
        checkOut: att.check_out_time ? att.check_out_time.slice(0, 5) : '-',
        lateMinutes: att.late_minutes || 0,
        deviation: att.late_minutes > 0 ? `+${att.late_minutes}m` : (att.check_in_time ? 'Tepat Waktu' : '-'),
        notes: att.notes || '-',
        method: att.method || 'fingerprint',
      }));
    }
    return [];
  }, [dbAttendances]);

  const [attendances, setAttendances] = useState(initialAttendancesList);
  const employees = initialEmployeesList;

  useEffect(() => {
    setAttendances(initialAttendancesList);
  }, [initialAttendancesList]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDivision, setFilterDivision] = useState('ALL');
  const [filterShift, setFilterShift] = useState('ALL');

  // Konfigurasi Shift yang Disinkronkan dari Modul Pengaturan Sistem
  const [shiftSettings, setShiftSettings] = useState(() => getShiftSettings());

  useEffect(() => {
    const handleSync = () => {
      setShiftSettings(getShiftSettings());
    };
    window.addEventListener('hris:settings-updated', handleSync);
    return () => window.removeEventListener('hris:settings-updated', handleSync);
  }, []);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isMassOpen, setIsMassOpen] = useState(false);
  const [isFingerprintOpen, setIsFingerprintOpen] = useState(false);

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

      // 2. Filter Lokasi
      const matchLocation = filterLocation === 'ALL' || rec.location === filterLocation;

      // 3. Filter Status
      const matchStatus = filterStatus === 'ALL' || rec.status === filterStatus;

      // 4. Filter Divisi
      const matchDivision = filterDivision === 'ALL' || rec.division === filterDivision;

      // 5. Filter Shift Operasional
      const matchShift =
        filterShift === 'ALL' ||
        (filterShift === 'Pagi' && rec.shift.toLowerCase().includes('pagi')) ||
        (filterShift === 'Malam' && rec.shift.toLowerCase().includes('malam'));

      return matchQuery && matchLocation && matchStatus && matchDivision && matchShift;
    });
  }, [currentDayAttendances, searchQuery, filterLocation, filterStatus, filterDivision, filterShift]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    filterLocation !== 'ALL' ||
    filterStatus !== 'ALL' ||
    filterDivision !== 'ALL' ||
    filterShift !== 'ALL';

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterLocation('ALL');
    setFilterStatus('ALL');
    setFilterDivision('ALL');
    setFilterShift('ALL');
  };

  // Reset pagination on filter/search/date change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, searchQuery, filterLocation, filterStatus, filterDivision, filterShift]);

  const totalFiltered = filteredAttendances.length;
  const totalPages = Math.ceil(totalFiltered / perPage) || 1;
  const paginatedAttendances = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredAttendances.slice(start, start + perPage);
  }, [filteredAttendances, currentPage, perPage]);

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
    const payload = {
      employee_id: recordData.employeeId,
      date: recordData.date,
      check_in_time: recordData.checkIn && recordData.checkIn !== '-' ? recordData.checkIn : null,
      check_out_time: recordData.checkOut && recordData.checkOut !== '-' ? recordData.checkOut : null,
      status: recordData.status,
      late_minutes: recordData.lateMinutes || 0,
      notes: recordData.notes || 'Input manual admin',
    };

    router.post('/kehadiran/manual', payload, {
      preserveScroll: true,
      onSuccess: () => {
        showAlert(`Catatan presensi untuk ${recordData.employeeName} berhasil disimpan.`);
        setIsFormOpen(false);
      },
      onError: (err) => {
        showAlert('Gagal menyimpan presensi: ' + Object.values(err).join(', '), 'error');
      },
    });
  };

  const handleFingerprintImportSuccess = (importedRecords) => {
    if (!importedRecords || importedRecords.length === 0) return;

    const payloadRecords = importedRecords.map((r) => ({
      employee_id: r.employeeId || r.employee_id,
      date: r.date,
      check_in_time: (r.checkIn && r.checkIn !== '-') ? r.checkIn : (r.check_in_time || null),
      check_out_time: (r.checkOut && r.checkOut !== '-') ? r.checkOut : (r.check_out_time || null),
      status: r.status ? r.status.toLowerCase() : 'hadir',
      late_minutes: r.lateMinutes ?? r.late_minutes ?? 0,
      work_duration_hours: (r.checkIn && r.checkOut && r.checkIn !== '-' && r.checkOut !== '-') ? 8.0 : 0,
      location_id: r.location_id || (r.location?.includes('Mariuk') ? 1 : 2),
      anomaly_reason: r.anomalyReason || r.anomaly_reason || null,
    }));

    if (importedRecords[0]?.date) {
      setSelectedDate(importedRecords[0].date);
    }

    router.post('/kehadiran/commit-fingerprint', {
      batch_id: `FP-${Date.now()}`,
      records: payloadRecords,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        showAlert(`Berhasil menyimpan ${importedRecords.length} log presensi biometric fingerprint ke database.`);
        setIsFingerprintOpen(false);
      },
      onError: (err) => {
        showAlert('Gagal menyimpan log presensi fingerprint: ' + Object.values(err).join(', '), 'error');
      },
    });
  };

  const handleDeleteRecord = (id, name) => {
    if (confirm(`Hapus catatan kehadiran untuk ${name}?`)) {
      router.delete(`/kehadiran/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          showAlert(`Catatan kehadiran ${name} berhasil dihapus.`, 'warning');
        },
        onError: () => {
          showAlert(`Gagal menghapus catatan kehadiran ${name}.`, 'error');
        },
      });
    }
  };

  // Presensi Massal
  const handleExecuteMass = ({ date, employees: targetEmps, checkInTime }) => {
    if (!targetEmps || targetEmps.length === 0) return;

    router.post('/kehadiran/mass', {
      date,
      check_in_time: checkInTime,
      employee_ids: targetEmps.map((e) => e.id),
    }, {
      preserveScroll: true,
      onSuccess: () => {
        showAlert(`Berhasil mencatat presensi massal untuk ${targetEmps.length} karyawan.`);
        setIsMassOpen(false);
      },
      onError: (err) => {
        showAlert('Gagal mencatat presensi massal: ' + Object.values(err).join(', '), 'error');
      },
    });
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
      'Lokasi Kerja': rec.location || '-',
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

      <Toast toast={alertInfo} onClose={() => setAlertInfo(null)} />

      {/* Page Header */}
      <PageHeader
        eyebrow="WAKTU & KEHADIRAN"
        title="Catatan Kehadiran"
        subtitle="Monitoring log presensi harian, tracking absensi, dan jam masuk/pulang karyawan operasional."
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => setIsFingerprintOpen(true)}
            className="gap-2 bg-indigo-50/50 hover:bg-indigo-100/60 text-indigo-700 border-indigo-200 hover:border-indigo-300 font-semibold"
          >
            <Fingerprint className="w-4 h-4 text-indigo-600" />
            <span>Tarik Log Fingerprint</span>
          </Button>
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
              Roster 9 Jam: {shiftSettings.shiftPagiName} ({shiftSettings.shiftPagiIn}–{shiftSettings.shiftPagiOut}) & {shiftSettings.shiftMalamName} ({shiftSettings.shiftMalamIn}–{shiftSettings.shiftMalamOut}) · Lokasi Mariuk & Cimalaka
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

      {/* Notice Mode Site Fingerprint (Validasi GPS Dinonaktifkan) */}
      <div className="mb-6 px-4 py-3 bg-gradient-to-r from-slate-50 via-indigo-50/25 to-slate-50 border border-slate-200/90 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0">
            <Fingerprint className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-800">Mode Operasional: Presensi Mesin Biometric Fingerprint (Site Mariuk & Cimalaka)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">Aktif</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">Validasi GPS Dinonaktifkan</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Presensi dicatat otomatis dari tarikan log mesin sidik jari atau diinput/dikoreksi manual oleh Admin jika karyawan berhalangan tap.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFingerprintOpen(true)}
          className="shrink-0 text-xs gap-1.5 font-medium border-indigo-200 text-indigo-700 hover:bg-indigo-50/80 bg-white"
        >
          <Fingerprint className="w-3.5 h-3.5" />
          <span>Tarik Log Mesin</span>
        </Button>
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
            {/* Filter Lokasi Kerja */}
            <TableSelect
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              title="Filter Lokasi Kerja"
            >
              <option value="ALL">Semua Lokasi (Mariuk & Cimalaka)</option>
              <option value="Lokasi Mariuk">📍 Lokasi Mariuk</option>
              <option value="Lokasi Cimalaka">📍 Lokasi Cimalaka</option>
            </TableSelect>

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

            {/* Filter Shift Operasional */}
            <TableSelect
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              title="Filter Shift"
            >
              <option value="ALL">Semua Shift</option>
              <option value="Pagi">{shiftSettings.shiftPagiName} ({shiftSettings.shiftPagiIn} - {shiftSettings.shiftPagiOut})</option>
              <option value="Malam">{shiftSettings.shiftMalamName} ({shiftSettings.shiftMalamIn} - {shiftSettings.shiftMalamOut})</option>
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
                paginatedAttendances.map((rec, index) => {
                  const isLate = rec.status === 'Terlambat';
                  const isPresent = rec.status === 'Hadir';

                  return (
                    <TableRow
                      key={rec.id}
                      className="hover:bg-slate-50/60 transition-colors border-b border-slate-100"
                    >
                      {/* 1. No */}
                      <TableCell className="text-center text-xs text-slate-400 font-mono">
                        {(currentPage - 1) * perPage + index + 1}
                      </TableCell>

                      {/* 2. Karyawan */}
                      <TableCell>
                        <div className="min-w-0">
                          <strong
                            onClick={() => handleOpenEdit(rec)}
                            className="text-xs font-semibold text-navy block truncate hover:text-[#c4a266] transition-colors cursor-pointer"
                            title="Klik untuk ubah presensi karyawan ini"
                          >
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
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{rec.location || 'Lokasi Mariuk'}</span>
                        </div>
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

                      {/* 8. Status & Metode Presensi */}
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          {getStatusBadge(rec.status)}
                          {rec.method === 'manual_admin' ? (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/70"
                              title="Presensi dicatat / dikoreksi manual oleh Admin"
                            >
                              <UserCheck className="w-2.5 h-2.5 text-amber-600" />
                              Manual
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/70"
                              title="Presensi ditarik dari mesin biometric fingerprint fisik"
                            >
                              <Fingerprint className="w-2.5 h-2.5 text-indigo-600" />
                              Fingerprint
                            </span>
                          )}
                        </div>
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

          {/* Atomic Table Pagination */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRows={totalFiltered}
            perPage={perPage}
            onPageChange={setCurrentPage}
            onPerPageChange={(newPerPage) => {
              setPerPage(newPerPage);
              setCurrentPage(1);
            }}
          />
        </CardContent>

        {/* Footer Info Card */}
        <div className="p-4 bg-slate-50/60 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>
            Menampilkan <strong>{totalFiltered > 0 ? (currentPage - 1) * perPage + 1 : 0}</strong>–
            <strong>{Math.min(currentPage * perPage, totalFiltered)}</strong> dari{' '}
            <strong>{totalFiltered}</strong> hasil filter (
            <strong>{currentDayAttendances.length}</strong> total presensi hari ini).
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

      {/* Modal Impor / Tarik Log Fingerprint */}
      <ModalImporFingerprint
        isOpen={isFingerprintOpen}
        onClose={() => setIsFingerprintOpen(false)}
        onSuccess={handleFingerprintImportSuccess}
        employees={employees}
        locations={dbLocations}
      />
    </>
  );
}
