import React, { useState, useEffect } from 'react';
import { Clock, CalendarCheck, Save, AlertCircle } from 'lucide-react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@/components/ui';

const STATUS_OPTIONS = [
  { value: 'Hadir', label: 'Hadir (Tepat Waktu)' },
  { value: 'Terlambat', label: 'Terlambat' },
  { value: 'Izin', label: 'Izin Resmi' },
  { value: 'Sakit', label: 'Sakit (Surat Dokter)' },
  { value: 'Cuti', label: 'Cuti Tahunan / Bersama' },
  { value: 'Alpha', label: 'Alpha (Tanpa Keterangan)' },
];

const SHIFT_OPTIONS = [
  { value: 'Shift 1 (07:00 - 15:00)', label: 'Shift 1: Pagi (07:00 - 15:00)', startTime: '07:00', endTime: '15:00' },
  { value: 'Shift 2 (15:00 - 23:00)', label: 'Shift 2: Malam (15:00 - 23:00)', startTime: '15:00', endTime: '23:00' },
  { value: 'Normal Office (08:00 - 17:00)', label: 'Normal Office: Reguler (08:00 - 17:00)', startTime: '08:00', endTime: '17:00' },
];

function getStartMinute(shiftStr) {
  const matched = SHIFT_OPTIONS.find((s) => s.value === shiftStr);
  if (!matched) return 480;
  const [h, m] = matched.startTime.split(':').map(Number);
  return h * 60 + m;
}

export default function ModalFormPresensi({
  isOpen,
  onClose,
  onSave,
  initialData,
  employees = [],
  currentDate = '',
}) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    employeeId: '',
    date: currentDate,
    shift: SHIFT_OPTIONS[0].value,
    status: 'Hadir',
    checkIn: '07:00',
    checkOut: '15:00',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        employeeId: initialData.employeeId || '',
        date: initialData.date || currentDate,
        shift: initialData.shift || SHIFT_OPTIONS[0].value,
        status: initialData.status || 'Hadir',
        checkIn: initialData.checkIn || '',
        checkOut: initialData.checkOut || '',
        notes: initialData.notes || '',
      });
    } else {
      const defaultEmp = employees[0];
      setFormData({
        employeeId: defaultEmp?.id || '',
        date: currentDate,
        shift: defaultEmp?.scheduleCategory || SHIFT_OPTIONS[0].value,
        status: 'Hadir',
        checkIn: defaultEmp?.checkInTime || '07:00',
        checkOut: defaultEmp?.checkOutTime || '15:00',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen, currentDate, employees]);

  const isPresentType = formData.status === 'Hadir' || formData.status === 'Terlambat';

  // Live calculation of tardiness
  const tardinessInfo = React.useMemo(() => {
    if (!isPresentType || !formData.checkIn) return null;
    const [h, m] = formData.checkIn.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return null;

    const actualMinute = h * 60 + m;
    const startMinute = getStartMinute(formData.shift);
    const diff = actualMinute - startMinute;

    if (diff > 0) {
      return { isLate: true, minutes: diff, text: `Terlambat ${diff} menit dari jam shift` };
    }
    return { isLate: false, minutes: 0, text: 'Tepat Waktu (Sesuai Jadwal)' };
  }, [formData.checkIn, formData.shift, isPresentType]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto update status Hadir vs Terlambat jika waktu checkIn diubah
      if (field === 'checkIn' && isPresentType && value) {
        const [h, m] = value.split(':').map(Number);
        if (!isNaN(h) && !isNaN(m)) {
          const actualMinute = h * 60 + m;
          const startMinute = getStartMinute(updated.shift);
          updated.status = actualMinute > startMinute ? 'Terlambat' : 'Hadir';
        }
      }

      // Jika employee dipilih, sesuaikan shift defaultnya
      if (field === 'employeeId') {
        const emp = employees.find((e) => e.id === Number(value));
        if (emp) {
          if (emp.scheduleCategory) updated.shift = emp.scheduleCategory;
          if (emp.checkInTime) updated.checkIn = emp.checkInTime;
          if (emp.checkOutTime) updated.checkOut = emp.checkOutTime;
        }
      }

      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleStatusChange = (newStatus) => {
    setFormData((prev) => {
      const isNowPresent = newStatus === 'Hadir' || newStatus === 'Terlambat';
      return {
        ...prev,
        status: newStatus,
        checkIn: isNowPresent ? (prev.checkIn || '07:00') : '',
        checkOut: isNowPresent ? (prev.checkOut || '15:00') : '',
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.employeeId) newErrors.employeeId = 'Pilih karyawan.';
    if (!formData.date) newErrors.date = 'Pilih tanggal presensi.';
    if (isPresentType && !formData.checkIn) {
      newErrors.checkIn = 'Jam masuk wajib diisi untuk status kehadiran.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedEmp = employees.find((e) => e.id === Number(formData.employeeId));

    onSave({
      id: formData.id || Date.now(),
      employeeId: Number(formData.employeeId),
      employeeName: selectedEmp?.name || initialData?.employeeName || 'Karyawan',
      nip: selectedEmp?.nip || initialData?.nip || '-',
      division: selectedEmp?.division || initialData?.division || '-',
      role: selectedEmp?.role || initialData?.role || '-',
      date: formData.date,
      shift: formData.shift,
      status: formData.status,
      checkIn: isPresentType ? formData.checkIn : '-',
      checkOut: isPresentType ? (formData.checkOut || '-') : '-',
      lateMinutes: tardinessInfo?.isLate ? tardinessInfo.minutes : 0,
      deviation: isPresentType
        ? (tardinessInfo?.isLate ? `+${tardinessInfo.minutes}m` : 'Tepat Waktu')
        : '-',
      notes: formData.notes.trim() || '-',
    });

    onClose();
  };

  const selectedEmp = employees.find((e) => e.id === Number(formData.employeeId));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit}>
        <ModalHeader
          title={isEditing ? 'Ubah Catatan Presensi' : 'Catat Presensi Karyawan'}
          description={
            isEditing
              ? `Perbarui detail presensi untuk ${formData.employeeName || selectedEmp?.name || 'karyawan'}.`
              : 'Tambahkan catatan kehadiran individual karyawan ke dalam sistem operasional.'
          }
          icon={<CalendarCheck className="w-5 h-5 text-[#c4a266]" />}
          onClose={onClose}
        />

        <ModalBody className="space-y-4">
          {/* 1. Pemilihan Karyawan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Karyawan <span className="text-rose-500">*</span>
            </label>
            {isEditing ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="block text-sm text-navy">{initialData?.employeeName}</strong>
                  <span className="text-xs text-slate-500">{initialData?.nip} · {initialData?.role}</span>
                </div>
                <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  {initialData?.division}
                </span>
              </div>
            ) : (
              <select
                value={formData.employeeId}
                onChange={(e) => handleChange('employeeId', e.target.value)}
                className="w-full text-xs rounded-xl border-slate-200 bg-white px-3 py-2.5 focus:border-navy focus:ring-navy transition-all"
              >
                <option value="">-- Pilih Karyawan --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nip} — {emp.name} ({emp.division})
                  </option>
                ))}
              </select>
            )}
            {errors.employeeId && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.employeeId}</p>
            )}
          </div>

          {/* 2. Tanggal Presensi & Shift */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tanggal Kerja <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
              {errors.date && <p className="text-[11px] text-rose-500 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jadwal / Shift Terjadwal
              </label>
              <select
                value={formData.shift}
                onChange={(e) => handleChange('shift', e.target.value)}
                className="w-full text-xs rounded-xl border-slate-200 bg-white px-3 py-2.5 focus:border-navy focus:ring-navy transition-all"
              >
                {SHIFT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Status Kehadiran */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Status Kehadiran <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((st) => {
                const isSelected = formData.status === st.value;
                return (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => handleStatusChange(st.value)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-navy bg-navy/5 text-navy font-semibold ring-1 ring-navy'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Jam Masuk & Jam Pulang (hanya bila Hadir/Terlambat) */}
          {isPresentType && (
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Jam Masuk (Check-In) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="time"
                    value={formData.checkIn}
                    onChange={(e) => handleChange('checkIn', e.target.value)}
                  />
                  {errors.checkIn && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.checkIn}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Jam Pulang (Check-Out)
                  </label>
                  <Input
                    type="time"
                    value={formData.checkOut}
                    onChange={(e) => handleChange('checkOut', e.target.value)}
                  />
                </div>
              </div>

              {/* Status Deviasi Realtime Preview */}
              {tardinessInfo && (
                <div
                  className={`text-xs p-2.5 rounded-lg flex items-center gap-2 ${
                    tardinessInfo.isLate
                      ? 'bg-amber-50 text-amber-900 border border-amber-200/60'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200/60'
                  }`}
                >
                  <Clock className="w-4 h-4 shrink-0" />
                  <span className="font-medium">
                    {tardinessInfo.text}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 5. Catatan / Alasan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Keterangan / Alasan (Opsional)
            </label>
            <Input
              type="text"
              placeholder="Contoh: Surat dokter terlampir / Izin keluarga / Kendala operasional"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="default" className="gap-2">
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Simpan Perubahan' : 'Simpan Presensi'}</span>
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

