import React, { useState } from 'react';
import { Users, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@/components/ui';

const TARGET_OPTIONS = [
  { value: 'ALL', label: 'Seluruh Karyawan Terjadwal' },
  { value: 'Shift 1 (Pagi)', label: 'Shift 1: Pagi (07:00 - 15:00)' },
  { value: 'Shift 2 (Siang)', label: 'Shift 2: Siang (15:00 - 23:00)' },
  { value: 'Normal Office', label: 'Normal Office (08:00 - 17:00)' },
];

export default function ModalPresensiMassal({
  isOpen,
  onClose,
  onExecute,
  employees = [],
  currentDate = '',
  existingAttendances = [],
}) {
  const [targetGroup, setTargetGroup] = useState('ALL');
  const [date, setDate] = useState(currentDate);
  const [checkInTime, setCheckInTime] = useState('07:00');
  const [onlyUnrecorded, setOnlyUnrecorded] = useState(true);

  // Filter affected employees
  const targetEmployees = React.useMemo(() => {
    return employees.filter((emp) => {
      if (emp.status === 'Non-Aktif') return false;
      if (targetGroup !== 'ALL' && emp.scheduleCategory !== targetGroup) return false;

      if (onlyUnrecorded) {
        const hasRecord = existingAttendances.some(
          (a) => a.employeeId === emp.id && a.date === date
        );
        if (hasRecord) return false;
      }
      return true;
    });
  }, [employees, targetGroup, onlyUnrecorded, existingAttendances, date]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (targetEmployees.length === 0) return;

    onExecute({
      date,
      employees: targetEmployees,
      checkInTime,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={handleSubmit}>
        <ModalHeader
          title="Presensi Massal Cepat"
          description="Tandai kehadiran tepat waktu untuk banyak karyawan operasional sekaligus."
          icon={Users}
          onClose={onClose}
        />

        <ModalBody className="space-y-4">
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Fitur ini akan mencatat kehadiran status <strong>Hadir (Tepat Waktu)</strong> untuk seluruh karyawan yang terpilih pada tanggal yang ditentukan.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tanggal Presensi
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Kategori / Shift
            </label>
            <select
              value={targetGroup}
              onChange={(e) => setTargetGroup(e.target.value)}
              className="w-full text-xs rounded-xl border-slate-200 bg-white px-3 py-2.5 focus:border-navy focus:ring-navy transition-all"
            >
              {TARGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jam Masuk Default (Check-In)
            </label>
            <Input
              type="time"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={onlyUnrecorded}
              onChange={(e) => setOnlyUnrecorded(e.target.checked)}
              className="rounded border-slate-300 text-navy focus:ring-navy"
            />
            <span className="text-xs text-slate-700 select-none">
              Hanya karyawan yang <strong>belum memiliki catatan</strong> pada tanggal ini
            </span>
          </label>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-600">Estimasi Karyawan Terpilih:</span>
            <strong className="text-sm font-semibold text-navy">
              {targetEmployees.length} Karyawan
            </strong>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={targetEmployees.length === 0}
            className="gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Terapkan ({targetEmployees.length})</span>
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

