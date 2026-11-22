import React from 'react';
import { RotateCcw } from 'lucide-react';
import {
  Button,
  TableToolbar,
  TableSearch,
  TableFilterGroup,
  TableSelect,
} from '@/components/ui';

export default function AttendanceToolbar({
  searchQuery,
  onSearchChange,
  filterLocation,
  onLocationChange,
  filterStatus,
  onStatusChange,
  filterDivision,
  onDivisionChange,
  availableDivisions = [],
  filterShift,
  onShiftChange,
  shiftSettings,
  hasActiveFilters,
  onResetFilters,
}) {
  return (
    <TableToolbar>
      <TableSearch
        placeholder="Cari berdasarkan nama karyawan, NIP, atau jabatan..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <TableFilterGroup>
        {/* Filter Lokasi Kerja */}
        <TableSelect
          value={filterLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          title="Filter Lokasi Kerja"
        >
          <option value="ALL">Semua Lokasi (Mariuk & Cimalaka)</option>
          <option value="Lokasi Mariuk">📍 Lokasi Mariuk</option>
          <option value="Lokasi Cimalaka">📍 Lokasi Cimalaka</option>
        </TableSelect>

        {/* Filter Status */}
        <TableSelect
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          title="Filter Status"
        >
          <option value="ALL">Semua Status</option>
          <option value="Hadir">Hadir</option>
          <option value="Terlambat">Terlambat</option>
          <option value="Izin">Izin</option>
          <option value="Sakit">Sakit</option>
          <option value="Cuti">Cuti</option>
          <option value="Alpha">Alpha</option>
        </TableSelect>

        {/* Filter Divisi (Dinamis dari Master Karyawan) */}
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

        {/* Filter Shift Operasional */}
        <TableSelect
          value={filterShift}
          onChange={(e) => onShiftChange(e.target.value)}
          title="Filter Shift"
        >
          <option value="ALL">Semua Shift</option>
          <option value="Pagi">
            {shiftSettings?.shiftPagiName || 'Shift Pagi'} ({shiftSettings?.shiftPagiIn || '08:00'} - {shiftSettings?.shiftPagiOut || '17:00'})
          </option>
          <option value="Malam">
            {shiftSettings?.shiftMalamName || 'Shift Malam'} ({shiftSettings?.shiftMalamIn || '20:00'} - {shiftSettings?.shiftMalamOut || '05:00'})
          </option>
        </TableSelect>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-9 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5"
            title="Reset seluruh filter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </TableFilterGroup>
    </TableToolbar>
  );
}
