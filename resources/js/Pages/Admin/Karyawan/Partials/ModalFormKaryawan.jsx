import React, { useState, useEffect, useMemo } from 'react';
import {
  UserPlus,
  Pencil,
  Save,
  MapPin,
  Lock,
  Building,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
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
  { value: 'Grup A', label: 'Grup A (Rotasi Hari Ganjil)', desc: 'Senin, Rabu, Jumat, Minggu' },
  { value: 'Grup B', label: 'Grup B (Rotasi Hari Genap)', desc: 'Selasa, Kamis, Sabtu' },
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
      label: `📍 ${loc.name} (${loc.type || 'Pabrik'})`,
      badgeColor: loc.name.includes('Mariuk') ? 'amber' : loc.name.includes('Cimalaka') ? 'indigo' : 'slate',
    }));
  }, [isOpen]);

  const schedulePresets = useMemo(() => {
    const s = getShiftSettings();
    return [
      {
        label: `${s.shiftPagiName}: 12 Jam (${s.shiftPagiIn} - ${s.shiftPagiOut})`,
        cat: 'Shift Pagi (12 Jam)',
        in: s.shiftPagiIn,
        out: s.shiftPagiOut,
        desc: 'Operasional siang 24/7 non-stop',
      },
      {
        label: `${s.shiftMalamName}: 12 Jam (${s.shiftMalamIn} - ${s.shiftMalamOut})`,
        cat: 'Shift Malam (12 Jam)',
        in: s.shiftMalamIn,
        out: s.shiftMalamOut,
        desc: 'Operasional malam 24/7 non-stop',
      },
      {
        label: 'Fleksibel Operasional (08:00 - 17:00)',
        cat: 'Fleksibel',
        in: '08:00',
        out: '17:00',
        desc: 'Staf pendukung kantor & GA',
      },
    ];
  }, [isOpen]);

  const defaultLoc = availableLocations[0]?.value || 'Lokasi Mariuk';
  const defaultPreset = schedulePresets[0];

  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    biometricPin: '',
    role: '',
    division: DIVISIONS[0],
    location: defaultLoc,
    group: GROUPS[0].value,
    scheduleCategory: defaultPreset.cat,
    checkInTime: defaultPreset.in,
    checkOutTime: defaultPreset.out,
    status: 'Aktif',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const curLoc = availableLocations[0]?.value || 'Lokasi Mariuk';
    const curPreset = schedulePresets[0];

    if (initialData) {
      setFormData({
        name: initialData.name || '',
        nip: initialData.nip || '',
        biometricPin: initialData.biometricPin || initialData.biometric_pin || '',
        role: initialData.role || '',
        division: initialData.division || DIVISIONS[0],
        location: initialData.location || curLoc,
        group: initialData.group || GROUPS[0].value,
        scheduleCategory: initialData.scheduleCategory || curPreset.cat,
        checkInTime: initialData.checkInTime || curPreset.in,
        checkOutTime: initialData.checkOutTime || curPreset.out,
        status: initialData.status || 'Aktif',
      });
    } else {
      setFormData({
        name: '',
        nip: '',
        biometricPin: '',
        role: '',
        division: DIVISIONS[0],
        location: curLoc,
        group: GROUPS[0].value,
        scheduleCategory: curPreset.cat,
        checkInTime: curPreset.in,
        checkOutTime: curPreset.out,
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
    if (!formData.checkInTime) newErrors.checkInTime = 'Jam masuk kerja wajib diisi.';
    if (!formData.checkOutTime) newErrors.checkOutTime = 'Jam pulang kerja wajib diisi.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      id: initialData?.id,
    }, setErrors);
  };

  const isMariuk = String(formData.location || '').includes('Mariuk');

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
          title={isEditing ? 'Ubah Data Karyawan' : 'Tambah Karyawan Baru'}
          description={
            isEditing
              ? `Perbarui profil, divisi, lokasi kerja, serta penugasan shift untuk ${formData.name || 'karyawan'}.`
              : 'Daftarkan personel baru ke dalam sistem operasional 24/7 (Mariuk & Cimalaka).'
          }
          onClose={onClose}
        />

        <ModalBody className="space-y-5 p-6 overflow-y-auto no-scrollbar">
          {/* Header Card khusus mode Edit */}
          {isEditing && (
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs border border-navy/20">
                  {(formData.name || 'K')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong className="text-sm font-bold text-navy">
                      {formData.name || 'Nama Karyawan'}
                    </strong>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      <Lock className="w-3 h-3 text-slate-400" />
                      {formData.nip}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formData.role || 'Jabatan'} · {formData.division}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${
                    isMariuk
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-indigo-50 text-indigo-900 border-indigo-200'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {formData.location}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                  {formData.group}
                </span>
              </div>
            </div>
          )}

          {/* Bagian 1: Data Identitas & Jabatan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <Users className="w-4 h-4 text-navy" />
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
                1. Data Identitas & Jabatan
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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

              {/* NIP */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Nomor Induk Pegawai (NIP)
                  </label>
                  <span className="text-[10px] text-slate-400">Otomatis jika kosong</span>
                </div>
                <Input
                  type="text"
                  name="nip"
                  placeholder="Contoh: HC-0121 (Opsional)"
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    ID Mesin Fingerprint (PIN)
                  </label>
                  <span className="text-[10px] text-slate-400">Opsional</span>
                </div>
                <Input
                  type="text"
                  name="biometricPin"
                  placeholder="Contoh: 101"
                  value={formData.biometricPin}
                  onChange={handleChange}
                  className="h-9.5 text-xs font-mono bg-white border-slate-200 focus:border-navy"
                />
                <span className="text-slate-400 text-[10px] mt-1 block">
                  Nomor ID pada mesin fisik site (jika kosong, membaca angka NIP).
                </span>
              </div>

              {/* Jabatan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Jabatan / Posisi Kerja <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  name="role"
                  placeholder="Contoh: Senior Operator Mesin / Danru K3"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Divisi / Departemen <span className="text-rose-500">*</span>
                </label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="w-full h-9.5 text-xs rounded-xl border border-slate-200 bg-white px-3 focus:border-navy focus:ring-1 focus:ring-navy transition-all cursor-pointer"
                >
                  {DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Karyawan */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Status Ketenagakerjaan
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { value: 'Aktif', label: 'Aktif (Bekerja Normal)' },
                    { value: 'Cuti', label: 'Sedang Cuti Resmi' },
                    { value: 'Non-Aktif', label: 'Non-Aktif / Resign' },
                  ].map((st) => {
                    const isSelected = formData.status === st.value;
                    return (
                      <button
                        key={st.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: st.value })}
                        className={`py-2 px-3 text-xs rounded-xl border text-center transition-all cursor-pointer font-medium ${
                          isSelected
                            ? 'border-navy bg-navy/5 text-navy font-bold ring-1 ring-navy'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bagian 2: Penempatan Kerja & Kelompok Roster */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <Building className="w-4 h-4 text-navy" />
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
                2. Lokasi Pabrik & Kelompok Roster
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Pilihan Lokasi Penempatan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Lokasi Pabrik / Site Penempatan <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  {availableLocations.map((loc) => {
                    const isSelected = formData.location === loc.value;
                    return (
                      <button
                        key={loc.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, location: loc.value })}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-navy bg-navy/5 text-navy font-bold ring-1 ring-navy'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-4 h-4 ${loc.badgeColor === 'amber' ? 'text-amber-600' : 'text-indigo-600'}`} />
                          <span className="text-xs">{loc.label}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-navy shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pilihan Grup Roster */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kelompok Roster Operasional (24/7) <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  {GROUPS.map((grp) => {
                    const isSelected = formData.group === grp.value;
                    return (
                      <button
                        key={grp.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, group: grp.value })}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-navy bg-navy/5 text-navy font-bold ring-1 ring-navy'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <strong className="block text-xs">{grp.label}</strong>
                          <span className="text-[11px] text-slate-500 font-normal">{grp.desc}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-navy shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bagian 3: Jam Kerja Shift 12 Jam */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-navy" />
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
                  3. Pengaturan Shift 12 Jam & Jam Kerja
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Tukar shift pukul 07:00 & 19:00</span>
            </div>

            {/* Presets Button List */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Preset Shift Standar
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {schedulePresets.map((preset) => {
                  const isCurrent = formData.scheduleCategory === preset.cat;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-navy bg-navy/5 text-navy font-bold ring-1 ring-navy'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <strong className="block text-xs">{preset.cat}</strong>
                      <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                        {preset.in} - {preset.out}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Waktu Masuk & Pulang Custom */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Jam Masuk Kerja (WIB) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="time"
                  name="checkInTime"
                  value={formData.checkInTime}
                  onChange={handleChange}
                  className="h-9 text-xs bg-white border-slate-200"
                />
                {errors.checkInTime && (
                  <span className="text-rose-600 text-[11px] mt-1 block">{errors.checkInTime}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Jam Pulang Kerja (WIB) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="time"
                  name="checkOutTime"
                  value={formData.checkOutTime}
                  onChange={handleChange}
                  className="h-9 text-xs bg-white border-slate-200"
                />
                {errors.checkOutTime && (
                  <span className="text-rose-600 text-[11px] mt-1 block">{errors.checkOutTime}</span>
                )}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={onClose} className="text-xs">
            Batal
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting}
            className="gap-2 bg-navy hover:bg-navy/90 text-white text-xs font-semibold disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan Karyawan' : 'Daftarkan Karyawan')}</span>
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
