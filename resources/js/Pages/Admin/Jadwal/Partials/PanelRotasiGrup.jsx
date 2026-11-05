import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Building,
  Sun,
  Moon,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Plus,
  Trash2,
  MapPin,
  Pencil,
  RotateCcw,
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
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSelect,
  TableToolbar,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui';
import { formatDateDMY } from '@/services/systemSettings.js';

// Helper Format Informasi Shift Operasional (2 Baris: Kode & Waktu)
const getOperationalShiftBadge = (emp) => {
  if (emp.shiftCode === 'S1') {
    return {
      code: 'S1',
      time: '07:00 - 15:00',
      label: 'Shift 1: Pagi (07:00 - 15:00)',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    };
  }
  if (emp.shiftCode === 'S2') {
    return {
      code: 'S2',
      time: '15:00 - 23:00',
      label: 'Shift 2: Malam (15:00 - 23:00)',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    };
  }
  if (emp.shiftCode === 'NON') {
    return {
      code: 'NON',
      time: '08:00 - 17:00',
      label: 'Normal Office (08:00 - 17:00)',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    };
  }
  const match = emp.baseShift?.match(/\((.*?)\)/);
  return {
    code: emp.shiftCode || 'S1',
    time: match ? match[1] : '07:00 - 15:00',
    label: emp.baseShift || `${emp.shiftCode || 'S1'} (07:00 - 15:00)`,
    badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
  };
};

export default function PanelRotasiGrup({
  employees,
  onUpdateEmployeeGroup,
  onUpdateEmployeeAssignment,
  onBulkUpdateGroup,
  onSwapAll,
  manualSchedules = [],
  onSaveManualSchedule,
  onDeleteManualSchedule,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterGroupTab, setFilterGroupTab] = useState('ALL'); // 'ALL' | 'Grup A' | 'Grup B' | 'Belum Ditetapkan'
  const [bulkTargetGroup, setBulkTargetGroup] = useState('Grup A');
  const [rotationWeekCycle, setRotationWeekCycle] = useState('odd'); // 'odd' (Minggu 1 & 3) | 'even' (Minggu 2 & 4)

  // State Modal Edit Penugasan Karyawan
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editGroup, setEditGroup] = useState('Grup A');
  const [editShiftCode, setEditShiftCode] = useState('S1');

  // Form State Perubahan Jadwal Operasional Manual (Sesuai 7 Kriteria Revisi)
  const [startDate, setStartDate] = useState(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date())
  );
  const [targetGroup, setTargetGroup] = useState('Grup A');
  const [shift1In, setShift1In] = useState('07:00');
  const [shift1Out, setShift1Out] = useState('15:00');
  const [shift2In, setShift2In] = useState('15:00');
  const [shift2Out, setShift2Out] = useState('23:00');
  const [reason, setReason] = useState('');

  // Pisahkan personil operasional (yang ikut rotasi) dan staf kantor (non-shift)
  const operationalEmployees = useMemo(
    () => employees.filter((e) => e.group !== 'Non-Shift'),
    [employees]
  );
  const nonShiftEmployees = useMemo(
    () => employees.filter((e) => e.group === 'Non-Shift'),
    [employees]
  );

  // Filter personil berdasarkan tab filter aktif
  const filteredOperational = useMemo(() => {
    if (filterGroupTab === 'ALL') return operationalEmployees;
    return operationalEmployees.filter((e) => e.group === filterGroupTab);
  }, [operationalEmployees, filterGroupTab]);

  // Statistik per grup
  const countA = useMemo(
    () => operationalEmployees.filter((e) => e.group === 'Grup A').length,
    [operationalEmployees]
  );
  const countB = useMemo(
    () => operationalEmployees.filter((e) => e.group === 'Grup B').length,
    [operationalEmployees]
  );
  const countUnassigned = useMemo(
    () => operationalEmployees.filter((e) => e.group === 'Belum Ditetapkan').length,
    [operationalEmployees]
  );

  // Checkbox multi-select
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOperational.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOperational.map((e) => e.id));
    }
  };

  const handleApplyBulk = () => {
    if (selectedIds.length === 0) return;
    onBulkUpdateGroup(selectedIds, bulkTargetGroup);
    setSelectedIds([]);
  };

  // Handlers Aksi Roster Personil
  const handleOpenEditModal = (emp) => {
    setEditingEmployee(emp);
    setEditGroup(emp.group);
    setEditShiftCode(emp.shiftCode || 'S1');
  };

  const handleSaveEdit = (e) => {
    e?.preventDefault();
    if (!editingEmployee) return;

    const baseShiftStr =
      editShiftCode === 'S2'
        ? 'Shift 2 (15:00 - 23:00)'
        : 'Shift 1 (07:00 - 15:00)';

    if (onUpdateEmployeeAssignment) {
      onUpdateEmployeeAssignment(editingEmployee.id, {
        group: editGroup,
        shiftCode: editShiftCode,
        baseShift: baseShiftStr,
      });
    } else if (onUpdateEmployeeGroup) {
      onUpdateEmployeeGroup(editingEmployee.id, editGroup);
    }

    setEditingEmployee(null);
  };

  const handleQuickSwapGroup = (emp) => {
    const nextGroup = emp.group === 'Grup A' ? 'Grup B' : 'Grup A';
    if (onUpdateEmployeeGroup) {
      onUpdateEmployeeGroup(emp.id, nextGroup);
    }
  };

  const handleResetGroup = (emp) => {
    if (onUpdateEmployeeGroup) {
      onUpdateEmployeeGroup(emp.id, 'Belum Ditetapkan');
    }
  };

  // Submit Perubahan Manual Operasional
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim() || !startDate) return;

    if (onSaveManualSchedule) {
      onSaveManualSchedule({
        startDate,
        targetGroup,
        shift1In,
        shift1Out,
        shift2In,
        shift2Out,
        reason: reason.trim(),
      });
    }

    setReason('');
  };

  // Matriks Aturan Permanen 7 Hari (Senin s/d Minggu - Siklus Bergulir 14 Hari)
  const permanentScheduleRows = useMemo(() => {
    const isOdd = rotationWeekCycle === 'odd';
    return [
      {
        day: 'Senin',
        date: isOdd ? '02/11/2026' : '09/11/2026',
        grupAStatus: isOdd ? 'MASUK (2 Shift)' : 'LIBUR (OFF)',
        grupABadge: isOdd ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' : 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
        grupBStatus: isOdd ? 'LIBUR (OFF)' : 'MASUK (2 Shift)',
        grupBBadge: isOdd ? 'bg-slate-100 text-slate-500 border-slate-200 font-semibold' : 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
        officeStatus: 'MASUK (08:00 - 17:00)',
      },
      {
        day: 'Selasa',
        date: isOdd ? '03/11/2026' : '10/11/2026',
        grupAStatus: isOdd ? 'LIBUR (OFF)' : 'MASUK (2 Shift)',
        grupABadge: isOdd ? 'bg-slate-100 text-slate-500 border-slate-200 font-semibold' : 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
        grupBStatus: isOdd ? 'MASUK (2 Shift)' : 'LIBUR (OFF)',
        grupBBadge: isOdd ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' : 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
        officeStatus: 'MASUK (08:00 - 17:00)',
      },
      {
        day: 'Rabu',
        date: isOdd ? '04/11/2026' : '11/11/2026',
        grupAStatus: isOdd ? 'MASUK (2 Shift)' : 'LIBUR (OFF)',
        grupABadge: isOdd ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' : 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
        grupBStatus: isOdd ? 'LIBUR (OFF)' : 'MASUK (2 Shift)',
        grupBBadge: isOdd ? 'bg-slate-100 text-slate-500 border-slate-200 font-semibold' : 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
        officeStatus: 'MASUK (08:00 - 17:00)',
      },
      {
        day: 'Kamis',
        date: isOdd ? '05/11/2026' : '12/11/2026',
        grupAStatus: isOdd ? 'LIBUR (OFF)' : 'MASUK (2 Shift)',
        grupABadge: isOdd ? 'bg-slate-100 text-slate-500 border-slate-200 font-semibold' : 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
        grupBStatus: isOdd ? 'MASUK (2 Shift)' : 'LIBUR (OFF)',
        grupBBadge: isOdd ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' : 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
        officeStatus: 'MASUK (08:00 - 17:00)',
      },
      {
        day: 'Jumat',
        date: isOdd ? '06/11/2026' : '13/11/2026',
        grupAStatus: isOdd ? 'MASUK (2 Shift)' : 'LIBUR (OFF)',
        grupABadge: isOdd ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' : 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
        grupBStatus: isOdd ? 'LIBUR (OFF)' : 'MASUK (2 Shift)',
        grupBBadge: isOdd ? 'bg-slate-100 text-slate-500 border-slate-200 font-semibold' : 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
        officeStatus: 'MASUK (08:00 - 17:00)',
      },
      {
        day: 'Sabtu',
        date: isOdd ? '07/11/2026' : '14/11/2026',
        grupAStatus: isOdd ? 'LIBUR (OFF)' : 'MASUK (2 Shift)',
        grupABadge: isOdd ? 'bg-slate-100 text-slate-500 border-slate-200 font-semibold' : 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
        grupBStatus: isOdd ? 'MASUK (2 Shift)' : 'LIBUR (OFF)',
        grupBBadge: isOdd ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' : 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
        officeStatus: 'LIBUR (OFF)',
      },
      {
        day: 'Minggu',
        date: isOdd ? '08/11/2026' : '15/11/2026',
        grupAStatus: isOdd ? 'MASUK (2 Shift)' : 'LIBUR (OFF)',
        grupABadge: isOdd ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' : 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
        grupBStatus: isOdd ? 'LIBUR (OFF)' : 'MASUK (2 Shift)',
        grupBBadge: isOdd ? 'bg-slate-100 text-slate-500 border-slate-200 font-semibold' : 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
        officeStatus: 'LIBUR (OFF)',
      },
    ];
  }, [rotationWeekCycle]);

  return (
    <div className="space-y-6">
      {/* 1. CARD MATRIKS ALUR KERJA BERGANTIAN (SENIN S/D MINGGU) */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#c4a266]" />
              Matriks Alur Kerja Bergantian (Senin s/d Minggu)
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Jadwal permanen operasional 7 hari non-stop (2 shift/hari) dengan skema selang-seling 1 hari dinas dan 1 hari libur (Siklus Bergulir 14 Hari).
            </CardDescription>
          </div>

          {onSwapAll && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSwapAll}
              className="gap-1.5 text-xs border-[#c4a266]/50 hover:bg-[#f7f2e8] text-navy font-semibold cursor-pointer shrink-0 self-start sm:self-auto"
              title="Tukar siklus penugasan seluruh personil Grup A ke Grup B dan sebaliknya"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#c4a266]" />
              <span>Tukar Siklus Grup</span>
            </Button>
          )}
        </CardHeader>

        {/* Toolbar Filter Siklus & Indikator Status Roster */}
        <TableToolbar className="py-2.5 px-4 sm:px-5 bg-slate-50/70 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Segmented Control Filter Siklus Minggu */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Siklus Roster:
            </span>
            <div className="inline-flex items-center p-1 bg-slate-200/70 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setRotationWeekCycle('odd')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  rotationWeekCycle === 'odd'
                    ? 'bg-navy text-white shadow-2xs'
                    : 'text-slate-600 hover:text-navy hover:bg-white/60'
                }`}
              >
                <span>Minggu 1 & 3</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    rotationWeekCycle === 'odd'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-300/60 text-slate-600'
                  }`}
                >
                  Ganjil
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRotationWeekCycle('even')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  rotationWeekCycle === 'even'
                    ? 'bg-navy text-white shadow-2xs'
                    : 'text-slate-600 hover:text-navy hover:bg-white/60'
                }`}
              >
                <span>Minggu 2 & 4</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    rotationWeekCycle === 'even'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-300/60 text-slate-600'
                  }`}
                >
                  Genap
                </span>
              </button>
            </div>
          </div>

          {/* Badge Ringkasan Distribusi Hari Dinas Aktif */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block shrink-0" />
              <strong className="text-emerald-950 font-bold">Grup A:</strong>
              <span>
                {rotationWeekCycle === 'odd'
                  ? '4 Hari (Sen, Rab, Jum, Min)'
                  : '3 Hari (Sel, Kam, Sab)'}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-600 inline-block shrink-0" />
              <strong className="text-amber-950 font-bold">Grup B:</strong>
              <span>
                {rotationWeekCycle === 'odd'
                  ? '3 Hari (Sel, Kam, Sab)'
                  : '4 Hari (Sen, Rab, Jum, Min)'}
              </span>
            </div>
          </div>
        </TableToolbar>

        <CardContent className="p-0">
          <Table className="w-full table-fixed min-w-[680px]">
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-200">
                <TableHead className="w-1/4 text-xs font-bold text-slate-700 tracking-wider pl-4 sm:pl-6">
                  HARI & TANGGAL
                </TableHead>
                <TableHead className="w-1/4 text-center text-xs font-bold text-emerald-900 tracking-wider">
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    <span>{rotationWeekCycle === 'odd' ? 'GRUP A (DINAS 4 HARI)' : 'GRUP A (DINAS 3 HARI)'}</span>
                  </div>
                </TableHead>
                <TableHead className="w-1/4 text-center text-xs font-bold text-amber-900 tracking-wider">
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                    <span>{rotationWeekCycle === 'odd' ? 'GRUP B (DINAS 3 HARI)' : 'GRUP B (DINAS 4 HARI)'}</span>
                  </div>
                </TableHead>
                <TableHead className="w-1/4 text-center text-xs font-bold text-slate-700 tracking-wider pr-4 sm:pr-6">
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>STAF KANTOR (NON-SHIFT)</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permanentScheduleRows.map((row, idx) => {
                const isGrupAWorking = row.grupAStatus.includes('MASUK');
                const isGrupBWorking = row.grupBStatus.includes('MASUK');
                const isOfficeWorking = row.officeStatus.includes('MASUK');

                return (
                  <TableRow
                    key={idx}
                    className={`text-xs transition-colors ${
                      row.day === 'Minggu' ? 'bg-slate-50/70' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <TableCell className="font-bold text-navy whitespace-nowrap pl-4 sm:pl-6 py-3">
                      <div className="flex items-center gap-2.5">
                        <CalendarDays className="w-4 h-4 text-[#c4a266] shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-navy">{row.day}</div>
                          <span className="text-[11px] font-normal font-mono text-slate-400">{row.date}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center py-3">
                      {isGrupAWorking ? (
                        <div className="inline-flex flex-col items-center justify-center w-full max-w-[190px] px-3 py-1.5 rounded-lg text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs font-semibold">
                          <span className="font-bold leading-tight">MASUK (2 Shift)</span>
                          <span className="text-[10px] font-mono text-emerald-700/80 mt-0.5 leading-tight">
                            07:00-15:00 • 15:00-23:00
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-center justify-center w-full max-w-[190px] px-3 py-1.5 rounded-lg text-xs bg-slate-100 text-slate-500 border border-slate-200 shadow-2xs font-medium">
                          <span className="font-bold leading-tight">LIBUR (OFF)</span>
                          <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                            Istirahat Roster
                          </span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="text-center py-3">
                      {isGrupBWorking ? (
                        <div className="inline-flex flex-col items-center justify-center w-full max-w-[190px] px-3 py-1.5 rounded-lg text-xs bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs font-semibold">
                          <span className="font-bold leading-tight">MASUK (2 Shift)</span>
                          <span className="text-[10px] font-mono text-amber-700/80 mt-0.5 leading-tight">
                            07:00-15:00 • 15:00-23:00
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-center justify-center w-full max-w-[190px] px-3 py-1.5 rounded-lg text-xs bg-slate-100 text-slate-500 border border-slate-200 shadow-2xs font-medium">
                          <span className="font-bold leading-tight">LIBUR (OFF)</span>
                          <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                            Istirahat Roster
                          </span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="text-center pr-4 sm:pr-6 py-3">
                      {isOfficeWorking ? (
                        <div className="inline-flex flex-col items-center justify-center w-full max-w-[190px] px-3 py-1.5 rounded-lg text-xs bg-sky-50 text-sky-800 border border-sky-200 shadow-2xs font-medium">
                          <span className="font-bold leading-tight">MASUK (Reguler)</span>
                          <span className="text-[10px] font-mono text-sky-700/80 mt-0.5 leading-tight">
                            08:00 - 17:00 WIB
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-center justify-center w-full max-w-[190px] px-3 py-1.5 rounded-lg text-xs bg-slate-100 text-slate-500 border border-slate-200 shadow-2xs font-medium">
                          <span className="font-bold leading-tight">LIBUR (OFF)</span>
                          <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                            Akhir Pekan
                          </span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 3. CARD PENETAPAN & PEMINDAHAN GRUP PERSONIL (TABEL & DROPDOWN DEFAULT) */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Penetapan & Pemindahan Grup Operasional Personil
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Pilih grup operasional personil melalui kolom <strong>Grup</strong> pada tabel di bawah.
            </CardDescription>
          </div>

          {/* Filter Chips Tab */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto text-xs">
            <button
              type="button"
              onClick={() => setFilterGroupTab('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterGroupTab === 'ALL'
                  ? 'bg-white text-navy shadow-2xs'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              Semua ({operationalEmployees.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterGroupTab('Grup A')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterGroupTab === 'Grup A'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              Grup A ({countA})
            </button>
            <button
              type="button"
              onClick={() => setFilterGroupTab('Grup B')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterGroupTab === 'Grup B'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-amber-800'
              }`}
            >
              Grup B ({countB})
            </button>
            <button
              type="button"
              onClick={() => setFilterGroupTab('Belum Ditetapkan')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterGroupTab === 'Belum Ditetapkan'
                  ? 'bg-slate-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Belum Ditetapkan ({countUnassigned})
            </button>
          </div>
        </CardHeader>

        {/* Toolbar Aksi Massal (Muncul jika ada checkbox personil terpilih) */}
        {selectedIds.length > 0 && (
          <div className="px-4 py-2.5 bg-navy/5 border-b border-navy/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-navy">
                {selectedIds.length} personil terpilih:
              </span>
              <span className="text-slate-500 text-[11px]">
                Pindahkan sekaligus ke grup penugasan tujuan:
              </span>
            </div>

            <div className="flex items-center gap-2">
              <TableSelect
                value={bulkTargetGroup}
                onChange={(e) => setBulkTargetGroup(e.target.value)}
                className="h-8 text-xs text-slate-700"
              >
                <option value="Grup A">Grup A</option>
                <option value="Grup B">Grup B</option>
                <option value="Belum Ditetapkan">Belum Ditetapkan</option>
              </TableSelect>

              <Button
                size="sm"
                onClick={handleApplyBulk}
                className="h-8 text-xs font-bold gap-1 bg-navy hover:bg-[#193750] cursor-pointer"
              >
                <span>Terapkan</span>
              </Button>
            </div>
          </div>
        )}

        {/* Tabel Karyawan Operasional */}
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-200">
                <TableHead className="w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredOperational.length > 0 &&
                      selectedIds.length === filteredOperational.length
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-navy focus:ring-navy border-slate-300 cursor-pointer"
                  />
                </TableHead>
                <TableHead className="w-12 text-center text-[11px] font-bold text-slate-700 tracking-wider">NO</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-700 tracking-wider min-w-[200px]">PERSONIL</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-700 tracking-wider min-w-[140px]">DIVISI</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-700 tracking-wider min-w-[150px]">LOKASI / PENUGASAN</TableHead>
                <TableHead className="text-center text-[11px] font-bold text-slate-700 tracking-wider min-w-[130px]">SHIFT OPERASIONAL</TableHead>
                <TableHead className="text-center text-[11px] font-bold text-slate-700 tracking-wider min-w-[150px]">ALUR JADWAL MASUK</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-700 tracking-wider min-w-[160px]">GRUP ROSTER</TableHead>
                <TableHead className="w-24 text-center text-[11px] font-bold text-slate-700 tracking-wider">AKSI</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOperational.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-slate-400 italic text-xs">
                    Tidak ada personil pada kategori ini.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOperational.map((emp, index) => {
                  const isSelected = selectedIds.includes(emp.id);
                  const isGroupA = emp.group === 'Grup A';
                  const isGroupB = emp.group === 'Grup B';
                  const isUnassigned = emp.group === 'Belum Ditetapkan';

                  return (
                    <TableRow
                      key={emp.id}
                      className={`text-xs transition-colors hover:bg-slate-50/80 ${
                        isSelected ? 'bg-navy/5' : ''
                      }`}
                    >
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(emp.id)}
                          className="w-4 h-4 rounded text-navy focus:ring-navy border-slate-300 cursor-pointer"
                        />
                      </TableCell>

                      <TableCell className="text-center font-medium text-slate-500">
                        {index + 1}
                      </TableCell>

                      <TableCell>
                        <div className="person">
                          <div className="avatar small font-bold text-slate-700 bg-slate-100 border border-slate-200 shrink-0">
                            {emp.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <strong className="block text-xs font-semibold text-navy truncate">
                              {emp.name}
                            </strong>
                            <span className="text-[11px] text-slate-500 block truncate">
                              {emp.nip} • {emp.role}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-slate-800 font-medium text-xs">{emp.division}</div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{emp.location}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        {(() => {
                          const shift = getOperationalShiftBadge(emp);
                          return (
                            <div
                              title={shift.label}
                              className={`inline-flex flex-col items-center justify-center min-w-[76px] px-2 py-1 rounded-md text-[10px] border shadow-2xs ${shift.badgeClass}`}
                            >
                              <span className="font-bold font-mono tracking-tight text-xs leading-none">
                                {shift.code}
                              </span>
                              <span className="font-mono text-[9px] opacity-90 mt-0.5 whitespace-nowrap leading-tight">
                                {shift.time}
                              </span>
                            </div>
                          );
                        })()}
                      </TableCell>

                      <TableCell className="text-center">
                        <div
                          title={
                            isGroupA
                              ? 'Jadwal Masuk Grup A: Siklus Bergulir 14 Hari (Minggu Ganjil: 4 Hari [Sen, Rab, Jum, Min], Minggu Genap: 3 Hari [Sel, Kam, Sab])'
                              : isGroupB
                              ? 'Jadwal Masuk Grup B: Siklus Bergulir 14 Hari (Minggu Ganjil: 3 Hari [Sel, Kam, Sab], Minggu Genap: 4 Hari [Sen, Rab, Jum, Min])'
                              : 'Personil belum ditetapkan grup kerja rosternya'
                          }
                          className={`inline-flex flex-col items-center justify-center min-w-[125px] px-2.5 py-1 rounded-md text-[10px] border shadow-2xs ${
                            isGroupA
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isGroupB
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          <span className="font-bold tracking-tight text-xs leading-none">
                            {isGroupA || isGroupB ? '1 On • 1 Off (Bergulir)' : 'Belum Terjadwal'}
                          </span>
                          <span className="text-[9px] opacity-85 mt-0.5 whitespace-nowrap leading-tight">
                            {isGroupA
                              ? 'Mgg Ganjil: 4H • Genap: 3H'
                              : isGroupB
                              ? 'Mgg Ganjil: 3H • Genap: 4H'
                              : 'Pilih Grup Roster'}
                          </span>
                        </div>
                      </TableCell>

                      {/* KOLOM DROPDOWN DEFAULT BERSIH */}
                      <TableCell>
                        <TableSelect
                          value={emp.group}
                          onChange={(e) => onUpdateEmployeeGroup(emp.id, e.target.value)}
                          className="h-8 text-xs text-slate-700"
                        >
                          <option value="Grup A">Grup A</option>
                          <option value="Grup B">Grup B</option>
                          <option value="Belum Ditetapkan">Belum Ditetapkan</option>
                        </TableSelect>
                      </TableCell>

                      {/* KOLOM AKSI */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(emp)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-navy hover:bg-slate-100 transition-colors cursor-pointer"
                            title={`Atur penugasan shift & grup untuk ${emp.name}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickSwapGroup(emp)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                            title={
                              emp.group === 'Grup A'
                                ? 'Pindahkan ke Grup B'
                                : emp.group === 'Grup B'
                                ? 'Pindahkan ke Grup A'
                                : 'Tetapkan ke Grup A'
                            }
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetGroup(emp)}
                            disabled={emp.group === 'Belum Ditetapkan'}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                            title="Reset grup ke Belum Ditetapkan"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
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
      </Card>

      {/* 4. CARD PERUBAHAN JADWAL OPERASIONAL MANUAL (REVISI 7 KRITERIA) */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#c4a266]" />
              Perubahan Jadwal Operasional Manual
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Penyesuaian ad-hoc tanggal mulai, grup bertugas, dan rentang jam kerja operasional Shift 1 & Shift 2.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-5">
          {/* Form Revisi 7 Kriteria */}
          <form
            onSubmit={handleManualSubmit}
            className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-4 sm:p-5 space-y-4"
          >
            {/* Baris 1: Informasi Penugasan & Tanggal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Tanggal Mulai Shift */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  1. Tanggal Mulai Shift <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 text-xs bg-white text-slate-700"
                  required
                />
              </div>

              {/* 2. Grup Yang Bekerja */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  2. Grup Yang Bekerja <span className="text-rose-500">*</span>
                </label>
                <TableSelect
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  className="h-9 text-xs text-slate-700"
                  containerClassName="w-full"
                >
                  <option value="Grup A">Grup A</option>
                  <option value="Grup B">Grup B</option>
                  <option value="Semua Grup (A & B)">Semua Grup (Grup A & Grup B)</option>
                </TableSelect>
              </div>

              {/* 7. Alasan Perubahan */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  7. Alasan Perubahan <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: Percepatan kuota ekspor / maintenance mesin CNC..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-9 text-xs bg-white text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Baris 2: Jam Operasional Shift 1 & Shift 2 (Format TIME) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Blok Shift 1 (Pagi) */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <Sun className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Konfigurasi Shift 1 (Pagi)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      3. Masuk Shift 1
                    </label>
                    <Input
                      type="time"
                      value={shift1In}
                      onChange={(e) => setShift1In(e.target.value)}
                      className="h-9 text-xs bg-slate-50/50 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      4. Pulang Shift 1
                    </label>
                    <Input
                      type="time"
                      value={shift1Out}
                      onChange={(e) => setShift1Out(e.target.value)}
                      className="h-9 text-xs bg-slate-50/50 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Blok Shift 2 (Malam) */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <Moon className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Konfigurasi Shift 2 (Malam)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      5. Masuk Shift 2
                    </label>
                    <Input
                      type="time"
                      value={shift2In}
                      onChange={(e) => setShift2In(e.target.value)}
                      className="h-9 text-xs bg-slate-50/50 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      6. Pulang Shift 2
                    </label>
                    <Input
                      type="time"
                      value={shift2Out}
                      onChange={(e) => setShift2Out(e.target.value)}
                      className="h-9 text-xs bg-slate-50/50 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Simpan & Catatan Petunjuk */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <p className="text-[11px] text-slate-400 italic">
                * Format waktu 24-jam (JJ:MM). Perubahan langsung aktif dan tercatat pada matriks roster mingguan.
              </p>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-semibold gap-1.5 cursor-pointer bg-navy hover:bg-[#193750] text-white self-end sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Terapkan Perubahan Jadwal Manual</span>
              </Button>
            </div>
          </form>

          {/* Tabel Riwayat Perubahan Jadwal Operasional Manual Aktif */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Daftar Perubahan Jadwal Operasional Manual Aktif ({manualSchedules.length})
              </h5>
              <span className="text-[11px] text-slate-400">
                Otomatis disinkronkan ke Matriks Roster Mingguan
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b border-slate-200">
                    <TableHead className="w-12 text-center text-[11px] font-bold text-slate-700 tracking-wider">NO</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-700 tracking-wider min-w-[130px]">TANGGAL MULAI</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-700 tracking-wider min-w-[140px]">GRUP DINAS</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-700 tracking-wider min-w-[170px]">JAM SHIFT 1 (PAGI)</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-700 tracking-wider min-w-[170px]">JAM SHIFT 2 (MALAM)</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-700 tracking-wider min-w-[200px]">ALASAN PERUBAHAN</TableHead>
                    <TableHead className="text-center text-[11px] font-bold text-slate-700 tracking-wider w-24">STATUS</TableHead>
                    <TableHead className="text-right pr-4 text-[11px] font-bold text-slate-700 tracking-wider w-20">AKSI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manualSchedules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-slate-400 italic text-xs">
                        Belum ada jadwal operasional manual aktif. Jadwal berjalan sesuai pola rotasi permanen normal.
                      </TableCell>
                    </TableRow>
                  ) : (
                    manualSchedules.map((item, idx) => (
                      <TableRow key={item.id} className="text-xs hover:bg-slate-50/70">
                        <TableCell className="text-center font-medium text-slate-500">{idx + 1}</TableCell>
                        <TableCell className="font-bold text-navy">
                          {formatDateDMY(item.startDateFormatted || item.startDate)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              item.targetGroup === 'Grup A'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                                : item.targetGroup === 'Grup B'
                                ? 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                                : 'bg-purple-50 text-purple-800 border-purple-200 font-bold'
                            }
                          >
                            {item.targetGroup}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-slate-700 font-medium">
                          <span className="inline-flex items-center gap-1">
                            <Sun className="w-3.5 h-3.5 text-emerald-600" />
                            {item.shift1In} - {item.shift1Out} WIB
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-slate-700 font-medium">
                          <span className="inline-flex items-center gap-1">
                            <Moon className="w-3.5 h-3.5 text-amber-600" />
                            {item.shift2In} - {item.shift2Out} WIB
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-600 max-w-xs truncate">{item.reason}</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                            <CheckCircle2 className="w-3 h-3 mr-1 inline text-emerald-600" />
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteManualSchedule && onDeleteManualSchedule(item.id)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Hapus Jadwal Manual"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. CARD INFORMASI STAF GENERAL OFFICE (NON-SHIFT) */}
      <Card className="border-slate-200 shadow-2xs bg-slate-50/70">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-navy">
                Staf General Office / Non-Shift ({nonShiftEmployees.length} Karyawan)
              </p>
              <p className="text-[11px] text-slate-500">
                {nonShiftEmployees.map((e) => e.name).join(', ')}
              </p>
            </div>
          </div>
          <Badge className="bg-sky-50 text-sky-800 border-sky-200 text-[10px] self-start sm:self-auto shrink-0 font-medium">
            Jadwal Tetap Kantor: Senin - Jumat (08:00 - 17:00 WIB)
          </Badge>
        </CardContent>
      </Card>

      {/* MODAL ATUR PENUGASAN ROSTER PERSONIL */}
      {editingEmployee && (
        <Modal
          isOpen={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
          size="lg"
        >
          <ModalHeader
            icon={<UserCheck className="w-5 h-5 text-[#c4a266]" />}
            title="Atur Penugasan Roster Personil"
            description="Konfigurasi grup roster kerja dan jam operasional harian untuk personil terkait."
            onClose={() => setEditingEmployee(null)}
          />

          <ModalBody className="space-y-5">
            {/* 1. Ringkasan Profil Personil */}
            <div className="p-3.5 bg-slate-50/80 border border-slate-200/90 rounded-xl flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  {editingEmployee.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-navy truncate">{editingEmployee.name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {editingEmployee.nip} • {editingEmployee.role}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 font-medium">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {editingEmployee.division}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {editingEmployee.location}
                </span>
              </div>
            </div>

            {/* 2. Pilihan Grup Roster Operasional (Kartu Interaktif) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Penempatan Grup Roster <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Grup A */}
                <button
                  type="button"
                  onClick={() => setEditGroup('Grup A')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    editGroup === 'Grup A'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-navy flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                      Grup A
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      Aktif
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-600 leading-snug">
                    <p className="font-semibold text-emerald-900">Mgg 1: Sen, Rab, Jum, Min</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Siklus Bergulir (4H / 3H)</p>
                  </div>
                </button>

                {/* Grup B */}
                <button
                  type="button"
                  onClick={() => setEditGroup('Grup B')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    editGroup === 'Grup B'
                      ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-600/20 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-navy flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                      Grup B
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                      Aktif
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-600 leading-snug">
                    <p className="font-semibold text-amber-900">Mgg 1: Sel, Kam, Sab</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Siklus Bergulir (3H / 4H)</p>
                  </div>
                </button>

                {/* Belum Ditetapkan */}
                <button
                  type="button"
                  onClick={() => setEditGroup('Belum Ditetapkan')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    editGroup === 'Belum Ditetapkan'
                      ? 'border-slate-600 bg-slate-100 ring-2 ring-slate-400/30 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                      Belum Ditetapkan
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 leading-snug">
                    <p className="font-medium text-slate-600">Personil Cadangan</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Tidak dijadwalkan dinas</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 3. Pilihan Shift Operasional (Kartu Interaktif) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Shift Jam Operasional <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* S1 - Shift 1 */}
                <button
                  type="button"
                  onClick={() => setEditShiftCode('S1')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    editShiftCode === 'S1'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-navy flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Shift 1 (Pagi)</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                      07:00 - 15:00 WIB
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                    S1
                  </span>
                </button>

                {/* S2 - Shift 2 */}
                <button
                  type="button"
                  onClick={() => setEditShiftCode('S2')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    editShiftCode === 'S2'
                      ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-600/20 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-navy flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-amber-600" />
                      <span>Shift 2 (Malam)</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                      15:00 - 23:00 WIB
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-100 text-amber-800">
                    S2
                  </span>
                </button>
              </div>
            </div>

            {/* 4. Pratinjau Alur Rotasi Efektif */}
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#c4a266] shrink-0" />
                <span className="text-slate-600">
                  Hasil Roster: <strong>{editGroup}</strong> • Kode Shift: <strong className="font-mono">{editShiftCode}</strong>
                </span>
              </div>
              <Badge className="bg-navy/5 text-navy border-navy/20 text-[10px] font-semibold">
                Siklus 14 Hari (Senin - Minggu)
              </Badge>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingEmployee(null)}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveEdit}
              className="bg-navy hover:bg-[#193750] text-white font-bold cursor-pointer"
            >
              Simpan Penugasan
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
