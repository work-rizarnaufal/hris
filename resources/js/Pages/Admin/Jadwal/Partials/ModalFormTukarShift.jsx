import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeftRight,
  Calendar,
  User,
  Clock,
  FileText,
  CheckCircle2,
  MapPin,
  Save,
  AlertCircle,
  Building,
  RotateCw,
} from 'lucide-react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@/components/ui';
import { getShiftSettings } from '@/services/systemSettings.js';

export function getDynamicShift12HOptions() {
  const shifts = getShiftSettings();
  return [
    {
      value: `Shift Pagi (${shifts.shiftPagiIn} - ${shifts.shiftPagiOut})`,
      label: `${shifts.shiftPagiName} (${shifts.shiftPagiIn} - ${shifts.shiftPagiOut} WIB)`,
      time: `${shifts.shiftPagiIn} - ${shifts.shiftPagiOut}`,
      type: 'Pagi',
    },
    {
      value: `Shift Malam (${shifts.shiftMalamIn} - ${shifts.shiftMalamOut})`,
      label: `${shifts.shiftMalamName} (${shifts.shiftMalamIn} - ${shifts.shiftMalamOut} WIB)`,
      time: `${shifts.shiftMalamIn} - ${shifts.shiftMalamOut}`,
      type: 'Malam',
    },
    {
      value: 'Off Pasca-Dinas',
      label: 'Off Pasca-Dinas (Libur Rotasi)',
      time: 'Off',
      type: 'Off',
    },
    {
      value: 'Penugasan Khusus Operasional',
      label: 'Penugasan Khusus / Lembur Operasional',
      time: 'Fleksibel',
      type: 'Khusus',
    },
  ];
}

export const SHIFT_12H_OPTIONS = [
  {
    value: 'Shift Pagi (08:00 - 17:00)',
    label: 'Shift Pagi: 9 Jam (08:00 - 17:00 WIB)',
    time: '08:00 - 17:00',
    type: 'Pagi',
  },
  {
    value: 'Shift Malam (20:00 - 05:00)',
    label: 'Shift Malam: 9 Jam (20:00 - 05:00 WIB)',
    time: '20:00 - 05:00',
    type: 'Malam',
  },
  {
    value: 'Off Pasca-Dinas',
    label: 'Off Pasca-Dinas (Libur Rotasi)',
    time: 'Off',
    type: 'Off',
  },
  {
    value: 'Penugasan Khusus Operasional',
    label: 'Penugasan Khusus / Lembur Operasional',
    time: 'Fleksibel',
    type: 'Khusus',
  },
];

export default function ModalFormTukarShift({
  isOpen,
  onClose,
  onSave,
  employees = [],
  initialData = null,
}) {
  const isEditing = Boolean(initialData?.id);
  const shiftOptions = useMemo(() => getDynamicShift12HOptions(), [isOpen]);

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
    targetShift: shiftOptions[0].value,
    reason: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        type: initialData.type || 'swap',
        employeeId: initialData.employeeId || employees[0]?.id || 1,
        targetEmployeeId: initialData.targetEmployeeId || employees[1]?.id || 2,
        date: initialData.date || new Date().toISOString().slice(0, 10),
        targetShift: initialData.targetShift || shiftOptions[0].value,
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
        targetShift: shiftOptions[0].value,
        reason: '',
      });
    }
    setErrors({});
  }, [isOpen, initialData, employees, shiftOptions]);

  const sourceEmp = useMemo(
    () => employees.find((e) => e.id === Number(formData.employeeId)),
    [employees, formData.employeeId]
  );

  const targetEmp = useMemo(
    () => employees.find((e) => e.id === Number(formData.targetEmployeeId)),
    [employees, formData.targetEmployeeId]
  );

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Tanggal efektif penugasan wajib ditentukan.';
    if (!formData.reason.trim()) newErrors.reason = 'Alasan / keterangan operasional wajib diisi.';
    if (formData.type === 'swap' && Number(formData.employeeId) === Number(formData.targetEmployeeId)) {
      newErrors.targetEmployeeId = 'Karyawan rekan pengganti tidak boleh sama dengan pemohon.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      id: initialData?.id || Date.now(),
      employeeId: Number(formData.employeeId),
      targetEmployeeId: Number(formData.targetEmployeeId),
      employeeName: sourceEmp?.name || 'Karyawan',
      employeeNip: sourceEmp?.nip || '-',
      employeeDivision: sourceEmp?.division || '-',
      employeeLocation: sourceEmp?.location || 'Lokasi Mariuk',
      employeeGroup: sourceEmp?.group || 'Grup A',
      sourceShift: sourceEmp?.baseShift || sourceEmp?.scheduleCategory || 'Shift Pagi (08:00 - 17:00)',
      targetEmployeeName: formData.type === 'swap' ? targetEmp?.name || '-' : '-',
      targetEmployeeNip: formData.type === 'swap' ? targetEmp?.nip || '-' : '-',
      targetEmployeeLocation: formData.type === 'swap' ? targetEmp?.location || '-' : '-',
      targetEmployeeGroup: formData.type === 'swap' ? targetEmp?.group || '-' : '-',
      status: 'Disetujui HCGA',
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <ModalHeader
          icon={<ArrowLeftRight className="w-5 h-5 text-[#c4a266]" />}
          title={isEditing ? 'Ubah Pengaturan Tukar Shift' : 'Atur Pengecualian / Tukar Shift'}
          description="Konfigurasi pertukaran jadwal antar-personel atau penugasan shift khusus operasional 24/7."
          onClose={onClose}
        />

        <ModalBody className="space-y-4 p-6 overflow-y-auto no-scrollbar">
          {/* 1. Tipe Penugasan: Tukar Shift vs Pengecualian Mandiri */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Metode Pengaturan Jadwal
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'swap' })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  formData.type === 'swap'
                    ? 'border-navy bg-navy/5 text-navy font-bold ring-1 ring-navy'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="w-4 h-4 text-navy shrink-0" />
                    <span className="text-xs font-bold">Tukar Shift Antar-Rekan</span>
                  </div>
                  {formData.type === 'swap' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-navy shrink-0" />
                  )}
                </div>
                <p className="text-[11px] font-normal text-slate-500 leading-relaxed">
                  Karyawan A dan B saling bertukar giliran dinas pada hari yang sama.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'override' })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  formData.type === 'override'
                    ? 'border-navy bg-navy/5 text-navy font-bold ring-1 ring-navy'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-navy shrink-0" />
                    <span className="text-xs font-bold">Pengecualian Mandiri</span>
                  </div>
                  {formData.type === 'override' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-navy shrink-0" />
                  )}
                </div>
                <p className="text-[11px] font-normal text-slate-500 leading-relaxed">
                  Penugasan shift khusus untuk satu karyawan pada tanggal tertentu.
                </p>
              </button>
            </div>
          </div>

          {/* 2. Tanggal Efektif */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Tanggal Efektif Penugasan <span className="text-rose-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="h-9.5 text-xs bg-white border-slate-200"
            />
            {errors.date && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.date}</p>}
          </div>

          {/* 3. Karyawan Pemohon / Terjadwal */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Karyawan Pemohon <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: Number(e.target.value) })}
              className="w-full h-9.5 text-xs rounded-xl border border-slate-200 bg-white px-3 focus:border-navy focus:ring-1 focus:ring-navy transition-all cursor-pointer"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nip} — {emp.name} ({emp.location || 'Mariuk'} · {emp.group || 'Grup A'} · {emp.role})
                </option>
              ))}
            </select>

            {/* Source Employee Preview Card */}
            {sourceEmp && (
              <div className="mt-2 p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-navy text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {sourceEmp.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <strong className="text-navy block">{sourceEmp.name}</strong>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {sourceEmp.nip} · {sourceEmp.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    (sourceEmp.location || '').includes('Mariuk')
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                  }`}>
                    {sourceEmp.location || 'Mariuk'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 text-slate-600 font-medium">
                    {sourceEmp.group || 'Grup A'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 4. Rekan Pengganti (Swap) ATAU Shift Pengganti (Override) */}
          {formData.type === 'swap' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Rekan Pengganti (Tukar Shift) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  Sebaiknya di lokasi & divisi yang sama
                </span>
              </div>
              <select
                value={formData.targetEmployeeId}
                onChange={(e) => setFormData({ ...formData, targetEmployeeId: Number(e.target.value) })}
                className="w-full h-9.5 text-xs rounded-xl border border-slate-200 bg-white px-3 focus:border-navy focus:ring-1 focus:ring-navy transition-all cursor-pointer"
              >
                {employees
                  .filter((e) => e.id !== Number(formData.employeeId))
                  .map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nip} — {emp.name} ({emp.location || 'Mariuk'} · {emp.group || 'Grup B'} · {emp.role})
                    </option>
                  ))}
              </select>
              {errors.targetEmployeeId && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.targetEmployeeId}</p>
              )}

              {/* Target Employee Preview Card */}
              {targetEmp && (
                <div className="mt-2 p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#c4a266] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {targetEmp.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <strong className="text-navy block">{targetEmp.name}</strong>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {targetEmp.nip} · {targetEmp.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      (targetEmp.location || '').includes('Mariuk')
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                    }`}>
                      {targetEmp.location || 'Mariuk'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 text-slate-600 font-medium">
                      {targetEmp.group || 'Grup B'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Shift Pengganti yang Diberikan <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.targetShift}
                onChange={(e) => setFormData({ ...formData, targetShift: e.target.value })}
                className="w-full h-9.5 text-xs rounded-xl border border-slate-200 bg-white px-3 focus:border-navy focus:ring-1 focus:ring-navy transition-all cursor-pointer"
              >
                {shiftOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 5. Alasan Operasional */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Alasan Pengajuan / Rekomendasi Supervisor <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={2}
              placeholder="Contoh: Keperluan keluarga darurat, telah berkoordinasi dengan rekan kerja dan disetujui Danru..."
              className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy resize-none"
            />
            {errors.reason && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.reason}</p>}
          </div>

          {/* Banner Integrasi Otomatis */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Perubahan jadwal ini akan langsung disinkronkan ke <strong>Tabel Presensi Harian</strong> sehingga jam toleransi keterlambatan menyesuaikan shift baru.
            </p>
          </div>
        </ModalBody>

        <ModalFooter className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={onClose} className="text-xs">
            Batal
          </Button>
          <Button
            type="submit"
            variant="default"
            className="gap-2 bg-navy hover:bg-navy/90 text-white text-xs font-semibold"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Simpan Perubahan Jadwal' : 'Terapkan Penugasan Jadwal'}</span>
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
