import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import * as XLSX from 'xlsx';
import { getHolidays, getShiftSettings, formatDateDMY } from '@/services/systemSettings.js';
import {
  CalendarDays,
  Clock,
  Users,
  ArrowLeftRight,
  Plus,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Pencil,
  MapPin,
} from 'lucide-react';
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
  TablePagination,
  Toast,
  Text,
} from '@/components/ui';
import ModalFormTukarShift from './Partials/ModalFormTukarShift.jsx';
import PanelRotasiGrup from './Partials/PanelRotasiGrup.jsx';

// Opsi Minggu Tersedia (Format DD/MM/YYYY)
const WEEKS = [
  {
    id: 1,
    label: 'Minggu 1: 02/11/2026 - 08/11/2026',
    days: [
      { key: 'd1', label: 'Sen', date: '02/11/2026', isWeekend: false },
      { key: 'd2', label: 'Sel', date: '03/11/2026', isWeekend: false },
      { key: 'd3', label: 'Rab', date: '04/11/2026', isWeekend: false },
      { key: 'd4', label: 'Kam', date: '05/11/2026', isWeekend: false },
      { key: 'd5', label: 'Jum', date: '06/11/2026', isWeekend: false },
      { key: 'd6', label: 'Sab', date: '07/11/2026', isWeekend: true },
      { key: 'd7', label: 'Min', date: '08/11/2026', isWeekend: true },
    ],
  },
  {
    id: 2,
    label: 'Minggu 2: 09/11/2026 - 15/11/2026',
    days: [
      { key: 'd1', label: 'Sen', date: '09/11/2026', isWeekend: false },
      { key: 'd2', label: 'Sel', date: '10/11/2026', isWeekend: false },
      { key: 'd3', label: 'Rab', date: '11/11/2026', isWeekend: false },
      { key: 'd4', label: 'Kam', date: '12/11/2026', isWeekend: false },
      { key: 'd5', label: 'Jum', date: '13/11/2026', isWeekend: false },
      { key: 'd6', label: 'Sab', date: '14/11/2026', isWeekend: true },
      { key: 'd7', label: 'Min', date: '15/11/2026', isWeekend: true },
    ],
  },
  {
    id: 3,
    label: 'Minggu 3: 16/11/2026 - 22/11/2026',
    days: [
      { key: 'd1', label: 'Sen', date: '16/11/2026', isWeekend: false },
      { key: 'd2', label: 'Sel', date: '17/11/2026', isWeekend: false },
      { key: 'd3', label: 'Rab', date: '18/11/2026', isWeekend: false },
      { key: 'd4', label: 'Kam', date: '19/11/2026', isWeekend: false },
      { key: 'd5', label: 'Jum', date: '20/11/2026', isWeekend: false },
      { key: 'd6', label: 'Sab', date: '21/11/2026', isWeekend: true },
      { key: 'd7', label: 'Min', date: '22/11/2026', isWeekend: true },
    ],
  },
  {
    id: 4,
    label: 'Minggu 4: 23/11/2026 - 29/11/2026',
    days: [
      { key: 'd1', label: 'Sen', date: '23/11/2026', isWeekend: false },
      { key: 'd2', label: 'Sel', date: '24/11/2026', isWeekend: false },
      { key: 'd3', label: 'Rab', date: '25/11/2026', isWeekend: false },
      { key: 'd4', label: 'Kam', date: '26/11/2026', isWeekend: false },
      { key: 'd5', label: 'Jum', date: '27/11/2026', isWeekend: false },
      { key: 'd6', label: 'Sab', date: '28/11/2026', isWeekend: true },
      { key: 'd7', label: 'Min', date: '29/11/2026', isWeekend: true },
    ],
  },
];

export default function JadwalShift({
  dbEmployees = [],
  dbLocations = [],
  dbShifts = [],
}) {
  const initialEmployees = useMemo(() => {
    if (dbEmployees && dbEmployees.length > 0) {
      return dbEmployees.map((emp) => ({
        id: emp.id,
        name: emp.name,
        nip: emp.nip,
        role: emp.role || emp.position || emp.role_title || '-',
        division: emp.division || '-',
        location: emp.location?.name || (emp.location_id === 1 ? 'Lokasi Mariuk' : 'Lokasi Cimalaka'),
        location_id: emp.location_id,
        group: emp.shift_group || emp.group || 'Grup A',
        baseShift: emp.shift?.name || 'Shift Pagi (08:00 - 17:00)',
        shiftCode: emp.shift?.code || 'PAGI',
      }));
    }
    return [];
  }, [dbEmployees]);

  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'patterns' | 'exceptions'
  const [employees, setEmployees] = useState(initialEmployees);

  useEffect(() => {
    setEmployees(initialEmployees);
  }, [initialEmployees]);

  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [filterLocation, setFilterLocation] = useState('ALL');
  const [filterDivision, setFilterDivision] = useState('ALL');
  const [filterGroup, setFilterGroup] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingException, setEditingException] = useState(null);
  const [alertInfo, setAlertInfo] = useState(null);

  // Pagination States untuk Roster Karyawan
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  const handleOpenAddException = () => {
    setEditingException(null);
    setIsModalOpen(true);
  };

  const handleOpenEditException = (item) => {
    setEditingException(item);
    setIsModalOpen(true);
  };

  // Daftar Pengecualian & Tukar Shift Aktif
  const [exceptions, setExceptions] = useState([]);

  // Daftar Perubahan Jadwal Operasional Manual
  const [manualSchedules, setManualSchedules] = useState([]);

  // Kalender Hari Libur & Konfigurasi Shift yang Disinkronkan dari Modul Pengaturan Sistem
  const [holidays, setHolidays] = useState(() => getHolidays());
  const [shiftSettings, setShiftSettings] = useState(() => getShiftSettings());

  // Listener Sinkronisasi Otomatis jika Pengaturan Hari Libur / Shift Diubah di Tab Lain
  useEffect(() => {
    const handleSync = () => {
      setHolidays(getHolidays());
      setShiftSettings(getShiftSettings());
    };
    window.addEventListener('hris:settings-updated', handleSync);
    return () => window.removeEventListener('hris:settings-updated', handleSync);
  }, []);

  const currentWeek = WEEKS[selectedWeekIndex];

  // Filter Karyawan
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchLocation = filterLocation === 'ALL' || emp.location === filterLocation;
      const matchDivision = filterDivision === 'ALL' || emp.division === filterDivision;
      const matchGroup = filterGroup === 'ALL' || emp.group === filterGroup;
      const matchSearch =
        searchQuery === '' ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLocation && matchDivision && matchGroup && matchSearch;
    });
  }, [employees, filterLocation, filterDivision, filterGroup, searchQuery]);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterLocation, filterDivision, filterGroup, searchQuery, selectedWeekIndex]);

  const totalFiltered = filteredEmployees.length;
  const totalPages = Math.ceil(totalFiltered / perPage) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredEmployees.slice(start, start + perPage);
  }, [filteredEmployees, currentPage, perPage]);

  // Statistik Ringkasan Jadwal (Reaktif terhadap Filter Lokasi)
  const stats = useMemo(() => {
    const list =
      filterLocation === 'ALL'
        ? employees
        : employees.filter((e) => e.location === filterLocation);

    const total = list.length;
    const groupA = list.filter((e) => e.group === 'Grup A').length;
    const groupB = list.filter((e) => e.group === 'Grup B').length;
    const unassigned = list.filter((e) => e.group === 'Belum Ditetapkan').length;
    const nonShift = list.filter((e) => e.group === 'Non-Shift').length;
    const totalExceptions = exceptions.filter((ex) => {
      const emp = employees.find((e) => e.id === ex.employeeId);
      return filterLocation === 'ALL' || emp?.location === filterLocation;
    }).length;
    const totalManualSchedules = manualSchedules.length;
    return { total, groupA, groupB, unassigned, nonShift, totalExceptions, totalManualSchedules };
  }, [employees, exceptions, manualSchedules, filterLocation]);

  // Handle Update Grup Karyawan per Individu (dari Kolom Dropdown)
  const handleUpdateEmployeeGroup = (empId, newGroup) => {
    const targetEmp = employees.find((e) => e.id === empId);
    router.put(`/jadwal/employee/${empId}/group`, { group: newGroup }, {
      preserveScroll: true,
      onSuccess: () => {
        setAlertInfo({
          type: 'success',
          message: `Grup kerja ${targetEmp?.name || 'personil'} berhasil diubah menjadi ${newGroup}.`,
        });
      },
      onError: () => {
        setAlertInfo({ type: 'error', message: 'Gagal mengubah grup kerja.' });
      },
    });
  };

  // Handle Pemindahan Massal (Bulk Update Group)
  const handleBulkUpdateGroup = (selectedIds, targetGroup) => {
    router.post('/jadwal/bulk-update-group', { employee_ids: selectedIds, group: targetGroup }, {
      preserveScroll: true,
      onSuccess: () => {
        setAlertInfo({
          type: 'success',
          message: `${selectedIds.length} personil berhasil dipindahkan ke ${targetGroup}.`,
        });
      },
      onError: () => {
        setAlertInfo({ type: 'error', message: 'Gagal memindahkan grup personil.' });
      },
    });
  };

  // Handle Tukar Semua Personil Grup A dan Grup B
  const handleSwapAllGroups = () => {
    router.post('/jadwal/swap-group', {}, {
      preserveScroll: true,
      onSuccess: () => {
        setAlertInfo({
          type: 'success',
          message: 'Rotasi siklus berhasil: Seluruh personil Grup A & B berhasil ditukar jadwal gilirannya.',
        });
      },
      onError: () => {
        setAlertInfo({ type: 'error', message: 'Gagal melakukan rotasi grup.' });
      },
    });
  };

  // Handle Simpan Pengecualian / Tukar Shift (Tambah & Ubah)
  const handleSaveException = (itemData) => {
    setExceptions((prev) => {
      const idx = prev.findIndex((e) => e.id === itemData.id);
      const formatted = {
        ...itemData,
        id: itemData.id || Date.now(),
        dateFormatted: formatDateDMY(itemData.date),
      };
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = formatted;
        return copy;
      }
      return [formatted, ...prev];
    });

    setAlertInfo({
      type: 'success',
      message: `Pengecualian jadwal untuk ${itemData.employeeName} berhasil disimpan dan disinkronkan.`,
    });
  };

  // Handle Hapus Pengecualian
  const handleDeleteException = (id) => {
    setExceptions(exceptions.filter((ex) => ex.id !== id));
    setAlertInfo({
      type: 'warning',
      message: 'Pengecualian jadwal telah dibatalkan dan dikembalikan ke jadwal normal.',
    });
  };

  // Handle Simpan Perubahan Jadwal Operasional Manual
  const handleSaveManualSchedule = (item) => {
    const newItem = {
      id: Date.now(),
      ...item,
      startDateFormatted: formatDateDMY(item.startDate),
      status: 'Aktif',
    };
    setManualSchedules((prev) => [newItem, ...prev]);
    setAlertInfo({
      type: 'success',
      message: `Perubahan jadwal operasional manual untuk ${item.targetGroup} pada ${newItem.startDateFormatted} berhasil diterapkan.`,
    });
  };

  // Handle Hapus Perubahan Jadwal Operasional Manual
  const handleDeleteManualSchedule = (id) => {
    setManualSchedules((prev) => prev.filter((m) => m.id !== id));
    setAlertInfo({
      type: 'warning',
      message: 'Perubahan jadwal operasional manual telah dihapus dan dikembalikan ke pola normal.',
    });
  };

  // Reset Filters
  const resetFilters = () => {
    setFilterLocation('ALL');
    setFilterDivision('ALL');
    setFilterGroup('ALL');
    setSearchQuery('');
  };

  // Helper penentuan shift dinamis per hari (Aturan Permanen: 1 Hari 2 Shift, Bergantian Antar-Grup)
  const getEmployeeShiftForDay = (emp, day) => {
    // Konversi day.date (dd/mm/yyyy) ke ISO (yyyy-mm-dd) untuk pencocokan data
    const parts = day.date.split('/');
    const dayDateStr = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : day.date;
    const activeException = exceptions.find(
      (ex) =>
        ex.date === dayDateStr &&
        (ex.employeeId === emp.id || (ex.type === 'swap' && ex.targetEmployeeId === emp.id))
    );

    if (activeException) {
      const isTarget = activeException.type === 'swap' && activeException.targetEmployeeId === emp.id;
      return {
        code: isTarget ? 'S1 (SWAP)' : 'S2 (SWAP)',
        label: `Tukar Shift: ${activeException.reason}`,
        badgeClass: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
      };
    }

    // Personil Belum Ditetapkan Grupnya
    if (emp.group === 'Belum Ditetapkan') {
      return {
        code: 'UNSET',
        label: 'Grup Kerja Belum Ditetapkan',
        badgeClass: 'bg-slate-100 text-slate-400 border-slate-200 font-medium',
      };
    }

    // Hari Libur Akhir Pekan untuk Non-Shift (Sabtu & Minggu)
    if (emp.group === 'Non-Shift') {
      if (day.isWeekend) {
        return {
          code: 'OFF',
          label: 'Libur Akhir Pekan',
          badgeClass: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
        };
      }
      return {
        code: 'NON',
        label: 'Office (08:00 - 17:00)',
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-200 font-semibold',
      };
    }

    // 2. Periksa apakah hari ini adalah Hari Libur Resmi / Nasional dari Pengaturan Sistem
    const activeHoliday = holidays.find((h) => h.date === dayDateStr);
    const activeManual = manualSchedules.find((m) => m.startDate === dayDateStr);

    if (activeHoliday) {
      // Jika ada penugasan kerja/lembur manual khusus pada hari libur ini
      const isTargetGroup =
        activeManual &&
        (activeManual.targetGroup === emp.group || activeManual.targetGroup === 'Semua Grup (A & B)');

      if (isTargetGroup) {
        const isShift2 = emp.shiftCode === 'S2' || (emp.baseShift && emp.baseShift.includes('Shift 2'));
        const timeStr = isShift2
          ? `${activeManual.shift2In}-${activeManual.shift2Out}`
          : `${activeManual.shift1In}-${activeManual.shift1Out}`;
        const shiftCodeStr = isShift2 ? `S2 (${timeStr})` : `S1 (${timeStr})`;
        return {
          code: shiftCodeStr,
          label: `Penugasan Lembur Libur [${activeHoliday.name}]: ${activeManual.reason}`,
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
        };
      }

      // Jika tidak ada penugasan manual khusus, seluruh regu libur resmi
      return {
        code: 'LIBUR',
        label: `${activeHoliday.category}: ${activeHoliday.name} - ${activeHoliday.operationalNote}`,
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200 font-bold',
      };
    }

    // 3. Periksa apakah ada Perubahan Jadwal Operasional Manual pada tanggal normal ini
    if (activeManual) {
      const isTargetGroup =
        activeManual.targetGroup === emp.group || activeManual.targetGroup === 'Semua Grup (A & B)';

      if (isTargetGroup) {
        const isShift2 = emp.shiftCode === 'S2' || (emp.baseShift && emp.baseShift.includes('Shift 2'));
        const timeStr = isShift2
          ? `${activeManual.shift2In}-${activeManual.shift2Out}`
          : `${activeManual.shift1In}-${activeManual.shift1Out}`;
        const shiftCodeStr = isShift2 ? `S2 (${timeStr})` : `S1 (${timeStr})`;
        const shiftName = isShift2 ? 'Shift 2' : 'Shift 1';
        return {
          code: shiftCodeStr,
          label: `Jadwal Manual [${activeManual.targetGroup}]: ${shiftName} (${timeStr}) - ${activeManual.reason}`,
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
        };
      } else {
        return {
          code: 'OFF',
          label: `Libur Operasional (Jadwal Manual Khusus ${activeManual.targetGroup})`,
          badgeClass: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
        };
      }
    }

    const isGroupA = emp.group === 'Grup A';
    const isGroupB = emp.group === 'Grup B';
    const dayNum = parseInt(day.key.replace('d', ''), 10); // 1 = Senin ... 7 = Minggu

    // Aturan Operasional 24/7 (Non-Stop 7 Hari Kerja):
    // Pola Continuous Rolling Selang-Seling:
    // Minggu ganjil (Minggu 1 & 3): Grup A masuk hari 1, 3, 5, 7 (Senin, Rabu, Jumat, Minggu); Grup B masuk hari 2, 4, 6 (Selasa, Kamis, Sabtu).
    // Minggu genap (Minggu 2 & 4): Kelompok B masuk hari 1, 3, 5, 7; Grup A masuk hari 2, 4, 6 (bergantian adil jatah Minggu).
    const isWeekEven = selectedWeekIndex % 2 === 1;
    const isGroupAWorking = !isWeekEven ? dayNum % 2 === 1 : dayNum % 2 === 0;
    const isWorkingDay = isGroupA ? isGroupAWorking : isGroupB ? !isGroupAWorking : false;

    if (!isWorkingDay) {
      return {
        code: 'OFF',
        label: 'Libur Roster Bergantian (OFF)',
        badgeClass: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
      };
    }

    // Jika hari kerja operasional: Tampilkan shift personil (Pagi 08:00-17:00 atau Malam 20:00-05:00)
    const isMalam =
      emp.shiftCode === 'MALAM' || (emp.baseShift && emp.baseShift.toLowerCase().includes('malam'));
    if (isMalam) {
      return {
        code: 'MALAM (20-05)',
        label: `${shiftSettings.shiftMalamName} (${shiftSettings.shiftMalamIn} - ${shiftSettings.shiftMalamOut})`,
        badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200 font-bold',
      };
    }

    return {
      code: 'PAGI (08-17)',
      label: `${shiftSettings.shiftPagiName} (${shiftSettings.shiftPagiIn} - ${shiftSettings.shiftPagiOut})`,
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
    };
  };

  // Kalkulasi total jam kerja mingguan aktual berdasarkan jadwal aktif (8 jam efektif per dinas)
  const calculateWeeklyHours = (emp, days) => {
    let totalHours = 0;
    days.forEach((day) => {
      const shiftInfo = getEmployeeShiftForDay(emp, day);
      if (
        shiftInfo.code.includes('PAGI') ||
        shiftInfo.code.includes('MALAM') ||
        shiftInfo.code.includes('SWAP') ||
        shiftInfo.code.includes('S1') ||
        shiftInfo.code.includes('S2')
      ) {
        totalHours += 8;
      } else if (shiftInfo.code === 'NON') {
        totalHours += 8;
      }
    });
    return totalHours;
  };

  // Ekspor Excel Roster Mingguan
  const handleExportRoster = () => {
    const rows = filteredEmployees.map((emp, index) => {
      const row = {
        No: index + 1,
        NIP: emp.nip,
        'Nama Karyawan': emp.name,
        Lokasi: emp.location || '-',
        Divisi: emp.division,
        Grup: emp.group,
        'Shift Dasar': emp.baseShift,
      };

      currentWeek.days.forEach((day) => {
        const shiftInfo = getEmployeeShiftForDay(emp, day);
        row[`${day.label} (${day.date})`] = shiftInfo.code;
      });

      const weeklyHours = calculateWeeklyHours(emp, currentWeek.days);
      row['Total Jam Kerja'] = `${weeklyHours} Jam`;
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Roster Shift');

    worksheet['!cols'] = [
      { wch: 4 },
      { wch: 12 },
      { wch: 22 },
      { wch: 18 },
      { wch: 24 },
      { wch: 12 },
      { wch: 28 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 16 },
    ];

    XLSX.writeFile(workbook, `Roster_Shift_HCGA_Minggu_${selectedWeekIndex + 1}_Nov_2026.xlsx`);
    setAlertInfo({
      type: 'success',
      message: `Roster Shift ${currentWeek.label} berhasil diekspor ke Excel.`,
    });
  };

  // Helper Badge Shift Sel
  const renderShiftCellBadge = (emp, day) => {
    const shiftInfo = getEmployeeShiftForDay(emp, day);
    return (
      <span
        title={shiftInfo.label}
        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] border ${shiftInfo.badgeClass}`}
      >
        {shiftInfo.code}
      </span>
    );
  };

  return (
    <>
      <Head title="Jadwal & Shift" />

      {/* Atomic Toast Feedback */}
      <Toast toast={alertInfo} onClose={() => setAlertInfo(null)} />

      {/* Header Halaman dengan Tombol Aksi */}
      <PageHeader
        eyebrow="WAKTU & KEHADIRAN (TIME & ATTENDANCE)"
        title="Jadwal & Roster Shift"
        subtitle="Konfigurasi jadwal kerja, matriks rotasi shift 2-grup (A/B), pemantauan beban kerja, dan permohonan tukar shift operasional."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportRoster}
              className="gap-1.5 border-emerald-600/30 text-emerald-800 hover:bg-emerald-50 bg-white"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Ekspor Roster (XLSX)</span>
            </Button>

            <Button
              size="sm"
              onClick={handleOpenAddException}
              className="gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Atur Tukar Shift</span>
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* 4 Scorecards KPI Roster Jadwal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total Personel Terjadwal
                </p>
                <p className="text-2xl font-bold font-display text-navy mt-1">
                  {stats.total} <span className="text-sm font-normal text-slate-400">Personel</span>
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {filterLocation === 'ALL'
                    ? `${stats.groupA} Grup A + ${stats.groupB} Grup B · ${stats.nonShift} Non-Shift`
                    : `${stats.groupA} Grup A + ${stats.groupB} Grup B`}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-navy/5 text-navy flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Grup Operasional A
                </p>
                <p className="text-2xl font-bold font-display text-emerald-700 mt-1">
                  {stats.groupA} <span className="text-sm font-normal text-slate-400">Personil</span>
                </p>
                <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  Shift 9 Jam (08:00 - 17:00 & 20:00 - 05:00)
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Grup Operasional B
                </p>
                <p className="text-2xl font-bold font-display text-amber-700 mt-1">
                  {stats.groupB} <span className="text-sm font-normal text-slate-400">Personil</span>
                </p>
                <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                  Shift 9 Jam (08:00 - 17:00 & 20:00 - 05:00)
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Jadwal Khusus & Tukar Shift
                </p>
                <p className="text-2xl font-bold font-display text-purple-700 mt-1">
                  {stats.totalExceptions + stats.totalManualSchedules} <span className="text-sm font-normal text-slate-400">Kasus</span>
                </p>
                <p className="text-[11px] text-purple-600 font-medium mt-0.5">
                  Penyesuaian Jadwal & Rotasi Aktif
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Switcher Segmented Control */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-100'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Matriks Roster Mingguan</span>
            <Badge className={activeTab === 'roster' ? 'bg-white/20 text-white font-mono text-[10px]' : 'bg-slate-200 text-slate-700 text-[10px]'}>
              {filteredEmployees.length}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('patterns')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'patterns'
                ? 'bg-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Rotasi Grup & Jadwal Manual</span>
            <Badge className={activeTab === 'patterns' ? 'bg-white/20 text-white font-mono text-[10px]' : 'bg-slate-200 text-slate-700 text-[10px]'}>
              {employees.length}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exceptions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'exceptions'
                ? 'bg-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-100'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Log Pengecualian & Tukar Shift</span>
            <Badge className={activeTab === 'exceptions' ? 'bg-white/20 text-white font-mono text-[10px]' : 'bg-slate-200 text-slate-700 text-[10px]'}>
              {exceptions.length}
            </Badge>
          </button>
        </div>

        {/* TAMPILAN 1: MATRIKS ROSTER MINGGUAN */}
        {activeTab === 'roster' && (
          <Card className="border-slate-200 shadow-2xs">
            {/* Header Roster & Navigasi Minggu */}
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-[#c4a266]" />
                  Kalender Matriks Roster Kerja Karyawan
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Distribusi penugasan shift mingguan seluruh personil operasional pabrik, gudang, dan kantor.
                </CardDescription>
              </div>

              {/* Selector Navigasi Minggu */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1 self-start md:self-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedWeekIndex(Math.max(0, selectedWeekIndex - 1))}
                  disabled={selectedWeekIndex === 0}
                  className="h-7 w-7 p-0 text-slate-600 hover:text-navy"
                  aria-label="Minggu Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <span className="text-xs font-bold text-navy px-2 whitespace-nowrap">
                  {currentWeek.label}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedWeekIndex(Math.min(WEEKS.length - 1, selectedWeekIndex + 1))}
                  disabled={selectedWeekIndex === WEEKS.length - 1}
                  className="h-7 w-7 p-0 text-slate-600 hover:text-navy"
                  aria-label="Minggu Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Segmented Location Controller (Mariuk & Cimalaka) */}
            <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="inline-flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setFilterLocation('ALL')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    filterLocation === 'ALL'
                      ? 'bg-navy text-white shadow-xs'
                      : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                  }`}
                >
                  Semua Lokasi ({employees.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterLocation('Lokasi Mariuk')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    filterLocation === 'Lokasi Mariuk'
                      ? 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  Mariuk ({employees.filter((e) => e.location === 'Lokasi Mariuk').length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterLocation('Lokasi Cimalaka')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    filterLocation === 'Lokasi Cimalaka'
                      ? 'bg-indigo-50 text-indigo-900 border border-indigo-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  Cimalaka ({employees.filter((e) => e.location === 'Lokasi Cimalaka').length})
                </button>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Roster Operasional · Shift Pagi 08:00-17:00 & Shift Malam 20:00-05:00 WIB</span>
              </div>
            </div>

            {/* Atomic Toolbar & Filters */}
            <TableToolbar>
              <TableSearch
                placeholder="Cari nama karyawan, NIP, atau jabatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <TableFilterGroup>
                {/* Filter Lokasi Penempatan */}
                <TableSelect
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  title="Filter Lokasi Kerja"
                >
                  <option value="ALL">Semua Lokasi</option>
                  <option value="Lokasi Mariuk">📍 Lokasi Mariuk</option>
                  <option value="Lokasi Cimalaka">📍 Lokasi Cimalaka</option>
                </TableSelect>

                {/* Filter Divisi */}
                <TableSelect
                  value={filterDivision}
                  onChange={(e) => setFilterDivision(e.target.value)}
                  title="Filter Divisi"
                >
                  <option value="ALL">Semua Divisi</option>
                  <option value="Operasional & Lapangan">Operasional & Lapangan</option>
                  <option value="Logistik & Gudang">Logistik & Gudang</option>
                  <option value="Security & Safety">Security & Safety</option>
                  <option value="Human Capital & GA">Human Capital & GA</option>
                </TableSelect>

                {/* Filter Grup */}
                <TableSelect
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  title="Filter Grup"
                >
                  <option value="ALL">Semua Grup</option>
                  <option value="Grup A">Grup A</option>
                  <option value="Grup B">Grup B</option>
                  <option value="Belum Ditetapkan">Belum Ditetapkan</option>
                  <option value="Non-Shift">Non-Shift (Staff)</option>
                </TableSelect>

                {/* Reset Filters */}
                {(searchQuery || filterLocation !== 'ALL' || filterDivision !== 'ALL' || filterGroup !== 'ALL') && (
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

            {/* Tabel Matriks Roster */}
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b border-slate-200">
                    <TableHead className="w-12 text-center text-xs font-semibold text-slate-600">
                      No
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[200px]">
                      Karyawan
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[140px]">
                      Divisi & Grup
                    </TableHead>

                    {/* 7 Kolom Hari dalam Minggu Terpilih */}
                    {currentWeek.days.map((day) => (
                      <TableHead
                        key={day.key}
                        className={`text-center text-xs font-bold w-24 ${
                          day.isWeekend ? 'bg-slate-100/70 text-slate-600' : 'text-slate-800'
                        }`}
                      >
                        <div>{day.label}</div>
                        <div className="text-[10px] font-normal text-slate-400">{day.date}</div>
                      </TableHead>
                    ))}

                    <TableHead className="text-center text-xs font-semibold text-slate-600 w-24">
                      Total Jam
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedEmployees.length === 0 ? (
                    <TableEmpty colSpan={11} message="Tidak ada data karyawan yang cocok dengan kriteria filter." />
                  ) : (
                    paginatedEmployees.map((emp, index) => {
                      const globalIndex = (currentPage - 1) * perPage + index + 1;
                      const weeklyHours = calculateWeeklyHours(emp, currentWeek.days);
                      const dutyDays = weeklyHours > 0 ? (weeklyHours >= 8 ? Math.round(weeklyHours / 8) : 1) : 0;
                      const isMariuk = emp.location?.includes('Mariuk');
                      const isCimalaka = emp.location?.includes('Cimalaka');

                      return (
                        <TableRow key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                          <TableCell className="text-center font-medium text-slate-500 text-xs">
                            {globalIndex}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-navy/10 text-navy font-bold flex items-center justify-center text-xs flex-shrink-0">
                                {emp.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join('')}
                              </div>
                              <div>
                                <p className="font-bold text-navy text-xs">{emp.name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[11px] text-slate-500 font-mono">{emp.nip}</span>
                                  <span className="text-[11px] text-slate-400">•</span>
                                  <span className="text-[11px] text-slate-500">{emp.role}</span>
                                  {emp.location && (
                                    <span
                                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                        isMariuk
                                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                          : isCimalaka
                                          ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                                          : 'bg-slate-100 text-slate-700'
                                      }`}
                                    >
                                      {isMariuk ? 'Mariuk' : isCimalaka ? 'Cimalaka' : emp.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-xs text-slate-800 font-medium">{emp.division || '-'}</p>
                            <span
                              className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                                emp.group === 'Grup A'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : emp.group === 'Grup B'
                                  ? 'bg-amber-100 text-amber-800'
                                  : emp.group === 'Belum Ditetapkan'
                                  ? 'bg-slate-200 text-slate-700'
                                  : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              {emp.group}
                            </span>
                          </TableCell>

                          {/* 7 Sel Hari */}
                          {currentWeek.days.map((day) => (
                            <TableCell key={day.key} className="text-center p-2">
                              {renderShiftCellBadge(emp, day)}
                            </TableCell>
                          ))}

                          <TableCell className="text-center font-bold text-xs text-slate-800">
                            <div>
                              <span>{weeklyHours} Jam</span>
                              <span className="block text-[10px] font-normal text-slate-400">
                                ({dutyDays} Hari Dinas)
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>

              {/* Pagination Roster */}
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={totalFiltered}
                perPage={perPage}
                onPageChange={(page) => setCurrentPage(page)}
                onPerPageChange={(newPerPage) => {
                  setPerPage(newPerPage);
                  setCurrentPage(1);
                }}
              />

              {/* Footer Roster Info & Legenda */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-slate-700">Legenda Kode:</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
                    <strong>PAGI (08-17)</strong>: Shift Pagi 9 Jam
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded bg-indigo-600 inline-block" />
                    <strong>MALAM (20-05)</strong>: Shift Malam 9 Jam
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded bg-sky-600 inline-block" />
                    <strong>NON</strong>: Office (08-17)
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded bg-purple-600 inline-block" />
                    <strong>SWAP</strong>: Tukar Shift Resmi
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded bg-rose-600 inline-block" />
                    <strong>LIBUR</strong>: Hari Libur Operasional
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded bg-slate-400 inline-block" />
                    <strong>OFF</strong>: Libur Pasca-Dinas
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  Menampilkan <strong>{paginatedEmployees.length}</strong> dari <strong>{filteredEmployees.length}</strong> tersaring (Total <strong>{employees.length}</strong> karyawan)
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAMPILAN 2: ROTASI GRUP & PERUBAHAN JADWAL MANUAL */}
        {activeTab === 'patterns' && (
          <PanelRotasiGrup
            employees={employees}
            onUpdateEmployeeGroup={handleUpdateEmployeeGroup}
            onBulkUpdateGroup={handleBulkUpdateGroup}
            onSwapAll={handleSwapAllGroups}
            manualSchedules={manualSchedules}
            onSaveManualSchedule={handleSaveManualSchedule}
            onDeleteManualSchedule={handleDeleteManualSchedule}
          />
        )}

        {/* TAMPILAN 3: LOG PENGECUALIAN & TUKAR SHIFT */}
        {activeTab === 'exceptions' && (
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-purple-600" />
                  Daftar Pengecualian & Tukar Shift Operasional
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Rekam permohonan tukar shift dan penugasan shift khusus yang disetujui HCGA.
                </CardDescription>
              </div>

              <Button
                size="sm"
                onClick={handleOpenAddException}
                className="gap-1.5 text-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tukar Shift Baru</span>
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b border-slate-200">
                    <TableHead className="w-12 text-center text-xs font-semibold text-slate-600">No</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Tanggal Efektif</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Karyawan Pemohon</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Shift Semula</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Rekan Pengganti / Shift Baru</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Alasan Operasional</TableHead>
                    <TableHead className="text-center text-xs font-semibold text-slate-600">Status</TableHead>
                    <TableHead className="text-right pr-4 text-xs font-semibold text-slate-600">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exceptions.length === 0 ? (
                    <TableEmpty colSpan={8} message="Belum ada catatan pengecualian atau tukar shift aktif." />
                  ) : (
                    exceptions.map((item, index) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <TableCell className="text-center font-medium text-slate-500 text-xs">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-navy">
                          {item.dateFormatted}
                        </TableCell>
                        <TableCell>
                          <p
                            onClick={() => handleOpenEditException(item)}
                            className="font-bold text-navy hover:text-[#c4a266] transition-colors cursor-pointer text-xs"
                            title="Klik untuk ubah pengecualian"
                          >
                            {item.employeeName}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">{item.employeeNip}</p>
                        </TableCell>
                        <TableCell className="text-xs text-slate-700">
                          {item.sourceShift}
                        </TableCell>
                        <TableCell>
                          {item.type === 'swap' ? (
                            <div>
                              <p className="font-bold text-purple-900 text-xs flex items-center gap-1">
                                <ArrowLeftRight className="w-3 h-3 text-purple-600" />
                                {item.targetEmployeeName}
                              </p>
                              <p className="text-[11px] text-slate-500 font-mono">{item.targetEmployeeNip}</p>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-navy">
                              {item.targetShift}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 max-w-xs truncate" title={item.reason}>
                          {item.reason}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-medium">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 inline" />
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditException(item)}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-navy hover:bg-slate-100"
                              title="Ubah Pengecualian"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteException(item.id)}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Batalkan Pengecualian"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="p-4 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-500">
                Pengecualian yang disetujui di sini akan secara otomatis dijadikan acuan batas toleransi masuk pada modul <strong>Catatan Kehadiran</strong>.
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal Form Tukar Shift & Pengecualian */}
      <ModalFormTukarShift
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveException}
        employees={employees}
        initialData={editingException}
      />
    </>
  );
}
