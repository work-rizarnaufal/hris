import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  CalendarCheck,
  Save,
  AlertCircle,
  MapPin,
  Lock,
  Building,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@/components/ui';
import { getShiftSettings, getAttendanceSettings } from '@/services/systemSettings.js';

const STATUS_OPTIONS = [
  { value: 'Hadir', label: 'Hadir (Tepat Waktu)' },
  { value: 'Terlambat', label: 'Terlambat' },
  { value: 'Izin', label: 'Izin Resmi' },
  { value: 'Sakit', label: 'Sakit (Surat Dokter)' },
  { value: 'Cuti', label: 'Cuti Tahunan / Bersama' },
  { value: 'Alpha', label: 'Alpha (Mangkir)' },
];

export function getDynamicShiftOptions() {
  const shifts = getShiftSettings();
  return [
    {
      value: `Shift Pagi (${shifts.shiftPagiIn} - ${shifts.shiftPagiOut})`,
      label: `${shifts.shiftPagiName}: 12 Jam (${shifts.shiftPagiIn} - ${shifts.shiftPagiOut})`,
      startTime: shifts.shiftPagiIn,
      endTime: shifts.shiftPagiOut,
      type: 'Pagi',
    },
    {
      value: `Shift Malam (${shifts.shiftMalamIn} - ${shifts.shiftMalamOut})`,
      label: `${shifts.shiftMalamName}: 12 Jam (${shifts.shiftMalamIn} - ${shifts.shiftMalamOut})`,
      startTime: shifts.shiftMalamIn,
      endTime: shifts.shiftMalamOut,
      type: 'Malam',
    },
  ];
}

export const SHIFT_OPTIONS = [
  {
    value: 'Shift Pagi (07:00 - 19:00)',
    label: 'Shift Pagi: 12 Jam (07:00 - 19:00)',
    startTime: '07:00',
    endTime: '19:00',
    type: 'Pagi',
  },
  {
    value: 'Shift Malam (19:00 - 07:00)',
    label: 'Shift Malam: 12 Jam (19:00 - 07:00)',
    startTime: '19:00',
    endTime: '07:00',
    type: 'Malam',
  },
];

export function resolveShiftConfig(shiftStr) {
  const options = getDynamicShiftOptions();
  if (!shiftStr) return options[0];
  const s = String(shiftStr).toLowerCase();
  if (s.includes('malam') || s.includes(options[1].startTime) || s.includes('19:00')) {
    return options[1];
  }
  return options[0];
}

const isValidTime = (val) => Boolean(val && /^\d{2}:\d{2}$/.test(val));

export function calculateTardiness(checkInTime, shiftStr) {
  if (!checkInTime || !isValidTime(checkInTime)) return null;

  const [inH, inM] = checkInTime.split(':').map(Number);
  const checkInMinute = inH * 60 + inM;

  const shiftConfig = resolveShiftConfig(shiftStr);
  const [startH, startM] = shiftConfig.startTime.split(':').map(Number);
  const shiftStartMinute = startH * 60 + startM;

  const attendanceSettings = getAttendanceSettings();
  const tolerance = attendanceSettings.lateToleranceMinutes || 0;

  let diff = 0;

  if (shiftConfig.type === 'Malam') {
    // Shift Malam starts at 19:00 (1140 min).
    // If checking in past midnight (e.g., 00:00 - 06:59), add 24 hours (1440 min).
    if (checkInMinute < 12 * 60) {
      const adjustedMinute = checkInMinute + 24 * 60;
      diff = adjustedMinute - shiftStartMinute;
    } else {
      diff = checkInMinute - shiftStartMinute;
    }
  } else {
    // Shift Pagi starts at 07:00 (420 min).
    diff = checkInMinute - shiftStartMinute;
  }

  // Jika keterlambatan melampaui toleransi yang ditentukan di Pengaturan
  if (diff > tolerance) {
    return {
      isLate: true,
      minutes: diff,
      text: `Terlambat ${diff} menit dari jam masuk (${shiftConfig.startTime} WIB, batas toleransi: ${tolerance} mnt)`,
    };
  }

  // Jika lewat jam masuk tapi masih dalam rentang toleransi / grace period
  if (diff > 0 && diff <= tolerance) {
    return {
      isLate: false,
      minutes: diff,
      inGracePeriod: true,
      text: `Tepat Waktu (Dalam batas masa tenggang toleransi ${diff}/${tolerance} menit)`,
    };
  }

  if (diff < 0) {
    const early = Math.abs(diff);
    return {
      isLate: false,
      minutes: 0,
      earlyMinutes: early,
      text: `Tepat Waktu (Hadir ${early} menit lebih awal dari ${shiftConfig.startTime} WIB)`,
    };
  }

  return {
    isLate: false,
    minutes: 0,
    text: `Tepat Waktu (Pukul ${shiftConfig.startTime} WIB)`,
  };
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
  const currentShiftOptions = useMemo(() => getDynamicShiftOptions(), [isOpen]);

  const [formData, setFormData] = useState({
    employeeId: '',
    date: currentDate,
    shift: currentShiftOptions[0].value,
    status: 'Hadir',
    checkIn: currentShiftOptions[0].startTime,
    checkOut: currentShiftOptions[0].endTime,
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const shiftConfig = resolveShiftConfig(initialData.shift);
      const isPresent = initialData.status === 'Hadir' || initialData.status === 'Terlambat';

      setFormData({
        id: initialData.id,
        employeeId: initialData.employeeId || '',
        date: initialData.date || currentDate,
        shift: shiftConfig.value,
        status: initialData.status || 'Hadir',
        checkIn: isPresent && isValidTime(initialData.checkIn)
          ? initialData.checkIn
          : isPresent
          ? shiftConfig.startTime
          : '',
        checkOut: isPresent && isValidTime(initialData.checkOut)
          ? initialData.checkOut
          : isPresent
          ? shiftConfig.endTime
          : '',
        notes: initialData.notes && initialData.notes !== '-' ? initialData.notes : '',
      });
    } else {
      const defaultEmp = employees[0];
      const shiftConfig = resolveShiftConfig(defaultEmp?.scheduleCategory);

      setFormData({
        employeeId: defaultEmp?.id || '',
        date: currentDate,
        shift: shiftConfig.value,
        status: 'Hadir',
        checkIn: defaultEmp?.checkInTime || shiftConfig.startTime,
        checkOut: defaultEmp?.checkOutTime || shiftConfig.endTime,
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen, currentDate, employees]);

  const isPresentType = formData.status === 'Hadir' || formData.status === 'Terlambat';

  // Live calculation of tardiness
  const tardinessInfo = useMemo(() => {
    if (!isPresentType || !formData.checkIn) return null;
    return calculateTardiness(formData.checkIn, formData.shift);
  }, [formData.checkIn, formData.shift, isPresentType]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Jika shift diubah, sesuaikan default jam masuk & pulang jika tipe hadir
      if (field === 'shift') {
        const newShiftConfig = resolveShiftConfig(value);
        if (isPresentType) {
          if (!isValidTime(updated.checkIn)) {
            updated.checkIn = newShiftConfig.startTime;
          }
          updated.checkOut = newShiftConfig.endTime;
        }
      }

      // Auto update status Hadir vs Terlambat jika waktu checkIn diubah
      if (field === 'checkIn' && isPresentType && isValidTime(value)) {
        const tardy = calculateTardiness(value, updated.shift);
        if (tardy) {
          updated.status = tardy.isLate ? 'Terlambat' : 'Hadir';
        }
      }

      // Jika employee dipilih (mode tambah), sesuaikan data shift defaultnya
      if (field === 'employeeId') {
        const emp = employees.find((e) => e.id === Number(value));
        if (emp) {
          const empShift = resolveShiftConfig(emp.scheduleCategory);
          updated.shift = empShift.value;
          updated.checkIn = emp.checkInTime || empShift.startTime;
          updated.checkOut = emp.checkOutTime || empShift.endTime;
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
      const shiftConfig = resolveShiftConfig(prev.shift);

      return {
        ...prev,
        status: newStatus,
        checkIn: isNowPresent
          ? isValidTime(prev.checkIn)
            ? prev.checkIn
            : shiftConfig.startTime
          : '',
        checkOut: isNowPresent
          ? isValidTime(prev.checkOut)
            ? prev.checkOut
            : shiftConfig.endTime
          : '',
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.employeeId) newErrors.employeeId = 'Pilih karyawan.';
    if (!formData.date) newErrors.date = 'Pilih tanggal presensi.';
    if (isPresentType && (!formData.checkIn || !isValidTime(formData.checkIn))) {
      newErrors.checkIn = 'Jam masuk wajib diisi dengan format valid (HH:MM).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedEmp = employees.find((e) => e.id === Number(formData.employeeId));
    const finalLocation = initialData?.location || selectedEmp?.location || 'Lokasi Mariuk';
    const finalGroup = initialData?.group || selectedEmp?.group || 'Grup A';

    onSave({
      id: formData.id || Date.now(),
      employeeId: Number(formData.employeeId),
      employeeName: selectedEmp?.name || initialData?.employeeName || 'Karyawan',
      nip: selectedEmp?.nip || initialData?.nip || '-',
      division: selectedEmp?.division || initialData?.division || '-',
      role: selectedEmp?.role || initialData?.role || '-',
      location: finalLocation,
      group: finalGroup,
      date: formData.date,
      shift: formData.shift,
      status: formData.status,
      checkIn: isPresentType && isValidTime(formData.checkIn) ? formData.checkIn : '-',
      checkOut: isPresentType && isValidTime(formData.checkOut) ? formData.checkOut : '-',
      lateMinutes: tardinessInfo?.isLate ? tardinessInfo.minutes : 0,
      deviation: isPresentType
        ? (tardinessInfo?.isLate ? `+${tardinessInfo.minutes}m` : 'Tepat Waktu')
        : '-',
      notes: formData.notes.trim() || '-',
    });

    onClose();
  };

  const selectedEmp = employees.find((e) => e.id === Number(formData.employeeId));
  const currentEmpName = initialData?.employeeName || selectedEmp?.name || 'Karyawan';
  const currentEmpNip = initialData?.nip || selectedEmp?.nip || '-';
  const currentEmpRole = initialData?.role || selectedEmp?.role || '-';
  const currentEmpDivision = initialData?.division || selectedEmp?.division || '-';
  const currentEmpLocation = initialData?.location || selectedEmp?.location || 'Lokasi Mariuk';
  const currentEmpGroup = initialData?.group || selectedEmp?.group || 'Grup A';

  const isMariuk = currentEmpLocation.includes('Mariuk');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit}>
        <ModalHeader
          title={isEditing ? 'Ubah Catatan Presensi' : 'Catat Presensi Karyawan'}
          description={
            isEditing
              ? `Perbarui detail presensi & jam kerja untuk ${currentEmpName}.`
              : 'Tambahkan catatan kehadiran individual karyawan ke dalam sistem operasional 24/7.'
          }
          icon={<CalendarCheck className="w-5 h-5 text-[#c4a266]" />}
          onClose={onClose}
        />

        <ModalBody className="space-y-4">
          {/* 1. Informasi Karyawan */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Karyawan Operasional <span className="text-rose-500">*</span>
              </label>
              {isEditing && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Identitas Terkunci
                </span>
              )}
            </div>

            {isEditing ? (
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    {currentEmpName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-navy">
                      {currentEmpName}
                    </strong>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-mono font-medium text-slate-600">{currentEmpNip}</span>
                      <span>•</span>
                      <span>{currentEmpRole}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      isMariuk
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : 'bg-indigo-50 text-indigo-900 border-indigo-200'
                    }`}
                  >
                    <MapPin className="w-3 h-3 shrink-0" />
                    {currentEmpLocation}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200">
                    {currentEmpGroup}
                  </span>
                  <span className="text-xs text-slate-500 hidden md:inline-block">
                    {currentEmpDivision}
                  </span>
                </div>
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
                    {emp.nip} — {emp.name} ({emp.location} · {emp.division})
                  </option>
                ))}
              </select>
            )}
            {errors.employeeId && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.employeeId}</p>
            )}
          </div>

          {/* 2. Tanggal Presensi & Shift 12 Jam */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tanggal Operasional <span className="text-rose-500">*</span>
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
                Jadwal / Shift 12 Jam
              </label>
              <select
                value={formData.shift}
                onChange={(e) => handleChange('shift', e.target.value)}
                className="w-full text-xs rounded-xl border-slate-200 bg-white px-3 py-2.5 focus:border-navy focus:ring-navy transition-all"
              >
                {currentShiftOptions.map((opt) => (
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
                    className={`py-2 px-3 text-xs rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-navy bg-navy/5 text-navy font-bold ring-1 ring-navy'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span>{st.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-navy shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Jam Masuk & Jam Pulang (hanya bila Hadir/Terlambat) */}
          {isPresentType ? (
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-3">
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
                  className={`text-xs p-3 rounded-lg flex items-center gap-2.5 transition-all ${
                    tardinessInfo.isLate
                      ? 'bg-amber-50 text-amber-900 border border-amber-200/80'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200/80'
                  }`}
                >
                  <Clock className={`w-4 h-4 shrink-0 ${tardinessInfo.isLate ? 'text-amber-700' : 'text-emerald-700'}`} />
                  <span className="font-semibold">{tardinessInfo.text}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Status <strong>{formData.status}</strong> tidak memerlukan pencatatan jam masuk & jam pulang.
              </span>
            </div>
          )}

          {/* 5. Catatan / Alasan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Keterangan / Alasan Operasional (Opsional)
            </label>
            <Input
              type="text"
              placeholder="Contoh: Shift pagi berjalan normal / Izin keperluan mendesak / Surat dokter terlampir"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="default" className="gap-2 bg-navy hover:bg-navy/90 text-white">
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Simpan Perubahan' : 'Simpan Presensi'}</span>
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
