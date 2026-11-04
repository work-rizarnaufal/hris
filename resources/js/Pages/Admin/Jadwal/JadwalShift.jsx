import React, { useState, useMemo, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import * as XLSX from 'xlsx';
import { getHolidays, formatDateDMY } from '@/services/systemSettings.js';
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
  Toast,
} from '@/components/ui';
import ModalFormTukarShift from './Partials/ModalFormTukarShift.jsx';
import PanelRotasiGrup from './Partials/PanelRotasiGrup.jsx';

// Data Induk Karyawan & Jadwal Default
const EMPLOYEES_SCHEDULE = [
  {
    id: 1,
    name: 'Budi Santoso',
    nip: 'HC-0101',
    role: 'Senior Operator Lapangan',
    division: 'Operasional & Lapangan',
    location: 'Pabrik A (Sidoarjo)',
    group: 'Grup A',
    baseShift: 'Shift 1 (07:00 - 15:00)',
    shiftCode: 'S1',
  },
  {
    id: 2,
    name: 'Siti Rahmawati',
    nip: 'HC-0102',
    role: 'HCGA Specialist',
    division: 'Human Capital & GA',
    location: 'Kantor Utama (Surabaya)',
    group: 'Non-Shift',
    baseShift: 'Normal Office (08:00 - 17:00)',
    shiftCode: 'NON',
  },
  {
    id: 3,
    name: 'Ahmad Fauzi',
    nip: 'HC-0103',
    role: 'Operator Forklift Utama',
    division: 'Logistik & Gudang',
    location: 'Gudang B (Rungkut)',
    group: 'Grup B',
    baseShift: 'Shift 2 (15:00 - 23:00)',
    shiftCode: 'S2',
  },
  {
    id: 4,
    name: 'Dewi Anggraini',
    nip: 'HC-0104',
    role: 'Quality Assurance Inspector',
    division: 'Operasional & Lapangan',
    location: 'Pabrik A (Sidoarjo)',
    group: 'Grup A',
    baseShift: 'Shift 1 (07:00 - 15:00)',
    shiftCode: 'S1',
  },
  {
    id: 5,
    name: 'Hendra Wijaya',
    nip: 'HC-0105',
    role: 'Danru Keamanan & K3',
    division: 'Security & Safety',
    location: 'Site Operasional (Gresik)',
    group: 'Grup A',
    baseShift: 'Security Shift 1 (06:30 - 14:30)',
    shiftCode: 'SEC1',
  },
  {
    id: 6,
    name: 'Rina Marlina',
    nip: 'HC-0106',
    role: 'Staf Administrasi Payroll',
    division: 'Human Capital & GA',
    location: 'Kantor Utama (Surabaya)',
    group: 'Non-Shift',
    baseShift: 'Normal Office (08:00 - 17:00)',
    shiftCode: 'NON',
  },
  {
    id: 7,
    name: 'Eko Prasetyo',
    nip: 'HC-0107',
    role: 'Teknisi Maintenance Mesin',
    division: 'Operasional & Lapangan',
    location: 'Pabrik A (Sidoarjo)',
    group: 'Grup B',
    baseShift: 'Shift 2 (15:00 - 23:00)',
    shiftCode: 'S2',
  },
  {
    id: 8,
    name: 'Maya Indah Lestari',
    nip: 'HC-0108',
    role: 'Koordinator Gudang Bahan Baku',
    division: 'Logistik & Gudang',
    location: 'Gudang B (Rungkut)',
    group: 'Non-Shift',
    baseShift: 'Normal Office (08:00 - 17:00)',
    shiftCode: 'NON',
  },
  {
    id: 9,
    name: 'Joko Susilo',
    nip: 'HC-0109',
    role: 'Anggota Patroli Keamanan',
    division: 'Security & Safety',
    location: 'Pabrik A (Sidoarjo)',
    group: 'Grup B',
    baseShift: 'Security Shift 2 (14:30 - 22:30)',
    shiftCode: 'SEC2',
  },
  {
    id: 10,
    name: 'Dian Kusuma',
    nip: 'HC-0110',
    role: 'IT Support & Sistem HRIS',
    division: 'Human Capital & GA',
    location: 'Kantor Utama (Surabaya)',
    group: 'Non-Shift',
    baseShift: 'Normal Office (08:00 - 17:00)',
    shiftCode: 'NON',
  },
  {
    id: 11,
    name: 'Wahyu Hidayat',
    nip: 'HC-0111',
    role: 'Operator Mesin CNC Milling',
    division: 'Operasional & Lapangan',
    location: 'Pabrik A (Sidoarjo)',
    group: 'Grup A',
    baseShift: 'Shift 1 (07:00 - 15:00)',
    shiftCode: 'S1',
  },
  {
    id: 12,
    name: 'Nurul Aini',
    nip: 'HC-0112',
    role: 'Petugas Inventory & Stok',
    division: 'Logistik & Gudang',
    location: 'Gudang B (Rungkut)',
    group: 'Grup A',
    baseShift: 'Shift 1 (07:00 - 15:00)',
    shiftCode: 'S1',
  },
];

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

export default function JadwalShift() {
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'patterns' | 'exceptions'
  const [employees, setEmployees] = useState(EMPLOYEES_SCHEDULE);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [filterDivision, setFilterDivision] = useState('ALL');
  const [filterGroup, setFilterGroup] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  // Daftar Pengecualian & Tukar Shift Aktif
  const [exceptions, setExceptions] = useState([
    {
      id: 1,
      date: '2026-11-04',
      dateFormatted: '04/11/2026',
      type: 'swap',
      employeeId: 3,
      employeeName: 'Ahmad Fauzi',
      employeeNip: 'HC-0103',
      sourceShift: 'Shift 2 (15:00 - 23:00)',
      targetEmployeeId: 1,
      targetEmployeeName: 'Budi Santoso',
      targetEmployeeNip: 'HC-0101',
      targetShift: 'Shift 1 (07:00 - 15:00)',
      reason: 'Keperluan muat logistik pagi pabrik A & urusan keluarga malam',
      status: 'Disetujui HCGA',
    },
    {
      id: 2,
      date: '2026-11-06',
      dateFormatted: '06/11/2026',
      type: 'override',
      employeeId: 9,
      employeeName: 'Joko Susilo',
      employeeNip: 'HC-0109',
      sourceShift: 'Security Shift 2 (14:30 - 22:30)',
      targetEmployeeName: '-',
      targetEmployeeNip: '-',
      targetShift: 'Security Shift 1 (06:30 - 14:30)',
      reason: 'Penugasan khusus pengawalan audit K3 gerbang utama',
      status: 'Disetujui HCGA',
    },
  ]);

  // Daftar Perubahan Jadwal Operasional Manual
  const [manualSchedules, setManualSchedules] = useState([
    {
      id: 1,
      startDate: '2026-11-05',
      startDateFormatted: '05/11/2026',
      targetGroup: 'Grup B',
      shift1In: '06:00',
      shift1Out: '14:00',
      shift2In: '14:00',
      shift2Out: '22:00',
      reason: 'Penyesuaian jam operasional paska maintenance mesin turbin',
      status: 'Aktif',
    },
  ]);

  // Kalender Hari Libur Resmi yang Disinkronkan dari Modul Pengaturan Sistem
  const [holidays, setHolidays] = useState(() => getHolidays());

  // Listener Sinkronisasi Otomatis jika Pengaturan Hari Libur Diubah di Tab Lain/Modul Pengaturan
  useEffect(() => {
    const handleSync = () => {
      setHolidays(getHolidays());
    };
    window.addEventListener('hris:settings-updated', handleSync);
    return () => window.removeEventListener('hris:settings-updated', handleSync);
  }, []);

  const currentWeek = WEEKS[selectedWeekIndex];

  // Filter Karyawan
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchDivision = filterDivision === 'ALL' || emp.division === filterDivision;
      const matchGroup = filterGroup === 'ALL' || emp.group === filterGroup;
      const matchSearch =
        searchQuery === '' ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDivision && matchGroup && matchSearch;
    });
  }, [employees, filterDivision, filterGroup, searchQuery]);

  // Statistik Ringkasan Jadwal
  const stats = useMemo(() => {
    const total = employees.length;
    const groupA = employees.filter((e) => e.group === 'Grup A').length;
    const groupB = employees.filter((e) => e.group === 'Grup B').length;
    const unassigned = employees.filter((e) => e.group === 'Belum Ditetapkan').length;
    const nonShift = employees.filter((e) => e.group === 'Non-Shift').length;
    const totalExceptions = exceptions.length;
    const totalManualSchedules = manualSchedules.length;
    return { total, groupA, groupB, unassigned, nonShift, totalExceptions, totalManualSchedules };
  }, [employees, exceptions, manualSchedules]);

  // Handle Update Grup Karyawan per Individu (dari Kolom Dropdown)
  const handleUpdateEmployeeGroup = (empId, newGroup) => {
    const targetEmp = employees.find((e) => e.id === empId);
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === empId ? { ...emp, group: newGroup } : emp))
    );
    setAlertInfo({
      type: 'success',
      message: `Grup kerja ${targetEmp?.name || 'personil'} berhasil diubah menjadi ${newGroup}.`,
    });
  };

  // Handle Pemindahan Massal (Bulk Update Group)
  const handleBulkUpdateGroup = (selectedIds, targetGroup) => {
    setEmployees((prev) =>
      prev.map((emp) => (selectedIds.includes(emp.id) ? { ...emp, group: targetGroup } : emp))
    );
    setAlertInfo({
      type: 'success',
      message: `${selectedIds.length} personil berhasil dipindahkan ke ${targetGroup}.`,
    });
  };

  // Handle Tukar Semua Personil Grup A dan Grup B
  const handleSwapAllGroups = () => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.group === 'Grup A') return { ...emp, group: 'Grup B' };
        if (emp.group === 'Grup B') return { ...emp, group: 'Grup A' };
        return emp;
      })
    );
    setAlertInfo({
      type: 'success',
      message: 'Rotasi siklus berhasil: Seluruh personil Grup A & B berhasil ditukar jadwal gilirannya.',
    });
  };

  // Handle Simpan Pengecualian / Tukar Shift Baru
  const handleSaveException = (newException) => {
    setExceptions([
      {
        id: Date.now(),
        ...newException,
        dateFormatted: formatDateDMY(newException.date),
      },
      ...exceptions,
    ]);

    setAlertInfo({
      type: 'success',
      message: `Pengecualian jadwal untuk ${newException.employeeName} berhasil disimpan dan disinkronkan.`,
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

    // Hari Minggu selalu Libur (OFF) bagi seluruh regu operasional
    if (day.key === 'd7') {
      return {
        code: 'OFF',
        label: 'Libur Mingguan (OFF)',
        badgeClass: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
      };
    }

    const isGroupA = emp.group === 'Grup A';
    const isGroupB = emp.group === 'Grup B';
    const isSec = emp.shiftCode.includes('SEC') || emp.division === 'Security & Safety';
    const dayNum = parseInt(day.key.replace('d', ''), 10); // 1 = Senin, 2 = Selasa, 3 = Rabu, 4 = Kamis, 5 = Jumat, 6 = Sabtu

    // Aturan Permanen:
    // Grup A masuk hari ganjil: 1 (Senin), 3 (Rabu), 5 (Jumat). Selasa, Kamis, Sabtu LIBUR (OFF).
    // Grup B masuk hari genap: 2 (Selasa), 4 (Kamis), 6 (Sabtu). Senin, Rabu, Jumat LIBUR (OFF).
    const isOddDay = dayNum % 2 === 1;
    const isWorkingDay = isGroupA ? isOddDay : isGroupB ? !isOddDay : false;

    if (!isWorkingDay) {
      return {
        code: 'OFF',
        label: 'Libur Roster Bergantian (OFF)',
        badgeClass: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
      };
    }

    // Jika hari kerja operasional: Tampilkan shift personil (Pagi atau Sore)
    if (isSec) {
      const isSec2 = emp.shiftCode === 'SEC2' || (emp.baseShift && emp.baseShift.includes('Shift 2'));
      return {
        code: isSec2 ? 'SEC2' : 'SEC1',
        label: isSec2 ? 'Security Shift 2 (Sore: 14:30 - 22:30)' : 'Security Shift 1 (Pagi: 06:30 - 14:30)',
        badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200 font-bold',
      };
    }

    const isShift2 = emp.shiftCode === 'S2' || (emp.baseShift && emp.baseShift.includes('Shift 2'));
    if (isShift2) {
      return {
        code: 'S2 (15-23)',
        label: 'Shift 2 (Sore: 15:00 - 23:00)',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
      };
    }

    return {
      code: 'S1 (07-15)',
      label: 'Shift 1 (Pagi: 07:00 - 15:00)',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
    };
  };

  // Ekspor Excel Roster Mingguan
  const handleExportRoster = () => {
    const rows = filteredEmployees.map((emp, index) => {
      const row = {
        No: index + 1,
        NIP: emp.nip,
        'Nama Karyawan': emp.name,
        Divisi: emp.division,
        Grup: emp.group,
        'Shift Dasar': emp.baseShift,
      };

      currentWeek.days.forEach((day) => {
        const shiftInfo = getEmployeeShiftForDay(emp, day);
        row[`${day.label} (${day.date})`] = shiftInfo.code;
      });

      row['Total Jam Kerja'] = '40 Jam';
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Roster Shift');

    worksheet['!cols'] = [
      { wch: 4 },
      { wch: 12 },
      { wch: 22 },
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
              onClick={() => setIsModalOpen(true)}
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
                  Total Terjadwal
                </p>
                <p className="text-2xl font-bold font-display text-navy mt-1">
                  {stats.total} <span className="text-sm font-normal text-slate-400">Karyawan</span>
                </p>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                  100% Tercover Roster
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
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Masuk: Sen, Rab, Jum (Off: Sel, Kam, Sab)
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
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Masuk: Sel, Kam, Sab (Off: Sen, Rab, Jum)
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
                  Jadwal Manual & Tukar Shift
                </p>
                <p className="text-2xl font-bold font-display text-purple-700 mt-1">
                  {stats.totalExceptions + stats.totalManualSchedules} <span className="text-sm font-normal text-slate-400">Kasus</span>
                </p>
                <p className="text-[11px] text-purple-600 font-medium mt-0.5">
                  {stats.totalManualSchedules} Jadwal Manual • {stats.totalExceptions} Tukar Shift
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Switcher Segmented Control */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
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

            {/* Atomic Toolbar & Filters */}
            <TableToolbar>
              <TableSearch
                placeholder="Cari nama karyawan, NIP, atau jabatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <TableFilterGroup>
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
                  <option value="Grup A">Grup A (Sen/Rab/Jum)</option>
                  <option value="Grup B">Grup B (Sel/Kam/Sab)</option>
                  <option value="Belum Ditetapkan">Belum Ditetapkan</option>
                  <option value="Non-Shift">Non-Shift (Kantor)</option>
                </TableSelect>

                {/* Reset Filters */}
                {(searchQuery || filterDivision !== 'ALL' || filterGroup !== 'ALL') && (
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
                  {filteredEmployees.length === 0 ? (
                    <TableEmpty colSpan={11} message="Tidak ada data karyawan yang cocok dengan kriteria filter." />
                  ) : (
                    filteredEmployees.map((emp, index) => (
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
                          <span
                            className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
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
                          40 Jam
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Footer Roster Info & Legenda */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-slate-700">Legenda Kode:</span>
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" /> S1 (Pagi 07-15)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded bg-amber-600 inline-block" /> S2 (Siang 15-23)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded bg-sky-600 inline-block" /> NON (Office 08-17)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded bg-purple-600 inline-block" /> SWAP (Tukar Shift)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded bg-rose-600 inline-block" /> LIBUR (Hari Libur Resmi)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded bg-slate-400 inline-block" /> OFF (Libur Roster)
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  Menampilkan <strong>{filteredEmployees.length}</strong> dari total <strong>{employees.length}</strong> karyawan
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
                onClick={() => setIsModalOpen(true)}
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
                          <p className="font-bold text-slate-900 text-xs">{item.employeeName}</p>
                          <p className="text-[11px] text-slate-500">{item.employeeNip}</p>
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
                              <p className="text-[11px] text-slate-500">{item.targetEmployeeNip}</p>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-navy">
                              {item.targetShift}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 max-w-xs truncate">
                          {item.reason}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-medium">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 inline" />
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteException(item.id)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Batalkan Pengecualian"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
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
      />
    </>
  );
}
