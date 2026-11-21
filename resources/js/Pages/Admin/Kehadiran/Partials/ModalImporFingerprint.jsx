import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  Upload,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  MapPin,
  Clock,
  Trash2,
  Search,
  Wand2,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Input,
} from '@/components/ui';

export default function ModalImporFingerprint({
  isOpen,
  onClose,
  onSuccess,
  employees = [],
  locations = [],
}) {
  const [fileInfo, setFileInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editableRecords, setEditableRecords] = useState([]);
  const [unmappedRecords, setUnmappedRecords] = useState([]);
  const [totalScansCount, setTotalScansCount] = useState(0);

  // Filter & Search Preview States
  const [previewFilter, setPreviewFilter] = useState('ALL'); // ALL | ANOMALY | READY | UNMAPPED
  const [searchPreview, setSearchPreview] = useState('');

  // Reset state when closing or re-opening
  const handleReset = () => {
    setFileInfo(null);
    setEditableRecords([]);
    setUnmappedRecords([]);
    setTotalScansCount(0);
    setPreviewFilter('ALL');
    setSearchPreview('');
  };

  // Parsing file unggahan (Excel / CSV / TXT / DAT)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileInfo({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    });

    const reader = new FileReader();

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rawObjects = XLSX.utils.sheet_to_json(firstSheet);

          const extracted = [];
          if (rawObjects.length > 0 && ('ID' in rawObjects[0] || 'id' in rawObjects[0] || 'Tanggal Absensi' in rawObjects[0])) {
            rawObjects.forEach((row) => {
              const pin = String(row['ID'] ?? row['id'] ?? row['PIN'] ?? row['pin'] ?? '').trim();
              const date = String(row['Tanggal Absensi'] ?? row['tanggal'] ?? row['Date'] ?? '').trim();
              const time = String(row['Jam Absensi'] ?? row['jam'] ?? row['Time'] ?? '').trim();
              const kantor = String(row['Kantor'] ?? row['kantor'] ?? '').trim();
              if (pin && (date || time)) {
                extracted.push({
                  pin,
                  timestamp: `${date} ${time}`.trim(),
                  kantor,
                  tipe: row['Tipe Absensi'] || '',
                  verifikasi: row['Verifikasi'] || 'Sidik Jari',
                });
              }
            });
          } else {
            const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            for (let i = 1; i < rows.length; i++) {
              const row = rows[i];
              if (!row || row.length === 0) continue;
              const pin = String(row[0] || row[1] || '').trim();
              const time = String(row[1] || row[2] || '').trim();
              if (pin && time) {
                extracted.push({ pin, timestamp: time });
              }
            }
          }
          parseScansClient(extracted);
        } catch (err) {
          alert('Gagal membaca file Excel/CSV: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // DAT / TXT file
      reader.onload = (evt) => {
        try {
          const text = evt.target.result;
          const lines = text.split('\n');
          const extracted = [];
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            const parts = trimmed.split(/\s+/);
            if (parts.length >= 2) {
              const pin = parts[0];
              const time = `${parts[1]} ${parts[2] || ''}`.trim();
              extracted.push({ pin, timestamp: time });
            }
          }
          parseScansClient(extracted);
        } catch (err) {
          alert('Gagal membaca file DAT/TXT: ' + err.message);
        }
      };
      reader.readAsText(file);
    }
  };

  // Demo scan generator untuk pengujian cepat
  const handleLoadDemoLog = () => {
    const realPins = employees
      .map((e) => String(e.biometricPin || e.biometric_pin || e.id))
      .filter((p) => p && p !== '-');
    const targetPins = realPins.length >= 4
      ? realPins
      : ['96', '81', '37', '40'];
    const today = new Date().toISOString().slice(0, 10);

    const demoScans = [
      // Karyawan 1: Hadir Tepat Waktu (Shift Pagi: 08:00 - 17:00)
      { pin: targetPins[0], timestamp: `${today} 07:48:10` },
      { pin: targetPins[0], timestamp: `${today} 07:48:30` },
      { pin: targetPins[0], timestamp: `${today} 17:04:15` },

      // Karyawan 2: Terlambat (Shift Pagi, masuk 08:22)
      { pin: targetPins[1], timestamp: `${today} 08:22:10` },
      { pin: targetPins[1], timestamp: `${today} 17:10:00` },

      // Karyawan 3: Anomali Single Punch (Lupa tap pulang)
      { pin: targetPins[2], timestamp: `${today} 07:55:00` },

      // Karyawan 4: Hadir Tepat Waktu
      { pin: targetPins[3], timestamp: `${today} 07:58:12` },
      { pin: targetPins[3], timestamp: `${today} 17:02:40` },

      // Unmapped PIN
      { pin: '9999', timestamp: `${today} 07:52:15` },
      { pin: '9999', timestamp: `${today} 17:05:00` },
    ];

    setFileInfo({
      name: `Demo_AttLog_Simulasi_${today}.dat`,
      size: `${demoScans.length} baris scan`,
    });

    parseScansClient(demoScans);
  };

  // Parser Engine: Dijalankan 1x saja saat file diunggah
  const parseScansClient = (scans) => {
    setIsProcessing(true);

    setTimeout(() => {
      // Pemetaan PIN Karyawan komprehensif
      const empMap = {};
      employees.forEach((emp) => {
        const pin = String(emp.biometricPin || emp.biometric_pin || '').trim();
        const idStr = String(emp.id);
        const nipNumeric = emp.nip ? String(emp.nip).replace(/\D/g, '') : '';

        if (pin && pin !== '-') {
          empMap[pin] = emp;
          const pinNum = parseInt(pin, 10);
          if (!isNaN(pinNum)) {
            empMap[String(pinNum)] = emp;
          }
        }
        if (nipNumeric) {
          empMap[nipNumeric] = emp;
          const nipNum = parseInt(nipNumeric, 10);
          if (!isNaN(nipNum)) {
            empMap[String(nipNum)] = emp;
          }
        }
        empMap[idStr] = emp;
      });

      const groupedByPin = {};
      scans.forEach((s) => {
        if (!groupedByPin[s.pin]) groupedByPin[s.pin] = [];
        groupedByPin[s.pin].push(new Date(s.timestamp));
      });

      const stagingList = [];
      const unmapped = [];

      Object.entries(groupedByPin).forEach(([pin, timestamps]) => {
        const emp = empMap[pin];
        if (!emp) {
          unmapped.push({
            pin,
            totalScans: timestamps.length,
            sampleScan: timestamps[0].toISOString().replace('T', ' ').slice(0, 19),
          });
          return;
        }

        // Urutkan & deduplikasi scan ganda dalam 3 menit
        timestamps.sort((a, b) => a - b);
        const deduped = [];
        timestamps.forEach((t) => {
          if (deduped.length === 0) {
            deduped.push(t);
          } else {
            const last = deduped[deduped.length - 1];
            if ((t - last) / (1000 * 60) >= 3) {
              deduped.push(t);
            }
          }
        });

        // Pengelompokan shift tugas 9 jam
        const dailyDuty = {};

        deduped.forEach((t) => {
          const timeStr = t.toTimeString().slice(0, 5);

          if (timeStr <= '06:30') {
            // Pulang shift malam kemarin
            const prev = new Date(t);
            prev.setDate(prev.getDate() - 1);
            const prevDate = prev.toISOString().slice(0, 10);
            if (!dailyDuty[prevDate]) dailyDuty[prevDate] = { in: [], out: [], shift: 'MALAM' };
            dailyDuty[prevDate].out.push(t);
          } else if (timeStr >= '18:30') {
            // Masuk shift malam hari ini
            const dutyDate = t.toISOString().slice(0, 10);
            if (!dailyDuty[dutyDate]) dailyDuty[dutyDate] = { in: [], out: [], shift: 'MALAM' };
            dailyDuty[dutyDate].in.push(t);
          } else {
            // Shift pagi (buka 07:00, kerja 08:00 - 17:00, tutup 18:00)
            const dutyDate = t.toISOString().slice(0, 10);
            if (!dailyDuty[dutyDate]) dailyDuty[dutyDate] = { in: [], out: [], shift: 'PAGI' };
            if (timeStr < '13:30') {
              dailyDuty[dutyDate].in.push(t);
            } else {
              dailyDuty[dutyDate].out.push(t);
            }
          }
        });

        Object.entries(dailyDuty).forEach(([dateStr, duty]) => {
          const firstIn = duty.in.length > 0 ? duty.in[0].toTimeString().slice(0, 5) : '';
          const lastOut = duty.out.length > 0 ? duty.out[duty.out.length - 1].toTimeString().slice(0, 5) : '';
          const isNight = duty.shift === 'MALAM';
          const shiftTitle = isNight ? 'Shift Malam (20:00 - 05:00)' : 'Shift Pagi (08:00 - 17:00)';

          let isAnomaly = false;
          let anomalyReason = '';
          let status = 'Hadir';

          if (firstIn && !lastOut) {
            if (isNight) {
              status = 'Sedang Berdinas';
              anomalyReason = 'Sedang Berdinas (Menunggu Scan Pulang 05:00)';
            } else {
              isAnomaly = true;
              anomalyReason = 'Lupa Tap Pulang (Missing Out)';
            }
          } else if (!firstIn && lastOut) {
            isAnomaly = true;
            anomalyReason = 'Lupa Tap Masuk (Missing In)';
          }

          // Hitung keterlambatan (target Pagi 08:00, target Malam 20:00, toleransi 15 menit)
          let lateMinutes = 0;
          if (firstIn) {
            const [inH, inM] = firstIn.split(':').map(Number);
            const inMinutes = inH * 60 + inM;
            const targetMinutes = isNight ? 20 * 60 : 8 * 60;
            const diff = inMinutes - targetMinutes;
            if (diff > 15) {
              lateMinutes = diff;
              if (status !== 'Sedang Berdinas') {
                status = 'Terlambat';
              }
            }
          }

          const record = {
            id: `rec-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            employeeName: emp.name,
            nip: emp.nip,
            pin,
            location: emp.location?.name || emp.location || (emp.location_id === 1 ? 'Lokasi Mariuk' : 'Lokasi Cimalaka'),
            location_id: emp.location_id || (emp.location?.includes('Mariuk') ? 1 : 2),
            date: dateStr,
            shift: shiftTitle,
            checkIn: firstIn,
            checkOut: lastOut,
            lateMinutes,
            status,
            isAnomaly,
            anomalyReason,
            notes: anomalyReason || (status === 'Terlambat' ? `Terlambat ${lateMinutes}m` : 'Presensi biometric fingerprint site'),
          };

          stagingList.push(record);
        });
      });

      setEditableRecords(stagingList);
      setUnmappedRecords(unmapped);
      setTotalScansCount(scans.length);
      setIsProcessing(false);
    }, 200);
  };

  // Helper Pengubahan Data Inline oleh Admin di Tabel Preview
  const handleFieldChange = (id, field, value) => {
    setEditableRecords((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };

        // Kalkulasi ulang menit telat jika jam masuk diedit
        if (field === 'checkIn') {
          if (value) {
            const isNight = updated.shift.includes('Malam');
            const [h, m] = value.split(':').map(Number);
            const totalM = h * 60 + m;
            const targetM = isNight ? 20 * 60 : 8 * 60;
            const diff = totalM - targetM;
            if (diff > 15) {
              updated.lateMinutes = diff;
              if (updated.status !== 'Sedang Berdinas') updated.status = 'Terlambat';
            } else {
              updated.lateMinutes = 0;
              if (updated.status === 'Terlambat') updated.status = 'Hadir';
            }
            if (updated.anomalyReason?.includes('Missing In')) {
              updated.isAnomaly = false;
              updated.anomalyReason = '';
            }
          }
        }

        // Hapus anomali Missing Out jika jam pulang telah diisi
        if (field === 'checkOut') {
          if (value && updated.anomalyReason?.includes('Missing Out')) {
            updated.isAnomaly = false;
            updated.anomalyReason = '';
          }
        }

        return updated;
      })
    );
  };

  // Hapus Baris dari Daftar Preview
  const handleDeleteRow = (id) => {
    setEditableRecords((prev) => prev.filter((item) => item.id !== id));
  };

  // Auto-Fill Jam Pulang untuk seluruh anomali Missing Out
  const handleAutoFillMissingOut = () => {
    setEditableRecords((prev) =>
      prev.map((item) => {
        if (item.isAnomaly && item.checkIn && !item.checkOut) {
          const isNight = item.shift.includes('Malam');
          const defaultOut = isNight ? '05:00' : '17:00';
          return {
            ...item,
            checkOut: defaultOut,
            isAnomaly: false,
            anomalyReason: '',
            notes: 'Auto-fill jam pulang standar oleh admin',
          };
        }
        return item;
      })
    );
  };

  // Statistik Preview
  const stats = useMemo(() => {
    const total = editableRecords.length;
    const anomalies = editableRecords.filter((r) => r.isAnomaly || !r.checkIn || !r.checkOut).length;
    const ready = total - anomalies;
    const unmapped = unmappedRecords.length;
    return { total, anomalies, ready, unmapped };
  }, [editableRecords, unmappedRecords]);

  // Data Terfilter untuk Ditampilkan di Preview
  const filteredPreview = useMemo(() => {
    return editableRecords.filter((rec) => {
      // 1. Search Query
      const q = searchPreview.toLowerCase().trim();
      const matchSearch =
        !q ||
        rec.employeeName.toLowerCase().includes(q) ||
        rec.nip.toLowerCase().includes(q) ||
        rec.pin.toLowerCase().includes(q);

      // 2. Tab Filter
      if (previewFilter === 'ANOMALY') {
        return matchSearch && (rec.isAnomaly || !rec.checkIn || !rec.checkOut);
      }
      if (previewFilter === 'READY') {
        return matchSearch && (!rec.isAnomaly && rec.checkIn && rec.checkOut);
      }

      return matchSearch;
    });
  }, [editableRecords, searchPreview, previewFilter]);

  // Commit: Simpan Data Preview Final ke Database
  const handleCommit = () => {
    if (editableRecords.length === 0) return;
    if (onSuccess) {
      onSuccess(editableRecords);
    }
    handleReset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalHeader
        title="Tarik / Impor Log Fingerprint (Mode Preview & Edit)"
        subtitle="Ekstraksi log scan mesin presensi dengan mode pratinjau dan pengeditan langsung sebelum disimpan ke database."
        icon={<Fingerprint className="w-5 h-5 text-indigo-600" />}
        onClose={onClose}
      />

      <ModalBody className="space-y-4">
        {/* STEP 1: Upload File Area (Tampil jika belum ada data preview) */}
        {editableRecords.length === 0 && (
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block">
                Unggah Berkas Ekstraksi Mesin Fingerprint:
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sistem otomatis memetakan PIN dan mendeteksi lokasi site (Mariuk & Cimalaka) berdasarkan data master karyawan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full">
                <label className="flex items-center justify-center gap-2.5 px-4 py-5 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/30 cursor-pointer transition-all text-xs font-medium text-slate-700 shadow-2xs">
                  <Upload className="w-5 h-5 text-indigo-600" />
                  <span>
                    {fileInfo ? fileInfo.name : 'Pilih / Seret File Log Fingerprint (.xlsx, .csv, .dat, .txt)'}
                  </span>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv,.dat,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLoadDemoLog}
                className="text-xs shrink-0 font-medium border-amber-300 text-amber-800 hover:bg-amber-50 gap-1.5 h-12"
                title="Muat data simulasi log mesin untuk pengujian instan"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Muat Log Simulasi</span>
              </Button>
            </div>

            <div className="text-[11px] text-slate-500 bg-white p-3 rounded-lg border border-slate-200/70 space-y-1">
              <p className="font-semibold text-slate-700">Format yang didukung:</p>
              <p>
                File laporan mesin finger (contoh: <code>report_scan_*.xlsx</code> atau <code>FORMAT MESIN FINGER.xlsx</code>) yang memuat kolom <em>ID, Tanggal Absensi, Jam Absensi, Tipe Absensi, Kantor</em>.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: MODE PREVIEW & EDIT INTERAKTIF (Tampil setelah file diparsing) */}
        {editableRecords.length > 0 && (
          <div className="space-y-3">
            {/* Header Ringkasan & Aksi Cepat */}
            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>{fileInfo?.name}</span>
                </span>
                <span className="text-[11px] text-slate-400">•</span>
                <span className="text-[11px] text-slate-600 font-mono">
                  {totalScansCount} raw scan terproses
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {stats.anomalies > 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAutoFillMissingOut}
                    className="h-8 px-2.5 text-xs text-amber-800 border-amber-300 bg-amber-50/60 hover:bg-amber-100 gap-1.5"
                    title="Otomatis isi jam pulang standar (17:00 Pagi / 05:00 Malam) untuk karyawan yang lupa tap pulang"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Auto-Fill Pulang ({stats.anomalies})</span>
                  </Button>
                )}

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  className="h-8 px-2 text-xs text-slate-600 hover:text-navy gap-1"
                  title="Ganti atau unggah file lain"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ganti File</span>
                </Button>
              </div>
            </div>

            {/* Segmented Badges Filter & Search Preview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setPreviewFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewFilter === 'ALL'
                      ? 'bg-navy text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua ({stats.total})
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewFilter('ANOMALY')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewFilter === 'ANOMALY'
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Perlu Review ({stats.anomalies})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewFilter('READY')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewFilter === 'READY'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Lengkap ({stats.ready})</span>
                </button>

                {stats.unmapped > 0 && (
                  <button
                    type="button"
                    onClick={() => setPreviewFilter('UNMAPPED')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      previewFilter === 'UNMAPPED'
                        ? 'bg-rose-700 text-white shadow-2xs'
                        : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>PIN Tidak Dikenal ({stats.unmapped})</span>
                  </button>
                )}
              </div>

              {previewFilter !== 'UNMAPPED' && (
                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    value={searchPreview}
                    onChange={(e) => setSearchPreview(e.target.value)}
                    placeholder="Cari nama, NIP, atau PIN..."
                    className="h-8 pl-8 text-xs bg-white text-slate-800"
                  />
                </div>
              )}
            </div>

            {/* TABEL PREVIEW INTERAKTIF & EDIT LANGSUNG */}
            {previewFilter !== 'UNMAPPED' ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 text-xs">
                      <TableHead className="w-10 text-center">No</TableHead>
                      <TableHead className="min-w-[160px]">Karyawan</TableHead>
                      <TableHead className="w-24">Lokasi</TableHead>
                      <TableHead className="w-24 text-center">Tgl Dinas</TableHead>
                      <TableHead className="w-28 text-center">Jam Masuk</TableHead>
                      <TableHead className="w-28 text-center">Jam Pulang</TableHead>
                      <TableHead className="w-24 text-center">Keterlambatan</TableHead>
                      <TableHead className="w-32">Status</TableHead>
                      <TableHead className="min-w-[160px]">Catatan / Anomali</TableHead>
                      <TableHead className="w-10 text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPreview.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-6 text-slate-400 text-xs">
                          Tidak ada data yang cocok dengan kriteria filter preview.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPreview.map((row, idx) => {
                        const hasAnomaly = row.isAnomaly || !row.checkIn || !row.checkOut;
                        const isMariuk = row.location?.includes('Mariuk');

                        return (
                          <TableRow
                            key={row.id}
                            className={`text-xs transition-colors ${
                              hasAnomaly ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/80'
                            }`}
                          >
                            <TableCell className="text-center font-medium text-slate-500">
                              {idx + 1}
                            </TableCell>

                            <TableCell>
                              <p className="font-bold text-navy">{row.employeeName}</p>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5">
                                <span>{row.nip}</span>
                                <span>•</span>
                                <span>PIN: {row.pin}</span>
                              </div>
                            </TableCell>

                            <TableCell>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                  isMariuk
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                                }`}
                              >
                                {isMariuk ? 'Mariuk' : 'Cimalaka'}
                              </span>
                            </TableCell>

                            <TableCell className="text-center font-mono text-[11px] text-slate-600 whitespace-nowrap">
                              {row.date}
                            </TableCell>

                            {/* Jam Masuk (Editable) */}
                            <TableCell className="p-1 text-center">
                              <Input
                                type="time"
                                value={row.checkIn}
                                onChange={(e) => handleFieldChange(row.id, 'checkIn', e.target.value)}
                                className={`h-7 w-24 text-xs font-mono text-center mx-auto ${
                                  !row.checkIn ? 'border-amber-400 bg-amber-50 text-amber-900 font-bold' : 'bg-white'
                                }`}
                              />
                            </TableCell>

                            {/* Jam Pulang (Editable) */}
                            <TableCell className="p-1 text-center">
                              <Input
                                type="time"
                                value={row.checkOut}
                                onChange={(e) => handleFieldChange(row.id, 'checkOut', e.target.value)}
                                className={`h-7 w-24 text-xs font-mono text-center mx-auto ${
                                  !row.checkOut ? 'border-amber-400 bg-amber-50 text-amber-900 font-bold' : 'bg-white'
                                }`}
                              />
                            </TableCell>

                            <TableCell className="text-center">
                              {row.lateMinutes > 0 ? (
                                <Badge className="bg-amber-50 text-amber-800 border-amber-200 font-mono text-[10px]">
                                  +{row.lateMinutes}m
                                </Badge>
                              ) : row.checkIn ? (
                                <span className="text-[11px] text-emerald-700 font-medium">Tepat Waktu</span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </TableCell>

                            {/* Status Dropdown (Editable) */}
                            <TableCell className="p-1">
                              <select
                                value={row.status}
                                onChange={(e) => handleFieldChange(row.id, 'status', e.target.value)}
                                className="h-7 w-full text-[11px] rounded-lg border border-slate-200 bg-white px-2 focus:border-navy focus:ring-navy"
                              >
                                <option value="Hadir">Hadir</option>
                                <option value="Terlambat">Terlambat</option>
                                <option value="Izin">Izin</option>
                                <option value="Sakit">Sakit</option>
                                <option value="Cuti">Cuti</option>
                                <option value="Alpha">Alpha</option>
                                <option value="Sedang Berdinas">Sedang Berdinas</option>
                              </select>
                            </TableCell>

                            {/* Catatan / Notes (Editable) */}
                            <TableCell className="p-1">
                              <Input
                                type="text"
                                value={row.notes || ''}
                                onChange={(e) => handleFieldChange(row.id, 'notes', e.target.value)}
                                placeholder="Keterangan..."
                                className="h-7 text-[11px] bg-white text-slate-700"
                              />
                            </TableCell>

                            {/* Aksi Hapus Baris */}
                            <TableCell className="text-center p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRow(row.id)}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Hapus baris ini dari daftar impor"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              /* TAB KHUSUS: PIN TIDAK DIKENAL */
              <div className="border border-rose-200 bg-rose-50/20 rounded-xl p-3 space-y-2">
                <div className="text-xs text-rose-800 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    Nomor PIN di bawah ini ditemukan di mesin, namun belum terhubung ke profil karyawan mana pun di HRIS:
                  </span>
                </div>
                <div className="border border-rose-200 rounded-lg bg-white overflow-hidden max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-rose-50/60 text-xs">
                        <TableHead>PIN Mesin</TableHead>
                        <TableHead>Jumlah Scan</TableHead>
                        <TableHead>Sampel Scan Terakhir</TableHead>
                        <TableHead>Petunjuk Penanganan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unmappedRecords.map((u, idx) => (
                        <TableRow key={idx} className="text-xs">
                          <TableCell className="font-mono font-bold text-rose-700">
                            PIN: {u.pin}
                          </TableCell>
                          <TableCell>{u.totalScans} kali</TableCell>
                          <TableCell className="font-mono text-slate-500">{u.sampleScan}</TableCell>
                          <TableCell className="text-slate-500 text-[11px]">
                            Masukkan PIN ini pada form Edit Karyawan di modul Data Karyawan untuk mengaitkannya secara permanen.
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Keterangan Bawah */}
            <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
              <span>
                💡 Anda dapat mengedit <strong>Jam Masuk</strong>, <strong>Jam Pulang</strong>, atau <strong>Status</strong> langsung pada tabel di atas sebelum disimpan.
              </span>
              <span>
                Menampilkan <strong>{filteredPreview.length}</strong> dari <strong>{editableRecords.length}</strong> rekaman
              </span>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} className="text-xs">
          Batal
        </Button>
        <Button
          variant="default"
          onClick={handleCommit}
          disabled={editableRecords.length === 0}
          className="bg-navy hover:bg-navy/90 text-white text-xs gap-1.5 shadow-sm font-bold"
        >
          <Save className="w-4 h-4" />
          <span>
            Simpan {editableRecords.length} Data ke Database
          </span>
        </Button>
      </ModalFooter>
    </Modal>
  );
}
