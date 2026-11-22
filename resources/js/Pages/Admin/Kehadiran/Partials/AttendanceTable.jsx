import React from 'react';
import {
  CalendarCheck,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Fingerprint,
  UserCheck,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableEmpty,
  Text,
  TablePagination,
} from '@/components/ui';

// Helper Badge Status
const getStatusBadge = (status) => {
  let className = 'status-hadir';
  if (status === 'Terlambat') className = 'status-terlambat';
  else if (status === 'Sakit') className = 'status-sakit';
  else if (status === 'Izin') className = 'status-izin';
  else if (status === 'Cuti') className = 'status-cuti';
  else if (status === 'Alpha') className = 'status-alpha';

  return (
    <span className={`badge ${className}`}>
      <i />
      {status}
    </span>
  );
};

export default function AttendanceTable({
  paginatedAttendances = [],
  totalFiltered = 0,
  currentDayTotal = 0,
  hasActiveFilters = false,
  formattedDateTitle = '',
  currentPage = 1,
  perPage = 25,
  totalPages = 1,
  onPageChange,
  onPerPageChange,
  onOpenEdit,
  onOpenAdd,
  onDeleteRecord,
  onResetFilters,
}) {
  return (
    <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/80 border-b border-slate-200/80">
            <TableHead className="w-12 text-center text-xs font-semibold text-slate-600">
              No
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-600 min-w-[190px]">
              Karyawan
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-600 min-w-[140px]">
              Divisi & Lokasi
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-600 min-w-[140px]">
              Shift Terjadwal
            </TableHead>
            <TableHead className="text-center text-xs font-semibold text-slate-600 w-24">
              Jam Masuk
            </TableHead>
            <TableHead className="text-center text-xs font-semibold text-slate-600 w-24">
              Jam Pulang
            </TableHead>
            <TableHead className="text-center text-xs font-semibold text-slate-600 w-24">
              Keterlambatan
            </TableHead>
            <TableHead className="text-center text-xs font-semibold text-slate-600 w-24">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-600 min-w-[140px]">
              Keterangan
            </TableHead>
            <TableHead className="text-center text-xs font-semibold text-slate-600 w-20">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {totalFiltered === 0 ? (
            <TableEmpty colSpan={10}>
              <div className="py-12 text-center">
                <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <strong className="text-sm font-semibold text-slate-700 block mb-1">
                  Tidak Ada Catatan Presensi
                </strong>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  {hasActiveFilters
                    ? 'Tidak ada data kehadiran yang cocok dengan kriteria filter yang Anda tentukan.'
                    : `Belum ada presensi yang dicatat untuk tanggal ${formattedDateTitle}.`}
                </p>
                <div className="flex items-center justify-center gap-2">
                  {hasActiveFilters ? (
                    <Button variant="outline" size="sm" onClick={onResetFilters}>
                      Reset Filter
                    </Button>
                  ) : (
                    <Button variant="default" size="sm" onClick={onOpenAdd} className="gap-1.5">
                      <Plus className="w-4 h-4" />
                      <span>Catat Presensi Sekarang</span>
                    </Button>
                  )}
                </div>
              </div>
            </TableEmpty>
          ) : (
            paginatedAttendances.map((rec, index) => {
              const isLate = rec.status === 'Terlambat';
              const isPresent = rec.status === 'Hadir';

              return (
                <TableRow
                  key={rec.id}
                  className="hover:bg-slate-50/60 transition-colors border-b border-slate-100"
                >
                  {/* 1. No */}
                  <TableCell className="text-center text-xs text-slate-400 font-mono">
                    {(currentPage - 1) * perPage + index + 1}
                  </TableCell>

                  {/* 2. Karyawan */}
                  <TableCell>
                    <div className="min-w-0">
                      <strong
                        onClick={() => onOpenEdit(rec)}
                        className="text-xs font-semibold text-navy block truncate hover:text-[#c4a266] transition-colors cursor-pointer"
                        title="Klik untuk ubah presensi karyawan ini"
                      >
                        {rec.employeeName}
                      </strong>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-mono">{rec.nip}</span>
                        <span>•</span>
                        <span className="truncate">{rec.role}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* 3. Divisi & Lokasi */}
                  <TableCell>
                    <div className="text-xs text-slate-700 font-medium">{rec.division}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{rec.location || 'Lokasi Mariuk'}</span>
                    </div>
                  </TableCell>

                  {/* 4. Shift Terjadwal */}
                  <TableCell className="text-xs text-slate-600">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                      {rec.shift}
                    </span>
                  </TableCell>

                  {/* 5. Jam Masuk */}
                  <TableCell className="text-center">
                    {rec.checkIn && rec.checkIn !== '-' ? (
                      <Text
                        variant="code"
                        className={`font-semibold inline-block ${
                          isLate
                            ? 'text-amber-900 bg-amber-50 border border-amber-200/70'
                            : 'text-emerald-800 bg-emerald-50 border border-emerald-200/60'
                        }`}
                      >
                        {rec.checkIn} WIB
                      </Text>
                    ) : (
                      <span className="text-slate-400 font-mono text-xs">-</span>
                    )}
                  </TableCell>

                  {/* 6. Jam Pulang */}
                  <TableCell className="text-center">
                    {rec.checkOut && rec.checkOut !== '-' ? (
                      <Text
                        variant="code"
                        className="text-slate-700 bg-slate-100 border border-slate-200 font-semibold inline-block"
                      >
                        {rec.checkOut} WIB
                      </Text>
                    ) : (
                      <span className="text-slate-400 font-mono text-xs">-</span>
                    )}
                  </TableCell>

                  {/* 7. Keterlambatan */}
                  <TableCell className="text-center">
                    {isLate ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                        {rec.deviation}
                      </span>
                    ) : isPresent ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-emerald-700 bg-emerald-50/70">
                        Tepat Waktu
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </TableCell>

                  {/* 8. Status & Metode Presensi */}
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      {getStatusBadge(rec.status)}
                      {rec.method === 'manual_admin' ? (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/70"
                          title="Presensi dicatat / dikoreksi manual oleh Admin"
                        >
                          <UserCheck className="w-2.5 h-2.5 text-amber-600" />
                          Manual
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/70"
                          title="Presensi ditarik dari mesin biometric fingerprint fisik"
                        >
                          <Fingerprint className="w-2.5 h-2.5 text-indigo-600" />
                          Fingerprint
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* 9. Keterangan */}
                  <TableCell className="text-xs text-slate-600 max-w-[200px] truncate" title={rec.notes}>
                    {rec.notes || '-'}
                  </TableCell>

                  {/* 10. Aksi */}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenEdit(rec)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-navy hover:bg-slate-100 transition-colors"
                        title="Ubah presensi"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(rec.id, rec.employeeName)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus presensi"
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

      {/* Atomic Table Pagination */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={currentDayTotal}
        filteredCount={totalFiltered}
        itemsPerPage={perPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={(newPerPage) => {
          onPerPageChange(newPerPage);
          onPageChange(1);
        }}
      />
    </CardContent>
  );
}
