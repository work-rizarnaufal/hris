import React, { useState, useEffect, useMemo } from 'react';
import {
  UserPlus,
  Pencil,
  Save,
  MapPin,
  Clock,
  UserCheck,
  CalendarDays,
  CheckCircle2,
} from 'lucide-react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@/components/ui';
import { getLocations, getShiftSettings } from '@/services/systemSettings.js';

const DIVISIONS = [
  'Operasional & Lapangan',
  'Human Capital & GA',
  'Logistik & Gudang',
  'Security & Safety',
  'IT & Sistem Informasi',
  'Keuangan & Akuntansi',
];

const GROUPS = [
  { value: 'Belum Ditetapkan', label: 'Belum Ditetapkan', desc: 'Jadwal belum ditentukan' },
  { value: 'Grup A', label: 'Grup A', desc: 'Rotasi Sen, Rab, Jum, Min' },
  { value: 'Grup B', label: 'Grup B', desc: 'Rotasi Sel, Kam, Sab' },
  { value: 'Non-Shift', label: 'Non-Shift', desc: 'Reguler Senin - Jumat' },
];

export default function ModalFormKaryawan({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSubmitting = false,
}) {
  const isEditing = Boolean(initialData?.id);

  const availableLocations = useMemo(() => {
    const locs = getLocations();
    return locs.map((loc) => ({
      value: loc.name,
      label: loc.name,
      sublabel: loc.name.includes('Mariuk') ? 'Site Subang (Pabrik)' : 'Site Sumedang (Pabrik)',
      badgeColor: loc.name.includes('Mariuk') ? 'amber' : loc.name.includes('Cimalaka') ? 'indigo' : 'slate',
    }));
  }, [isOpen]);

  const schedulePresets = useMemo(() => {
    const s = getShiftSettings();
    return [
      {
        shortName: 'Belum Ditetapkan',
        cat: 'Belum Ditetapkan',
        in: '',
        out: '',
        desc: 'Shift belum ditentukan',
      },
      {
        shortName: 'Shift Pagi',
        cat: 'Shift Pagi (08:00 - 17:00)',
        in: s.shiftPagiIn,
        out: s.shiftPagiOut,
        desc: 'Buka 07:00 · Tutup 18:00',
      },
      {
        shortName: 'Shift Malam',
        cat: 'Shift Malam (20:00 - 05:00)',
        in: s.shiftMalamIn,
        out: s.shiftMalamOut,
        desc: 'Buka 19:00 · Tutup 06:00 (+1)',
      },
      {
        shortName: 'Non-Shift Kantor',
        cat: 'Non-Shift Kantor (08:00 - 17:00)',
        in: '08:00',
        out: '17:00',
        desc: 'Staf kantor reguler',
      },
    ];
  }, [isOpen]);

  const defaultLoc = availableLocations[0]?.value || 'Lokasi Mariuk';

  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    biometricPin: '',
    role: '',
    division: '',
    location: defaultLoc,
    group: 'Belum Ditetapkan',
    scheduleCategory: 'Belum Ditetapkan',
    checkInTime: '',
    checkOutTime: '',
    status: 'Aktif',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const curLoc = availableLocations[0]?.value || 'Lokasi Mariuk';

    if (initialData) {
      setFormData({
        name: initialData.name || '',
        nip: initialData.nip || '',
        biometricPin: initialData.biometricPin || initialData.biometric_pin || '',
        role: initialData.role || '',
        division: (initialData.division && initialData.division !== '-') ? initialData.division : '',
        location: initialData.location || curLoc,
        group: initialData.group || initialData.shift_group || 'Belum Ditetapkan',
        scheduleCategory: (initialData.scheduleCategory && initialData.scheduleCategory !== '-') ? initialData.scheduleCategory : 'Belum Ditetapkan',
        checkInTime: (initialData.checkInTime && initialData.checkInTime !== '-') ? initialData.checkInTime : '',
        checkOutTime: (initialData.checkOutTime && initialData.checkOutTime !== '-') ? initialData.checkOutTime : '',
        status: initialData.status || 'Aktif',
      });
    } else {
      setFormData({
        name: '',
        nip: '',
        biometricPin: '',
        role: '',
        division: '',
        location: curLoc,
        group: 'Belum Ditetapkan',
        scheduleCategory: 'Belum Ditetapkan',
        checkInTime: '',
        checkOutTime: '',
        status: 'Aktif',
      });
    }
    setErrors({});
  }, [initialData, isOpen, availableLocations, schedulePresets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      scheduleCategory: preset.cat,
      checkInTime: preset.in,
      checkOutTime: preset.out,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nama lengkap karyawan wajib diisi.';
    if (!formData.role.trim()) newErrors.role = 'Jabatan / posisi kerja wajib diisi.';

    const isShiftActive = formData.scheduleCategory && formData.scheduleCategory !== 'Belum Ditetapkan' && formData.scheduleCategory !== '-';
    if (isShiftActive) {
      if (!formData.checkInTime) newErrors.checkInTime = 'Jam masuk kerja wajib diisi jika shift aktif.';
      if (!formData.checkOutTime) newErrors.checkOutTime = 'Jam pulang kerja wajib diisi jika shift aktif.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      id: initialData?.id,
    }, setErrors);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <ModalHeader
          icon={
            isEditing ? (
              <Pencil className="w-5 h-5 text-[#c4a266]" />
            ) : (
              <UserPlus className="w-5 h-5 text-[#c4a266]" />
            )
          }
          title={isEditing ? `Ubah Data Karyawan` : 'Tambah Karyawan Baru'}
          description={
            isEditing
              ? `${formData.name || 'Karyawan'} · ${formData.role || 'Staff'} (NIP: ${formData.nip || '-'})`
              : 'Daftarkan personel baru ke dalam sistem operasional (Mariuk & Cimalaka).'
          }
          onClose={onClose}
        />

        <ModalBody className="space-y-4 p-5 sm:p-6 overflow-y-auto no-scrollbar">
          {/* Bagian 1: Data Identitas & Jabatan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <UserCheck className="w-4 h-4 text-navy" />
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
                1. Data Karyawan & Posisi
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Karyawan <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={handleChange}
                  className={`h-9.5 text-xs bg-white ${
                    errors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:border-navy'
                  }`}
                />
                {errors.name && (
                  <span className="text-rose-600 text-[11px] mt-1 block font-medium">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Jabatan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan / Posisi Kerja <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  name="role"
                  placeholder="Contoh: Operator Mesin / Staf Logistik"
                  value={formData.role}
                  onChange={handleChange}
                  className={`h-9.5 text-xs bg-white ${
                    errors.role ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:border-navy'
                  }`}
                />
                {errors.role && (
                  <span className="text-rose-600 text-[11px] mt-1 block font-medium">
                    {errors.role}
                  </span>
                )}
              </div>

              {/* Divisi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Divisi / Departemen
                </label>
                <select
                  name="division"
                  value={formData.division || ''}
                  onChange={handleChange}
                  className="w-full h-9.5 text-xs rounded-xl border border-slate-200 bg-white px-3 focus:border-navy focus:ring-1 focus:ring-navy transition-all cursor-pointer"
                >
                  <option value="">Belum Ditetapkan (-)</option>
                  {DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Keaktifan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Keaktifan
                </label>
                <div className="grid grid-cols-3 gap-1.5 h-9.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80 items-center">
                  {[
                    { value: 'Aktif', label: 'Aktif' },
                    { value: 'Cuti', label: 'Cuti' },
                    { value: 'Non-Aktif', label: 'Non-Aktif' },
                  ].map((st) => {
                    const isSelected = formData.status === st.value;
                    return (
                      <button
                        key={st.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: st.value })}
                        className={`h-full text-xs rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'bg-white text-navy shadow-xs border border-slate-200/60 font-bold'
                            : 'text-slate-600 hover:text-navy hover:bg-white/50'
                        }`}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* NIP */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Nomor Induk Pegawai (NIP)
                  </label>
                  <span className="text-[10px] text-slate-400">Otomatis jika kosong</span>
                </div>
                <Input
                  type="text"
                  name="nip"
                  placeholder="Contoh: HC-0001 (Otomatis)"
                  value={formData.nip}
                  onChange={handleChange}
                  className={`h-9.5 text-xs font-mono bg-white ${
                    errors.nip ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:border-navy'
                  }`}
                />
                {errors.nip && (
                  <span className="text-rose-600 text-[11px] mt-1 block font-medium">
                    {errors.nip}
                  </span>
                )}
              </div>

              {/* ID Mesin Fingerprint (PIN) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    ID Mesin Fingerprint (PIN)
                  </label>
                  <span className="text-[10px] text-slate-400">Default angka NIP</span>
                </div>
                <Input
                  type="text"
                  name="biometricPin"
                  placeholder="Contoh: 101 (Nomor ID fisik mesin finger)"
                  value={formData.biometricPin}
                  onChange={handleChange}
                  className="h-9.5 text-xs font-mono bg-white border-slate-200 focus:border-navy"
                />
              </div>
            </div>
          </div>

          {/* Bagian 2: Penempatan & Jadwal Kerja */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <CalendarDays className="w-4 h-4 text-navy" />
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
                2. Penempatan & Jadwal Operasional
              </h3>
            </div>

            {/* Lokasi Site */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Lokasi Pabrik / Site Penempatan <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableLocations.map((loc) => {
                  const isSelected = formData.location === loc.value;
                  const isMariuk = loc.value.includes('Mariuk');
                  return (
                    <button
                      key={loc.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, location: loc.value })}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-navy bg-navy/5 text-navy font-bold ring-1 ring-navy shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isMariuk ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                        <div className="min-w-0">
                          <span className="text-xs font-bold block truncate">{loc.label}</span>
                          <span className="text-[10px] text-slate-400 font-normal block truncate">
                            {loc.sublabel}
                          </span>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-navy shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kelompok Roster */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kelompok Roster Operasional (24/7) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GROUPS.map((grp) => {
                  const isSelected = formData.group === grp.value;
                  return (
                    <button
                      key={grp.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, group: grp.value })}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[56px] ${
                        isSelected
                          ? 'border-navy bg-navy/5 text-navy font-bold ring-1 ring-navy shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold truncate">{grp.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-navy shrink-0 ml-1" />}
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal leading-tight block truncate mt-1">
                        {grp.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kategori Shift Presets */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Kategori Shift & Jam Kerja
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Aturan: Pagi 08-17, Malam 20-05</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {schedulePresets.map((preset) => {
                  const isCurrent = formData.scheduleCategory === preset.cat;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[62px] ${
                        isCurrent
                          ? 'border-navy bg-navy/5 text-navy font-bold ring-1 ring-navy shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold truncate">{preset.shortName}</span>
                          {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-navy shrink-0 ml-1" />}
                        </div>
                        <span className="text-[11px] font-mono mt-0.5 block font-semibold text-slate-700">
                          {preset.in && preset.out ? `${preset.in} - ${preset.out}` : 'Belum ditentukan'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal leading-tight block truncate mt-1">
                        {preset.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notice jika Belum Ditetapkan ATAU Input Jam Kerja jika Shift Aktif */}
            {formData.scheduleCategory === 'Belum Ditetapkan' ? (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs text-slate-600">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong>Shift Belum Ditetapkan:</strong> Jam masuk dan pulang dikosongkan. Admin dapat menentukan jadwal shift operasional sewaktu-waktu.
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Label Kategori Shift
                  </label>
                  <Input
                    type="text"
                    name="scheduleCategory"
                    value={formData.scheduleCategory}
                    onChange={handleChange}
                    className="h-9 text-xs bg-white border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jam Masuk (WIB) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="time"
                    name="checkInTime"
                    value={formData.checkInTime}
                    onChange={handleChange}
                    className="h-9 text-xs bg-white border-slate-200 font-mono"
                  />
                  {errors.checkInTime && (
                    <span className="text-rose-600 text-[11px] mt-1 block">{errors.checkInTime}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jam Pulang (WIB) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="time"
                    name="checkOutTime"
                    value={formData.checkOutTime}
                    onChange={handleChange}
                    className="h-9 text-xs bg-white border-slate-200 font-mono"
                  />
                  {errors.checkOutTime && (
                    <span className="text-rose-600 text-[11px] mt-1 block">{errors.checkOutTime}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter className="px-6 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={onClose} className="text-xs h-9">
            Batal
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting}
            className="gap-2 bg-navy hover:bg-navy/90 text-white text-xs font-semibold h-9 px-4 disabled:opacity-60 cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Daftarkan Karyawan')}</span>
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
