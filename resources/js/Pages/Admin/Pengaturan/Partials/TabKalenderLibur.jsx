import React from 'react';
import {
  CalendarDays,
  Plus,
  Search,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle2,
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
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSelect,
} from '@/components/ui';
import { formatDateDMY } from '@/services/systemSettings.js';

export default function TabKalenderLibur({
  holidays,
  filteredHolidays,
  holidaySearch,
  setHolidaySearch,
  holidayFilterCategory,
  setHolidayFilterCategory,
  onOpenAdd,
  onOpenEdit,
  onDelete,
}) {
  return (
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
            onClick={onOpenAdd}
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
                        onClick={() => onOpenEdit(holiday)}
                        className="h-7 w-7 p-0 text-slate-500 hover:text-navy hover:bg-slate-100 cursor-pointer"
                        title="Edit Hari Libur"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(holiday.id, holiday.name)}
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
  );
}
