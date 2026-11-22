import React from 'react';
import { UserCheck, RotateCcw, Eye } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
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
} from '@/components/ui';
import { renderStatusBadge } from './LaporanAnalyticsGrid.jsx';

export default function LaporanEvaluasiTable({
  filteredData = [],
  totalEmployees = 0,
  searchQuery = '',
  onSearchChange,
  selectedLocation = 'ALL',
  onLocationChange,
  selectedDivision = 'ALL',
  onDivisionChange,
  divisions = [],
  selectedStatus = 'ALL',
  onStatusChange,
  onResetFilters,
  hasActiveFilters = false,
  selectedPeriod = '',
  onOpenRapor,
}) {
  return (
    <Card className="border-slate-200 shadow-2xs">
      <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-navy" />
            Matriks Evaluasi Kedisiplinan Karyawan
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Rekapitulasi performa kepatuhan, frekuensi keterlambatan, dan skor disiplin kerja karyawan periode {selectedPeriod}.
          </CardDescription>
        </div>
        <Badge variant="neutral" className="text-xs self-start sm:self-auto font-medium">
          Total {filteredData.length} Karyawan
        </Badge>
      </CardHeader>

      {/* Atomic Table Toolbar & Filter Group */}
      <TableToolbar>
        <TableSearch
          placeholder="Cari berdasarkan nama karyawan, NIP, atau jabatan..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <TableFilterGroup>
          {/* Filter Lokasi */}
          <TableSelect
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            title="Filter Lokasi Kerja"
          >
            <option value="ALL">Semua Lokasi</option>
            <option value="Lokasi Mariuk">📍 Lokasi Mariuk</option>
            <option value="Lokasi Cimalaka">📍 Lokasi Cimalaka</option>
          </TableSelect>

          {/* Filter Divisi */}
          <TableSelect
            value={selectedDivision}
            onChange={(e) => onDivisionChange(e.target.value)}
            title="Filter Divisi"
          >
            <option value="ALL">Semua Divisi</option>
            {divisions.filter((d) => d !== 'ALL').map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </TableSelect>

          {/* Filter Status Evaluasi */}
          <TableSelect
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            title="Filter Status Evaluasi"
          >
            <option value="ALL">Semua Status</option>
            <option value="Sangat Baik">Sangat Baik</option>
            <option value="Disiplin Baik">Disiplin Baik</option>
            <option value="Perlu Pembinaan">Perlu Pembinaan</option>
            <option value="Peringatan / SP">Peringatan / SP</option>
          </TableSelect>

          {/* Tombol Reset Filter */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-9 px-3 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </Button>
          )}
        </TableFilterGroup>
      </TableToolbar>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">No</TableHead>
              <TableHead>Karyawan</TableHead>
              <TableHead>Divisi & Lokasi</TableHead>
              <TableHead className="text-center">Kehadiran (Hadir/Hari)</TableHead>
              <TableHead className="text-center">Keterlambatan</TableHead>
              <TableHead className="text-center">Cuti / Sakit</TableHead>
              <TableHead className="text-center">Alpa</TableHead>
              <TableHead className="text-center">Skor Disiplin</TableHead>
              <TableHead className="text-center">Status Evaluasi</TableHead>
              <TableHead className="text-right pr-4">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableEmpty colSpan={10} message="Tidak ada data evaluasi karyawan yang cocok dengan kriteria filter." />
            ) : (
              filteredData.map((emp, index) => {
                const attendancePct = ((emp.presentDays / emp.workDays) * 100).toFixed(0);
                return (
                  <TableRow key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    <TableCell className="text-center font-medium text-slate-500 text-xs">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-navy/10 text-navy font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {emp.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <p
                            onClick={() => onOpenRapor(emp.id)}
                            className="font-bold text-navy text-xs hover:text-[#c4a266] transition-colors cursor-pointer"
                            title="Klik untuk buka rapor individu"
                          >
                            {emp.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-slate-500 font-mono">{emp.nip}</span>
                            <span className="text-[11px] text-slate-400">•</span>
                            <span className="text-[11px] text-slate-500">{emp.role}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-slate-800 font-medium">{emp.division}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            emp.location?.includes('Mariuk')
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : emp.location?.includes('Cimalaka')
                              ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {emp.location?.includes('Mariuk') ? 'Mariuk' : emp.location?.includes('Cimalaka') ? 'Cimalaka' : emp.location}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                            emp.group === 'Grup A'
                              ? 'bg-emerald-100 text-emerald-800'
                              : emp.group === 'Grup B'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {emp.group}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-block">
                        <span className="font-bold text-xs text-slate-900">
                          {emp.presentDays} / {emp.workDays}
                        </span>
                        <span className="text-[11px] text-slate-500 ml-1">
                          ({attendancePct}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {emp.lateCount > 0 ? (
                        <span className="font-semibold text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {emp.lateCount}x ({emp.totalLateMinutes} mnt)
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">0x</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-xs text-slate-700">
                      {emp.leaveDays > 0 ? `${emp.leaveDays} hari` : '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {emp.alpaDays > 0 ? (
                        <Badge className="bg-rose-100 text-rose-800 border-rose-300 font-bold text-[10px]">
                          {emp.alpaDays} Alpa
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span
                          className={`font-bold text-xs ${
                            emp.score >= 95
                              ? 'text-emerald-700'
                              : emp.score >= 85
                              ? 'text-sky-700'
                              : emp.score >= 70
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {emp.score}%
                        </span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              emp.score >= 95
                                ? 'bg-emerald-500'
                                : emp.score >= 85
                                ? 'bg-sky-500'
                                : emp.score >= 70
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${emp.score}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {renderStatusBadge(emp.status)}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenRapor(emp.id)}
                        className="h-7 text-xs px-2.5 gap-1.5 text-navy border-slate-300 hover:bg-slate-100"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#c4a266]" />
                        <span>Buka Rapor</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Footer Table Info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Menampilkan <strong>{filteredData.length}</strong> dari total <strong>{totalEmployees}</strong> karyawan pada periode {selectedPeriod}
          </div>
          <div className="text-[11px] text-slate-400">
            Pembaruan terakhir: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
