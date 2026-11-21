import React from 'react';
import { CalendarDays, Save } from 'lucide-react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  TableSelect,
} from '@/components/ui';

export default function ModalHariLibur({
  isOpen,
  onClose,
  onSubmit,
  editingHolidayId,
  holidayForm,
  setHolidayForm,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <ModalHeader
        icon={<CalendarDays className="w-5 h-5 text-[#c4a266]" />}
        title={editingHolidayId ? 'Ubah Hari Libur & Operasional' : 'Tambah Hari Libur Baru'}
        description="Konfigurasikan tanggal, kategori libur, dan ketentuan pemotongan kuota cuti tahunan."
        onClose={onClose}
      />

      <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
        <ModalBody className="space-y-4 p-6 text-xs overflow-y-auto no-scrollbar">
          {editingHolidayId && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Sedang Mengubah Agenda:</span>
                <strong className="text-navy font-bold">{holidayForm.name || 'Agenda Libur'}</strong>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white border border-slate-200 text-slate-700">
                {holidayForm.date}
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tanggal Libur / Khusus <span className="text-rose-500">*</span>
            </label>
            <Input
              type="date"
              value={holidayForm.date}
              onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
              className="h-9.5 text-xs bg-white text-slate-800 border-slate-200 focus:border-navy"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Hari Libur / Agenda Operasional <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Contoh: Hari Raya Idul Fitri 1447 H / Cuti Bersama..."
              value={holidayForm.name}
              onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
              className="h-9.5 text-xs bg-white text-slate-800 border-slate-200 focus:border-navy"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kategori Libur
              </label>
              <TableSelect
                value={holidayForm.category}
                onChange={(e) => setHolidayForm({ ...holidayForm, category: e.target.value })}
                className="h-9.5 text-xs text-slate-700 bg-white"
                containerClassName="w-full"
              >
                <option value="Libur Nasional">Libur Nasional</option>
                <option value="Cuti Bersama">Cuti Bersama</option>
                <option value="Libur Khusus Pabrik">Libur Khusus Pabrik</option>
              </TableSelect>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pengaruh Kuota Cuti Tahunan
              </label>
              <TableSelect
                value={holidayForm.deductsLeave ? 'true' : 'false'}
                onChange={(e) =>
                  setHolidayForm({
                    ...holidayForm,
                    deductsLeave: e.target.value === 'true',
                  })
                }
                className="h-9.5 text-xs text-slate-700 bg-white"
                containerClassName="w-full"
              >
                <option value="false">Tidak Potong Cuti (0 Hari)</option>
                <option value="true">Potong Cuti Tahunan (-1 Hari)</option>
              </TableSelect>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Keterangan Operasional Pabrik
            </label>
            <Input
              type="text"
              placeholder="Contoh: Operasional lini pabrik Mariuk & Cimalaka libur..."
              value={holidayForm.operationalNote}
              onChange={(e) =>
                setHolidayForm({ ...holidayForm, operationalNote: e.target.value })
              }
              className="h-9.5 text-xs bg-white text-slate-800 border-slate-200 focus:border-navy"
            />
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
            <span>{editingHolidayId ? 'Simpan Perubahan Agenda' : 'Tambahkan Agenda Libur'}</span>
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
