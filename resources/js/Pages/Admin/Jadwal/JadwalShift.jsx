import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
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
import {
  WEEKS,
  getEmployeeShiftForDay,
  calculateWeeklyHours,
  exportRosterToExcel,
} from './services/rosterUtils.js';

export default function JadwalShift({
  dbEmployees = [],
  dbLocations = [],
  dbShifts = [],
}) {
  const employees = useMemo(() => {
    if (!dbEmployees || dbEmployees.length === 0) return [];
    return dbEmployees.map((emp) => {
      const group = emp.shift_group || emp.group || 'Belum Ditetapkan';
      const isNonShift = group === 'Non-Shift';
      const isUnset = group === 'Belum Ditetapkan';

      return {
        id: emp.id,
        name: emp.name,
        nip: emp.nip,
        role: emp.role || emp.position || emp.role_title || '-',
        division: emp.division || '-',
        location: emp.location?.name || (emp.location_id === 1 ? 'Lokasi Mariuk' : 'Lokasi Cimalaka'),
        location_id: emp.location_id,
        group,
        baseShift: isNonShift
          ? 'Non-Shift Kantor (08:00 - 17:00)'
          : isUnset
          ? (emp.shift?.name || 'Belum Ditentukan')
          : (emp.shift?.name || 'Shift Pagi (08:00 - 17:00)'),
        shiftCode: isNonShift
          ? 'OFFICE'
          : isUnset
          ? (emp.shift?.code || '-')
          : (emp.shift?.code || 'PAGI'),
      };
    });
  }, [dbEmployees]);

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

  const STORAGE_KEYS_JADWAL = {
    MANUAL_SCHEDULES: 'hris_manual_schedules',
    EXCEPTIONS: 'hris_shift_exceptions',
  };

  const [exceptions, setExceptions] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS_JADWAL.EXCEPTIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [manualSchedules, setManualSchedules] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS_JADWAL.MANUAL_SCHEDULES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS_JADWAL.EXCEPTIONS, JSON.stringify(exceptions));
    }
  }, [exceptions]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS_JADWAL.MANUAL_SCHEDULES, JSON.stringify(manualSchedules));
    }
  }, [manualSchedules]);

  const [holidays, setHolidays] = useState(() => getHolidays());
  const [shiftSettings, setShiftSettings] = useState(() => getShiftSettings());

  useEffect(() => {
    const handleSync = () => {
      setHolidays(getHolidays());
      setShiftSettings(getShiftSettings());
    };
    window.addEventListener('hris:settings-updated', handleSync);
    return () => window.removeEventListener('hris:settings-updated', handleSync);
  }, []);

  const currentWeek = WEEKS[selectedWeekIndex];

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

  useEffect(() => {
    setCurrentPage(1);
  }, [filterLocation, filterDivision, filterGroup, searchQuery, selectedWeekIndex]);

  const totalFiltered = filteredEmployees.length;
  const totalPages = Math.ceil(totalFiltered / perPage) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredEmployees.slice(start, start + perPage);
  }, [filteredEmployees, currentPage, perPage]);

  // Statistik Ringkasan Jadwal (Single Pass)
  const stats = useMemo(() => {
    let total = 0;
    let groupA = 0;
    let groupB = 0;
    let unassigned = 0;
    let nonShift = 0;

    employees.forEach((e) => {
      if (filterLocation === 'ALL' || e.location === filterLocation) {
        total++;
        if (e.group === 'Grup A') groupA++;
        else if (e.group === 'Grup B') groupB++;
        else if (e.group === 'Non-Shift') nonShift++;
        else unassigned++;
      }
    });

    const totalExceptions = exceptions.filter((ex) => {
      const emp = employees.find((e) => e.id === ex.employeeId);
      return filterLocation === 'ALL' || emp?.location === filterLocation;
    }).length;

    return {
      total,
      groupA,
      groupB,
      unassigned,
      nonShift,
      totalExceptions,
      totalManualSchedules: manualSchedules.length,
    };
  }, [employees, exceptions, manualSchedules, filterLocation]);

  const handleUpdateEmployeeGroup = (empId, newGroup) => {
    const targetEmp = employees.find((e) => e.id === empId);
    router.put(`/jadwal/employee/${empId}/group`, { group: newGroup }, {
      preserveScroll: true,
      onSuccess: (page) => {
        const flash = page.props?.flash;
        setAlertInfo({
          type: 'success',
          message: flash?.success || `Grup kerja ${targetEmp?.name || 'personil'} berhasil diubah menjadi ${newGroup}.`,
        });
      },
      onError: () => {
        setAlertInfo({ type: 'error', message: 'Gagal mengubah grup kerja.' });
      },
    });
  };

  const handleBulkUpdateGroup = (selectedIds, targetGroup) => {
    router.post('/jadwal/bulk-update-group', { employee_ids: selectedIds, group: targetGroup }, {
      preserveScroll: true,
      onSuccess: (page) => {
        const flash = page.props?.flash;
        setAlertInfo({
          type: 'success',
          message: flash?.success || `${selectedIds.length} personil berhasil dipindahkan ke ${targetGroup}.`,
        });
      },
      onError: () => {
        setAlertInfo({ type: 'error', message: 'Gagal memindahkan grup personil.' });
      },
    });
  };

  const handleSwapAllGroups = () => {
    router.post('/jadwal/swap-group', {}, {
      preserveScroll: true,
      onSuccess: (page) => {
        const flash = page.props?.flash;
        if (flash?.warning) {
          setAlertInfo({ type: 'warning', message: flash.warning });
        } else {
          setAlertInfo({
            type: 'success',
            message: flash?.success || 'Rotasi siklus berhasil: Seluruh personil Grup A & B berhasil ditukar jadwal gilirannya.',
          });
        }
      },
      onError: () => {
        setAlertInfo({ type: 'error', message: 'Gagal melakukan rotasi grup.' });
      },
    });
  };

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

  const handleDeleteException = (id) => {
    setExceptions(exceptions.filter((ex) => ex.id !== id));
    setAlertInfo({
      type: 'warning',
      message: 'Pengecualian jadwal telah dibatalkan dan dikembalikan ke jadwal normal.',
    });
  };

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

  const handleDeleteManualSchedule = (id) => {
    setManualSchedules((prev) => prev.filter((m) => m.id !== id));
    setAlertInfo({
      type: 'warning',
      message: 'Perubahan jadwal operasional manual telah dihapus dan dikembalikan ke pola normal.',
    });
  };

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

  const resolverOptions = useMemo(
    () => ({
      exceptions,
      holidays,
      manualSchedules,
      shiftSettings,
      selectedWeekIndex,
    }),
    [exceptions, holidays, manualSchedules, shiftSettings, selectedWeekIndex]
  );

  const calculateHours = (emp, days) => calculateWeeklyHours(emp, days, resolverOptions);

  const handleExportRoster = () => {
    exportRosterToExcel(filteredEmployees, currentWeek, selectedWeekIndex, resolverOptions);
    setAlertInfo({
      type: 'success',
      message: `Roster Shift ${currentWeek.label} berhasil diekspor ke Excel.`,
    });
  };

  const renderShiftCellBadge = (emp, day) => {
    const shiftInfo = getEmployeeShiftForDay(emp, day, resolverOptions);
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
            calculateWeeklyHours={calculateHours}
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
            currentWeek={currentWeek}
            selectedWeekIndex={selectedWeekIndex}
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
