import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
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
  Text,
  TableToolbar,
  TableSearch,
  TableFilterGroup,
  TableSelect,
  TablePagination,
  Toast,
} from '@/components/ui';
import ModalFormKaryawan from './Partials/ModalFormKaryawan.jsx';
import ModalImporKaryawan from './Partials/ModalImporKaryawan.jsx';
import { getLocations } from '@/services/systemSettings.js';

const normalizeEmployee = (emp) => {
  const locName = typeof emp.location === 'object'
    ? (emp.location?.name || (emp.location_id === 2 ? 'Lokasi Cimalaka' : 'Lokasi Mariuk'))
    : (emp.location || (emp.location_id === 2 ? 'Lokasi Cimalaka' : 'Lokasi Mariuk'));

  const shiftName = typeof emp.shift === 'object'
    ? (emp.shift?.name || emp.scheduleCategory || 'Shift Pagi (12 Jam)')
    : (emp.scheduleCategory || emp.shift || 'Shift Pagi (12 Jam)');

  const inTime = typeof emp.shift === 'object' && emp.shift?.start_time
    ? emp.shift.start_time.slice(0, 5)
    : (emp.checkInTime || '07:00');

  const outTime = typeof emp.shift === 'object' && emp.shift?.end_time
    ? emp.shift.end_time.slice(0, 5)
    : (emp.checkOutTime || '19:00');

  return {
    ...emp,
    id: emp.id,
    name: emp.name || '',
    nip: emp.nip || '',
    biometricPin: String(emp.biometric_pin || emp.biometricPin || ''),
    role: emp.role || emp.role_title || 'Staff Operasional Lapangan',
    division: emp.division || 'Operasional & Lapangan',
    location: locName,
    group: emp.group || emp.shift_group || 'Grup A',
    scheduleCategory: shiftName,
    checkInTime: inTime,
    checkOutTime: outTime,
    status: emp.status || 'Aktif',
  };
};

export default function DataKaryawan({ employees: initialDbEmployees = [] }) {
  const [employees, setEmployees] = useState(() => {
    return Array.isArray(initialDbEmployees) ? initialDbEmployees.map(normalizeEmployee) : [];
  });

  useEffect(() => {
    if (Array.isArray(initialDbEmployees)) {
      setEmployees(initialDbEmployees.map(normalizeEmployee));
    }
  }, [initialDbEmployees]);
  const locationList = useMemo(() => getLocations(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('ALL');
  const [filterDivision, setFilterDivision] = useState('ALL');
  const [filterGroup, setFilterGroup] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formInitialData, setFormInitialData] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification Toast State
  const [alertInfo, setAlertInfo] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlertInfo({ message, type });
    setTimeout(() => setAlertInfo(null), 3500);
  };

  // KPI Counts
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'Aktif').length;
    const onLeave = employees.filter((e) => e.status === 'Cuti').length;
    const inactive = employees.filter((e) => e.status === 'Non-Aktif').length;
    return { total, active, onLeave, inactive };
  }, [employees]);

  // Filtered List
  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return employees.filter((emp) => {
      const name = String(emp.name || '').toLowerCase();
      const nip = String(emp.nip || '').toLowerCase();
      const role = String(emp.role || '').toLowerCase();
      const pin = String(emp.biometricPin || '').toLowerCase();

      const matchQuery =
        !q ||
        name.includes(q) ||
        nip.includes(q) ||
        role.includes(q) ||
        pin.includes(q);

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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset ke halaman 1 saat filter / pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterLocation, filterDivision, filterGroup, filterStatus, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage, itemsPerPage]);

  // Add / Edit Handlers
  const handleOpenAdd = () => {
    setFormInitialData(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setFormInitialData(emp);
    setIsFormOpen(true);
  };

  const handleSaveEmployee = (empData, setModalErrors) => {
    setIsSubmitting(true);
    const payload = {
      nip: empData.nip,
      biometric_pin: empData.biometricPin || null,
      name: empData.name,
      role_title: empData.role,
      division: empData.division,
      location: empData.location,
      shift_group: empData.group,
      scheduleCategory: empData.scheduleCategory,
      status: empData.status || 'Aktif',
      employment_status: empData.employment_status || 'Tetap',
    };

    if (formInitialData?.id) {
      router.put(`/karyawan/${formInitialData.id}`, payload, {
        preserveScroll: true,
        onSuccess: () => {
          showAlert(`Data karyawan "${empData.name}" berhasil diperbarui.`);
          setIsFormOpen(false);
          setIsSubmitting(false);
        },
        onError: (errs) => {
          setIsSubmitting(false);
          if (setModalErrors) setModalErrors(errs);
          const firstErr = Object.values(errs)[0] || 'Gagal memperbarui data karyawan.';
          showAlert(firstErr, 'error');
        },
      });
    } else {
      router.post('/karyawan', payload, {
        preserveScroll: true,
        onSuccess: () => {
          showAlert(`Karyawan baru "${empData.name}" berhasil ditambahkan.`);
          setIsFormOpen(false);
          setIsSubmitting(false);
        },
        onError: (errs) => {
          setIsSubmitting(false);
          if (setModalErrors) setModalErrors(errs);
          const firstErr = Object.values(errs)[0] || 'Gagal menyimpan data karyawan.';
          showAlert(firstErr, 'error');
        },
      });
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data karyawan "${name}"?`)) {
      router.delete(`/karyawan/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          showAlert(`Data karyawan "${name}" telah dihapus dari sistem.`, 'warning');
        },
        onError: () => {
          showAlert(`Gagal menghapus data karyawan "${name}".`, 'error');
        },
      });
    }
  };

  // Import Handler
  const handleImportSuccess = (importedList, setImportError) => {
    router.post(
      '/karyawan/batch-import',
      { employees: importedList },
      {
        preserveScroll: true,
        onSuccess: () => {
          showAlert(`Berhasil mengimpor ${importedList.length} data karyawan ke dalam database.`);
          setIsImportOpen(false);
        },
        onError: (errs) => {
          const msg = Object.values(errs)[0] || 'Gagal mengimpor data karyawan ke database.';
          if (setImportError) setImportError(msg);
          showAlert(msg, 'error');
        },
      }
    );
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

      {/* Ringkasan Metrik Singkat (KPI Badges) */}
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

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Sedang Cuti
              </div>
              <div className="text-2xl font-bold font-display text-[#8880b1] mt-0.5">
                {stats.onLeave} <span className="text-xs font-normal text-slate-400">orang</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#f1f0f9] flex items-center justify-center text-[#8880b1] shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Non-Aktif / Resign
              </div>
              <div className="text-2xl font-bold font-display text-[#b36a74] mt-0.5">
                {stats.inactive} <span className="text-xs font-normal text-slate-400">orang</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#fbf0f2] flex items-center justify-center text-[#b36a74] shrink-0">
              <ShieldAlert className="w-4 h-4" />
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
              {locationList.map((loc) => (
                <option key={loc.id} value={loc.name}>📍 {loc.name}</option>
              ))}
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
                paginatedEmployees.map((emp, index) => {
                  const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;

                  // Badge styling helper
                  const statusClass =
                    emp.status === 'Aktif'
                      ? 'status-aktif'
                      : emp.status === 'Cuti'
                      ? 'status-cuti'
                      : 'status-alpha';

                  const groupBadgeBg =
                    emp.group === 'Grup A'
                      ? 'bg-[#f7f2e8] text-[#ab874b] border-[#c4a266]/30'
                      : emp.group === 'Grup B'
                      ? 'bg-[#eef7f1] text-[#398872] border-[#398872]/30'
                      : 'bg-slate-100 text-slate-600 border-slate-200';

                  return (
                    <TableRow key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 1. No */}
                      <TableCell className="text-center font-medium text-slate-500 text-xs">
                        {rowNumber}
                      </TableCell>

                      {/* 2. Nama Karyawan */}
                      <TableCell>
                        <div className="person">
                          <div className="avatar small font-bold text-slate-700 bg-slate-100 border border-slate-200">
                            {String(emp.name || 'KR').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <strong
                              onClick={() => handleOpenEdit(emp)}
                              className="block text-xs font-semibold text-navy hover:text-[#c4a266] transition-colors cursor-pointer"
                              title="Klik untuk ubah data karyawan"
                            >
                              {emp.name}
                            </strong>
                            <Text variant="caption" color="muted">
                              {emp.nip} {emp.biometricPin ? `(PIN: ${emp.biometricPin})` : ''} • {emp.role}
                            </Text>
                          </div>
                        </div>
                      </TableCell>

                      {/* 3. Divisi */}
                      <TableCell className="font-medium text-slate-700">
                        {emp.division}
                      </TableCell>

                      {/* 4. Lokasi Kerja */}
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <Badge
                            className={
                              String(emp.location || '').includes('Mariuk')
                                ? 'bg-amber-50 text-amber-800 border-amber-200 text-[11px] font-semibold'
                                : String(emp.location || '').includes('Cimalaka')
                                ? 'bg-indigo-50 text-indigo-800 border-indigo-200 text-[11px] font-semibold'
                                : 'bg-slate-100 text-slate-700 border-slate-200 text-[11px]'
                            }
                          >
                            {String(emp.location || '').includes('Mariuk')
                              ? 'Mariuk'
                              : String(emp.location || '').includes('Cimalaka')
                              ? 'Cimalaka'
                              : (emp.location || '-')}
                          </Badge>
                        </div>
                      </TableCell>

                      {/* 5. Grup */}
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${groupBadgeBg}`}
                        >
                          {emp.group}
                        </span>
                      </TableCell>

                      {/* 6. Kategori Jadwal */}
                      <TableCell className="text-slate-600 text-xs">
                        {emp.scheduleCategory}
                      </TableCell>

                      {/* 7. Jam Masuk */}
                      <TableCell className="text-center">
                        <Text variant="code" className="text-emerald-800 bg-emerald-50 border border-emerald-200/60 font-semibold inline-block">
                          {emp.checkInTime}
                        </Text>
                      </TableCell>

                      {/* 8. Jam Pulang */}
                      <TableCell className="text-center">
                        <Text variant="code" className="text-slate-700 bg-slate-100 border border-slate-200 font-semibold inline-block">
                          {emp.checkOutTime}
                        </Text>
                      </TableCell>

                      {/* 9. Status */}
                      <TableCell className="text-center">
                        <span className={`badge ${statusClass}`}>
                          <i />
                          {emp.status}
                        </span>
                      </TableCell>

                      {/* 10. Aksi */}
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
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={employees.length}
            filteredCount={filteredEmployees.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            perPageOptions={[10, 25, 50, 100]}
          />
        </CardContent>
      </Card>

      {/* Modal Tambah / Ubah Karyawan */}
      <ModalFormKaryawan
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveEmployee}
        initialData={formInitialData}
        isSubmitting={isSubmitting}
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
