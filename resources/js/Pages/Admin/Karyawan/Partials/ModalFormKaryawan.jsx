import React, { useState, useEffect } from 'react';
import { UserPlus, Save } from 'lucide-react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@/components/ui';

const DIVISIONS = [
  'Operasional & Lapangan',
  'Human Capital & GA',
  'Logistik & Gudang',
  'Security & Safety',
  'IT & Sistem Informasi',
  'Keuangan & Akuntansi',
];

const LOCATIONS = [
  'Pabrik A (Sidoarjo)',
  'Kantor Utama (Surabaya)',
  'Gudang B (Rungkut)',
  'Site Operasional (Gresik)',
];

const GROUPS = ['Grup A', 'Grup B', 'Non-Shift'];

const SCHEDULE_CATEGORIES = [
  { label: 'Shift 1 (Pagi: 07:00 - 15:00)', in: '07:00', out: '15:00', cat: 'Shift 1 (Pagi)' },
  { label: 'Shift 2 (Siang: 15:00 - 23:00)', in: '15:00', out: '23:00', cat: 'Shift 2 (Siang)' },
  { label: 'Normal Office (08:00 - 17:00)', in: '08:00', out: '17:00', cat: 'Normal Office' },
  { label: 'Security Shift 1 (06:30 - 14:30)', in: '06:30', out: '14:30', cat: 'Shift 1 (Pagi)' },
  { label: 'Security Shift 2 (14:30 - 22:30)', in: '14:30', out: '22:30', cat: 'Shift 2 (Siang)' },
  { label: 'Fleksibel Operasional', in: '08:30', out: '17:30', cat: 'Fleksibel' },
];

export default function ModalFormKaryawan({ isOpen, onClose, onSave, initialData }) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    role: '',
    division: DIVISIONS[0],
    location: LOCATIONS[0],
    group: GROUPS[0],
    scheduleCategory: 'Shift 1 (Pagi)',
    checkInTime: '07:00',
    checkOutTime: '15:00',
    status: 'Aktif',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        nip: initialData.nip || '',
        role: initialData.role || '',
        division: initialData.division || DIVISIONS[0],
        location: initialData.location || LOCATIONS[0],
        group: initialData.group || GROUPS[0],
        scheduleCategory: initialData.scheduleCategory || 'Shift 1 (Pagi)',
        checkInTime: initialData.checkInTime || '07:00',
        checkOutTime: initialData.checkOutTime || '15:00',
        status: initialData.status || 'Aktif',
      });
    } else {
      setFormData({
        name: '',
        nip: `HC-${String(Math.floor(100 + Math.random() * 900))}`,
        role: '',
        division: DIVISIONS[0],
        location: LOCATIONS[0],
        group: GROUPS[0],
        scheduleCategory: 'Shift 1 (Pagi)',
        checkInTime: '07:00',
        checkOutTime: '15:00',
        status: 'Aktif',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSchedulePresetChange = (e) => {
    const selected = SCHEDULE_CATEGORIES.find((s) => s.label === e.target.value);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        scheduleCategory: selected.cat,
        checkInTime: selected.in,
        checkOutTime: selected.out,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi.';
    if (!formData.nip.trim()) newErrors.nip = 'NIP wajib diisi.';
    if (!formData.role.trim()) newErrors.role = 'Jabatan wajib diisi.';
    if (!formData.checkInTime) newErrors.checkInTime = 'Jam masuk wajib ditentukan.';
    if (!formData.checkOutTime) newErrors.checkOutTime = 'Jam pulang wajib ditentukan.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      id: initialData?.id || Date.now(),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalHeader
        icon={<UserPlus className="w-5 h-5" />}
        title={isEditing ? 'Ubah Data Karyawan' : 'Tambah Karyawan Baru'}
        description={
          isEditing
            ? 'Perbarui informasi data induk, divisi, lokasi kerja, dan pengaturan shift.'
            : 'Lengkapi formulir berikut untuk mendaftarkan karyawan ke dalam sistem HRIS.'
        }
        onClose={onClose}
      />

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Lengkap */}
            <div>
              <label>
                <span>Nama Lengkap Karyawan *</span>
                <Input
                  type="text"
                  name="name"
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'border-rose-400 focus:ring-rose-400' : ''}
                />
              </label>
              {errors.name && <span className="text-rose-600 text-[11px] mt-1 block">{errors.name}</span>}
            </div>

            {/* NIP */}
            <div>
              <label>
                <span>Nomor Induk Pegawai (NIP) *</span>
                <Input
                  type="text"
                  name="nip"
                  placeholder="Contoh: HC-0101"
                  value={formData.nip}
                  onChange={handleChange}
                  className={errors.nip ? 'border-rose-400 focus:ring-rose-400' : ''}
                />
              </label>
              {errors.nip && <span className="text-rose-600 text-[11px] mt-1 block">{errors.nip}</span>}
            </div>

            {/* Jabatan */}
            <div>
              <label>
                <span>Jabatan / Posisi Kerja *</span>
                <Input
                  type="text"
                  name="role"
                  placeholder="Contoh: Staf Operasional, QA Officer"
                  value={formData.role}
                  onChange={handleChange}
                  className={errors.role ? 'border-rose-400 focus:ring-rose-400' : ''}
                />
              </label>
              {errors.role && <span className="text-rose-600 text-[11px] mt-1 block">{errors.role}</span>}
            </div>

            {/* Divisi */}
            <div>
              <label>
                <span>Divisi / Departemen *</span>
                <select name="division" value={formData.division} onChange={handleChange}>
                  {DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Lokasi Kerja */}
            <div>
              <label>
                <span>Lokasi Penempatan Kerja *</span>
                <select name="location" value={formData.location} onChange={handleChange}>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Grup Shift */}
            <div>
              <label>
                <span>Grup Kerja (Roster) *</span>
                <select name="group" value={formData.group} onChange={handleChange}>
                  {GROUPS.map((grp) => (
                    <option key={grp} value={grp}>
                      {grp}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Template Jadwal Preset */}
            <div className="md:col-span-2">
              <label>
                <span>Pilihan Preset Jadwal & Shift</span>
                <select onChange={handleSchedulePresetChange} defaultValue="">
                  <option value="" disabled>-- Pilih Preset Jadwal Cepat --</option>
                  {SCHEDULE_CATEGORIES.map((preset) => (
                    <option key={preset.label} value={preset.label}>
                      {preset.label}
                    </option>
                  ))}
                </select>
                <small>Memilih preset akan otomatis mengisi kategori, jam masuk, dan jam pulang di bawah.</small>
              </label>
            </div>

            {/* Kategori Jadwal */}
            <div>
              <label>
                <span>Kategori Jadwal *</span>
                <Input
                  type="text"
                  name="scheduleCategory"
                  value={formData.scheduleCategory}
                  onChange={handleChange}
                  placeholder="Contoh: Shift 1 (Pagi)"
                />
              </label>
            </div>

            {/* Status Karyawan */}
            <div>
              <label>
                <span>Status Karyawan *</span>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Aktif">Aktif (Bekerja)</option>
                  <option value="Cuti">Sedang Cuti Resmi</option>
                  <option value="Non-Aktif">Non-Aktif / Resign</option>
                </select>
              </label>
            </div>

            {/* Jam Masuk */}
            <div>
              <label>
                <span>Jam Masuk Kerja (WIB) *</span>
                <Input
                  type="time"
                  name="checkInTime"
                  value={formData.checkInTime}
                  onChange={handleChange}
                />
              </label>
            </div>

            {/* Jam Pulang */}
            <div>
              <label>
                <span>Jam Pulang Kerja (WIB) *</span>
                <Input
                  type="time"
                  name="checkOutTime"
                  value={formData.checkOutTime}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="default" className="bg-navy hover:bg-navy/90">
            <Save className="w-4 h-4 mr-1.5" />
            <span>{isEditing ? 'Simpan Perubahan' : 'Daftarkan Karyawan'}</span>
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
