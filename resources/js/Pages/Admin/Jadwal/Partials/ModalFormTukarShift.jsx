import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Calendar, User, Clock, FileText, CheckCircle2 } from 'lucide-react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@/components/ui';

const SHIFT_OPTIONS = [
  { value: 'Shift 1 (07:00 - 15:00)', label: 'Shift 1 (Pagi: 07:00 - 15:00)' },
  { value: 'Shift 2 (15:00 - 23:00)', label: 'Shift 2 (Malam: 15:00 - 23:00)' },
  { value: 'Normal Office (08:00 - 17:00)', label: 'Normal Office (08:00 - 17:00)' },
  { value: 'Libur (OFF)', label: 'Libur (OFF / Tukar Hari Off)' },
];

export default function ModalFormTukarShift({
  isOpen,
  onClose,
  onSave,
  employees = [],
  initialData = null,
}) {
  const [formData, setFormData] = useState({
    type: 'swap', // 'swap' | 'override'
    employeeId: employees[0]?.id || 1,
    targetEmployeeId: employees[1]?.id || 2,
    date: new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date()),
    targetShift: 'Shift 2 (15:00 - 23:00)',
    reason: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'swap',
        employeeId: initialData.employeeId || employees[0]?.id || 1,
        targetEmployeeId: initialData.targetEmployeeId || employees[1]?.id || 2,
        date: initialData.date || new Date().toISOString().slice(0, 10),
        targetShift: initialData.targetShift || 'Shift 2 (15:00 - 23:00)',
        reason: initialData.reason || '',
      });
    } else {
      setFormData({
        type: 'swap',
        employeeId: employees[0]?.id || 1,
        targetEmployeeId: employees[1]?.id || 2,
        date: new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Jakarta',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(new Date()),
        targetShift: 'Shift 2 (15:00 - 23:00)',
        reason: '',
      });
    }
    setErrors({});
  }, [isOpen, initialData, employees]);

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Tanggal wajib diisi';
    if (!formData.reason.trim()) newErrors.reason = 'Alasan / keterangan wajib diisi';
    if (formData.type === 'swap' && formData.employeeId === formData.targetEmployeeId) {
      newErrors.targetEmployeeId = 'Karyawan pengganti tidak boleh sama dengan pemohon';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const sourceEmp = employees.find((e) => e.id === Number(formData.employeeId));
    const targetEmp = employees.find((e) => e.id === Number(formData.targetEmployeeId));

    onSave({
      ...formData,
      employeeId: Number(formData.employeeId),
      targetEmployeeId: Number(formData.targetEmployeeId),
      employeeName: sourceEmp?.name || '',
      employeeNip: sourceEmp?.nip || '',
      employeeDivision: sourceEmp?.division || '',
      sourceShift: sourceEmp?.baseShift || 'Shift 1 (07:00 - 15:00)',
      targetEmployeeName: formData.type === 'swap' ? targetEmp?.name || '' : '-',
      targetEmployeeNip: formData.type === 'swap' ? targetEmp?.nip || '' : '-',
      status: 'Disetujui HCGA',
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit}>
        <ModalHeader
          icon={<ArrowLeftRight className="w-5 h-5" />}
          title="Atur Pengecualian / Tukar Shift"
          description="Konfigurasi pertukaran jadwal antar-rekan kerja atau penugasan shift khusus operasional."
          onClose={onClose}
        />

        <ModalBody className="space-y-4">
          {/* Tipe Penugasan: Tukar Shift vs Pengecualian Mandiri */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Jenis Pengaturan Jadwal
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'swap' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  formData.type === 'swap'
                    ? 'border-navy bg-navy/5 text-navy font-bold ring-1 ring-navy'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-navy" />
                  <span className="text-xs">Tukar Shift Antar-Karyawan</span>
                </div>
                <p className="text-[11px] font-normal text-slate-500 mt-1">
                  Karyawan A bertukar jadwal dengan Karyawan B pada hari yang sama.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'override' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  formData.type === 'override'
                    ? 'border-navy bg-navy/5 text-navy font-bold ring-1 ring-navy'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-navy" />
                  <span className="text-xs">Pengecualian Shift Mandiri</span>
                </div>
                <p className="text-[11px] font-normal text-slate-500 mt-1">
                  Penggantian jam kerja satu karyawan khusus pada tanggal tertentu.
                </p>
              </button>
            </div>
          </div>

          {/* Tanggal Efektif */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Tanggal Efektif <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              />
            </div>
            {errors.date && <p className="text-[11px] text-rose-500 mt-1">{errors.date}</p>}
          </div>

          {/* Karyawan Pemohon */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Karyawan Pemohon / Terjadwal <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: Number(e.target.value) })}
                className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy cursor-pointer"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nip} - {emp.name} ({emp.division} • {emp.group})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Kolom Khusus Tukar Shift: Karyawan Pengganti */}
          {formData.type === 'swap' ? (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Karyawan Rekan Pengganti (Tukar) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={formData.targetEmployeeId}
                  onChange={(e) => setFormData({ ...formData, targetEmployeeId: Number(e.target.value) })}
                  className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy cursor-pointer"
                >
                  {employees
                    .filter((e) => e.id !== Number(formData.employeeId))
                    .map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.nip} - {emp.name} ({emp.division} • {emp.group})
                      </option>
                    ))}
                </select>
              </div>
              {errors.targetEmployeeId && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.targetEmployeeId}</p>
              )}
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Shift Pengganti / Khusus <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={formData.targetShift}
                  onChange={(e) => setFormData({ ...formData, targetShift: e.target.value })}
                  className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy cursor-pointer"
                >
                  {SHIFT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Alasan / Catatan Operasional */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Alasan Pengajuan / Catatan Operasional <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={2}
                placeholder="Contoh: Keperluan keluarga darurat, telah berkoordinasi dan disetujui supervisor lapangan..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy resize-none"
              />
            </div>
            {errors.reason && <p className="text-[11px] text-rose-500 mt-1">{errors.reason}</p>}
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2 text-xs text-amber-900">
            <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              Perubahan jadwal ini akan secara otomatis terintegrasi ke <strong>Catatan Kehadiran Harian</strong> untuk toleransi check-in dan perhitungan keterlambatan.
            </span>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button size="sm" type="submit">
            Simpan Jadwal
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

