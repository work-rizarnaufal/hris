import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import * as XLSX from 'xlsx';
import { getHolidays, getShiftSettings, formatDateDMY } from '@/services/systemSettings.js';
import {
  CalendarDays,
  Clock,
  ArrowLeftRight,
  Plus,
  FileSpreadsheet,
} from 'lucide-react';
import {
  Button,
  Badge,
  PageHeader,
  Toast,
} from '@/components/ui';
import ModalFormTukarShift from './Partials/ModalFormTukarShift.jsx';
import PanelRotasiGrup from './Partials/PanelRotasiGrup.jsx';
import JadwalKpiCards from './Partials/JadwalKpiCards.jsx';
import JadwalRosterTab from './Partials/JadwalRosterTab.jsx';
import JadwalExceptionsTab from './Partials/JadwalExceptionsTab.jsx';

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
}) {
  // Normalisasi data karyawan langsung via useMemo tanpa mirroring state
  const employees = useMemo(() => {
    if (!dbEmployees || dbEmployees.length === 0) return [];
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
  }, [dbEmployees]);

  // Ekstraksi divisi dinamis langsung dari master data karyawan
  const availableDivisions = useMemo(() => {
    const set = new Set();
    employees.forEach((e) => {
      if (e.division && e.division !== '-' && e.division !== 'Belum Ditetapkan') {
        set.add(e.division);
      }
    });
    return Array.from(set).sort();
  }, [employees]);

  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'patterns' | 'exceptions'
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

  // Handle Update Grup Karyawan per Individu
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
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    filterLocation !== 'ALL' ||
    filterDivision !== 'ALL' ||
    filterGroup !== 'ALL';

  const resetFilters = () => {
    setFilterLocation('ALL');
    setFilterDivision('ALL');
    setFilterGroup('ALL');
    setSearchQuery('');
  };

  // Helper penentuan shift dinamis per hari (Aturan Permanen: 1 Hari 2 Shift, Bergantian Antar-Grup)
  const getEmployeeShiftForDay = (emp, day) => {
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

    if (emp.group === 'Belum Ditetapkan') {
      return {
        code: 'UNSET',
        label: 'Grup Kerja Belum Ditetapkan',
        badgeClass: 'bg-slate-100 text-slate-400 border-slate-200 font-medium',
      };
    }

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

    const activeHoliday = holidays.find((h) => h.date === dayDateStr);
    const activeManual = manualSchedules.find((m) => m.startDate === dayDateStr);

    if (activeHoliday) {
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

      return {
        code: 'LIBUR',
        label: `${activeHoliday.category}: ${activeHoliday.name} - ${activeHoliday.operationalNote}`,
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200 font-bold',
      };
    }

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
    const dayNum = parseInt(day.key.replace('d', ''), 10);

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
        <JadwalKpiCards stats={stats} filterLocation={filterLocation} />

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
          <JadwalRosterTab
            currentWeek={currentWeek}
            selectedWeekIndex={selectedWeekIndex}
            totalWeeks={WEEKS.length}
            onWeekChange={setSelectedWeekIndex}
            employees={employees}
            filteredEmployees={filteredEmployees}
            paginatedEmployees={paginatedEmployees}
            filterLocation={filterLocation}
            onLocationChange={setFilterLocation}
            filterDivision={filterDivision}
            onDivisionChange={setFilterDivision}
            availableDivisions={availableDivisions}
            filterGroup={filterGroup}
            onGroupChange={setFilterGroup}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onResetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
            currentPage={currentPage}
            totalPages={totalPages}
            totalFiltered={totalFiltered}
            perPage={perPage}
            onPageChange={setCurrentPage}
            onPerPageChange={setPerPage}
            calculateWeeklyHours={calculateWeeklyHours}
            renderShiftCellBadge={renderShiftCellBadge}
          />
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
          <JadwalExceptionsTab
            exceptions={exceptions}
            onOpenAdd={handleOpenAddException}
            onOpenEdit={handleOpenEditException}
            onDeleteException={handleDeleteException}
          />
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
