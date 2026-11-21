import React from 'react';
import { MapPin, Save } from 'lucide-react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  TableSelect,
} from '@/components/ui';

export default function ModalEditLokasi({
  isOpen,
  onClose,
  onSubmit,
  locationForm,
  setLocationForm,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <ModalHeader
        title={`Edit Parameter Geofence - ${locationForm.name}`}
        description="Sesuaikan titik koordinat GPS, batas radius validasi presensi, dan alamat operasional."
        icon={<MapPin className="w-5 h-5 text-[#c4a266]" />}
        onClose={onClose}
      />

      <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
        <ModalBody className="p-6 space-y-4 text-xs overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Titik Lokasi Operasional <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Contoh: Lokasi Mariuk"
                value={locationForm.name}
                onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                className="h-9.5 text-xs bg-white text-slate-800 border-slate-200 focus:border-navy"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kategori Titik
              </label>
              <TableSelect
                value={locationForm.type}
                onChange={(e) => setLocationForm({ ...locationForm, type: e.target.value })}
                className="h-9.5 text-xs text-slate-700 bg-white"
                containerClassName="w-full"
              >
                <option value="Pabrik Utama">Pabrik Utama</option>
                <option value="Pabrik Cabang">Pabrik Cabang</option>
                <option value="Head Office">Head Office</option>
                <option value="Gudang Logistik">Gudang Logistik</option>
              </TableSelect>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Latitude GPS <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                step="any"
                placeholder="-6.8797"
                value={locationForm.latitude}
                onChange={(e) => setLocationForm({ ...locationForm, latitude: e.target.value })}
                className="h-9.5 text-xs bg-white text-slate-800 border-slate-200 focus:border-navy font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Longitude GPS <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                step="any"
                placeholder="107.9254"
                value={locationForm.longitude}
                onChange={(e) => setLocationForm({ ...locationForm, longitude: e.target.value })}
                className="h-9.5 text-xs bg-white text-slate-800 border-slate-200 focus:border-navy font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Radius Geofence (Meter) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                min="20"
                max="1000"
                step="10"
                value={locationForm.radiusMeters}
                onChange={(e) => setLocationForm({ ...locationForm, radiusMeters: e.target.value })}
                className="h-9.5 text-xs bg-white text-slate-800 border-slate-200 focus:border-navy font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alamat Lengkap & Patokan Operasional
            </label>
            <Input
              type="text"
              placeholder="Contoh: Jl. Raya Mariuk No. 88, Sumedang, Jawa Barat"
              value={locationForm.address}
              onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
              className="h-9.5 text-xs bg-white text-slate-800 border-slate-200 focus:border-navy"
            />
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-900 leading-relaxed">
              Perubahan titik koordinat atau radius geofence akan langsung berdampak pada validasi jarak presensi mobile aplikasi karyawan di lokasi ini. Pastikan titik koordinat akurat.
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs text-slate-600 cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="text-xs font-semibold bg-navy hover:bg-[#193750] text-white cursor-pointer gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Parameter Geofence</span>
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
