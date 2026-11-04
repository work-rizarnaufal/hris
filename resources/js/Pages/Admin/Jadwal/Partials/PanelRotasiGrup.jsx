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
} from '@/components/ui';
import { formatDateDMY } from '@/services/systemSettings.js';

export default function PanelRotasiGrup({
  employees,
  onUpdateEmployeeGroup,
  onBulkUpdateGroup,
  onSwapAll,
  manualSchedules = [],
  onSaveManualSchedule,
  onDeleteManualSchedule,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterGroupTab, setFilterGroupTab] = useState('ALL'); // 'ALL' | 'Grup A' | 'Grup B' | 'Belum Ditetapkan'
  const [bulkTargetGroup, setBulkTargetGroup] = useState('Grup A');

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

  // Matriks Aturan Permanen 7 Hari (Senin s/d Minggu)
  const permanentScheduleRows = [
    {
      day: 'Senin',
      date: '02/11/2026',
      grupAStatus: 'MASUK (2 Shift)',
      grupABadge: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
      grupBStatus: 'LIBUR (OFF)',
      grupBBadge: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
      officeStatus: 'MASUK (08:00 - 17:00)',
      note: 'Grup A berdinas 2 shift (Pagi & Sore). Grup B libur otomatis.',
    },
    {
      day: 'Selasa',
      date: '03/11/2026',
      grupAStatus: 'LIBUR (OFF)',
      grupABadge: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
      grupBStatus: 'MASUK (2 Shift)',
      grupBBadge: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      officeStatus: 'MASUK (08:00 - 17:00)',
      note: 'Grup A otomatis libur paska dinas Senin. Giliran Grup B masuk 2 shift.',
    },
    {
      day: 'Rabu',
      date: '04/11/2026',
      grupAStatus: 'MASUK (2 Shift)',
      grupABadge: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
      grupBStatus: 'LIBUR (OFF)',
      grupBBadge: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
      officeStatus: 'MASUK (08:00 - 17:00)',
      note: 'Grup A kembali berdinas operasional. Grup B libur.',
    },
    {
      day: 'Kamis',
      date: '05/11/2026',
      grupAStatus: 'LIBUR (OFF)',
      grupABadge: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
      grupBStatus: 'MASUK (2 Shift)',
      grupBBadge: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      officeStatus: 'MASUK (08:00 - 17:00)',
      note: 'Grup B kembali berdinas operasional. Grup A libur.',
    },
    {
      day: 'Jumat',
      date: '06/11/2026',
      grupAStatus: 'MASUK (2 Shift)',
      grupABadge: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
      grupBStatus: 'LIBUR (OFF)',
      grupBBadge: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
      officeStatus: 'MASUK (08:00 - 17:00)',
      note: 'Grup A berdinas operasional. Grup B libur.',
    },
    {
      day: 'Sabtu',
      date: '07/11/2026',
      grupAStatus: 'LIBUR (OFF)',
      grupABadge: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
      grupBStatus: 'MASUK (2 Shift)',
      grupBBadge: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      officeStatus: 'LIBUR (OFF)',
      note: 'Grup B berdinas operasional. Grup A & Staf Kantor libur akhir pekan.',
    },
    {
      day: 'Minggu',
      date: '08/11/2026',
      grupAStatus: 'LIBUR (OFF)',
      grupABadge: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
      grupBStatus: 'LIBUR (OFF)',
      grupBBadge: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
      officeStatus: 'LIBUR (OFF)',
      note: 'Seluruh lini operasional dan kantor libur terjadwal mingguan.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. BANNER ATURAN OPERASIONAL PERMANEN & AKSI SIKLUS CEPAT */}
      <div className="bg-[#10273f] text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded bg-[#c4a266]/20 border border-[#c4a266]/40 text-[#c4a266] text-[10px] font-bold uppercase tracking-wider">
              Aturan Operasional Permanen
            </span>
            <Badge className="bg-white/10 text-white text-[10px] font-medium border-white/10">
              1 Hari 2 Shift (Pagi & Sore) • 2 Grup (A & B)
            </Badge>
          </div>
          <h3 className="text-base font-bold font-display mt-2 text-white">
            Pusat Penugasan & Rotasi Roster Grup A & Grup B
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Operasional berjalan <strong>2 shift per hari (Pagi & Sore)</strong>. Grup A dan Grup B bertugas secara selang-seling: jika <strong>Grup A masuk hari Senin</strong>, maka otomatis <strong>hari Selasa libur (OFF)</strong>, demikian sebaliknya untuk <strong>Grup B</strong>. Hari Minggu seluruh personil libur operasional.
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
              Grup A: Sen, Rab, Jum ({countA} Personil)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
              Grup B: Sel, Kam, Sab ({countB} Personil)
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-200">
                <TableHead className="w-32 text-xs font-semibold text-slate-600">Hari & Tanggal</TableHead>
                <TableHead className="text-xs font-semibold text-emerald-900 min-w-[170px]">
                  Grup A (Hari Ganjil)
                </TableHead>
                <TableHead className="text-xs font-semibold text-amber-900 min-w-[170px]">
                  Grup B (Hari Genap)
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
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-400 italic text-xs">
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
                        <div className="font-bold text-navy">{emp.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {emp.nip} • {emp.role}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-slate-800 font-medium">{emp.division}</div>
                        <div className="text-[10px] text-slate-400">{emp.location}</div>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${
                            emp.shiftCode === 'S1'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : emp.shiftCode === 'S2'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                          }`}
                        >
                          {emp.shiftCode === 'S1' ? (
                            <>
                              <Sun className="w-3 h-3 text-emerald-600" />
                              Pagi (07-15)
                            </>
                          ) : emp.shiftCode === 'S2' ? (
                            <>
                              <Moon className="w-3 h-3 text-amber-600" />
                              Sore (15-23)
                            </>
                          ) : (
                            emp.shiftCode
                          )}
                        </span>
                      </TableCell>

                      <TableCell>
                        {isGroupA && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Masuk: Sen, Rab, Jum
                          </span>
                        )}
                        {isGroupB && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <CheckCircle2 className="w-3 h-3 text-amber-600" />
                            Masuk: Sel, Kam, Sab
                          </span>
                        )}
                        {isUnassigned && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                            <AlertCircle className="w-3 h-3 text-slate-400" />
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

              {/* Blok Shift 2 (Sore) */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <Moon className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Konfigurasi Shift 2 (Sore)
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
                    <TableHead className="w-12 text-center text-xs font-semibold text-slate-600">No</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[130px]">Tanggal Mulai Shift</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[140px]">Grup Yang Bekerja</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[170px]">Jam Shift 1 (Pagi)</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[170px]">Jam Shift 2 (Sore)</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[200px]">Alasan Perubahan</TableHead>
                    <TableHead className="text-center text-xs font-semibold text-slate-600 w-24">Status</TableHead>
                    <TableHead className="text-right pr-4 text-xs font-semibold text-slate-600 w-20">Aksi</TableHead>
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
    </div>
  );
}
