import React, { useState, useEffect } from 'react';
import { UserPlus, Save, Pencil } from 'lucide-react';
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
  'SITE A CIMALAKA',
  'SITE B PASEH',
];

const EMPLOYMENT_TYPES = [
  'Tetap',
  'Kontrak (PKWT)',
  'Magang',
];

export default function ModalFormKaryawan({ isOpen, onClose, onSave, initialData }) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    role: '',
    division: DIVISIONS[0],
    location: LOCATIONS[0],
    employmentType: EMPLOYMENT_TYPES[0],
    email: '',
    phone: '',
    joinDate: new Date().toISOString().slice(0, 10),
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
        employmentType: initialData.employmentType || EMPLOYMENT_TYPES[0],
        email: initialData.email || '',
        phone: initialData.phone || '',
        joinDate: initialData.joinDate || new Date().toISOString().slice(0, 10),
        status: initialData.status || 'Aktif',
      });
    } else {
      setFormData({
        name: '',
        nip: `HC-${String(Math.floor(100 + Math.random() * 900))}`,
        role: '',
        division: DIVISIONS[0],
        location: LOCATIONS[0],
        employmentType: EMPLOYMENT_TYPES[0],
        email: '',
        phone: '',
        joinDate: new Date().toISOString().slice(0, 10),
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi.';
    if (!formData.nip.trim()) newErrors.nip = 'NIP wajib diisi.';
    if (!formData.role.trim()) newErrors.role = 'Jabatan / posisi kerja wajib diisi.';

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
        icon={
          isEditing ? (
            <Pencil className="w-5 h-5 text-[#c4a266]" />
          ) : (
            <UserPlus className="w-5 h-5 text-[#c4a266]" />
          )
        }
        title={isEditing ? 'Ubah Profil Karyawan' : 'Daftarkan Karyawan Baru'}
        description={
          isEditing
            ? 'Perbarui informasi data profil, divisi penempatan, status kepegawaian, dan kontak karyawan.'
            : 'Lengkapi formulir berikut untuk mendaftarkan karyawan baru ke dalam database master HRIS.'
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
                  placeholder="Contoh: Senior Operator Lapangan"
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

            {/* Lokasi Penempatan */}
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

            {/* Status Hubungan Kerja */}
            <div>
              <label>
                <span>Status Hubungan Kerja *</span>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange}>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Email */}
            <div>
              <label>
                <span>Alamat Email</span>
                <Input
                  type="email"
                  name="email"
                  placeholder="contoh: budi.santoso@perusahaan.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
            </div>

            {/* Nomor Telepon / WhatsApp */}
            <div>
              <label>
                <span>No. Telepon / WhatsApp</span>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Contoh: 0812-3456-7890"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </label>
            </div>

            {/* Tanggal Bergabung */}
            <div>
              <label>
                <span>Tanggal Bergabung (Join Date)</span>
                <Input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                />
              </label>
            </div>

            {/* Status Keaktifan */}
            <div>
              <label>
                <span>Status Keaktifan Pegawai *</span>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Aktif">Aktif (Bekerja)</option>
                  <option value="Cuti">Sedang Cuti Resmi</option>
                  <option value="Non-Aktif">Non-Aktif / Resign</option>
                </select>
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
