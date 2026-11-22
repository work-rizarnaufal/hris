import React from 'react';
import { FileSpreadsheet, Plus } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  TableSelect,
} from '@/components/ui';

export default function RaporCoachingLogs({
  employee,
  coachingLogs,
  newNoteType,
  onNoteTypeChange,
  newNote,
  onNoteChange,
  onAddLog,
}) {
  return (
    <Card className="border-slate-200 shadow-2xs">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-navy" />
              Buku Catatan Pembinaan & Sanksi Kedisiplinan
            </CardTitle>
            <CardDescription className="text-xs">
              Rekam jejak konseling, surat peringatan, dan tindakan pembinaan oleh HCGA untuk {employee.name}
            </CardDescription>
          </div>

          <Badge variant="neutral" className="text-xs self-start sm:self-auto font-medium">
            {coachingLogs.length} Catatan Pembinaan
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Form Input Catatan Baru */}
        <form onSubmit={onAddLog} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-navy" />
            Tambah Catatan Pembinaan Baru
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Kategori Tindakan
              </label>
              <TableSelect
                value={newNoteType}
                onChange={(e) => onNoteTypeChange(e.target.value)}
                containerClassName="w-full"
              >
                <option value="Konseling Rutin">Konseling Rutin</option>
                <option value="Teguran Lisan">Teguran Lisan</option>
                <option value="Surat Peringatan (SP-1)">Surat Peringatan (SP-1)</option>
                <option value="Surat Peringatan (SP-2)">Surat Peringatan (SP-2)</option>
                <option value="Apresiasi Kedisiplinan">Apresiasi Kedisiplinan</option>
              </TableSelect>
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Catatan Pembinaan / Kesepakatan Komitmen
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => onNoteChange(e.target.value)}
                  placeholder="Contoh: Karyawan berjanji hadir 15 menit sebelum briefing shift..."
                  className="flex-1 h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                />
                <Button type="submit" size="sm" className="h-9 px-4 text-xs shrink-0">
                  Simpan Catatan
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Timeline / Daftar Catatan Pembinaan */}
        <div className="space-y-3">
          {coachingLogs.length > 0 ? (
            coachingLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.type}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">{log.date}</span>
                    <Badge
                      className={
                        log.type.includes('SP')
                          ? 'bg-rose-50 text-rose-700 border-rose-200 text-[10px]'
                          : log.type.includes('Teguran')
                          ? 'bg-amber-50 text-amber-700 border-amber-200 text-[10px]'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{log.note}</p>
                  <p className="text-[11px] text-slate-400">Dicatat oleh: {log.officer}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-slate-400 py-3 italic">
              Belum ada catatan pembinaan tersimpan.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
