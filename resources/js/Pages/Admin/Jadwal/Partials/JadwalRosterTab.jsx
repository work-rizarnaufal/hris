import React from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  MapPin,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
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
  TablePagination,
} from '@/components/ui';

export default function JadwalRosterTab({
  currentWeek,
  selectedWeekIndex,
  totalWeeks,
  onWeekChange,
  employees = [],
  filteredEmployees = [],
  paginatedEmployees = [],
  filterLocation,
  onLocationChange,
  filterDivision,
  onDivisionChange,
  availableDivisions = [],
  filterGroup,
  onGroupChange,
  searchQuery,
  onSearchChange,
  onResetFilters,
  hasActiveFilters,
  currentPage,
  totalPages,
  totalFiltered,
  perPage,
  onPageChange,
  onPerPageChange,
  calculateWeeklyHours,
  renderShiftCellBadge,
}) {
  return (
    <Card className="border-slate-200 shadow-2xs">
      {/* Header Roster & Navigasi Minggu */}
      <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#c4a266]" />
            Kalender Matriks Roster Kerja Karyawan
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Distribusi penugasan shift mingguan seluruh personil operasional pabrik, gudang, dan kantor.
          </CardDescription>
        </div>

        {/* Selector Navigasi Minggu */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1 self-start md:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(Math.max(0, selectedWeekIndex - 1))}
            disabled={selectedWeekIndex === 0}
            className="h-7 w-7 p-0 text-slate-600 hover:text-navy"
            aria-label="Minggu Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="text-xs font-bold text-navy px-2 whitespace-nowrap">
            {currentWeek.label}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(Math.min(totalWeeks - 1, selectedWeekIndex + 1))}
            disabled={selectedWeekIndex === totalWeeks - 1}
            className="h-7 w-7 p-0 text-slate-600 hover:text-navy"
            aria-label="Minggu Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Segmented Location Controller (Mariuk & Cimalaka) */}
      <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <button
            type="button"
            onClick={() => onLocationChange('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filterLocation === 'ALL'
                ? 'bg-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-50'
            }`}
          >
            Semua Lokasi ({employees.length})
          </button>
          <button
            type="button"
            onClick={() => onLocationChange('Lokasi Mariuk')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              filterLocation === 'Lokasi Mariuk'
                ? 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            Mariuk ({employees.filter((e) => e.location === 'Lokasi Mariuk').length})
          </button>
          <button
            type="button"
            onClick={() => onLocationChange('Lokasi Cimalaka')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              filterLocation === 'Lokasi Cimalaka'
                ? 'bg-indigo-50 text-indigo-900 border border-indigo-200/80 shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            Cimalaka ({employees.filter((e) => e.location === 'Lokasi Cimalaka').length})
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Roster Operasional · Shift Pagi 08:00-17:00 & Shift Malam 20:00-05:00 WIB</span>
        </div>
      </div>

      {/* Atomic Toolbar & Filters */}
      <TableToolbar>
        <TableSearch
          placeholder="Cari nama karyawan, NIP, atau jabatan..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <TableFilterGroup>
          {/* Filter Lokasi Penempatan */}
          <TableSelect
            value={filterLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            title="Filter Lokasi Kerja"
          >
            <option value="ALL">Semua Lokasi</option>
            <option value="Lokasi Mariuk">📍 Lokasi Mariuk</option>
            <option value="Lokasi Cimalaka">📍 Lokasi Cimalaka</option>
          </TableSelect>

          {/* Filter Divisi (Dinamis dari Master Data Karyawan) */}
          <TableSelect
            value={filterDivision}
            onChange={(e) => onDivisionChange(e.target.value)}
            title="Filter Divisi"
          >
            <option value="ALL">Semua Divisi</option>
            {availableDivisions.map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </TableSelect>

          {/* Filter Grup */}
          <TableSelect
            value={filterGroup}
            onChange={(e) => onGroupChange(e.target.value)}
            title="Filter Grup"
          >
            <option value="ALL">Semua Grup</option>
            <option value="Grup A">Grup A</option>
            <option value="Grup B">Grup B</option>
            <option value="Belum Ditetapkan">Belum Ditetapkan</option>
            <option value="Non-Shift">Non-Shift (Staff)</option>
          </TableSelect>

          {/* Reset Filters */}
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

      {/* Tabel Matriks Roster */}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-200">
              <TableHead className="w-12 text-center text-xs font-semibold text-slate-600">
                No
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-600 min-w-[200px]">
                Karyawan
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-600 min-w-[140px]">
                Divisi & Grup
              </TableHead>

              {/* 7 Kolom Hari dalam Minggu Terpilih */}
              {currentWeek.days.map((day) => (
                <TableHead
                  key={day.key}
                  className={`text-center text-xs font-bold w-24 ${
                    day.isWeekend ? 'bg-slate-100/70 text-slate-600' : 'text-slate-800'
                  }`}
                >
                  <div>{day.label}</div>
                  <div className="text-[10px] font-normal text-slate-400">{day.date}</div>
                </TableHead>
              ))}

              <TableHead className="text-center text-xs font-semibold text-slate-600 w-24">
                Total Jam
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedEmployees.length === 0 ? (
              <TableEmpty colSpan={11} message="Tidak ada data karyawan yang cocok dengan kriteria filter." />
            ) : (
              paginatedEmployees.map((emp, index) => {
                const globalIndex = (currentPage - 1) * perPage + index + 1;
                const weeklyHours = calculateWeeklyHours(emp, currentWeek.days);
                const dutyDays = weeklyHours > 0 ? (weeklyHours >= 8 ? Math.round(weeklyHours / 8) : 1) : 0;
                const isMariuk = emp.location?.includes('Mariuk');
                const isCimalaka = emp.location?.includes('Cimalaka');

                return (
                  <TableRow key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    <TableCell className="text-center font-medium text-slate-500 text-xs">
                      {globalIndex}
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
                          <p className="font-bold text-navy text-xs">{emp.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-slate-500 font-mono">{emp.nip}</span>
                            <span className="text-[11px] text-slate-400">•</span>
                            <span className="text-[11px] text-slate-500">{emp.role}</span>
                            {emp.location && (
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                  isMariuk
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : isCimalaka
                                    ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {isMariuk ? 'Mariuk' : isCimalaka ? 'Cimalaka' : emp.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-slate-800 font-medium">{emp.division || '-'}</p>
                      <span
                        className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                          emp.group === 'Grup A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : emp.group === 'Grup B'
                            ? 'bg-amber-100 text-amber-800'
                            : emp.group === 'Belum Ditetapkan'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {emp.group}
                      </span>
                    </TableCell>

                    {/* 7 Sel Hari */}
                    {currentWeek.days.map((day) => (
                      <TableCell key={day.key} className="text-center p-2">
                        {renderShiftCellBadge(emp, day)}
                      </TableCell>
                    ))}

                    <TableCell className="text-center font-bold text-xs text-slate-800">
                      <div>
                        <span>{weeklyHours} Jam</span>
                        <span className="block text-[10px] font-normal text-slate-400">
                          ({dutyDays} Hari Dinas)
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Roster */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredEmployees.length}
          itemsPerPage={perPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onPerPageChange}
        />

        {/* Footer Roster Info & Legenda */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-slate-700">Legenda Kode:</span>
            <span className="inline-flex items-center gap-1.5 text-[11px]">
              <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
              <strong>PAGI (08-17)</strong>: Shift Pagi 9 Jam
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px]">
              <span className="w-2.5 h-2.5 rounded bg-indigo-600 inline-block" />
              <strong>MALAM (20-05)</strong>: Shift Malam 9 Jam
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px]">
              <span className="w-2.5 h-2.5 rounded bg-sky-600 inline-block" />
              <strong>NON</strong>: Office (08-17)
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px]">
              <span className="w-2.5 h-2.5 rounded bg-purple-600 inline-block" />
              <strong>SWAP</strong>: Tukar Shift Resmi
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px]">
              <span className="w-2.5 h-2.5 rounded bg-rose-600 inline-block" />
              <strong>LIBUR</strong>: Hari Libur Operasional
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px]">
              <span className="w-2.5 h-2.5 rounded bg-slate-400 inline-block" />
              <strong>OFF</strong>: Libur Pasca-Dinas
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            Menampilkan <strong>{paginatedEmployees.length}</strong> dari <strong>{filteredEmployees.length}</strong> tersaring (Total <strong>{employees.length}</strong> karyawan)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
