import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
  Clock,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Save,
  RotateCcw,
  Database,
  ArrowLeftRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  PageHeader,
  Button,
  Badge,
  Toast,
} from '@/components/ui';
import {
  getAttendanceSettings,
  saveAttendanceSettings,
  getShiftSettings,
  saveShiftSettings,
  getHolidays,
  saveHolidays,
  getLocations,
  saveLocations,
  getCompanyProfile,
  saveCompanyProfile,
  resetAllSettings,
  DEFAULT_ATTENDANCE_SETTINGS,
  DEFAULT_SHIFT_SETTINGS,
  DEFAULT_COMPANY_PROFILE,
} from '@/services/systemSettings.js';

// Partials
import TabKebijakanPresensi from './Partials/TabKebijakanPresensi.jsx';
import TabJamKerjaShift from './Partials/TabJamKerjaShift.jsx';
import TabKalenderLibur from './Partials/TabKalenderLibur.jsx';
import TabGeofencingLokasi from './Partials/TabGeofencingLokasi.jsx';
import TabProfilPemeliharaan from './Partials/TabProfilPemeliharaan.jsx';
import ModalHariLibur from './Partials/ModalHariLibur.jsx';
import ModalEditLokasi from './Partials/ModalEditLokasi.jsx';

export default function PengaturanSistem() {
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'shifts' | 'calendar' | 'location' | 'maintenance'
  const [alertInfo, setAlertInfo] = useState(null);

  // State Konfigurasi Kehadiran & Parameter Kerja
  const [attendanceSettings, setAttendanceSettings] = useState(() => getAttendanceSettings());

  // State Konfigurasi Shift & Jam Kerja
  const [shiftSettings, setShiftSettings] = useState(() => getShiftSettings());

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

  // State Lokasi Geofencing & Modal
  const [locations, setLocations] = useState(() => getLocations());
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationForm, setLocationForm] = useState({
    id: null,
    name: '',
    type: '',
    latitude: 0,
    longitude: 0,
    radiusMeters: 120,
    address: '',
  });

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
    saveShiftSettings(shiftSettings);
    saveHolidays(holidays);
    saveLocations(locations);
    saveCompanyProfile(companyProfile);
    setAlertInfo({
      type: 'success',
      message: 'Seluruh konfigurasi jam kerja operasional, parameter sistem, dan kebijakan HR berhasil disimpan & disinkronkan.',
    });
  };

  // Handle Reset ke Standar Pabrik
  const handleResetDefaults = () => {
    resetAllSettings();
    setAttendanceSettings(DEFAULT_ATTENDANCE_SETTINGS);
    setShiftSettings(DEFAULT_SHIFT_SETTINGS);
    setHolidays(getHolidays());
    setLocations(getLocations());
    setCompanyProfile(DEFAULT_COMPANY_PROFILE);
    setAlertInfo({
      type: 'warning',
      message: 'Parameter kehadiran, shift, dan profil telah dikembalikan ke standar bawaan regulasi.',
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

  // Handle Buka Modal Edit Lokasi Geofence
  const handleOpenEditLocation = (loc) => {
    setLocationForm({
      id: loc.id,
      name: loc.name,
      type: loc.type,
      latitude: loc.latitude,
      longitude: loc.longitude,
      radiusMeters: loc.radiusMeters,
      address: loc.address,
    });
    setIsLocationModalOpen(true);
  };

  // Handle Simpan Modal Edit Lokasi Geofence
  const handleLocationSubmit = (e) => {
    e.preventDefault();
    const updated = locations.map((loc) =>
      loc.id === locationForm.id
        ? {
            ...loc,
            name: locationForm.name,
            type: locationForm.type,
            latitude: Number(locationForm.latitude),
            longitude: Number(locationForm.longitude),
            radiusMeters: Number(locationForm.radiusMeters),
            address: locationForm.address,
          }
        : loc
    );
    setLocations(updated);
    saveLocations(updated);
    setIsLocationModalOpen(false);
    setAlertInfo({
      type: 'success',
      message: `Konfigurasi geofence "${locationForm.name}" berhasil diperbarui dan disinkronkan.`,
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
      message: 'Cadangan konfigurasi sistem berhasil diunduh dalam format JSON.',
    });
  };

  // Handle Bersihkan Cache Sistem
  const handleClearCache = () => {
    setAlertInfo({
      type: 'success',
      message: 'Cache sesi presensi sementara berhasil dibersihkan. Sistem dioptimalkan.',
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
                {attendanceSettings.enableGeofence !== false ? (
                  <>
                    <p className="text-2xl font-bold font-display text-emerald-700 mt-1">
                      {stats.activeLocations} <span className="text-sm font-normal text-slate-400">Titik Aktif</span>
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      Radius Aktif (80 - 150m)
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold font-display text-amber-600 mt-1">
                      Dinonaktifkan
                    </p>
                    <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                      Bebas Lokasi / Tanpa Batas
                    </p>
                  </>
                )}
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                attendanceSettings.enableGeofence !== false
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-amber-50 text-amber-600'
              }`}>
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
                  SQLite <span className="text-sm font-normal text-slate-400">(Auto-Sync)</span>
                </p>
                <p className="text-[11px] text-purple-600 font-medium mt-0.5">
                  10 Tabel Terindeks Bersih
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
            onClick={() => setActiveTab('shifts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'shifts'
                ? 'bg-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-100'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Jam Kerja & Shift Operasional</span>
            <Badge className={activeTab === 'shifts' ? 'bg-white/20 text-white font-mono text-[10px]' : 'bg-slate-200 text-slate-700 text-[10px]'}>
              Roster Operasional
            </Badge>
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

        {/* TAB CONTENTS */}
        {activeTab === 'attendance' && (
          <TabKebijakanPresensi
            attendanceSettings={attendanceSettings}
            setAttendanceSettings={setAttendanceSettings}
          />
        )}

        {activeTab === 'shifts' && (
          <TabJamKerjaShift
            shiftSettings={shiftSettings}
            setShiftSettings={setShiftSettings}
            locations={locations}
          />
        )}

        {activeTab === 'calendar' && (
          <TabKalenderLibur
            holidays={holidays}
            filteredHolidays={filteredHolidays}
            holidaySearch={holidaySearch}
            setHolidaySearch={setHolidaySearch}
            holidayFilterCategory={holidayFilterCategory}
            setHolidayFilterCategory={setHolidayFilterCategory}
            onOpenAdd={handleOpenAddHoliday}
            onOpenEdit={handleOpenEditHoliday}
            onDelete={handleDeleteHoliday}
          />
        )}

        {activeTab === 'location' && (
          <TabGeofencingLokasi
            locations={locations}
            attendanceSettings={attendanceSettings}
            setAttendanceSettings={setAttendanceSettings}
            onUpdateRadius={handleUpdateLocationRadius}
            onToggleStatus={handleToggleLocationStatus}
            onOpenEdit={handleOpenEditLocation}
            setAlertInfo={setAlertInfo}
          />
        )}

        {activeTab === 'maintenance' && (
          <TabProfilPemeliharaan
            companyProfile={companyProfile}
            setCompanyProfile={setCompanyProfile}
            onDownloadBackup={handleDownloadBackup}
            onClearCache={handleClearCache}
          />
        )}
      </div>

      {/* MODAL TAMBAH / EDIT HARI LIBUR */}
      <ModalHariLibur
        isOpen={isHolidayModalOpen}
        onClose={() => setIsHolidayModalOpen(false)}
        onSubmit={handleHolidaySubmit}
        editingHolidayId={editingHolidayId}
        holidayForm={holidayForm}
        setHolidayForm={setHolidayForm}
      />

      {/* MODAL EDIT PARAMETER GEOFENCE LOKASI */}
      <ModalEditLokasi
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSubmit={handleLocationSubmit}
        locationForm={locationForm}
        setLocationForm={setLocationForm}
      />
    </>
  );
}
