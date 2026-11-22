import React from 'react';
import { ArrowLeftRight, Plus, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
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
} from '@/components/ui';

export default function JadwalExceptionsTab({
  exceptions = [],
  onOpenAdd,
  onOpenEdit,
  onDeleteException,
}) {
  return (
    <Card className="border-slate-200 shadow-2xs">
      <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-purple-600" />
            Daftar Pengecualian & Tukar Shift Operasional
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Rekam permohonan tukar shift dan penugasan shift khusus yang disetujui HCGA.
          </CardDescription>
        </div>

        <Button
          size="sm"
          onClick={onOpenAdd}
          className="gap-1.5 text-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tukar Shift Baru</span>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-200">
              <TableHead className="w-12 text-center text-xs font-semibold text-slate-600">No</TableHead>
              <TableHead className="text-xs font-semibold text-slate-600">Tanggal Efektif</TableHead>
              <TableHead className="text-xs font-semibold text-slate-600">Karyawan Pemohon</TableHead>
              <TableHead className="text-xs font-semibold text-slate-600">Shift Semula</TableHead>
              <TableHead className="text-xs font-semibold text-slate-600">Rekan Pengganti / Shift Baru</TableHead>
              <TableHead className="text-xs font-semibold text-slate-600">Alasan Operasional</TableHead>
              <TableHead className="text-center text-xs font-semibold text-slate-600">Status</TableHead>
              <TableHead className="text-right pr-4 text-xs font-semibold text-slate-600">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exceptions.length === 0 ? (
              <TableEmpty colSpan={8} message="Belum ada catatan pengecualian atau tukar shift aktif." />
            ) : (
              exceptions.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <TableCell className="text-center font-medium text-slate-500 text-xs">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-navy">
                    {item.dateFormatted}
                  </TableCell>
                  <TableCell>
                    <p
                      onClick={() => onOpenEdit(item)}
                      className="font-bold text-navy hover:text-[#c4a266] transition-colors cursor-pointer text-xs"
                      title="Klik untuk ubah pengecualian"
                    >
                      {item.employeeName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">{item.employeeNip}</p>
                  </TableCell>
                  <TableCell className="text-xs text-slate-700">
                    {item.sourceShift}
                  </TableCell>
                  <TableCell>
                    {item.type === 'swap' ? (
                      <div>
                        <p className="font-bold text-purple-900 text-xs flex items-center gap-1">
                          <ArrowLeftRight className="w-3 h-3 text-purple-600" />
                          {item.targetEmployeeName}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">{item.targetEmployeeNip}</p>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-navy">
                        {item.targetShift}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 max-w-xs truncate" title={item.reason}>
                    {item.reason}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-medium">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 inline" />
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenEdit(item)}
                        className="h-7 w-7 p-0 text-slate-400 hover:text-navy hover:bg-slate-100"
                        title="Ubah Pengecualian"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteException(item.id)}
                        className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Batalkan Pengecualian"
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

        <div className="p-4 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-500">
          Pengecualian yang disetujui di sini akan secara otomatis dijadikan acuan batas toleransi masuk pada modul <strong>Catatan Kehadiran</strong>.
        </div>
      </CardContent>
    </Card>
  );
}
