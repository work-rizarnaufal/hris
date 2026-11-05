import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import * as XLSX from 'xlsx';
import {
  Users,
  Plus,
  Upload,
  Download,
  Pencil,
  Trash2,
  CheckCircle2,
  RotateCcw,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  UserCheck,
  Building2,
} from 'lucide-react';
import {
  Card,
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
  Text,
  TableToolbar,
  TableSearch,
  TableFilterGroup,
  TableSelect,
  Toast,
} from '@/components/ui';
import ModalFormKaryawan from './Partials/ModalFormKaryawan.jsx';
import ModalImporKaryawan from './Partials/ModalImporKaryawan.jsx';
import { useActiveSite, matchesActiveSite } from '@/services/systemSettings.js';

// Data master database karyawan HCGA
const INITIAL_EMPLOYEES = [
  {
    id: 1,
    nip: 'HC-0101',
    name: 'Budi Santoso',
    role: 'Senior Operator Lapangan',
    division: 'Operasional & Lapangan',
    location: 'SITE A CIMALAKA',
    employmentType: 'Tetap',
    email: 'budi.santoso@perusahaan.com',
    phone: '0812-3456-7801',
    joinDate: '2021-03-15',
    status: 'Aktif',
  },
  {
    id: 2,
    nip: 'HC-0102',
    name: 'Siti Rahmawati',
    role: 'HCGA Specialist',
    division: 'Human Capital & GA',
    location: 'SITE A CIMALAKA',
    employmentType: 'Tetap',
    email: 'siti.rahmawati@perusahaan.com',
    phone: '0812-3456-7802',
    joinDate: '2020-07-01',
    status: 'Aktif',
  },
  {
    id: 3,
    nip: 'HC-0103',
    name: 'Ahmad Fauzi',
    role: 'Operator Forklift Utama',
    division: 'Logistik & Gudang',
    location: 'SITE A CIMALAKA',
    employmentType: 'Kontrak (PKWT)',
    email: 'ahmad.fauzi@perusahaan.com',
    phone: '0812-3456-7803',
    joinDate: '2022-11-10',
    status: 'Aktif',
  },
  {
    id: 4,
    nip: 'HC-0104',
    name: 'Dewi Anggraini',
    role: 'Quality Assurance Inspector',
    division: 'Operasional & Lapangan',
    location: 'SITE A CIMALAKA',
    employmentType: 'Tetap',
    email: 'dewi.anggraini@perusahaan.com',
    phone: '0812-3456-7804',
    joinDate: '2021-09-01',
    status: 'Aktif',
  },
  {
    id: 5,
    nip: 'HC-0105',
    name: 'Hendra Wijaya',
    role: 'Danru Keamanan & K3',
    division: 'Security & Safety',
    location: 'SITE A CIMALAKA',
    employmentType: 'Tetap',
    email: 'hendra.wijaya@perusahaan.com',
    phone: '0812-3456-7805',
    joinDate: '2019-02-18',
    status: 'Aktif',
  },
  {
    id: 6,
    nip: 'HC-0106',
    name: 'Rina Marlina',
    role: 'Staf Administrasi Payroll',
    division: 'Human Capital & GA',
    location: 'SITE A CIMALAKA',
    employmentType: 'Kontrak (PKWT)',
    email: 'rina.marlina@perusahaan.com',
    phone: '0812-3456-7806',
    joinDate: '2023-05-15',
    status: 'Cuti',
  },
  {
    id: 7,
    nip: 'HC-0107',
    name: 'Eko Prasetyo',
    role: 'Teknisi Maintenance Mesin',
    division: 'Operasional & Lapangan',
    location: 'SITE B PASEH',
    employmentType: 'Tetap',
    email: 'eko.prasetyo@perusahaan.com',
    phone: '0813-4567-8901',
    joinDate: '2020-01-20',
    status: 'Aktif',
  },
  {
    id: 8,
    nip: 'HC-0108',
    name: 'Maya Indah Lestari',
    role: 'Koordinator Gudang Bahan Baku',
    division: 'Logistik & Gudang',
    location: 'SITE B PASEH',
    employmentType: 'Tetap',
    email: 'maya.indah@perusahaan.com',
    phone: '0813-4567-8902',
    joinDate: '2021-06-10',
    status: 'Aktif',
  },
  {
    id: 9,
    nip: 'HC-0109',
    name: 'Joko Susilo',
    role: 'Anggota Patroli Keamanan',
    division: 'Security & Safety',
    location: 'SITE B PASEH',
    employmentType: 'Kontrak (PKWT)',
    email: 'joko.susilo@perusahaan.com',
    phone: '0813-4567-8903',
    joinDate: '2023-02-01',
    status: 'Aktif',
  },
  {
    id: 10,
    nip: 'HC-0110',
    name: 'Dian Kusuma',
    role: 'IT Support & Sistem HRIS',
    division: 'Human Capital & GA',
    location: 'SITE B PASEH',
    employmentType: 'Tetap',
    email: 'dian.kusuma@perusahaan.com',
    phone: '0813-4567-8904',
    joinDate: '2022-04-12',
    status: 'Aktif',
  },
  {
    id: 11,
    nip: 'HC-0111',
    name: 'Wahyu Hidayat',
    role: 'Operator Mesin CNC Milling',
    division: 'Operasional & Lapangan',
    location: 'SITE B PASEH',
    employmentType: 'Kontrak (PKWT)',
    email: 'wahyu.hidayat@perusahaan.com',
    phone: '0813-4567-8905',
    joinDate: '2023-08-01',
    status: 'Non-Aktif',
  },
  {
    id: 12,
    nip: 'HC-0112',
    name: 'Nurul Aini',
    role: 'Petugas Inventory & Stok',
    division: 'Logistik & Gudang',
    location: 'SITE B PASEH',
    employmentType: 'Magang',
    email: 'nurul.aini@perusahaan.com',
    phone: '0813-4567-8906',
    joinDate: '2024-01-10',
    status: 'Aktif',
  },
];

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const month = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
      const day = parts[2];
      return `${day} ${month} ${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

export default function DataKaryawan() {
  const activeSite = useActiveSite();
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivision, setFilterDivision] = useState('ALL');
  const [filterEmployment, setFilterEmployment] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formInitialData, setFormInitialData] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Notification Toast State
  const [alertInfo, setAlertInfo] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlertInfo({ message, type });
  };

  // Karyawan terfilter berdasarkan Site Aktif
  const siteEmployees = useMemo(() => {
    return employees.filter((emp) => matchesActiveSite(emp.location, activeSite.id));
  }, [employees, activeSite]);

  // KPI Counts Personalia
  const stats = useMemo(() => {
    const total = siteEmployees.length;
    const permanent = siteEmployees.filter((e) => e.employmentType === 'Tetap').length;
    const contract = siteEmployees.filter(
      (e) => e.employmentType === 'Kontrak (PKWT)' || e.employmentType === 'Magang'
    ).length;
    const active = siteEmployees.filter((e) => e.status === 'Aktif').length;
    return { total, permanent, contract, active };
  }, [siteEmployees]);

  // Filtered List
  const filteredEmployees = useMemo(() => {
    return siteEmployees.filter((emp) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.nip.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        (emp.email && emp.email.toLowerCase().includes(q)) ||
        (emp.phone && emp.phone.includes(q));

      const matchDivision = filterDivision === 'ALL' || emp.division === filterDivision;
      const matchEmployment = filterEmployment === 'ALL' || emp.employmentType === filterEmployment;
      const matchStatus = filterStatus === 'ALL' || emp.status === filterStatus;

      return matchQuery && matchDivision && matchEmployment && matchStatus;
    });
  }, [siteEmployees, searchQuery, filterDivision, filterEmployment, filterStatus]);

  // Reset Filters
  const isFiltered =
    Boolean(searchQuery) ||
    filterDivision !== 'ALL' ||
    filterEmployment !== 'ALL' ||
    filterStatus !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setFilterDivision('ALL');
    setFilterEmployment('ALL');
    setFilterStatus('ALL');
  };

  // Add / Edit Handlers
  const handleOpenAdd = () => {
    setFormInitialData({
      location: activeSite.id === 'site-b' ? 'SITE B PASEH' : 'SITE A CIMALAKA',
      employmentType: 'Tetap',
      status: 'Aktif',
      division: 'Operasional & Lapangan',
      joinDate: new Date().toISOString().slice(0, 10),
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setFormInitialData(emp);
    setIsFormOpen(true);
  };

  const handleSaveEmployee = (empData) => {
    if (formInitialData && formInitialData.id) {
      setEmployees((prev) => prev.map((item) => (item.id === empData.id ? empData : item)));
      showAlert(`Data karyawan "${empData.name}" berhasil diperbarui.`);
    } else {
      setEmployees((prev) => [empData, ...prev]);
      showAlert(`Karyawan baru "${empData.name}" berhasil ditambahkan ke database.`);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data karyawan "${name}" dari database?`)) {
      setEmployees((prev) => prev.filter((item) => item.id !== id));
      showAlert(`Data karyawan "${name}" telah dihapus.`, 'warning');
    }
  };

  // Import Handler
  const handleImportSuccess = (importedList) => {
    setEmployees((prev) => [...importedList, ...prev]);
    showAlert(`Berhasil mengimpor ${importedList.length} data karyawan ke database.`);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = filteredEmployees.map((emp, index) => ({
      No: index + 1,
      NIP: emp.nip,
      'Nama Karyawan': emp.name,
      Jabatan: emp.role,
      Divisi: emp.division,
      'Lokasi Kerja': emp.location,
      'Status Hubungan Kerja': emp.employmentType,
      Email: emp.email || '-',
      'No. Telepon': emp.phone || '-',
      'Tanggal Bergabung': emp.joinDate || '-',
      'Status Keaktifan': emp.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Database Karyawan');
    XLSX.writeFile(workbook, `Database_Karyawan_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showAlert('Database Karyawan berhasil diekspor ke Excel.');
  };

  return (
    <>
      <Head title="Database Karyawan" />

      <Toast toast={alertInfo} onClose={() => setAlertInfo(null)} />

      {/* Page Header dengan Action Toolbar */}
      <PageHeader
        eyebrow="MODUL PERSONEL & MASTER DATA (CORE HR)"
        title="Direktori Database Karyawan"
        subtitle="Pusat data induk seluruh karyawan, penempatan lokasi kerja, status hubungan kerja, dan informasi kontak kepegawaian."
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
              title="Ekspor database karyawan ke format Excel (.xlsx)"
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

      {/* Ringkasan Metrik Personalia (KPI Scorecards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Total Karyawan
              </div>
              <div className="text-2xl font-bold font-display text-navy mt-0.5">
                {stats.total} <span className="text-xs font-normal text-slate-400">orang</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Karyawan Tetap
              </div>
              <div className="text-2xl font-bold font-display text-blue-700 mt-0.5">
                {stats.permanent} <span className="text-xs font-normal text-slate-400">orang</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                PKWT & Magang
              </div>
              <div className="text-2xl font-bold font-display text-amber-700 mt-0.5">
                {stats.contract} <span className="text-xs font-normal text-slate-400">orang</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Status Aktif
              </div>
              <div className="text-2xl font-bold font-display text-[#398872] mt-0.5">
                {stats.active} <span className="text-xs font-normal text-slate-400">orang</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#eef7f1] flex items-center justify-center text-[#398872] shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card Kontainer Tabel & Filter */}
      <Card className="overflow-hidden border border-slate-200/90 shadow-xs">
        {/* Toolbar Pencarian & Filter Terstandarisasi */}
        <TableToolbar>
          <TableSearch
            placeholder="Cari nama karyawan, NIP, jabatan, atau kontak..."
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
              <option value="Human Capital & GA">Human Capital & GA</option>
              <option value="Logistik & Gudang">Logistik & Gudang</option>
              <option value="Security & Safety">Security & Safety</option>
            </TableSelect>

            {/* Filter Hubungan Kerja */}
            <TableSelect
              value={filterEmployment}
              onChange={(e) => setFilterEmployment(e.target.value)}
              title="Filter Hubungan Kerja"
            >
              <option value="ALL">Semua Status Kerja</option>
              <option value="Tetap">Karyawan Tetap</option>
              <option value="Kontrak (PKWT)">Kontrak (PKWT)</option>
              <option value="Magang">Magang</option>
            </TableSelect>

            {/* Filter Status Keaktifan */}
            <TableSelect
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              title="Filter Status"
            >
              <option value="ALL">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Cuti">Sedang Cuti</option>
              <option value="Non-Aktif">Non-Aktif / Keluar</option>
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

        {/* Tabel Database Karyawan */}
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/90 border-b border-slate-200">
                <TableHead className="w-12 text-center font-bold text-slate-700">NO</TableHead>
                <TableHead className="min-w-[200px] font-bold text-slate-700">NAMA & NIP</TableHead>
                <TableHead className="min-w-[150px] font-bold text-slate-700">DIVISI</TableHead>
                <TableHead className="min-w-[150px] font-bold text-slate-700">LOKASI KERJA</TableHead>
                <TableHead className="w-32 text-center font-bold text-slate-700">HUBUNGAN KERJA</TableHead>
                <TableHead className="min-w-[170px] font-bold text-slate-700">KONTAK</TableHead>
                <TableHead className="w-28 text-center font-bold text-slate-700">TGL BERGABUNG</TableHead>
                <TableHead className="w-24 text-center font-bold text-slate-700">STATUS</TableHead>
                <TableHead className="w-20 text-center font-bold text-slate-700">AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableEmpty colSpan={9}>
                  <div className="py-8">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <div className="font-semibold text-slate-600 text-sm">Tidak ada data karyawan yang sesuai</div>
                    <div className="text-slate-400 text-xs mt-1">
                      Coba sesuaikan kata kunci pencarian atau ubah filter divisi/status kepegawaian.
                    </div>
                  </div>
                </TableEmpty>
              ) : (
                filteredEmployees.map((emp, index) => {
                  const statusClass =
                    emp.status === 'Aktif'
                      ? 'status-aktif'
                      : emp.status === 'Cuti'
                      ? 'status-cuti'
                      : 'status-alpha';

                  const employmentBadgeBg =
                    emp.employmentType === 'Tetap'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : emp.employmentType === 'Magang'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200';

                  return (
                    <TableRow key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 1. No */}
                      <TableCell className="text-center font-medium text-slate-500 text-xs">
                        {index + 1}
                      </TableCell>

                      {/* 2. Profil Karyawan & NIP */}
                      <TableCell>
                        <div className="person">
                          <div className="avatar small font-bold text-slate-700 bg-slate-100 border border-slate-200">
                            {emp.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <strong className="block text-xs font-semibold text-navy">
                              {emp.name}
                            </strong>
                            <Text variant="caption" color="muted">
                              {emp.nip} • {emp.role}
                            </Text>
                          </div>
                        </div>
                      </TableCell>

                      {/* 3. Divisi */}
                      <TableCell className="font-medium text-slate-700 text-xs">
                        {emp.division}
                      </TableCell>

                      {/* 4. Lokasi Kerja */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{emp.location}</span>
                        </div>
                      </TableCell>

                      {/* 5. Hubungan Kerja */}
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${employmentBadgeBg}`}
                        >
                          {emp.employmentType || 'Tetap'}
                        </span>
                      </TableCell>

                      {/* 6. Kontak */}
                      <TableCell>
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[150px]">{emp.email || '-'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{emp.phone || '-'}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* 7. Tanggal Bergabung */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-600 text-xs">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{formatDate(emp.joinDate)}</span>
                        </div>
                      </TableCell>

                      {/* 8. Status Keaktifan */}
                      <TableCell className="text-center">
                        <span className={`badge ${statusClass}`}>
                          <i />
                          {emp.status}
                        </span>
                      </TableCell>

                      {/* 9. Aksi */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(emp)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-navy hover:bg-slate-100 transition-colors"
                            title="Ubah data karyawan"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(emp.id, emp.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus karyawan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Footer Pagination / Count Info */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <div>
              Menampilkan <strong>{filteredEmployees.length}</strong> dari total <strong>{siteEmployees.length}</strong> karyawan pada site terpilih ({employees.length} total perusahaan)
            </div>
            <div className="text-[11px] text-slate-400">
              Database karyawan tersinkronisasi dengan master data kepegawaian HCGA
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Tambah / Ubah Data Karyawan */}
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
