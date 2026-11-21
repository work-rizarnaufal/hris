import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import * as XLSX from 'xlsx';
import {
  Users,
  Plus,
  Upload,
  Download,
  FileSpreadsheet,
  Search,
  Filter,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Building,
  MapPin,
  Clock,
  ShieldAlert,
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
import ModalFormKaryawan from './Partials/ModalFormKaryawan.jsx';
import ModalImporKaryawan from './Partials/ModalImporKaryawan.jsx';

// Data dummy awal 12 karyawan operasional HCGA (Sinkron Mariuk & Cimalaka)
const INITIAL_EMPLOYEES = [
  // --- LOKASI MARIUK (6 Personil) ---
  {
    id: 1,
    name: 'Budi Santoso',
    nip: 'HC-0101',
    role: 'Senior Operator Lapangan',
    division: 'Operasional & Lapangan',
    location: 'Lokasi Mariuk',
    group: 'Grup A',
    scheduleCategory: 'Shift Pagi (12 Jam)',
    checkInTime: '07:00',
    checkOutTime: '19:00',
    status: 'Aktif',
  },
  {
    id: 2,
    name: 'Dewi Anggraini',
    nip: 'HC-0104',
    role: 'Quality Assurance Inspector',
    division: 'Operasional & Lapangan',
    location: 'Lokasi Mariuk',
    group: 'Grup A',
    scheduleCategory: 'Shift Pagi (12 Jam)',
    checkInTime: '07:00',
    checkOutTime: '19:00',
    status: 'Aktif',
  },
  {
    id: 3,
    name: 'Hendra Wijaya',
    nip: 'HC-0105',
    role: 'Danru Keamanan & K3',
    division: 'Security & Safety',
    location: 'Lokasi Mariuk',
    group: 'Grup A',
    scheduleCategory: 'Shift Malam (12 Jam)',
    checkInTime: '19:00',
    checkOutTime: '07:00',
    status: 'Aktif',
  },
  {
    id: 4,
    name: 'Ahmad Fauzi',
    nip: 'HC-0103',
    role: 'Operator Forklift Utama',
    division: 'Logistik & Gudang',
    location: 'Lokasi Mariuk',
    group: 'Grup B',
    scheduleCategory: 'Shift Pagi (12 Jam)',
    checkInTime: '07:00',
    checkOutTime: '19:00',
    status: 'Aktif',
  },
  {
    id: 5,
    name: 'Eko Prasetyo',
    nip: 'HC-0107',
    role: 'Teknisi Maintenance Mesin',
    division: 'Operasional & Lapangan',
    location: 'Lokasi Mariuk',
    group: 'Grup B',
    scheduleCategory: 'Shift Pagi (12 Jam)',
    checkInTime: '07:00',
    checkOutTime: '19:00',
    status: 'Aktif',
  },
  {
    id: 6,
    name: 'Joko Susilo',
    nip: 'HC-0109',
    role: 'Anggota Patroli Keamanan',
    division: 'Security & Safety',
    location: 'Lokasi Mariuk',
    group: 'Grup B',
    scheduleCategory: 'Shift Malam (12 Jam)',
    checkInTime: '19:00',
    checkOutTime: '07:00',
    status: 'Aktif',
  },

  // --- LOKASI CIMALAKA (6 Personil) ---
  {
    id: 7,
    name: 'Siti Rahmawati',
    nip: 'HC-0102',
    role: 'Supervisor Operasional Site',
    division: 'Operasional & Lapangan',
    location: 'Lokasi Cimalaka',
    group: 'Grup A',
    scheduleCategory: 'Shift Pagi (12 Jam)',
    checkInTime: '07:00',
    checkOutTime: '19:00',
    status: 'Aktif',
  },
  {
    id: 8,
    name: 'Wahyu Hidayat',
    nip: 'HC-0111',
    role: 'Operator Mesin Produksi',
    division: 'Operasional & Lapangan',
    location: 'Lokasi Cimalaka',
    group: 'Grup A',
    scheduleCategory: 'Shift Pagi (12 Jam)',
    checkInTime: '07:00',
    checkOutTime: '19:00',
    status: 'Aktif',
  },
  {
    id: 9,
    name: 'Dian Kusuma',
    nip: 'HC-0110',
    role: 'Petugas Keamanan Site',
    division: 'Security & Safety',
    location: 'Lokasi Cimalaka',
    group: 'Grup A',
    scheduleCategory: 'Shift Malam (12 Jam)',
    checkInTime: '19:00',
    checkOutTime: '07:00',
    status: 'Aktif',
  },
  {
    id: 10,
    name: 'Rina Marlina',
    nip: 'HC-0106',
    role: 'Koordinator Gudang & Logistik',
    division: 'Logistik & Gudang',
    location: 'Lokasi Cimalaka',
    group: 'Grup B',
    scheduleCategory: 'Shift Pagi (12 Jam)',
    checkInTime: '07:00',
    checkOutTime: '19:00',
    status: 'Aktif',
  },
  {
    id: 11,
    name: 'Maya Indah Lestari',
    nip: 'HC-0108',
    role: 'Operator QC Lapangan',
    division: 'Operasional & Lapangan',
    location: 'Lokasi Cimalaka',
    group: 'Grup B',
    scheduleCategory: 'Shift Pagi (12 Jam)',
    checkInTime: '07:00',
    checkOutTime: '19:00',
    status: 'Cuti',
  },
  {
    id: 12,
    name: 'Nurul Aini',
    nip: 'HC-0112',
    role: 'Petugas Inventory Stok',
    division: 'Logistik & Gudang',
    location: 'Lokasi Cimalaka',
    group: 'Grup B',
    scheduleCategory: 'Shift Malam (12 Jam)',
    checkInTime: '19:00',
    checkOutTime: '07:00',
    status: 'Aktif',
  },
];

export default function DataKaryawan() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('ALL');
  const [filterDivision, setFilterDivision] = useState('ALL');
  const [filterGroup, setFilterGroup] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formInitialData, setFormInitialData] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Notification Toast State
  const [alertInfo, setAlertInfo] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlertInfo({ message, type });
    setTimeout(() => setAlertInfo(null), 3500);
  };

  // KPI Counts (Reaktif terhadap Filter Lokasi)
  const stats = useMemo(() => {
    const list =
      filterLocation === 'ALL'
        ? employees
        : employees.filter((e) => e.location === filterLocation);

    const total = list.length;
    const active = list.filter((e) => e.status === 'Aktif').length;
    const onLeave = list.filter((e) => e.status === 'Cuti').length;
    const groupA = list.filter((e) => e.group === 'Grup A').length;
    const groupB = list.filter((e) => e.group === 'Grup B').length;
    return { total, active, onLeave, groupA, groupB };
  }, [employees, filterLocation]);

  // Filtered List
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchQuery =
        !searchQuery.trim() ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchLocation = filterLocation === 'ALL' || emp.location === filterLocation;
      const matchDivision = filterDivision === 'ALL' || emp.division === filterDivision;
      const matchGroup = filterGroup === 'ALL' || emp.group === filterGroup;
      const matchStatus = filterStatus === 'ALL' || emp.status === filterStatus;

      return matchQuery && matchLocation && matchDivision && matchGroup && matchStatus;
    });
  }, [employees, searchQuery, filterLocation, filterDivision, filterGroup, filterStatus]);

  // Reset Filters
  const isFiltered =
    Boolean(searchQuery) ||
    filterLocation !== 'ALL' ||
    filterDivision !== 'ALL' ||
    filterGroup !== 'ALL' ||
    filterStatus !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setFilterLocation('ALL');
    setFilterDivision('ALL');
    setFilterGroup('ALL');
    setFilterStatus('ALL');
  };

  // Add / Edit Handlers
  const handleOpenAdd = () => {
    setFormInitialData(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setFormInitialData(emp);
    setIsFormOpen(true);
  };

  const handleSaveEmployee = (empData) => {
    if (formInitialData) {
      setEmployees((prev) => prev.map((item) => (item.id === empData.id ? empData : item)));
      showAlert(`Data karyawan "${empData.name}" berhasil diperbarui.`);
    } else {
      setEmployees((prev) => [empData, ...prev]);
      showAlert(`Karyawan baru "${empData.name}" berhasil ditambahkan.`);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data karyawan "${name}"?`)) {
      setEmployees((prev) => prev.filter((item) => item.id !== id));
      showAlert(`Data karyawan "${name}" telah dihapus.`, 'warning');
    }
  };

  // Import Handler
  const handleImportSuccess = (importedList) => {
    setEmployees((prev) => [...importedList, ...prev]);
    showAlert(`Berhasil mengimpor ${importedList.length} data karyawan baru.`);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = filteredEmployees.map((emp, index) => ({
      No: index + 1,
      'Nama Karyawan': emp.name,
      NIP: emp.nip,
      Jabatan: emp.role,
      Divisi: emp.division,
      'Lokasi Kerja': emp.location,
      Grup: emp.group,
      'Kategori Jadwal': emp.scheduleCategory,
      'Jam Masuk': emp.checkInTime,
      'Jam Pulang': emp.checkOutTime,
      Status: emp.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Karyawan');
    XLSX.writeFile(workbook, `Data_Karyawan_HCGA_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showAlert('File Excel berhasil diunduh.');
  };

  return (
    <>
      <Head title="Data Karyawan" />

      <Toast toast={alertInfo} onClose={() => setAlertInfo(null)} />

      {/* Page Header dengan Action Toolbar */}
      <PageHeader
        eyebrow="MODUL MANAJEMEN KARYAWAN (CORE HR)"
        title="Direktori Data Karyawan"
        subtitle="Kelola informasi induk, divisi penempatan, roster grup kerja, dan kategori jadwal shift seluruh karyawan."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Tombol Impor */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsImportOpen(true)}
              className="text-xs border-slate-300 hover:bg-slate-50"
            >
              <Upload className="w-3.5 h-3.5 mr-1 text-[#c4a266]" />
              <span>Impor Excel</span>
            </Button>

            {/* Tombol Ekspor Excel */}
            <Button
              type="button"
              variant="outline"
              onClick={handleExportExcel}
              className="text-xs border-slate-300 hover:bg-slate-50"
              title="Ekspor data karyawan ke format Excel (.xlsx)"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              <span>Ekspor Excel</span>
            </Button>

            {/* Tombol Tambah Karyawan */}
            <Button
              type="button"
              variant="default"
              onClick={handleOpenAdd}
              className="bg-navy hover:bg-navy/90 text-xs shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1 text-[#c4a266]" />
              <span>Tambah Karyawan</span>
            </Button>
          </div>
        }
      />

      {/* Segmented Location Controller & Operational Heartbeat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs mb-6">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setFilterLocation('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterLocation === 'ALL'
                ? 'bg-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-200/60'
            }`}
          >
            Semua Lokasi ({employees.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterLocation('Lokasi Mariuk')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterLocation === 'Lokasi Mariuk'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Mariuk ({employees.filter((e) => e.location === 'Lokasi Mariuk').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterLocation('Lokasi Cimalaka')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterLocation === 'Lokasi Cimalaka'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-indigo-800 hover:bg-indigo-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            Cimalaka ({employees.filter((e) => e.location === 'Lokasi Cimalaka').length})
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
            Direktori Personil 24/7 · 6 Mariuk + 6 Cimalaka
          </Badge>
        </div>
      </div>

      {/* 4 Kartu KPI Metrik Karyawan (Reaktif terhadap Lokasi) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="hover:border-slate-300 transition-colors shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Total Personil
              </div>
              <div className="text-2xl font-bold font-display text-navy mt-0.5">
                {stats.total} <span className="text-xs font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {filterLocation === 'ALL'
                  ? '6 Mariuk + 6 Cimalaka'
                  : filterLocation}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Status Siap Dinas
              </div>
              <div className="text-2xl font-bold font-display text-emerald-700 mt-0.5">
                {stats.active} <span className="text-xs font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                {stats.onLeave > 0 ? `${stats.onLeave} Orang Sedang Cuti` : '100% Siap Operasional'}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Roster Grup A
              </div>
              <div className="text-2xl font-bold font-display text-amber-700 mt-0.5">
                {stats.groupA} <span className="text-xs font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Rotasi Hari Ganjil (24/7)
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Building className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Roster Grup B
              </div>
              <div className="text-2xl font-bold font-display text-indigo-700 mt-0.5">
                {stats.groupB} <span className="text-xs font-normal text-slate-400">orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Rotasi Hari Genap (24/7)
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card Kontainer Tabel & Filter */}
      <Card className="overflow-hidden border border-slate-200/90 shadow-xs">
        {/* Toolbar Pencarian & Filter Terstandarisasi */}
        <TableToolbar>
          <TableSearch
            placeholder="Cari nama karyawan, NIP, atau jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <TableFilterGroup>
            {/* Filter Lokasi Penempatan */}
            <TableSelect
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              title="Filter Lokasi Kerja"
            >
              <option value="ALL">Semua Lokasi</option>
              <option value="Lokasi Mariuk">📍 Lokasi Mariuk</option>
              <option value="Lokasi Cimalaka">📍 Lokasi Cimalaka</option>
            </TableSelect>

            {/* Filter Divisi */}
            <TableSelect
              value={filterDivision}
              onChange={(e) => setFilterDivision(e.target.value)}
              title="Filter Divisi"
            >
              <option value="ALL">Semua Divisi</option>
              <option value="Operasional & Lapangan">Operasional & Lapangan</option>
              <option value="Human Capital & GA">Human Capital & GA</option>
              <option value="Logistik & Gudang">Logistik & Gudang</option>
              <option value="Security & Safety">Security & Safety</option>
            </TableSelect>

            {/* Filter Grup */}
            <TableSelect
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              title="Filter Grup"
            >
              <option value="ALL">Semua Grup</option>
              <option value="Grup A">Grup A</option>
              <option value="Grup B">Grup B</option>
              <option value="Non-Shift">Non-Shift</option>
            </TableSelect>

            {/* Filter Status */}
            <TableSelect
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              title="Filter Status"
            >
              <option value="ALL">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Cuti">Sedang Cuti</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </TableSelect>

            {/* Tombol Reset Filter */}
            {isFiltered && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-9 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5"
                title="Reset seluruh filter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
            )}
          </TableFilterGroup>
        </TableToolbar>

        {/* Tabel Data Karyawan */}
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/90 border-b border-slate-200">
                <TableHead className="w-12 text-center font-bold text-slate-700">NO</TableHead>
                <TableHead className="min-w-[200px] font-bold text-slate-700">NAMA KARYAWAN</TableHead>
                <TableHead className="min-w-[150px] font-bold text-slate-700">DIVISI</TableHead>
                <TableHead className="min-w-[150px] font-bold text-slate-700">LOKASI KERJA</TableHead>
                <TableHead className="w-24 text-center font-bold text-slate-700">GRUP</TableHead>
                <TableHead className="min-w-[140px] font-bold text-slate-700">KATEGORI JADWAL</TableHead>
                <TableHead className="w-24 text-center font-bold text-slate-700">JAM MASUK</TableHead>
                <TableHead className="w-24 text-center font-bold text-slate-700">JAM PULANG</TableHead>
                <TableHead className="w-24 text-center font-bold text-slate-700">STATUS</TableHead>
                <TableHead className="w-20 text-center font-bold text-slate-700">AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableEmpty colSpan={10}>
                  <div className="py-8">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <div className="font-semibold text-slate-600 text-sm">Tidak ada karyawan yang sesuai</div>
                    <div className="text-slate-400 text-xs mt-1">
                      Coba sesuaikan kata kunci pencarian atau ubah filter divisi/grup.
                    </div>
                  </div>
                </TableEmpty>
              ) : (
                filteredEmployees.map((emp, index) => (
                  <TableRow key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* 1. No */}
                    <TableCell className="text-center font-medium text-slate-500 text-xs">
                      {index + 1}
                    </TableCell>

                    {/* 2. Nama Karyawan */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy/10 text-navy font-bold text-xs flex items-center justify-center shrink-0 border border-navy/15">
                          {emp.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <strong
                            onClick={() => handleOpenEdit(emp)}
                            className="block text-xs font-semibold text-navy hover:text-[#c4a266] transition-colors cursor-pointer"
                            title="Klik untuk ubah data karyawan"
                          >
                            {emp.name}
                          </strong>
                          <p className="text-[11px] text-slate-500 font-normal">
                            <span className="font-mono text-slate-600 font-medium">{emp.nip}</span> • {emp.role}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* 3. Divisi */}
                    <TableCell className="font-medium text-slate-700 text-xs">
                      {emp.division}
                    </TableCell>

                    {/* 4. Lokasi Kerja */}
                    <TableCell>
                      <Badge
                        className={
                          emp.location.includes('Mariuk')
                            ? 'bg-amber-50 text-amber-800 border-amber-200 text-[11px] font-bold px-2 py-0.5'
                            : emp.location.includes('Cimalaka')
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-200 text-[11px] font-bold px-2 py-0.5'
                            : 'bg-slate-100 text-slate-700 border-slate-200 text-[11px] font-medium px-2 py-0.5'
                        }
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{emp.location}</span>
                      </Badge>
                    </TableCell>

                    {/* 5. Grup */}
                    <TableCell className="text-center">
                      <Badge
                        className={
                          emp.group === 'Grup A'
                            ? 'bg-amber-50 text-amber-800 border-amber-200 text-[11px] font-bold px-2 py-0.5'
                            : emp.group === 'Grup B'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 text-[11px] font-bold px-2 py-0.5'
                            : 'bg-slate-100 text-slate-600 border-slate-200 text-[11px] font-medium px-2 py-0.5'
                        }
                      >
                        {emp.group}
                      </Badge>
                    </TableCell>

                    {/* 6. Kategori Jadwal */}
                    <TableCell>
                      <Badge
                        className={
                          emp.scheduleCategory?.toLowerCase().includes('malam')
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-200 text-[11px] font-bold px-2 py-0.5'
                            : emp.scheduleCategory?.toLowerCase().includes('pagi')
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 text-[11px] font-bold px-2 py-0.5'
                            : 'bg-sky-50 text-sky-800 border-sky-200 text-[11px] font-medium px-2 py-0.5'
                        }
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{emp.scheduleCategory}</span>
                      </Badge>
                    </TableCell>

                    {/* 7. Jam Masuk */}
                    <TableCell className="text-center">
                      <span className="font-mono text-xs px-2 py-0.5 rounded text-emerald-800 bg-emerald-50 border border-emerald-200/60 font-semibold inline-block">
                        {emp.checkInTime}
                      </span>
                    </TableCell>

                    {/* 8. Jam Pulang */}
                    <TableCell className="text-center">
                      <span className="font-mono text-xs px-2 py-0.5 rounded text-slate-700 bg-slate-100 border border-slate-200 font-semibold inline-block">
                        {emp.checkOutTime}
                      </span>
                    </TableCell>

                    {/* 9. Status */}
                    <TableCell className="text-center">
                      <Badge
                        className={
                          emp.status === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 text-[11px] font-bold px-2 py-0.5'
                            : emp.status === 'Cuti'
                            ? 'bg-amber-50 text-amber-800 border-amber-200 text-[11px] font-bold px-2 py-0.5'
                            : 'bg-rose-50 text-rose-800 border-rose-200 text-[11px] font-bold px-2 py-0.5'
                        }
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1 ${emp.status === 'Aktif' ? 'bg-emerald-500' : emp.status === 'Cuti' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                        {emp.status}
                      </Badge>
                    </TableCell>

                    {/* 10. Aksi */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(emp)}
                          className="h-7 w-7 p-0 text-slate-500 hover:text-navy hover:bg-slate-100 border-slate-200 cursor-pointer"
                          title="Ubah data karyawan"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#c4a266]" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(emp.id, emp.name)}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-slate-200 cursor-pointer"
                          title="Hapus karyawan"
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

          {/* Footer Pagination / Count Info */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <div>
              Menampilkan <strong>{filteredEmployees.length}</strong> dari total <strong>{employees.length}</strong> karyawan terdaftar
            </div>
            <div className="text-[11px] text-slate-400">
              Pembaruan data tersinkronisasi dengan master roster HCGA
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Tambah / Ubah Karyawan */}
      <ModalFormKaryawan
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveEmployee}
        initialData={formInitialData}
      />

      {/* Modal Impor Karyawan dari File Spreadsheet */}
      <ModalImporKaryawan
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </>
  );
}
