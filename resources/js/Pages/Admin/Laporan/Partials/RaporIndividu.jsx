import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  UserCheck,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Award,
  TrendingUp,
  TrendingDown,
  Printer,
  FileSpreadsheet,
  Plus,
  Info,
  CalendarCheck,
  Sparkles,
  MapPin,
  Building,
  RotateCcw,
  HeartPulse,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  TableSelect,
  PrintButton,
} from '@/components/ui';

// Helper membuat 30 hari kalender November 2026 yang 100% sinkron dengan aturan JadwalShift.jsx
// Catatan Operasional: Shift Operasional (Grup A & Grup B) TIDAK memiliki libur Sabtu & Minggu tetap.
// Operasional berjalan 7 hari penuh dengan sistem rotasi bergulir (1 Hari Dinas, 1 Hari Libur Roster OFF).
// Staf Non-Shift (Kantor Reguler) bekerja Senin s/d Jumat dengan Libur Akhir Pekan Sabtu & Minggu.
function generateCalendarDays(employee) {
  const daysInMonth = 30; // November 2026
  const isNonShift = employee.group === 'Non-Shift' || employee.shiftCode === 'NON';
  const isGroupA = employee.group === 'Grup A';
  const isGroupB = employee.group === 'Grup B';
  const incidents = employee.incidents || [];

  const days = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = d < 10 ? `0${d}` : `${d}`;
    const dateFormatted = `${dayStr} Nov 2026`;
    const dateObj = new Date(2026, 10, d);
    const dayOfWeek = dateObj.getDay(); // 0 = Min, 1 = Sen, ..., 6 = Sab
    const dayName = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][dayOfWeek];
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let isScheduledWorkDay = false;
    let defaultStatus = 'Libur';
    let defaultDetail = 'Libur Roster Bergulir (OFF)';
    let defaultClass = 'status-libur';

    if (isNonShift) {
      if (isWeekend) {
        isScheduledWorkDay = false;
        defaultStatus = 'Libur';
        defaultDetail = 'Libur Akhir Pekan (OFF)';
        defaultClass = 'status-libur';
      } else {
        isScheduledWorkDay = true;
        defaultStatus = 'Hadir';
        defaultDetail = '08:00 - 17:00 WIB (Normal Office)';
        defaultClass = 'status-hadir';
      }
    } else {
      // Siklus 14 Hari Roster Operasional (Ganjil d-1 = Grup A Masuk, Genap d-1 = Grup B Masuk)
      const dayIndex = d - 1;
      const isTurnA = dayIndex % 2 === 1;
      const isTurnB = dayIndex % 2 === 0;

      if (isGroupA && isTurnA) {
        isScheduledWorkDay = true;
        defaultStatus = 'Hadir';
        defaultDetail = '07:00 - 15:00 WIB (Shift 1 Pagi)';
        defaultClass = 'status-hadir';
      } else if (isGroupB && isTurnB) {
        isScheduledWorkDay = true;
        defaultStatus = 'Hadir';
        const timeStr = d === 5 ? '14:00 - 22:00 WIB' : '15:00 - 23:00 WIB';
        defaultDetail = `${timeStr} (Shift 2 Malam)`;
        defaultClass = 'status-hadir';
      }
    }

    // Periksa apakah ada insiden atau catatan kehadiran spesifik pada hari ini
    const incident = incidents.find((inc) => inc.date && inc.date.includes(`${dayStr} Nov`));

    let status = defaultStatus;
    let detail = defaultDetail;
    let typeClass = defaultClass;

    if (incident) {
      if (incident.type.includes('Terlambat')) {
        status = 'Terlambat';
        detail = incident.detail;
        typeClass = 'status-terlambat';
      } else if (incident.type.includes('Alpa') || incident.type.includes('Alpha')) {
        status = 'Alpha';
        detail = incident.detail;
        typeClass = 'status-alpha';
      } else if (incident.type.includes('Cuti')) {
        status = 'Cuti';
        detail = incident.detail;
        typeClass = 'status-cuti';
      } else if (incident.type.includes('Sakit')) {
        status = 'Sakit';
        detail = incident.detail;
        typeClass = 'status-sakit';
      } else if (incident.type.includes('Izin')) {
        status = 'Izin';
        detail = incident.detail;
        typeClass = 'status-izin';
      } else if (incident.type.includes('Tepat Waktu')) {
        status = 'Hadir';
        detail = incident.detail;
        typeClass = 'status-hadir';
      }
    }

    days.push({
      day: d,
      dateFormatted,
      dayName,
      dayOfWeek,
      isWeekend,
      isScheduledWorkDay,
      status,
      detail,
      typeClass,
    });
  }

  return days;
}

export default function RaporIndividu({
  employee,
  allEmployees,
  onSelectEmployee,
  selectedPeriod,
  onBackToOrganization,
  onOpenPrintModal,
}) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [newNoteType, setNewNoteType] = useState('Konseling Rutin');

  // State lokal untuk catatan pembinaan agar interaktif
  const [coachingLogs, setCoachingLogs] = useState(() => [
    {
      id: 1,
      date: '02 Nov 2026',
      type: employee.status === 'Peringatan / SP' ? 'Surat Peringatan (SP-1)' : 'Konseling Supervisor',
      officer: 'Siti Rahmawati (HCGA)',
      note: employee.actionRecommendation,
      status: employee.status === 'Peringatan / SP' ? 'Aktif (Masa Berlaku 6 Bulan)' : 'Selesai',
    },
    {
      id: 2,
      date: '24 Okt 2026',
      type: 'Teguran Lisan',
      officer: 'Supervisor Divisi',
      note: 'Evaluasi kesiapan shift dan pemenuhan APD di area kerja.',
      status: 'Selesai',
    },
  ]);

  // Generate kalender kehadiran untuk karyawan aktif
  const calendarDays = useMemo(() => generateCalendarDays(employee), [employee]);

  // Hitung riwayat 6 bulan
  const historyData = useMemo(() => {
    return employee.monthlyHistory || [
      { month: 'Jun', score: Math.min(100, employee.score + 4) },
      { month: 'Jul', score: Math.min(100, employee.score + 2) },
      { month: 'Agt', score: Math.max(60, employee.score - 3) },
      { month: 'Sep', score: Math.min(100, employee.score + 1) },
      { month: 'Okt', score: Math.max(60, employee.score - 2) },
      { month: 'Nov', score: employee.score },
    ];
  }, [employee]);

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
  };

  // 8 Metrik KPI Rapor Individu
  const presentDays = employee.presentDays || 0;
  const workDays = employee.workDays || 22;
  const lateCount = employee.lateCount || 0;
  const totalLateMinutes = employee.totalLateMinutes || 0;
  const onTimeDays = employee.onTimeDays ?? Math.max(0, presentDays - lateCount);
  const izinDays = employee.izinDays ?? 0;
  const sakitDays = employee.sakitDays ?? 0;
  const cutiDays = employee.cutiDays ?? Math.max(0, (employee.leaveDays || 0) - izinDays - sakitDays);
  const alpaDays = employee.alpaDays || 0;

  // Ekspor Rapor Karyawan ke Excel
  const handleExportIndividualReport = () => {
    const profileData = [
      { Properti: 'NIP', Nilai: employee.nip },
      { Properti: 'Nama Karyawan', Nilai: employee.name },
      { Properti: 'Jabatan', Nilai: employee.role },
      { Properti: 'Divisi', Nilai: employee.division },
      { Properti: 'Lokasi Kerja', Nilai: employee.location },
      { Properti: 'Periode Evaluasi', Nilai: selectedPeriod },
      { Properti: 'Hari Kerja Efektif', Nilai: `${workDays} Hari` },
      { Properti: 'Total Kehadiran', Nilai: `${presentDays} Hari (${((presentDays / workDays) * 100).toFixed(1)}%)` },
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
    XLSX.utils.book_append_sheet(workbook, wsCalendar, 'Log Presensi 30 Hari');

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
      {/* Bar Navigasi & Pemilihan Karyawan */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToOrganization}
            className="text-xs text-slate-600 hover:text-navy gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kembali ke Rekap Kehadiran</span>
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
          <PrintButton
            label="Cetak Rapor"
            onClick={onOpenPrintModal}
          />

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

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#c4a266]" />
                  {employee.division}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c4a266]" />
                  {employee.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#c4a266]" />
                  {employee.group || 'Non-Shift'} • {employee.baseShift || 'Reguler'}
                </span>
                <span className="flex items-center gap-1.5">
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* 1. Total Kehadiran */}
        <Card className="border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                Total Kehadiran
              </p>
              <p className="text-2xl font-bold font-display text-navy mt-1">
                {presentDays} <span className="text-xs font-normal text-slate-400">/ {workDays} Hari</span>
              </p>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5 truncate">
                {((presentDays / workDays) * 100).toFixed(1)}% Rasio Kehadiran
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-navy flex items-center justify-center shrink-0 ml-2">
              <UserCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* 2. Tepat Waktu */}
        <Card className="border-slate-200 shadow-2xs hover:border-emerald-200 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                Tepat Waktu
              </p>
              <p className="text-2xl font-bold font-display text-[#398872] mt-1">
                {onTimeDays} <span className="text-xs font-normal text-slate-400">Hari</span>
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5 truncate">
                {presentDays > 0 ? ((onTimeDays / presentDays) * 100).toFixed(0) : 0}% Presensi Tepat
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#eef7f1] text-[#398872] flex items-center justify-center shrink-0 ml-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* 3. Terlambat */}
        <Card className="border-slate-200 shadow-2xs hover:border-amber-200 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                Terlambat
              </p>
              <p className="text-2xl font-bold font-display text-[#ac8848] mt-1">
                {lateCount} <span className="text-xs font-normal text-slate-400">Kali</span>
              </p>
              <p className="text-[11px] text-amber-700 font-medium mt-0.5 truncate">
                {lateCount > 0 ? `${lateCount}x keterlambatan` : 'Disiplin sempurna'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#fcf6e9] text-[#ac8848] flex items-center justify-center shrink-0 ml-2">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* 4. Menit Terlambat */}
        <Card className="border-slate-200 shadow-2xs hover:border-amber-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                Menit Terlambat
              </p>
              <p className="text-2xl font-bold font-display text-amber-600 mt-1">
                {totalLateMinutes} <span className="text-xs font-normal text-slate-400">Mnt</span>
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                {lateCount > 0 ? `Rata-rata ${Math.round(totalLateMinutes / lateCount)} mnt/telat` : '0 mnt akumulasi'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 ml-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* 5. Izin */}
        <Card className="border-slate-200 shadow-2xs hover:border-sky-200 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                Izin
              </p>
              <p className="text-2xl font-bold font-display text-[#698eb0] mt-1">
                {izinDays} <span className="text-xs font-normal text-slate-400">Hari</span>
              </p>
              <p className="text-[11px] text-sky-700 font-medium mt-0.5 truncate">
                {izinDays > 0 ? 'Izin resmi disetujui' : 'Nihil izin pribadi'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#eff5fa] text-[#698eb0] flex items-center justify-center shrink-0 ml-2">
              <Calendar className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* 6. Sakit */}
        <Card className="border-slate-200 shadow-2xs hover:border-purple-200 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                Sakit
              </p>
              <p className="text-2xl font-bold font-display text-[#ab7b9b] mt-1">
                {sakitDays} <span className="text-xs font-normal text-slate-400">Hari</span>
              </p>
              <p className="text-[11px] text-purple-700 font-medium mt-0.5 truncate">
                {sakitDays > 0 ? 'Surat dokter terlampir' : 'Kondisi fisik prima'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f7f0f7] text-[#ab7b9b] flex items-center justify-center shrink-0 ml-2">
              <HeartPulse className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* 7. Cuti */}
        <Card className="border-slate-200 shadow-2xs hover:border-teal-200 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                Cuti
              </p>
              <p className="text-2xl font-bold font-display text-[#489490] mt-1">
                {cutiDays} <span className="text-xs font-normal text-slate-400">Hari</span>
              </p>
              <p className="text-[11px] text-teal-700 font-medium mt-0.5 truncate">
                {cutiDays > 0 ? 'Potong cuti tahunan' : 'Saldo cuti utuh'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#edf6f6] text-[#489490] flex items-center justify-center shrink-0 ml-2">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* 8. Alpha */}
        <Card className="border-slate-200 shadow-2xs hover:border-rose-200 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                Alpha
              </p>
              <p className="text-2xl font-bold font-display text-[#b36a74] mt-1">
                {alpaDays} <span className="text-xs font-normal text-slate-400">Hari</span>
              </p>
              <p className="text-[11px] text-rose-700 font-medium mt-0.5 truncate">
                {alpaDays > 0 ? 'Mangkir tanpa izin' : 'Nihil pelanggaran'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#fbf0f2] text-[#b36a74] flex items-center justify-center shrink-0 ml-2">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Kalender Presensi 30 Hari & Grafik Tren 6 Bulan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Kalender Presensi 30 Hari */}
        <Card className="lg:col-span-2 border-slate-200 shadow-2xs">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-[#c4a266]" />
                  Matriks Presensi 30 Hari (November 2026)
                </CardTitle>
                <CardDescription className="text-xs">
                  {employee.group === 'Non-Shift'
                    ? 'Jadwal Kantor Reguler (Senin s/d Jumat) • Libur Akhir Pekan Sabtu & Minggu'
                    : `Pola Roster Operasional 7 Hari Non-Stop • 1 Hari Dinas 1 Hari Libur Bergulir (${employee.group || 'Shift Operasional'})`}
                </CardDescription>
              </div>

              {/* Legenda Warna */}
              <div className="flex items-center gap-2 flex-wrap text-[10px]">
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Tepat Waktu
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Terlambat
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Izin
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Sakit
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" /> Cuti
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Alpha
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" /> Libur
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-5">
            {/* Grid 30 Hari */}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
              {calendarDays.map((dayItem) => {
                const isSelected = selectedDay?.day === dayItem.day;
                let bgStyle = 'bg-emerald-50 border-emerald-200 text-emerald-900';
                let dotStyle = 'bg-emerald-500';

                if (dayItem.status === 'Terlambat') {
                  bgStyle = 'bg-amber-50 border-amber-300 text-amber-900 font-semibold';
                  dotStyle = 'bg-amber-500';
                } else if (dayItem.status === 'Alpha' || dayItem.status === 'Alpa') {
                  bgStyle = 'bg-rose-50 border-rose-300 text-rose-900 font-bold';
                  dotStyle = 'bg-rose-500';
                } else if (dayItem.status === 'Izin') {
                  bgStyle = 'bg-sky-50 border-sky-300 text-sky-900';
                  dotStyle = 'bg-sky-500';
                } else if (dayItem.status === 'Sakit') {
                  bgStyle = 'bg-purple-50 border-purple-300 text-purple-900';
                  dotStyle = 'bg-purple-500';
                } else if (dayItem.status === 'Cuti') {
                  bgStyle = 'bg-teal-50 border-teal-300 text-teal-900';
                  dotStyle = 'bg-teal-500';
                } else if (dayItem.status === 'Libur') {
                  bgStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                  dotStyle = 'bg-slate-300';
                }

                return (
                  <button
                    key={dayItem.day}
                    type="button"
                    onClick={() => setSelectedDay(dayItem)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer relative ${bgStyle} ${
                      isSelected ? 'ring-2 ring-navy scale-105 shadow-sm' : 'hover:opacity-90'
                    }`}
                  >
                    <span className="text-[10px] block opacity-75">{dayItem.dayName}</span>
                    <span className="text-base font-bold font-display block my-0.5">
                      {dayItem.day}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full mx-auto block ${dotStyle}`} />
                  </button>
                );
              })}
            </div>

            {/* Panel Rincian Tanggal Terpilih */}
            {selectedDay ? (
              <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy text-white flex items-center justify-center font-bold">
                    {selectedDay.day}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      {selectedDay.dateFormatted} ({selectedDay.dayName})
                    </p>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Status: <strong>{selectedDay.status}</strong> • {selectedDay.detail}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDay(null)}
                  className="text-xs h-7 px-2 text-slate-500 hover:text-navy"
                >
                  Tutup
                </Button>
              </div>
            ) : (
              <p className="text-center text-xs text-slate-400 mt-4 italic print:hidden">
                Klik salah satu kotak tanggal di atas untuk melihat detail presensi.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Grafik Tren Kedisiplinan 6 Bulan Terakhir */}
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-navy flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#c4a266]" />
                Tren Disiplin 6 Bulan
              </span>
              <Badge variant="neutral" className="text-[10px]">
                Target ≥ 95%
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Histori skor kepatuhan kehadiran (Jun - Nov 2026)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historyData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                  />
                  <YAxis
                    domain={[50, 100]}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    unit="%"
                  />
                  <Tooltip
                    formatter={(val) => [`${val}%`, 'Skor Disiplin']}
                    contentStyle={{
                      backgroundColor: '#10273f',
                      borderColor: '#10273f',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={32}>
                    {historyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.score >= 95 ? '#10273f' : entry.score >= 85 ? '#39609e' : '#c4a266'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 mt-2">
              Rata-rata semester: <strong>{(historyData.reduce((a, b) => a + b.score, 0) / 6).toFixed(1)}%</strong>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Buku Catatan Pembinaan & Sanksi HCGA (Disciplinary Log) */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-navy" />
                Buku Catatan Pembinaan & Sanksi Kedisiplinan
              </CardTitle>
              <CardDescription className="text-xs">
                Rekam jejak konseling, surat peringatan, dan tindakan pembinaan oleh HCGA untuk {employee.name}
              </CardDescription>
            </div>

            <Badge variant="neutral" className="text-xs self-start sm:self-auto font-medium">
              {coachingLogs.length} Catatan Pembinaan
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* Form Input Catatan Baru */}
          <form onSubmit={handleAddCoachingLog} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3 print:hidden">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-navy" />
              Tambah Catatan Pembinaan Baru
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Kategori Tindakan
                </label>
                <TableSelect
                  value={newNoteType}
                  onChange={(e) => setNewNoteType(e.target.value)}
                  containerClassName="w-full"
                >
                  <option value="Konseling Rutin">Konseling Rutin</option>
                  <option value="Teguran Lisan">Teguran Lisan</option>
                  <option value="Surat Peringatan (SP-1)">Surat Peringatan (SP-1)</option>
                  <option value="Surat Peringatan (SP-2)">Surat Peringatan (SP-2)</option>
                  <option value="Apresiasi Kedisiplinan">Apresiasi Kedisiplinan</option>
                </TableSelect>
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Catatan Pembinaan / Kesepakatan Komitmen
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Contoh: Karyawan berjanji hadir 15 menit sebelum briefing shift..."
                    className="flex-1 h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  />
                  <Button type="submit" size="sm" className="h-9 px-4 text-xs shrink-0">
                    Simpan Catatan
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* Timeline / Daftar Catatan Pembinaan */}
          <div className="space-y-3">
            {coachingLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.type}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">{log.date}</span>
                    <Badge
                      className={
                        log.type.includes('SP')
                          ? 'bg-rose-50 text-rose-700 border-rose-200 text-[10px]'
                          : log.type.includes('Teguran')
                          ? 'bg-amber-50 text-amber-700 border-amber-200 text-[10px]'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{log.note}</p>
                  <p className="text-[11px] text-slate-400">Dicatat oleh: {log.officer}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

