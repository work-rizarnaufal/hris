import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';

export default function ModalImporKaryawan({ isOpen, onClose, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const downloadTemplate = () => {
    const templateData = [
      {
        'Nama Karyawan': 'Budi Santoso',
        NIP: 'HC-0101',
        Jabatan: 'Staf Operasional',
        Divisi: 'Operasional & Lapangan',
        'Lokasi Kerja': 'Pabrik A (Sidoarjo)',
        Grup: 'Grup A',
        'Kategori Jadwal': 'Shift 1 (Pagi)',
        'Jam Masuk': '07:00',
        'Jam Pulang': '15:00',
        Status: 'Aktif',
      },
      {
        'Nama Karyawan': 'Siti Rahmawati',
        NIP: 'HC-0102',
        Jabatan: 'HCGA Specialist',
        Divisi: 'Human Capital & GA',
        'Lokasi Kerja': 'Kantor Utama (Surabaya)',
        Grup: 'Non-Shift',
        'Kategori Jadwal': 'Normal Office',
        'Jam Masuk': '08:00',
        'Jam Pulang': '17:00',
        Status: 'Aktif',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Karyawan');
    XLSX.writeFile(workbook, 'Template_Impor_Karyawan_HCGA.xlsx');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setErrorMsg('');
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawJson = XLSX.utils.sheet_to_json(ws);

        if (!rawJson || rawJson.length === 0) {
          setErrorMsg('File kosong atau format tabel tidak terdeteksi.');
          setPreviewData([]);
          return;
        }

        // Map column variations
        const mapped = rawJson.map((row, idx) => ({
          id: Date.now() + idx,
          name: row['Nama Karyawan'] || row['Nama'] || row['name'] || `Karyawan ${idx + 1}`,
          nip: row['NIP'] || row['nip'] || `HC-${1000 + idx}`,
          role: row['Jabatan'] || row['Role'] || row['role'] || 'Staf',
          division: row['Divisi'] || row['Departemen'] || row['division'] || 'Operasional & Lapangan',
          location: row['Lokasi Kerja'] || row['Lokasi'] || row['location'] || 'Pabrik A (Sidoarjo)',
          group: row['Grup'] || row['group'] || 'Grup A',
          scheduleCategory: row['Kategori Jadwal'] || row['Jadwal'] || 'Shift 1 (Pagi)',
          checkInTime: row['Jam Masuk'] || '07:00',
          checkOutTime: row['Jam Pulang'] || '15:00',
          status: row['Status'] || 'Aktif',
        }));

        setPreviewData(mapped);
      } catch (err) {
        setErrorMsg('Gagal membaca file. Pastikan format file adalah .xlsx atau .csv yang valid.');
        setPreviewData([]);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleConfirmImport = () => {
    if (previewData.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      onImportSuccess(previewData);
      setIsProcessing(false);
      onClose();
    }, 400);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalHeader
        icon={<FileSpreadsheet className="w-5 h-5" />}
        title="Impor Data Karyawan dari Excel"
        description="Unggah file spreadsheet untuk mendaftarkan banyak karyawan sekaligus ke dalam sistem."
        onClose={onClose}
      />

      <ModalBody className="space-y-5">
        {/* Box Download Template */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <div className="font-semibold text-xs text-navy flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Belum memiliki format file yang sesuai?</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Gunakan template resmi HCGA agar kolom (NIP, Divisi, Lokasi, Shift) terpetakan secara presisi.
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={downloadTemplate}
            className="shrink-0 text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            <span>Unduh Template Excel</span>
          </Button>
        </div>

        {/* Area Upload File */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-[#c4a266] rounded-xl p-8 text-center cursor-pointer transition-colors bg-white hover:bg-slate-50/50"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#c4a266] flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <div className="font-semibold text-xs text-navy">
            {file ? file.name : 'Klik untuk memilih file Excel / CSV'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Mendukung file berekstensi .xlsx, .xls, atau .csv (Maksimal 500 baris)
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Preview Tabel Baris yang Berhasil Dibaca */}
        {previewData.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-navy flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Terdeteksi {previewData.length} baris data siap diimpor:</span>
              </div>
              <span className="text-[11px] text-slate-400">Pratinjau 3 baris pertama</span>
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NAMA</TableHead>
                    <TableHead>NIP</TableHead>
                    <TableHead>DIVISI</TableHead>
                    <TableHead>LOKASI</TableHead>
                    <TableHead>GRUP</TableHead>
                    <TableHead>JADWAL</TableHead>
                    <TableHead>STATUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.slice(0, 3).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-semibold text-navy">{row.name}</TableCell>
                      <TableCell><Text variant="code">{row.nip}</Text></TableCell>
                      <TableCell>{row.division}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.group}</TableCell>
                      <TableCell>{row.scheduleCategory}</TableCell>
                      <TableCell>{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button type="button" variant="secondary" onClick={onClose} disabled={isProcessing}>
          Batal
        </Button>
        <Button
          type="button"
          variant="default"
          disabled={previewData.length === 0 || isProcessing}
          onClick={handleConfirmImport}
          className="bg-navy hover:bg-navy/90"
        >
          <Upload className="w-4 h-4 mr-1.5" />
          <span>
            {isProcessing
              ? 'Memproses Impor...'
              : `Konfirmasi Impor (${previewData.length} Karyawan)`}
          </span>
        </Button>
      </ModalFooter>
    </Modal>
  );
}
