import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Printer,
  FileSpreadsheet,
  RotateCcw,
  Building,
  MapPin,
  CalendarCheck,
  Award,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Info,
} from 'lucide-react';
import {
  Card,
  Button,
  Badge,
  TableSelect,
  Toast,
} from '@/components/ui';
import RaporKpiCards from './RaporKpiCards.jsx';
import RaporCalendarGrid, { generateCalendarDays } from './RaporCalendarGrid.jsx';
import RaporCoachingLogs from './RaporCoachingLogs.jsx';

export default function RaporIndividu({
  employee,
  allEmployees,
  onSelectEmployee,
  selectedPeriod,
  onBackToOrganization,
}) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [newNoteType, setNewNoteType] = useState('Konseling Rutin');
  const [alertInfo, setAlertInfo] = useState(null);

  // Parsing periode dinamis
  const [yearStr, monthStr] = (selectedPeriod || '2026-11').split('-');
  const year = parseInt(yearStr, 10) || 2026;
  const month = parseInt(monthStr, 10) || 11;
  const monthNamesLong = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const currentMonthLong = monthNamesLong[month - 1] || 'November';

  // State catatan pembinaan tersinkronisasi per karyawan aktif
  const [coachingLogs, setCoachingLogs] = useState([]);

  useEffect(() => {
    setSelectedDay(null);
    const initialLogs = [];

    if (employee.status === 'Peringatan / SP') {
      initialLogs.push({
        id: 1,
        date: `02 ${currentMonthLong.slice(0, 3)} ${year}`,
        type: 'Surat Peringatan (SP-1)',
        officer: 'Tim Human Capital & GA',
        note: employee.actionRecommendation || 'Penerbitan SP-1 terkait ketidakhadiran berulang.',
        status: 'Aktif (Masa Berlaku 6 Bulan)',
      });
    } else if (employee.status === 'Perlu Pembinaan') {
      initialLogs.push({
        id: 1,
        date: `05 ${currentMonthLong.slice(0, 3)} ${year}`,
        type: 'Konseling Supervisor',
        officer: 'Tim Human Capital & GA',
        note: employee.actionRecommendation || 'Bimbingan kedisiplinan dan evaluasi kesiapan shift kerja.',
        status: 'Dalam Pengawasan',
      });
    } else {
      initialLogs.push({
        id: 1,
        date: `01 ${currentMonthLong.slice(0, 3)} ${year}`,
        type: 'Apresiasi Kedisiplinan',
        officer: 'Tim Human Capital & GA',
        note: employee.actionRecommendation || 'Rekam jejak kehadiran sangat baik, pertahankan konsistensi.',
        status: 'Selesai',
      });
    }

    setCoachingLogs(initialLogs);
  }, [employee.id, employee.status, employee.actionRecommendation, currentMonthLong, year]);

  // Generate kalender kehadiran untuk karyawan aktif
  const calendarDays = useMemo(() => generateCalendarDays(employee, selectedPeriod), [employee, selectedPeriod]);

  // Riwayat skor 6 bulan terhubung database backend
  const historyData = useMemo(() => {
    return employee.monthlyHistory && employee.monthlyHistory.length > 0
      ? employee.monthlyHistory
      : [];
  }, [employee.monthlyHistory]);

  // Tambah Catatan Pembinaan Baru
  const handleAddCoachingLog = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const logItem = {
      id: Date.now(),
      date: new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()),
      type: newNoteType,
      officer: 'Administrator HCGA',
      note: newNote.trim(),
      status: 'Dalam Pengawasan',
    };

    setCoachingLogs([logItem, ...coachingLogs]);
    setNewNote('');
    setAlertInfo({
      type: 'success',
      message: `Catatan pembinaan (${newNoteType}) untuk ${employee.name} berhasil disimpan.`,
    });
  };

  // Ekspor Rapor Karyawan ke Excel
  const handleExportIndividualReport = () => {
    const presentDays = employee.presentDays || 0;
    const workDays = employee.workDays || 22;
    const lateCount = employee.lateCount || 0;
    const totalLateMinutes = employee.totalLateMinutes || 0;
    const onTimeDays = employee.onTimeDays ?? Math.max(0, presentDays - lateCount);
    const izinDays = employee.izinDays ?? 0;
    const sakitDays = employee.sakitDays ?? 0;
    const cutiDays = employee.cutiDays ?? Math.max(0, (employee.leaveDays || 0) - izinDays - sakitDays);
    const alpaDays = employee.alpaDays || 0;

    const profileData = [
      { Properti: 'NIP', Nilai: employee.nip },
      { Properti: 'Nama Karyawan', Nilai: employee.name },
      { Properti: 'Jabatan', Nilai: employee.role },
      { Properti: 'Divisi', Nilai: employee.division },
      { Properti: 'Lokasi Kerja', Nilai: employee.location },
      { Properti: 'Periode Evaluasi', Nilai: selectedPeriod },
      { Properti: 'Hari Kerja Efektif', Nilai: `${workDays} Hari` },
      { Properti: 'Total Kehadiran', Nilai: `${presentDays} Hari (${workDays > 0 ? ((presentDays / workDays) * 100).toFixed(1) : 0}%)` },
      { Properti: 'Tepat Waktu', Nilai: `${onTimeDays} Hari (${presentDays > 0 ? ((onTimeDays / presentDays) * 100).toFixed(1) : 0}%)` },
      { Properti: 'Terlambat', Nilai: `${lateCount} kali` },
      { Properti: 'Menit Terlambat', Nilai: `${totalLateMinutes} menit` },
      { Properti: 'Izin', Nilai: `${izinDays} Hari` },
      { Properti: 'Sakit', Nilai: `${sakitDays} Hari` },
      { Properti: 'Cuti', Nilai: `${cutiDays} Hari` },
      { Properti: 'Alpha', Nilai: `${alpaDays} Hari` },
      { Properti: 'Skor Kedisiplinan', Nilai: `${employee.score}%` },
      { Properti: 'Status Evaluasi', Nilai: employee.status },
      { Properti: 'Rekomendasi HCGA', Nilai: employee.actionRecommendation },
    ];

    const calendarExport = calendarDays.map((c) => ({
      Tanggal: c.dateFormatted,
      Hari: c.dayName,
      Status: c.status,
      Keterangan: c.detail,
    }));

    const workbook = XLSX.utils.book_new();
    const wsProfile = XLSX.utils.json_to_sheet(profileData);
    const wsCalendar = XLSX.utils.json_to_sheet(calendarExport);

    wsProfile['!cols'] = [{ wch: 22 }, { wch: 45 }];
    wsCalendar['!cols'] = [{ wch: 15 }, { wch: 8 }, { wch: 16 }, { wch: 40 }];

    XLSX.utils.book_append_sheet(workbook, wsProfile, 'Ringkasan Rapor');
    XLSX.utils.book_append_sheet(workbook, wsCalendar, 'Log Presensi Harian');

    XLSX.writeFile(workbook, `Rapor_Disiplin_${employee.nip}_${selectedPeriod}.xlsx`);
  };

  // Helper Badge Status
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Sangat Baik':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 inline" />
            Sangat Baik
          </Badge>
        );
      case 'Disiplin Baik':
        return (
          <Badge className="bg-sky-50 text-sky-700 border-sky-200 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-sky-600 inline" />
            Disiplin Baik
          </Badge>
        );
      case 'Perlu Pembinaan':
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600 inline" />
            Perlu Pembinaan
          </Badge>
        );
      case 'Peringatan / SP':
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-600 inline" />
            Peringatan / SP
          </Badge>
        );
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Atomic Toast Feedback */}
      <Toast toast={alertInfo} onClose={() => setAlertInfo(null)} />

      {/* Bar Navigasi & Pemilihan Karyawan */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToOrganization}
            className="text-xs text-slate-600 hover:text-navy gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kembali ke Rekap Organisasi</span>
          </Button>

          <div className="h-5 w-px bg-slate-200 hidden md:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Pilih Karyawan:
            </span>
            <TableSelect
              value={employee.id}
              onChange={(e) => onSelectEmployee(Number(e.target.value))}
              containerClassName="min-w-[240px]"
            >
              {allEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nip} - {emp.name} ({emp.division})
                </option>
              ))}
            </TableSelect>
          </div>
        </div>

        {/* Tombol Ekspor Rapor */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs gap-1.5 text-navy border-slate-200 hover:bg-slate-50"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak Rapor</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportIndividualReport}
            className="text-xs gap-1.5 border-emerald-600/30 text-emerald-800 hover:bg-emerald-50 bg-white"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ekspor Excel (.xlsx)</span>
          </Button>
        </div>
      </div>

      {/* Kartu Profil & Skor Kedisiplinan Karyawan */}
      <Card className="border-slate-200 shadow-2xs overflow-hidden">
        <div className="bg-navy p-6 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Avatar & Data Induk */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#f7f2e8] text-navy border-2 border-[#c4a266] flex items-center justify-center font-display font-bold text-xl shadow-md shrink-0">
              {employee.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold font-display">{employee.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 font-mono text-slate-200">
                  {employee.nip}
                </span>
                {renderStatusBadge(employee.status)}
              </div>

              <p className="text-sm text-slate-300 mt-1 font-medium">{employee.role}</p>

              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300 mt-2.5">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#c4a266]" />
                  {employee.division}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 ${
                    employee.location?.includes('Mariuk')
                      ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30'
                      : 'bg-indigo-400/20 text-indigo-200 border border-indigo-400/30'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  {employee.location}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    employee.group === 'Grup A'
                      ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30'
                      : 'bg-amber-400/20 text-amber-200 border border-amber-400/30'
                  }`}
                >
                  {employee.group}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-slate-200 border border-white/15">
                  {employee.shiftCode === 'MALAM' ? 'Shift Malam (20:00 - 05:00)' : 'Shift Pagi (08:00 - 17:00)'}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <CalendarCheck className="w-3.5 h-3.5 text-[#c4a266]" />
                  Periode {selectedPeriod}
                </span>
              </div>
            </div>
          </div>

          {/* Indikator Skor Kedisiplinan */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-5 shrink-0">
            <div className="text-right">
              <p className="text-xs text-slate-300 font-medium">Skor Kedisiplinan</p>
              <p className="text-3xl font-bold font-display text-[#c4a266] mt-0.5">
                {employee.score}%
              </p>
              <p className="text-[11px] text-slate-400">
                {employee.score >= 95
                  ? 'Predikat Teladan'
                  : employee.score >= 85
                  ? 'Kepatuhan Standar'
                  : 'Perlu Pengawasan'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#c4a266]/20 border border-[#c4a266]/40 flex items-center justify-center text-[#c4a266]">
              {employee.score >= 95 ? (
                <Award className="w-6 h-6" />
              ) : employee.score >= 85 ? (
                <UserCheck className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              )}
            </div>
          </div>
        </div>

        {/* Kotak Rekomendasi Resmi HCGA */}
        <div className="bg-amber-50/60 border-t border-amber-200/60 px-6 py-3.5 flex items-start gap-2.5 text-xs">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="text-amber-950 font-semibold">Rekomendasi Tindakan Manajemen:</strong>
            <span className="text-amber-900 ml-1.5">{employee.actionRecommendation}</span>
          </div>
        </div>
      </Card>

      {/* 8 Scorecards KPI Khusus Karyawan */}
      <RaporKpiCards employee={employee} />

      {/* Matriks Kalender Harian Presensi & Tren 6 Bulan */}
      <RaporCalendarGrid
        calendarDays={calendarDays}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        currentMonthLong={currentMonthLong}
        year={year}
        historyData={historyData}
      />

      {/* Buku Catatan Pembinaan & Sanksi HCGA */}
      <RaporCoachingLogs
        employee={employee}
        coachingLogs={coachingLogs}
        newNoteType={newNoteType}
        onNoteTypeChange={setNewNoteType}
        newNote={newNote}
        onNoteChange={setNewNote}
        onAddLog={handleAddCoachingLog}
      />
    </div>
  );
}
