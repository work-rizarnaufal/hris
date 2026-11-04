import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
  Settings,
  Clock,
  CalendarDays,
  MapPin,
  Building,
  ShieldCheck,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  AlertCircle,
  Database,
  Download,
  RefreshCw,
  FileText,
  Search,
  Sliders,
  Bell,
  Fingerprint,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  PageHeader,
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Toast,
} from '@/components/ui';
import {
  getAttendanceSettings,
  saveAttendanceSettings,
  getHolidays,
  saveHolidays,
  getLocations,
  saveLocations,
  getCompanyProfile,
  saveCompanyProfile,
  resetAllSettings,
  formatDateDMY,
  DEFAULT_ATTENDANCE_SETTINGS,
  DEFAULT_COMPANY_PROFILE,
} from '@/services/systemSettings.js';

export default function PengaturanSistem() {
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'calendar' | 'location' | 'maintenance'
  const [alertInfo, setAlertInfo] = useState(null);

  // State Konfigurasi Kehadiran & Parameter Kerja
  const [attendanceSettings, setAttendanceSettings] = useState(() => getAttendanceSettings());

  // State Kalender Libur
  const [holidays, setHolidays] = useState(() => getHolidays());
  const [holidaySearch, setHolidaySearch] = useState('');
  const [holidayFilterCategory, setHolidayFilterCategory] = useState('ALL');

  // Modal Hari Libur
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [editingHolidayId, setEditingHolidayId] = useState(null);
  const [holidayForm, setHolidayForm] = useState({
    date: '',
    name: '',
    category: 'Libur Nasional',
    deductsLeave: false,
    operationalNote: '',
  });

  // State Lokasi Geofencing
  const [locations, setLocations] = useState(() => getLocations());

  // State Profil Perusahaan
  const [companyProfile, setCompanyProfile] = useState(() => getCompanyProfile());

  // Filter Kalender Hari Libur
  const filteredHolidays = useMemo(() => {
    return holidays.filter((h) => {
      const matchSearch =
        holidaySearch === '' ||
        h.name.toLowerCase().includes(holidaySearch.toLowerCase()) ||
        h.date.includes(holidaySearch) ||
        h.operationalNote.toLowerCase().includes(holidaySearch.toLowerCase());
      const matchCategory =
        holidayFilterCategory === 'ALL' || h.category === holidayFilterCategory;
      return matchSearch && matchCategory;
    });
  }, [holidays, holidaySearch, holidayFilterCategory]);

  // Statistik Ringkasan Pengaturan
  const stats = useMemo(() => {
    const totalHolidays = holidays.length;
    const activeLocations = locations.filter((loc) => loc.status === 'Aktif').length;
    const tolerance = attendanceSettings.lateToleranceMinutes;
    return { totalHolidays, activeLocations, tolerance };
  }, [holidays, locations, attendanceSettings]);

  // Handle Simpan Semua Perubahan Pengaturan
  const handleSaveAll = () => {
    saveAttendanceSettings(attendanceSettings);
    saveHolidays(holidays);
    saveLocations(locations);
    saveCompanyProfile(companyProfile);
    setAlertInfo({
      type: 'success',
      message: 'Seluruh konfigurasi parameter sistem dan kebijakan HR berhasil disimpan & disinkronkan ke seluruh modul.',
    });
  };

  // Handle Reset ke Standar Pabrik
  const handleResetDefaults = () => {
    resetAllSettings();
    setAttendanceSettings(DEFAULT_ATTENDANCE_SETTINGS);
    setHolidays(getHolidays());
    setLocations(getLocations());
    setCompanyProfile(DEFAULT_COMPANY_PROFILE);
    setAlertInfo({
      type: 'warning',
      message: 'Parameter kehadiran dan profil telah dikembalikan ke standar bawaan regulasi.',
    });
  };

  // Handle Buka Modal Tambah Libur
  const handleOpenAddHoliday = () => {
    setEditingHolidayId(null);
    setHolidayForm({
      date: new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date()),
      name: '',
      category: 'Libur Nasional',
      deductsLeave: false,
      operationalNote: '',
    });
    setIsHolidayModalOpen(true);
  };

  // Handle Buka Modal Edit Libur
  const handleOpenEditHoliday = (holiday) => {
    setEditingHolidayId(holiday.id);
    setHolidayForm({
      date: holiday.date,
      name: holiday.name,
      category: holiday.category,
      deductsLeave: holiday.deductsLeave,
      operationalNote: holiday.operationalNote,
    });
    setIsHolidayModalOpen(true);
  };

  // Handle Submit Form Hari Libur
  const handleHolidaySubmit = (e) => {
    e.preventDefault();
    if (!holidayForm.name.trim() || !holidayForm.date) return;

    const dateObj = new Date(holidayForm.date);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const calculatedDayName = dayNames[dateObj.getDay()] || 'Hari';

    let updatedHolidays;
    if (editingHolidayId) {
      updatedHolidays = holidays.map((item) =>
        item.id === editingHolidayId
          ? { ...item, ...holidayForm, dayName: calculatedDayName }
          : item
      );
      setHolidays(updatedHolidays);
      saveHolidays(updatedHolidays);
      setAlertInfo({
        type: 'success',
        message: `Hari libur "${holidayForm.name}" berhasil diperbarui dan disinkronkan.`,
      });
    } else {
      const newHoliday = {
        id: Date.now(),
        ...holidayForm,
        dayName: calculatedDayName,
      };
      updatedHolidays = [newHoliday, ...holidays];
      setHolidays(updatedHolidays);
      saveHolidays(updatedHolidays);
      setAlertInfo({
        type: 'success',
        message: `Hari libur "${holidayForm.name}" berhasil ditambahkan dan disinkronkan ke jadwal roster.`,
      });
    }

    setIsHolidayModalOpen(false);
  };

  // Handle Hapus Hari Libur
  const handleDeleteHoliday = (id, name) => {
    const updated = holidays.filter((item) => item.id !== id);
    setHolidays(updated);
    saveHolidays(updated);
    setAlertInfo({
      type: 'warning',
      message: `Hari libur "${name}" telah dihapus dari kalender kerja dan roster jadwal.`,
    });
  };

  // Handle Update Radius Lokasi
  const handleUpdateLocationRadius = (id, newRadius) => {
    const updated = locations.map((loc) =>
      loc.id === id ? { ...loc, radiusMeters: Number(newRadius) } : loc
    );
    setLocations(updated);
    saveLocations(updated);
  };

  // Handle Toggle Status Lokasi Geofence
  const handleToggleLocationStatus = (id) => {
    const updated = locations.map((loc) =>
      loc.id === id
        ? { ...loc, status: loc.status === 'Aktif' ? 'Non-Aktif' : 'Aktif' }
        : loc
    );
    setLocations(updated);
    saveLocations(updated);
  };

  // Handle Download Backup Snapshot
  const handleDownloadBackup = () => {
    const backupPayload = {
      system: 'HCGA Attendance & Shift Monitoring System',
      version: '1.0.0-enterprise',
      exportedAt: new Date().toISOString(),
      companyProfile,
      attendanceSettings,
      locations,
      holidays,
    };

    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `backup_konfigurasi_hris_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);

    setAlertInfo({
      type: 'success',
      message: 'Cadangan database konfigurasi sistem berhasil diunduh dalam format JSON.',
    });
  };

  // Handle Bersihkan Cache Sistem
  const handleClearCache = () => {
    setAlertInfo({
      type: 'success',
      message: 'Cache sesi presensi dan memori redis berhasil dibersihkan. Sistem dioptimalkan.',
    });
  };

  return (
    <>
      <Head title="Pengaturan Sistem" />

      {/* Atomic Toast Feedback */}
      <Toast toast={alertInfo} onClose={() => setAlertInfo(null)} />

      {/* Header Halaman */}
      <PageHeader
        eyebrow="SISTEM & ADMINISTRASI HCGA"
        title="Pengaturan Sistem & Kebijakan HR"
        subtitle="Konfigurasi kebijakan kehadiran, kalender kerja & hari libur nasional, validasi geofencing GPS, dan pemeliharaan pencadangan data."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="gap-1.5 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </Button>

            <Button
              size="sm"
              onClick={handleSaveAll}
              className="gap-1.5 bg-navy hover:bg-[#193750] text-white shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* 4 Scorecards KPI Konfigurasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Toleransi Keterlambatan
                </p>
                <p className="text-2xl font-bold font-display text-navy mt-1">
                  {stats.tolerance} <span className="text-sm font-normal text-slate-400">Menit</span>
                </p>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                  Grace Period Presensi Aktif
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-navy/5 text-navy flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Hari Libur Nasional 2026
                </p>
                <p className="text-2xl font-bold font-display text-emerald-700 mt-1">
                  {stats.totalHolidays} <span className="text-sm font-normal text-slate-400">Hari</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Termasuk Cuti Bersama Resmi
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Geofence Presensi Mobile
                </p>
                <p className="text-2xl font-bold font-display text-amber-700 mt-1">
                  {stats.activeLocations} <span className="text-sm font-normal text-slate-400">Titik Aktif</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Radius Default: 80 - 150m
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status Database & Cadangan
                </p>
                <p className="text-2xl font-bold font-display text-purple-700 mt-1">
                  Aman <span className="text-sm font-normal text-slate-400">(Auto-Sync)</span>
                </p>
                <p className="text-[11px] text-purple-600 font-medium mt-0.5">
                  Backup Terakhir: Hari ini 03:00 WIB
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Switcher Segmented Control */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'bg-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Kebijakan Presensi & Kerja</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-100'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Kalender Libur & Cuti Bersama</span>
            <Badge className={activeTab === 'calendar' ? 'bg-white/20 text-white font-mono text-[10px]' : 'bg-slate-200 text-slate-700 text-[10px]'}>
              {holidays.length}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('location')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'location'
                ? 'bg-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Geofencing & Lokasi Pabrik</span>
            <Badge className={activeTab === 'location' ? 'bg-white/20 text-white font-mono text-[10px]' : 'bg-slate-200 text-slate-700 text-[10px]'}>
              {locations.length}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'maintenance'
                ? 'bg-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Profil Perusahaan & Pemeliharaan</span>
          </button>
        </div>

        {/* TAB 1: KEBIJAKAN PRESENSI & KERJA */}
        {activeTab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Batas Waktu & Toleransi */}
            <Card className="border-slate-200 shadow-2xs">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#c4a266]" />
                  Parameter Waktu Kehadiran
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Batas toleransi masuk, kepulangan lebih awal, dan durasi kerja mingguan standar.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Toleransi Keterlambatan Masuk (Menit)
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="60"
                        value={attendanceSettings.lateToleranceMinutes}
                        onChange={(e) =>
                          setAttendanceSettings({
                            ...attendanceSettings,
                            lateToleranceMinutes: Number(e.target.value),
                          })
                        }
                        className="h-9 text-xs bg-white text-slate-800 font-mono w-32"
                      />
                      <span className="text-xs text-slate-500">
                        menit paska jam shift dimulai (tidak dihitung denda keterlambatan)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Batas Buka Check-In Lebih Awal (Menit)
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="15"
                        max="180"
                        value={attendanceSettings.earlyCheckInMinutes}
                        onChange={(e) =>
                          setAttendanceSettings({
                            ...attendanceSettings,
                            earlyCheckInMinutes: Number(e.target.value),
                          })
                        }
                        className="h-9 text-xs bg-white text-slate-800 font-mono w-32"
                      />
                      <span className="text-xs text-slate-500">
                        menit sebelum shift aktif (karyawan dapat mulai check-in masuk)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Toleransi Pulang Lebih Cepat (Menit)
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        value={attendanceSettings.earlyDepartureToleranceMinutes}
                        onChange={(e) =>
                          setAttendanceSettings({
                            ...attendanceSettings,
                            earlyDepartureToleranceMinutes: Number(e.target.value),
                          })
                        }
                        className="h-9 text-xs bg-white text-slate-800 font-mono w-32"
                      />
                      <span className="text-xs text-slate-500">
                        menit sebelum jam pulang (0 = wajib sesuai jam kerja)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kewajiban Jam Kerja Minimal Mingguan
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="30"
                        max="60"
                        value={attendanceSettings.weeklyMinHours}
                        onChange={(e) =>
                          setAttendanceSettings({
                            ...attendanceSettings,
                            weeklyMinHours: Number(e.target.value),
                          })
                        }
                        className="h-9 text-xs bg-white text-slate-800 font-mono w-32"
                      />
                      <span className="text-xs text-slate-500">
                        jam per minggu (Regulasi Depnaker: 40 jam kerja)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Validasi Swafoto / Selfie Wajah
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Karyawan wajib mengunggah foto selfie saat presensi melalui ponsel
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={attendanceSettings.requireSelfie}
                      onChange={(e) =>
                        setAttendanceSettings({
                          ...attendanceSettings,
                          requireSelfie: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-navy focus:ring-navy border-slate-300 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Anti-Fake GPS / Mock Location Detection
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Tolak presensi secara otomatis jika aplikasi GPS palsu terdeteksi
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={attendanceSettings.preventMockGps}
                      onChange={(e) =>
                        setAttendanceSettings({
                          ...attendanceSettings,
                          preventMockGps: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-navy focus:ring-navy border-slate-300 cursor-pointer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Parameter Lembur & Kuota Cuti */}
            <Card className="border-slate-200 shadow-2xs">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#c4a266]" />
                  Parameter Lembur & Kuota Cuti
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Koefisien upah lembur reguler dan hak jatah cuti tahunan karyawan.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ambang Batas Minimum Durasi Lembur (Menit)
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="30"
                        max="120"
                        value={attendanceSettings.minOvertimeMinutes}
                        onChange={(e) =>
                          setAttendanceSettings({
                            ...attendanceSettings,
                            minOvertimeMinutes: Number(e.target.value),
                          })
                        }
                        className="h-9 text-xs bg-white text-slate-800 font-mono w-32"
                      />
                      <span className="text-xs text-slate-500">
                        menit (durasi lembur di bawah nilai ini diabaikan)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pengali Lembur Jam Ke-1
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={attendanceSettings.overtimeFirstHourRate}
                        onChange={(e) =>
                          setAttendanceSettings({
                            ...attendanceSettings,
                            overtimeFirstHourRate: Number(e.target.value),
                          })
                        }
                        className="h-9 text-xs bg-white text-slate-800 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Standar Depnaker: 1.5x upah per jam
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pengali Lembur Jam Ke-2+
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={attendanceSettings.overtimeSubsequentHourRate}
                        onChange={(e) =>
                          setAttendanceSettings({
                            ...attendanceSettings,
                            overtimeSubsequentHourRate: Number(e.target.value),
                          })
                        }
                        className="h-9 text-xs bg-white text-slate-800 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Standar Depnaker: 2.0x upah per jam
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hak Kuota Cuti Tahunan Standar (Hari/Tahun)
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="6"
                        max="24"
                        value={attendanceSettings.standardAnnualLeaveDays}
                        onChange={(e) =>
                          setAttendanceSettings({
                            ...attendanceSettings,
                            standardAnnualLeaveDays: Number(e.target.value),
                          })
                        }
                        className="h-9 text-xs bg-white text-slate-800 font-mono w-32"
                      />
                      <span className="text-xs text-slate-500">
                        hari kerja per tahun masa bakti penuh
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Batas Kedaluwarsa Sisa Cuti Tahunan
                    </label>
                    <TableSelect
                      value={attendanceSettings.leaveExpiryPeriod}
                      onChange={(e) =>
                        setAttendanceSettings({
                          ...attendanceSettings,
                          leaveExpiryPeriod: e.target.value,
                        })
                      }
                      className="h-9 text-xs text-slate-700"
                      containerClassName="w-full"
                    >
                      <option value="31 Maret (Tahun Berikutnya)">
                        31 Maret Tahun Berikutnya (3 Bulan Grace Period)
                      </option>
                      <option value="30 Juni (Tahun Berikutnya)">
                        30 Juni Tahun Berikutnya (6 Bulan Grace Period)
                      </option>
                      <option value="31 Desember (Akhir Tahun Berjalan)">
                        31 Desember (Hangus pada akhir tahun kalender berjalan)
                      </option>
                    </TableSelect>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Notifikasi Pengingat Jadwal Shift Otomatis
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Kirim notifikasi pengingat 1 jam sebelum shift dimulai ke personil dinas
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={attendanceSettings.autoNotifyShiftReminder}
                      onChange={(e) =>
                        setAttendanceSettings({
                          ...attendanceSettings,
                          autoNotifyShiftReminder: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-navy focus:ring-navy border-slate-300 cursor-pointer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: KALENDER LIBUR & CUTI BERSAMA */}
        {activeTab === 'calendar' && (
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-[#c4a266]" />
                  Kalender Hari Libur Resmi & Cuti Bersama 2026
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Daftar hari libur nasional resmi pemerintah dan libur operasional pabrik khusus.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
                <Button
                  size="sm"
                  onClick={handleOpenAddHoliday}
                  className="gap-1.5 text-xs bg-navy hover:bg-[#193750] text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Hari Libur</span>
                </Button>
              </div>
            </CardHeader>

            {/* Filter Toolbar Hari Libur */}
            <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 w-full sm:w-72">
                <div className="relative w-full">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Cari hari libur atau keterangan..."
                    value={holidaySearch}
                    onChange={(e) => setHolidaySearch(e.target.value)}
                    className="h-8 pl-8 text-xs bg-white border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[11px] whitespace-nowrap">Kategori:</span>
                <TableSelect
                  value={holidayFilterCategory}
                  onChange={(e) => setHolidayFilterCategory(e.target.value)}
                  className="h-8 text-xs text-slate-700"
                >
                  <option value="ALL">Semua Kategori ({holidays.length})</option>
                  <option value="Libur Nasional">Libur Nasional</option>
                  <option value="Cuti Bersama">Cuti Bersama</option>
                  <option value="Libur Khusus Pabrik">Libur Khusus Pabrik</option>
                </TableSelect>
              </div>
            </div>

            {/* Tabel Hari Libur */}
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b border-slate-200">
                    <TableHead className="w-12 text-center text-xs font-semibold text-slate-600">No</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[130px]">Tanggal & Hari</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[220px]">Nama Hari Libur</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[140px]">Kategori</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[160px]">Potong Hak Cuti?</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[240px]">Keterangan Operasional</TableHead>
                    <TableHead className="text-right pr-4 text-xs font-semibold text-slate-600 w-24">Aksi</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredHolidays.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-400 italic text-xs">
                        Tidak ada catatan hari libur yang sesuai filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHolidays.map((holiday, idx) => (
                      <TableRow key={holiday.id} className="text-xs hover:bg-slate-50/70">
                        <TableCell className="text-center font-medium text-slate-500">{idx + 1}</TableCell>
                        <TableCell className="font-bold text-navy whitespace-nowrap">
                          {formatDateDMY(holiday.date)}
                          <span className="text-[11px] text-slate-400 block font-normal">
                            {holiday.dayName}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">
                          {holiday.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              holiday.category === 'Libur Nasional'
                                ? 'bg-rose-50 text-rose-800 border-rose-200 font-bold'
                                : holiday.category === 'Cuti Bersama'
                                ? 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                                : 'bg-indigo-50 text-indigo-800 border-indigo-200 font-bold'
                            }
                          >
                            {holiday.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {holiday.deductsLeave ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              Mengurangi Cuti Tahunan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Tidak Potong Cuti
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {holiday.operationalNote}
                        </TableCell>
                        <TableCell className="text-right pr-4 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditHoliday(holiday)}
                              className="h-7 w-7 p-0 text-slate-500 hover:text-navy hover:bg-slate-100 cursor-pointer"
                              title="Edit Hari Libur"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteHoliday(holiday.id, holiday.name)}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Hapus Hari Libur"
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
            </CardContent>
          </Card>
        )}

        {/* TAB 3: GEOFENCING & LOKASI PABRIK */}
        {activeTab === 'location' && (
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#c4a266]" />
                  Titik Lokasi & Radius Geofence Presensi Mobile
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Validasi presensi GPS smartphone hanya diizinkan dalam batas radius meter yang ditentukan.
                </CardDescription>
              </div>

              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-semibold self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Service Geofence Aktif (GPS Accurate)
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b border-slate-200">
                    <TableHead className="w-12 text-center text-xs font-semibold text-slate-600">No</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[200px]">Nama Lokasi Operasional</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[180px]">Koordinat GPS (Lat, Long)</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[160px]">Radius Valid (Meter)</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 min-w-[130px]">Personil Terdaftar</TableHead>
                    <TableHead className="text-center text-xs font-semibold text-slate-600 w-28">Status Geofence</TableHead>
                    <TableHead className="text-right pr-4 text-xs font-semibold text-slate-600 w-28">Aksi</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {locations.map((loc, idx) => (
                    <TableRow key={loc.id} className="text-xs hover:bg-slate-50/70">
                      <TableCell className="text-center font-medium text-slate-500">{idx + 1}</TableCell>
                      <TableCell>
                        <p className="font-bold text-navy">{loc.name}</p>
                        <p className="text-[11px] text-slate-500">{loc.address}</p>
                      </TableCell>
                      <TableCell className="font-mono text-slate-700">
                        {loc.latitude}, {loc.longitude}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="20"
                            max="500"
                            step="10"
                            value={loc.radiusMeters}
                            onChange={(e) =>
                              handleUpdateLocationRadius(loc.id, e.target.value)
                            }
                            className="h-8 text-xs bg-white text-slate-800 font-mono w-24"
                          />
                          <span className="text-xs text-slate-500">Meter</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-700">
                        {loc.assignedCount} Karyawan
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            loc.status === 'Aktif'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                              : 'bg-slate-100 text-slate-500 border-slate-200 font-semibold'
                          }
                        >
                          {loc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleLocationStatus(loc.id)}
                          className="h-7 text-[11px] px-2 font-medium cursor-pointer"
                        >
                          {loc.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* TAB 4: PROFIL PERUSAHAAN & PEMELIHARAAN */}
        {activeTab === 'maintenance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profil Resmi Entitas Perusahaan */}
            <Card className="border-slate-200 shadow-2xs">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#c4a266]" />
                  Profil Legal Perusahaan & Kontak HCGA
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Informasi identitas resmi entitas perusahaan yang dicantumkan pada slip gaji dan laporan.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Resmi Perusahaan
                  </label>
                  <Input
                    type="text"
                    value={companyProfile.companyName}
                    onChange={(e) =>
                      setCompanyProfile({ ...companyProfile, companyName: e.target.value })
                    }
                    className="h-9 text-xs bg-white text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nomor Induk Berusaha (NIB)
                    </label>
                    <Input
                      type="text"
                      value={companyProfile.registrationNumber}
                      onChange={(e) =>
                        setCompanyProfile({
                          ...companyProfile,
                          registrationNumber: e.target.value,
                        })
                      }
                      className="h-9 text-xs bg-white text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      NPWP Badan Perusahaan
                    </label>
                    <Input
                      type="text"
                      value={companyProfile.taxId}
                      onChange={(e) =>
                        setCompanyProfile({ ...companyProfile, taxId: e.target.value })
                      }
                      className="h-9 text-xs bg-white text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alamat Kantor Pusat
                  </label>
                  <Input
                    type="text"
                    value={companyProfile.headOfficeAddress}
                    onChange={(e) =>
                      setCompanyProfile({
                        ...companyProfile,
                        headOfficeAddress: e.target.value,
                      })
                    }
                    className="h-9 text-xs bg-white text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nomor Telepon Operasional
                    </label>
                    <Input
                      type="text"
                      value={companyProfile.phone}
                      onChange={(e) =>
                        setCompanyProfile({ ...companyProfile, phone: e.target.value })
                      }
                      className="h-9 text-xs bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Resmi HCGA
                    </label>
                    <Input
                      type="email"
                      value={companyProfile.officialEmail}
                      onChange={(e) =>
                        setCompanyProfile({
                          ...companyProfile,
                          officialEmail: e.target.value,
                        })
                      }
                      className="h-9 text-xs bg-white text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Penanggung Jawab HCGA (PIC Administrator)
                  </label>
                  <Input
                    type="text"
                    value={companyProfile.adminPicName}
                    onChange={(e) =>
                      setCompanyProfile({
                        ...companyProfile,
                        adminPicName: e.target.value,
                      })
                    }
                    className="h-9 text-xs bg-white text-slate-800 font-medium"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Nama penandatangan sah dokumen laporan rekapitulasi dan surat tugas resmi.
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Pemeliharaan Sistem & Pencadangan Data */}
            <Card className="border-slate-200 shadow-2xs">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#c4a266]" />
                  Pencadangan Data & Pemeliharaan Server
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Operasi pencadangan instan, optimasi database, dan pembersihan cache sistem.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Database Engine:</span>
                    <span className="font-mono font-bold text-navy">MariaDB / MySQL 8.0</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Ukuran Storage DB:</span>
                    <span className="font-mono font-bold text-slate-800">18.4 MB (48 Tabel Terindeks)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Pencadangan Otomatis Terakhir:</span>
                    <span className="font-bold text-emerald-700">04 Nov 2026, 03:00 WIB</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Status Geolocation Service:</span>
                    <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                      Normal (Latency 12ms)
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-navy">
                        Unduh Snapshot Cadangan (JSON)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Ekspor seluruh parameter konfigurasi, kalender libur, dan koordinat ke berkas lokal.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleDownloadBackup}
                      className="gap-1.5 text-xs bg-navy hover:bg-[#193750] text-white shrink-0 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Backup</span>
                    </Button>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-navy">
                        Bersihkan Cache & Session Presensi
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Hapus cache sementara untuk me-refresh sinkronisasi data roster ke aplikasi mobile.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearCache}
                      className="gap-1.5 text-xs text-slate-700 hover:bg-slate-50 shrink-0 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Bersihkan Cache</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* MODAL ATOMIK TAMBAH / EDIT HARI LIBUR */}
      <Modal
        isOpen={isHolidayModalOpen}
        onClose={() => setIsHolidayModalOpen(false)}
        size="md"
      >
        <ModalHeader
          icon={<CalendarDays className="w-5 h-5" />}
          title={editingHolidayId ? 'Edit Hari Libur' : 'Tambah Hari Libur Baru'}
          description="Konfigurasikan tanggal, jenis libur, dan aturan pemotongan hak cuti tahunan."
          onClose={() => setIsHolidayModalOpen(false)}
        />

        <form onSubmit={handleHolidaySubmit}>
          <ModalBody className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Libur <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                value={holidayForm.date}
                onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
                className="h-9 text-xs bg-white text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Hari Libur / Acara <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Contoh: Hari Raya Idul Fitri 1447 H..."
                value={holidayForm.name}
                onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
                className="h-9 text-xs bg-white text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kategori Libur
                </label>
                <TableSelect
                  value={holidayForm.category}
                  onChange={(e) => setHolidayForm({ ...holidayForm, category: e.target.value })}
                  className="h-9 text-xs text-slate-700"
                  containerClassName="w-full"
                >
                  <option value="Libur Nasional">Libur Nasional</option>
                  <option value="Cuti Bersama">Cuti Bersama</option>
                  <option value="Libur Khusus Pabrik">Libur Khusus Pabrik</option>
                </TableSelect>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pengaruh Cuti Tahunan
                </label>
                <TableSelect
                  value={holidayForm.deductsLeave ? 'true' : 'false'}
                  onChange={(e) =>
                    setHolidayForm({
                      ...holidayForm,
                      deductsLeave: e.target.value === 'true',
                    })
                  }
                  className="h-9 text-xs text-slate-700"
                  containerClassName="w-full"
                >
                  <option value="false">Tidak Potong Cuti</option>
                  <option value="true">Potong Cuti Tahunan</option>
                </TableSelect>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Keterangan Operasional
              </label>
              <Input
                type="text"
                placeholder="Contoh: Seluruh lini pabrik dan kantor libur..."
                value={holidayForm.operationalNote}
                onChange={(e) =>
                  setHolidayForm({ ...holidayForm, operationalNote: e.target.value })
                }
                className="h-9 text-xs bg-white text-slate-800"
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsHolidayModalOpen(false)}
              className="text-xs text-slate-600 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs font-semibold bg-navy hover:bg-[#193750] text-white cursor-pointer"
            >
              Simpan Hari Libur
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
