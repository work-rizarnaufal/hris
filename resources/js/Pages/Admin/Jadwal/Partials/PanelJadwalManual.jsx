import React, { useState } from 'react';
import { Clock, Sun, Moon, Plus, Trash2, CheckCircle2 } from 'lucide-react';
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
  TableEmpty,
} from '@/components/ui';
import { formatDateDMY } from '@/services/systemSettings.js';

export default function PanelJadwalManual({
  manualSchedules = [],
  onSaveManualSchedule,
  onDeleteManualSchedule,
  currentWeek,
}) {
  const [startDate, setStartDate] = useState(() => {
    if (currentWeek?.days?.[0]?.date) {
      const parts = currentWeek.days[0].date.split('/');
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  });

  const [targetGroup, setTargetGroup] = useState('Grup A');
  const [shift1In, setShift1In] = useState('08:00');
  const [shift1Out, setShift1Out] = useState('17:00');
  const [shift2In, setShift2In] = useState('20:00');
  const [shift2Out, setShift2Out] = useState('05:00');
  const [reason, setReason] = useState('');

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim() || !startDate) return;

    if (onSaveManualSchedule) {
      onSaveManualSchedule({
        startDate,
        targetGroup,
        shift1In,
        shift1Out,
        shift2In,
        shift2Out,
        reason: reason.trim(),
      });
    }

    setReason('');
  };

  return (
    <Card className="border-slate-200 shadow-2xs">
      <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#c4a266]" />
            Perubahan Jadwal Operasional Manual
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Penyesuaian ad-hoc tanggal mulai, grup bertugas, dan rentang jam kerja operasional Shift 1 & Shift 2.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-5">
        <form
          onSubmit={handleManualSubmit}
          className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-4 sm:p-5 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tanggal Mulai Shift <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 text-xs bg-white text-slate-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Grup Yang Bekerja <span className="text-rose-500">*</span>
              </label>
              <TableSelect
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="h-9 text-xs text-slate-700"
                containerClassName="w-full"
              >
                <option value="Grup A">Grup A</option>
                <option value="Grup B">Grup B</option>
                <option value="Semua Grup (A & B)">Semua Grup (Grup A & Grup B)</option>
              </TableSelect>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alasan Perubahan <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Contoh: Percepatan kuota ekspor / maintenance mesin CNC..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-9 text-xs bg-white text-slate-700 placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Shift 1 (Pagi) */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <Sun className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">
                  Konfigurasi Shift Pagi (08:00 - 17:00 WIB)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Jam Masuk
                  </label>
                  <Input
                    type="time"
                    value={shift1In}
                    onChange={(e) => setShift1In(e.target.value)}
                    className="h-9 text-xs bg-slate-50/50 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Jam Pulang
                  </label>
                  <Input
                    type="time"
                    value={shift1Out}
                    onChange={(e) => setShift1Out(e.target.value)}
                    className="h-9 text-xs bg-slate-50/50 font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shift 2 (Malam) */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800">
                  Konfigurasi Shift Malam (20:00 - 05:00 WIB)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Jam Masuk
                  </label>
                  <Input
                    type="time"
                    value={shift2In}
                    onChange={(e) => setShift2In(e.target.value)}
                    className="h-9 text-xs bg-slate-50/50 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Jam Pulang
                  </label>
                  <Input
                    type="time"
                    value={shift2Out}
                    onChange={(e) => setShift2Out(e.target.value)}
                    className="h-9 text-xs bg-slate-50/50 font-mono"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-slate-400 italic">
              * Format waktu 24-jam (JJ:MM). Perubahan langsung aktif dan tercatat pada matriks roster mingguan.
            </p>
            <Button
              type="submit"
              size="sm"
              className="text-xs font-semibold gap-1.5 cursor-pointer bg-navy hover:bg-[#193750] text-white self-end sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Terapkan Perubahan Jadwal Manual</span>
            </Button>
          </div>
        </form>

        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Daftar Perubahan Jadwal Operasional Manual Aktif ({manualSchedules.length})
            </h5>
            <span className="text-[11px] text-slate-400">
              Otomatis disinkronkan ke Matriks Roster Mingguan
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 border-b border-slate-200">
                  <TableHead className="w-12 text-center text-xs font-semibold text-slate-600">No</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 min-w-[130px]">Tanggal Mulai Shift</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 min-w-[140px]">Grup Yang Bekerja</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 min-w-[170px]">Jam Shift 1 (Pagi)</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 min-w-[170px]">Jam Shift 2 (Malam)</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 min-w-[200px]">Alasan Perubahan</TableHead>
                  <TableHead className="text-center text-xs font-semibold text-slate-600 w-24">Status</TableHead>
                  <TableHead className="text-right pr-4 text-xs font-semibold text-slate-600 w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manualSchedules.length === 0 ? (
                  <TableEmpty colSpan={8}>
                    Belum ada jadwal operasional manual aktif. Jadwal berjalan sesuai pola rotasi permanen normal.
                  </TableEmpty>
                ) : (
                  manualSchedules.map((item, idx) => (
                    <TableRow key={item.id} className="text-xs hover:bg-slate-50/70">
                      <TableCell className="text-center font-medium text-slate-500">{idx + 1}</TableCell>
                      <TableCell className="font-bold text-navy">
                        {formatDateDMY(item.startDateFormatted || item.startDate)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            item.targetGroup === 'Grup A'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                              : item.targetGroup === 'Grup B'
                              ? 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                              : 'bg-purple-50 text-purple-800 border-purple-200 font-bold'
                          }
                        >
                          {item.targetGroup}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-slate-700 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-emerald-600" />
                          {item.shift1In} - {item.shift1Out} WIB
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-slate-700 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <Moon className="w-3.5 h-3.5 text-indigo-600" />
                          {item.shift2In} - {item.shift2Out} WIB
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600 max-w-xs truncate">{item.reason}</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                          <CheckCircle2 className="w-3 h-3 mr-1 inline text-emerald-600" />
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteManualSchedule && onDeleteManualSchedule(item.id)}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Hapus Jadwal Manual"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
