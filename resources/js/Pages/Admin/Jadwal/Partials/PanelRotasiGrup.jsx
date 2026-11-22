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
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSelect,
  TableEmpty,
} from '@/components/ui';
import PanelJadwalManual from './PanelJadwalManual.jsx';

export default function PanelRotasiGrup({
  employees = [],
  onUpdateEmployeeGroup,
  onBulkUpdateGroup,
  onSwapAll,
  manualSchedules = [],
  onSaveManualSchedule,
  onDeleteManualSchedule,
  currentWeek,
  selectedWeekIndex = 0,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterGroupTab, setFilterGroupTab] = useState('ALL'); // 'ALL' | 'Grup A' | 'Grup B' | 'Belum Ditetapkan'
  const [bulkTargetGroup, setBulkTargetGroup] = useState('Grup A');

  const isWeekEven = selectedWeekIndex % 2 === 1;

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

  // Matriks Aturan 7 Hari Dinamis (Senin s/d Minggu Sesuai Siklus Roster Minggu Aktif)
  const permanentScheduleRows = useMemo(() => {
    const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    return dayNames.map((dayName, idx) => {
      const dayNum = idx + 1;
      const dateStr = currentWeek?.days?.[idx]?.date || '-';
      const isWeekend = idx >= 5;

      const isGroupAWorking = !isWeekEven ? dayNum % 2 === 1 : dayNum % 2 === 0;

      const grupAStatus = isGroupAWorking ? 'MASUK (Pagi & Malam)' : 'LIBUR (OFF)';
      const grupABadge = isGroupAWorking
        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
        : 'bg-slate-100 text-slate-500 border-slate-200 font-semibold';

      const grupBStatus = !isGroupAWorking ? 'MASUK (Pagi & Malam)' : 'LIBUR (OFF)';
      const grupBBadge = !isGroupAWorking
        ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
        : 'bg-slate-100 text-slate-500 border-slate-200 font-semibold';

      const officeStatus = isWeekend ? 'LIBUR (OFF)' : 'MASUK (08:00 - 17:00)';

      let note = '';
      if (dayNum === 7) {
        note = isGroupAWorking
          ? 'Rotasi 24/7 Akhir Pekan: Giliran Grup A berdinas; Grup B libur otomatis.'
          : 'Rotasi 24/7 Akhir Pekan: Giliran Grup B berdinas; Grup A libur otomatis.';
      } else {
        note = isGroupAWorking
          ? 'Grup A berdinas shift operasional (Pagi & Malam). Grup B libur otomatis.'
          : 'Grup B berdinas shift operasional (Pagi & Malam). Grup A libur otomatis.';
      }

      return {
        day: dayName,
        date: dateStr,
        grupAStatus,
        grupABadge,
        grupBStatus,
        grupBBadge,
        officeStatus,
        note,
      };
    });
  }, [currentWeek, isWeekEven]);

  return (
    <div className="space-y-6">
      {/* 1. BANNER ATURAN OPERASIONAL PERMANEN & AKSI SIKLUS CEPAT */}
      <div className="bg-[#10273f] text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded bg-[#c4a266]/20 border border-[#c4a266]/40 text-[#c4a266] text-[10px] font-bold uppercase tracking-wider">
              Aturan Operasional Permanen 24/7
            </span>
            <Badge className="bg-white/10 text-white text-[10px] font-medium border-white/10">
              Shift Operasional (Pagi 08:00-17:00 & Malam 20:00-05:00) • 2 Kelompok (A & B)
            </Badge>
          </div>
          <h3 className="text-base font-bold font-display mt-2 text-white">
            Pusat Penugasan & Rotasi Roster Grup A & Grup B (Mariuk & Cimalaka)
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Operasional berjalan <strong>7 hari per minggu (24/7)</strong> dengan <strong>2 shift operasional (Pagi 08:00-17:00 & Malam 20:00-05:00)</strong>. Kelompok A dan B bertugas secara selang-seling setiap hari: jika <strong>Kelompok A masuk hari Senin</strong>, maka otomatis <strong>hari Selasa libur (OFF)</strong>, demikian sebaliknya untuk <strong>Kelompok B</strong>. Jatah libur hari Minggu bergantian adil setiap 2 minggu.
          </p>
        </div>

        <div className="shrink-0">
          <Button
            onClick={onSwapAll}
            className="gap-2 bg-[#c4a266] hover:bg-[#b08e54] text-navy font-bold text-xs shadow-sm border-0 cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4 text-navy" />
            <span>Tukar Siklus Grup A ⇄ Grup B</span>
          </Button>
        </div>
      </div>

      {/* 2. CARD MATRIKS ALUR KERJA BERGANTIAN (SENIN S/D MINGGU) */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#c4a266]" />
              Matriks Alur Kerja Bergantian (Senin s/d Minggu)
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Jadwal permanen 2 shift per hari dengan skema selang-seling 1 hari dinas dan 1 hari libur.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              Grup A: {!isWeekEven ? 'Sen, Rab, Jum, Min' : 'Sel, Kam, Sab'} ({countA} Personil)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
              Grup B: {!isWeekEven ? 'Sel, Kam, Sab' : 'Sen, Rab, Jum, Min'} ({countB} Personil)
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-200">
                <TableHead className="w-32 text-xs font-semibold text-slate-600">Hari & Tanggal</TableHead>
                <TableHead className="text-xs font-semibold text-emerald-900 min-w-[170px]">
                  Grup A {!isWeekEven ? '(Hari Ganjil)' : '(Hari Genap)'}
                </TableHead>
                <TableHead className="text-xs font-semibold text-amber-900 min-w-[170px]">
                  Grup B {!isWeekEven ? '(Hari Genap)' : '(Hari Ganjil)'}
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[160px]">
                  Staf Kantor (Non-Shift)
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Keterangan Alur Rotasi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permanentScheduleRows.map((row, idx) => (
                <TableRow
                  key={idx}
                  className={`text-xs transition-colors ${
                    row.day === 'Minggu' ? 'bg-slate-50/70' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <TableCell className="font-bold text-navy whitespace-nowrap">
                    <div>{row.day}</div>
                    <span className="text-[11px] font-normal text-slate-400">{row.date}</span>
                  </TableCell>

                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] border ${row.grupABadge}`}>
                      {row.grupAStatus}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] border ${row.grupBBadge}`}>
                      {row.grupBStatus}
                    </span>
                  </TableCell>

                  <TableCell className="text-slate-700 font-medium text-[11px]">
                    {row.officeStatus}
                  </TableCell>

                  <TableCell className="text-slate-600 text-[11px]">
                    {row.note}
                  </TableCell>
                </TableRow>
              ))}
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
                <option value="Non-Shift">Non-Shift</option>
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
                <TableHead className="w-12 text-center text-xs font-semibold text-slate-600">No</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[200px]">Personil</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[150px]">Divisi & Penugasan</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[140px]">Shift Operasional</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[160px]">Alur Jadwal Masuk</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[160px]">Grup</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOperational.length === 0 ? (
                <TableEmpty colSpan={7}>
                  Tidak ada personil pada kategori ini.
                </TableEmpty>
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
                        <div className="font-bold text-navy">{emp.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {emp.nip} • {emp.role}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-slate-800 font-medium">{emp.division}</div>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              (emp.location || '').includes('Mariuk')
                                ? 'bg-amber-50 text-amber-900 border-amber-200'
                                : 'bg-indigo-50 text-indigo-900 border-indigo-200'
                            }`}
                          >
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            {emp.location}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {isUnassigned ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border bg-slate-100 text-slate-500 border-slate-200">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            Belum Ditentukan
                          </span>
                        ) : emp.shiftCode === 'PAGI' || (emp.baseShift && emp.baseShift.toLowerCase().includes('pagi')) ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border bg-emerald-50 text-emerald-800 border-emerald-200 font-mono">
                            <Sun className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            Pagi (08:00 - 17:00)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border bg-indigo-50 text-indigo-800 border-indigo-200 font-mono">
                            <Moon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            Malam (20:00 - 05:00)
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {isGroupA && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            {!isWeekEven ? 'Masuk: Sen, Rab, Jum, Min' : 'Masuk: Sel, Kam, Sab'}
                          </span>
                        )}
                        {isGroupB && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            {!isWeekEven ? 'Masuk: Sel, Kam, Sab' : 'Masuk: Sen, Rab, Jum, Min'}
                          </span>
                        )}
                        {isUnassigned && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            Belum Terjadwal
                          </span>
                        )}
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
                          <option value="Non-Shift">Non-Shift</option>
                        </TableSelect>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 4. CARD PERUBAHAN JADWAL OPERASIONAL MANUAL (SUB-KOMPONEN TERISOLASI) */}
      <PanelJadwalManual
        manualSchedules={manualSchedules}
        onSaveManualSchedule={onSaveManualSchedule}
        onDeleteManualSchedule={onDeleteManualSchedule}
        currentWeek={currentWeek}
      />

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
                {nonShiftEmployees.length > 0
                  ? nonShiftEmployees.map((e) => e.name).join(', ')
                  : 'Belum ada personil yang ditugaskan ke kelompok Non-Shift (Staf Kantor).'}
              </p>
            </div>
          </div>
          <Badge className="bg-sky-50 text-sky-800 border-sky-200 text-[10px] self-start sm:self-auto shrink-0 font-medium">
            Jadwal Tetap Kantor: Senin - Jumat (08:00 - 17:00 WIB)
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
