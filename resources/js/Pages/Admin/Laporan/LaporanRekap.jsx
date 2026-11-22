import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  Building,
  UserCheck,
  Calendar,
  MapPin,
} from 'lucide-react';
import {
  Badge,
  Button,
  PageHeader,
} from '@/components/ui';
import { AVAILABLE_PERIODS, EVALUATION_DATASET } from './data/evaluationDataset.js';
import RaporIndividu from './Partials/RaporIndividu.jsx';
import LaporanKpiCards from './Partials/LaporanKpiCards.jsx';
import LaporanAnalyticsGrid from './Partials/LaporanAnalyticsGrid.jsx';
import LaporanEvaluasiTable from './Partials/LaporanEvaluasiTable.jsx';

export default function LaporanRekap() {
  const [activeTab, setActiveTab] = useState('organisasi'); // 'organisasi' | 'individu'
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState('2026-11');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Karyawan terpilih untuk tab Rapor Individu
  const selectedEmployee = useMemo(() => {
    return EVALUATION_DATASET.find((e) => e.id === selectedEmployeeId) || EVALUATION_DATASET[0];
  }, [selectedEmployeeId]);

  // Daftar Divisi Unik
  const divisions = useMemo(() => {
    const list = Array.from(new Set(EVALUATION_DATASET.map((item) => item.division)));
    return ['ALL', ...list];
  }, []);

  // Filter Data Evaluasi
  const filteredData = useMemo(() => {
    return EVALUATION_DATASET.filter((emp) => {
      const matchLocation = selectedLocation === 'ALL' || emp.location === selectedLocation;
      const matchDivision = selectedDivision === 'ALL' || emp.division === selectedDivision;
      const matchStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;
      const matchSearch =
        searchQuery === '' ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLocation && matchDivision && matchStatus && matchSearch;
    });
  }, [selectedLocation, selectedDivision, selectedStatus, searchQuery]);

  // Dataset sesuai filter lokasi aktif (Semua / Mariuk / Cimalaka)
  const locationDataset = useMemo(() => {
    if (selectedLocation === 'ALL') return EVALUATION_DATASET;
    return EVALUATION_DATASET.filter((e) => e.location === selectedLocation);
  }, [selectedLocation]);

  // Statistik Ringkasan Evaluasi (Reaktif terhadap Lokasi Terpilih)
  const summaryStats = useMemo(() => {
    const totalEmployees = locationDataset.length;
    const totalPossibleDays = totalEmployees * 22;
    const totalPresentDays = locationDataset.reduce((acc, curr) => acc + curr.presentDays, 0);
    const totalLateIncidents = locationDataset.reduce((acc, curr) => acc + curr.lateCount, 0);
    const totalLateMinutes = locationDataset.reduce((acc, curr) => acc + curr.totalLateMinutes, 0);
    const totalAlpa = locationDataset.reduce((acc, curr) => acc + curr.alpaDays, 0);

    const attendanceRate = totalPossibleDays > 0 ? ((totalPresentDays / totalPossibleDays) * 100).toFixed(1) : '0.0';
    const perfectCount = locationDataset.filter((e) => e.score === 100).length;
    const warningCount = locationDataset.filter((e) => e.status === 'Peringatan / SP').length;
    const coachingCount = locationDataset.filter((e) => e.status === 'Perlu Pembinaan').length;

    return {
      attendanceRate,
      totalLateIncidents,
      totalLateMinutes,
      totalAlpa,
      perfectCount,
      warningCount,
      coachingCount,
      totalEmployees,
    };
  }, [locationDataset]);

  // Data Grafik Per Divisi (Reaktif terhadap Lokasi Terpilih)
  const divisionChartData = useMemo(() => {
    const divMap = {};
    locationDataset.forEach((emp) => {
      if (!divMap[emp.division]) {
        divMap[emp.division] = { division: emp.division, totalScore: 0, count: 0, totalLate: 0 };
      }
      divMap[emp.division].totalScore += emp.score;
      divMap[emp.division].totalLate += emp.lateCount;
      divMap[emp.division].count += 1;
    });

    return Object.values(divMap).map((d) => ({
      name: d.division.replace('& Lapangan', '').replace('& Safety', '').trim(),
      fullName: d.division,
      avgScore: Math.round(d.totalScore / d.count),
      totalLate: d.totalLate,
      karyawan: d.count,
    }));
  }, [locationDataset]);

  // Top Performers (100% On-Time) & Perhatian Khusus
  const topPerformers = useMemo(() => {
    return locationDataset.filter((e) => e.score === 100);
  }, [locationDataset]);

  const warningList = useMemo(() => {
    return locationDataset.filter((e) => e.status === 'Peringatan / SP' || e.status === 'Perlu Pembinaan');
  }, [locationDataset]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedLocation !== 'ALL' ||
    selectedDivision !== 'ALL' ||
    selectedStatus !== 'ALL';

  const resetFilters = () => {
    setSelectedLocation('ALL');
    setSelectedDivision('ALL');
    setSelectedStatus('ALL');
    setSearchQuery('');
  };

  // Fungsi Ekspor Excel
  const handleExportExcel = () => {
    const exportRows = filteredData.map((emp, index) => ({
      No: index + 1,
      NIP: emp.nip,
      'Nama Karyawan': emp.name,
      Divisi: emp.division,
      Jabatan: emp.role,
      Lokasi: emp.location,
      'Hari Kerja': emp.workDays,
      'Total Hadir': emp.presentDays,
      '% Kehadiran': `${((emp.presentDays / emp.workDays) * 100).toFixed(1)}%`,
      'Frekuensi Terlambat': emp.lateCount,
      'Total Menit Terlambat': emp.totalLateMinutes,
      'Cuti/Izin': emp.leaveDays,
      Alpa: emp.alpaDays,
      'Skor Kedisiplinan': `${emp.score}%`,
      'Status Evaluasi': emp.status,
      'Rekomendasi Tindakan': emp.actionRecommendation,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Evaluasi Kehadiran');

    const colWidths = [
      { wch: 4 },  // No
      { wch: 12 }, // NIP
      { wch: 22 }, // Nama
      { wch: 24 }, // Divisi
      { wch: 24 }, // Jabatan
      { wch: 22 }, // Lokasi
      { wch: 10 }, // Hari Kerja
      { wch: 10 }, // Hadir
      { wch: 12 }, // % Kehadiran
      { wch: 12 }, // Frek Telat
      { wch: 14 }, // Menit Telat
      { wch: 10 }, // Cuti
      { wch: 8 },  // Alpa
      { wch: 12 }, // Skor
      { wch: 18 }, // Status
      { wch: 35 }, // Rekomendasi
    ];
    worksheet['!cols'] = colWidths;

    const periodLabel = selectedPeriod.replace('-', '_');
    XLSX.writeFile(workbook, `Evaluasi_Kehadiran_HCGA_${periodLabel}.xlsx`);
  };

  const handleOpenRapor = (empId) => {
    setSelectedEmployeeId(empId);
    setActiveTab('individu');
  };

  return (
    <>
      <Head title="Evaluasi & Laporan Kehadiran" />

      {/* Header Halaman dengan Pemilihan Periode & Ekspor */}
      <PageHeader
        eyebrow="MODUL HCGA ANALYTICS & DISCIPLINE"
        title="Laporan & Evaluasi Kehadiran"
        subtitle="Analisis kepatuhan kerja, scoring kedisiplinan berkala, peringatan dini indisipliner, dan rekap evaluasi bulanan."
        actions={
          <div className="flex items-center gap-2.5">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
              <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="text-xs font-semibold text-navy bg-transparent border-0 focus:ring-0 cursor-pointer p-0 pr-4"
              >
                {AVAILABLE_PERIODS.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              className="gap-1.5 border-emerald-600/30 text-emerald-800 hover:bg-emerald-50 bg-white"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Ekspor Rekap (XLSX)</span>
            </Button>
          </div>
        }
      />

      {/* Tab Switcher: Rekap Organisasi vs Rapor Individu */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 mb-6 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('organisasi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'organisasi'
              ? 'bg-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-navy hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Rekap & Analitik Organisasi</span>
          <Badge className={activeTab === 'organisasi' ? 'bg-white/20 text-white font-mono text-[10px]' : 'bg-slate-200 text-slate-700 text-[10px]'}>
            {EVALUATION_DATASET.length}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('individu')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'individu'
              ? 'bg-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-navy hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Rapor Kehadiran Individu</span>
          {selectedEmployee && (
            <span className={`text-[11px] font-normal ${activeTab === 'individu' ? 'text-[#c4a266]' : 'text-slate-400'}`}>
              • {selectedEmployee.name}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'organisasi' ? (
        <div className="space-y-6">
          {/* Banner Prinsip Operasional Ringkas HCGA */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700">
              <div className="w-6 h-6 rounded-lg bg-navy/10 text-navy flex items-center justify-center font-bold text-[11px]">
                HC
              </div>
              <span>
                <strong>Evaluasi Terpadu:</strong> Perhitungan skor disiplin dihitung otomatis dari kehadiran efektif, frekuensi keterlambatan, dan riwayat absensi tanpa keterangan (Alpa).
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge className="bg-navy/5 text-navy border-navy/20 text-[10px]">
                Target Kehadiran: ≥ 95%
              </Badge>
              <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
                Toleransi Terlambat: Maks 2x/Bulan
              </Badge>
            </div>
          </div>

          {/* Segmented Location Controller (Semua Lokasi, Mariuk, Cimalaka) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="p-1 bg-white rounded-xl border border-slate-200/90 shadow-2xs inline-flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedLocation('ALL')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedLocation === 'ALL'
                    ? 'bg-navy text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                }`}
              >
                Semua Lokasi ({EVALUATION_DATASET.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedLocation('Lokasi Mariuk')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedLocation === 'Lokasi Mariuk'
                    ? 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                Mariuk ({EVALUATION_DATASET.filter((e) => e.location === 'Lokasi Mariuk').length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedLocation('Lokasi Cimalaka')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedLocation === 'Lokasi Cimalaka'
                    ? 'bg-indigo-50 text-indigo-900 border border-indigo-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                Cimalaka ({EVALUATION_DATASET.filter((e) => e.location === 'Lokasi Cimalaka').length})
              </button>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Monitoring Disiplin & Evaluasi 24/7 Non-Stop</span>
            </div>
          </div>

          {/* 4 Kartu KPI Utama Evaluasi Kehadiran */}
          <LaporanKpiCards summaryStats={summaryStats} />

          {/* Visual Analytics & Top Highlight Grid */}
          <LaporanAnalyticsGrid
            divisionChartData={divisionChartData}
            selectedPeriod={selectedPeriod}
            topPerformers={topPerformers}
            warningList={warningList}
            onSelectEmployee={handleOpenRapor}
          />

          {/* Tabel Master Evaluasi Kehadiran */}
          <LaporanEvaluasiTable
            filteredData={filteredData}
            totalEmployees={EVALUATION_DATASET.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            selectedDivision={selectedDivision}
            onDivisionChange={setSelectedDivision}
            divisions={divisions}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onResetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
            selectedPeriod={selectedPeriod}
            onOpenRapor={handleOpenRapor}
          />
        </div>
      ) : (
        <RaporIndividu
          employee={selectedEmployee}
          allEmployees={EVALUATION_DATASET}
          onSelectEmployee={setSelectedEmployeeId}
          selectedPeriod={selectedPeriod}
          onBackToOrganization={() => setActiveTab('organisasi')}
        />
      )}
    </>
  );
}
