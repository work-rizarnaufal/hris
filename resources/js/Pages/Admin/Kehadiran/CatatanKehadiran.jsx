import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import * as XLSX from 'xlsx';
import { getShiftSettings } from '@/services/systemSettings.js';
import {
  Plus,
  FileSpreadsheet,
  Sparkles,
  Fingerprint,
} from 'lucide-react';
import {
  Card,
  Button,
  PageHeader,
  Toast,
} from '@/components/ui';
import ModalFormPresensi from './Partials/ModalFormPresensi.jsx';
import ModalPresensiMassal from './Partials/ModalPresensiMassal.jsx';
import ModalImporFingerprint from './Partials/ModalImporFingerprint.jsx';
import AttendanceDateRibbon from './Partials/AttendanceDateRibbon.jsx';
import AttendanceKpiCards from './Partials/AttendanceKpiCards.jsx';
import AttendanceToolbar from './Partials/AttendanceToolbar.jsx';
import AttendanceTable from './Partials/AttendanceTable.jsx';

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

export default function CatatanKehadiran({
  dbEmployees = [],
  dbLocations = [],
  dbShifts = [],
  dbAttendances = [],
}) {
  const defaultDate = useMemo(() => {
    if (dbAttendances && dbAttendances.length > 0) {
      const dates = dbAttendances.map((a) =>
        typeof a.date === 'string' ? a.date.slice(0, 10) : new Date(a.date).toISOString().slice(0, 10)
      );
      dates.sort().reverse();
      return dates[0];
    }
    return DEFAULT_DATE;
  }, [dbAttendances]);

  const [selectedDate, setSelectedDate] = useState(defaultDate);

  // Normalisasi data master karyawan
  const employees = useMemo(() => {
    if (!dbEmployees || dbEmployees.length === 0) return [];
    return dbEmployees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      nip: emp.nip,
      biometricPin: emp.biometric_pin || emp.biometricPin || '-',
      role: emp.role || emp.position || '-',
      division: emp.division || '-',
      location: emp.location?.name || (emp.location_id === 1 ? 'Lokasi Mariuk' : 'Lokasi Cimalaka'),
      location_id: emp.location_id,
      group: emp.group || emp.shift_group || 'Belum Ditetapkan',
      scheduleCategory: emp.shift?.name || emp.scheduleCategory || '-',
      checkInTime: emp.shift?.start_time ? emp.shift.start_time.slice(0, 5) : (emp.checkInTime || '-'),
      checkOutTime: emp.shift?.end_time ? emp.shift.end_time.slice(0, 5) : (emp.checkOutTime || '-'),
      status: emp.status || 'Aktif',
    }));
  }, [dbEmployees]);

  // Normalisasi data log presensi langsung dari database
  const attendances = useMemo(() => {
    if (!dbAttendances || dbAttendances.length === 0) return [];
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
  }, [dbAttendances]);

  // Daftar divisi unik yang ada pada master data karyawan
  const availableDivisions = useMemo(() => {
    const set = new Set();
    employees.forEach((e) => {
      if (e.division && e.division !== '-' && e.division !== 'Belum Ditetapkan') {
        set.add(e.division);
      }
    });
    return Array.from(set).sort();
  }, [employees]);

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
    setSelectedDate(current.toISOString().slice(0, 10));
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
      work_duration_hours: (r.checkIn && r.checkOut && r.checkIn !== '-' && r.checkOut !== '-') ? 9.0 : 0,
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

      {/* Date Navigation Ribbon Component */}
      <AttendanceDateRibbon
        selectedDate={selectedDate}
        defaultDate={DEFAULT_DATE}
        formattedDateTitle={formattedDateTitle}
        shiftSettings={shiftSettings}
        onDateChange={handleDateChange}
        onResetToday={handleResetToToday}
        onSelectDate={(newDate) => setSelectedDate(newDate)}
      />

      {/* Notice Mode Site Fingerprint */}
      <div className="mb-6 px-4 py-3 bg-gradient-to-r from-slate-50 via-indigo-50/25 to-slate-50 border border-slate-200/90 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0">
            <Fingerprint className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-800">
                Mode Operasional: Presensi Mesin Biometric Fingerprint (Site Mariuk & Cimalaka)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                Aktif
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                Validasi GPS Dinonaktifkan
              </span>
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

      {/* KPI Cards Component */}
      <AttendanceKpiCards stats={stats} />

      {/* Main Table Card */}
      <Card className="overflow-hidden border border-slate-200/90 shadow-xs">
        <AttendanceToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterLocation={filterLocation}
          onLocationChange={setFilterLocation}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          filterDivision={filterDivision}
          onDivisionChange={setFilterDivision}
          availableDivisions={availableDivisions}
          filterShift={filterShift}
          onShiftChange={setFilterShift}
          shiftSettings={shiftSettings}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />

        <AttendanceTable
          paginatedAttendances={paginatedAttendances}
          totalFiltered={totalFiltered}
          currentDayTotal={currentDayAttendances.length}
          hasActiveFilters={hasActiveFilters}
          formattedDateTitle={formattedDateTitle}
          currentPage={currentPage}
          perPage={perPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPerPageChange={setPerPage}
          onOpenEdit={handleOpenEdit}
          onOpenAdd={handleOpenAdd}
          onDeleteRecord={handleDeleteRecord}
          onResetFilters={handleResetFilters}
        />
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
        existingAttendances={attendances}
      />

      {/* Modal Impor Fingerprint */}
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
