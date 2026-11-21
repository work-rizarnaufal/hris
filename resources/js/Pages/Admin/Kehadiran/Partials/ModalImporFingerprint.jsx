import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  Upload,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileSpreadsheet,
  Link2,
  Save,
  RotateCcw,
  Sparkles,
  MapPin,
  Clock,
  HelpCircle,
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
} from '@/components/ui';

export default function ModalImporFingerprint({
  isOpen,
  onClose,
  onSuccess,
  employees = [],
  locations = [],
}) {
  const [selectedLocationId, setSelectedLocationId] = useState(() => {
    return locations[0]?.id || 1;
  });

  const [activeTab, setActiveTab] = useState('ready'); // ready | anomalies | unmapped
  const [fileInfo, setFileInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewResult, setPreviewResult] = useState(null);

  // Filter karyawan sesuai lokasi terpilih
  const locationEmployees = useMemo(() => {
    return employees.filter((e) => {
      if (!selectedLocationId) return true;
      return e.location_id === Number(selectedLocationId) || (e.location && e.location.includes(selectedLocationId === 1 ? 'Mariuk' : 'Cimalaka'));
    });
  }, [employees, selectedLocationId]);

  // Demo scan generator untuk pengujian instan
  const handleLoadDemoLog = () => {
    const isMariuk = Number(selectedLocationId) === 1;
    const targetPins = isMariuk ? ['101', '104', '105', '103', '107', '109'] : ['202', '211', '210', '206', '208', '212'];
    const today = new Date().toISOString().slice(0, 10);

    const demoScans = [
      // Karyawan 1: Hadir Tepat Waktu (Pagi)
      { pin: targetPins[0], timestamp: `${today} 06:48:10` },
      { pin: targetPins[0], timestamp: `${today} 06:48:30` }, // double tap
      { pin: targetPins[0], timestamp: `${today} 19:04:15` },

      // Karyawan 2: Terlambat 18 menit (Pagi, lewat toleransi 15m)
      { pin: targetPins[1], timestamp: `${today} 07:18:22` },
      { pin: targetPins[1], timestamp: `${today} 19:10:00` },

      // Karyawan 3: Anomali (Lupa tap pulang)
      { pin: targetPins[2], timestamp: `${today} 06:55:00` },

      // Karyawan 4: Hadir Tepat Waktu
      { pin: targetPins[3], timestamp: `${today} 06:58:12` },
      { pin: targetPins[3], timestamp: `${today} 19:02:40` },

      // Unmapped PIN (misal teknisi mendaftarkan PIN baru 999 di mesin)
      { pin: '999', timestamp: `${today} 07:02:15` },
      { pin: '999', timestamp: `${today} 19:05:00` },
    ];

    setFileInfo({
      name: `Demo_AttLog_${isMariuk ? 'Mariuk' : 'Cimalaka'}_${today}.dat`,
      size: `${demoScans.length} baris scan`,
    });

    parseScansClient(demoScans);
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
          const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

          const extracted = [];
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;
            // Kolom umum: PIN/No (index 0 atau 1), Time (index 1 atau 2)
            const pin = String(row[0] || row[1] || '').trim();
            const time = String(row[1] || row[2] || '').trim();
            if (pin && time) {
              extracted.push({ pin, timestamp: time });
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

  // Client-side parser engine untuk preview instan
  const parseScansClient = (scans) => {
    setIsProcessing(true);

    setTimeout(() => {
      const empMap = {};
      locationEmployees.forEach((emp) => {
        const pin = String(emp.biometricPin || emp.biometric_pin || emp.nip.replace(/\D/g, ''));
        empMap[pin] = emp;
      });

      const groupedByPin = {};
      scans.forEach((s) => {
        if (!groupedByPin[s.pin]) groupedByPin[s.pin] = [];
        groupedByPin[s.pin].push(new Date(s.timestamp));
      });

      const ready = [];
      const anomalies = [];
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

        // Sort & deduplicate (< 5 min)
        timestamps.sort((a, b) => a - b);
        const deduped = [];
        timestamps.forEach((t) => {
          if (deduped.length === 0) {
            deduped.push(t);
          } else {
            const last = deduped[deduped.length - 1];
            if ((t - last) / (1000 * 60) >= 5) {
              deduped.push(t);
            }
          }
        });

        const dateStr = deduped[0].toISOString().slice(0, 10);
        const firstIn = deduped[0].toTimeString().slice(0, 5);
        const lastOut = deduped.length > 1 ? deduped[deduped.length - 1].toTimeString().slice(0, 5) : null;

        // Toleransi keterlambatan 15 menit (Pagi 07:15)
        const [inH, inM] = firstIn.split(':').map(Number);
        const inMinutes = inH * 60 + inM;
        const targetMinutes = 7 * 60; // 07:00
        const diff = inMinutes - targetMinutes;
        const isLate = diff > 15;
        const lateMinutes = isLate ? diff : 0;

        const record = {
          employeeId: emp.id,
          employeeName: emp.name,
          nip: emp.nip,
          pin,
          location: emp.location || (selectedLocationId === 1 ? 'Lokasi Mariuk' : 'Lokasi Cimalaka'),
          date: dateStr,
          shift: 'Shift Pagi (12 Jam)',
          checkIn: firstIn,
          checkOut: lastOut || '-',
          lateMinutes,
          status: isLate ? 'Terlambat' : 'Hadir',
          isAnomaly: !lastOut,
          anomalyReason: !lastOut ? 'Lupa Tap Pulang (Missing Out)' : null,
          method: 'fingerprint',
        };

        if (record.isAnomaly) {
          anomalies.push(record);
        } else {
          ready.push(record);
        }
      });

      setPreviewResult({
        ready,
        anomalies,
        unmapped,
        totalScans: scans.length,
      });

      setIsProcessing(false);
    }, 250);
  };

  // Simpan hasil impor ke data presensi
  const handleCommit = () => {
    if (!previewResult) return;
    const allValid = [...previewResult.ready, ...previewResult.anomalies];
    if (onSuccess) {
      onSuccess(allValid);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalHeader
        title="Tarik / Impor Data Log Fingerprint"
        subtitle="Ekstraksi log scan fisik dari mesin presensi site tanpa ketergantungan sinyal GPS."
        icon={<Fingerprint className="w-5 h-5 text-indigo-600" />}
        onClose={onClose}
      />

      <ModalBody className="space-y-4">
        {/* Step 1: Lokasi Mesin & File Upload */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block">
                1. Pilih Asal Lokasi Mesin Pabrik:
              </label>
              <p className="text-[11px] text-slate-500">
                Pencocokan PIN biometric akan diisolasi sesuai lokasi site terpilih.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                  Number(selectedLocationId) === 1
                    ? 'bg-amber-100/70 border-amber-400 text-amber-900 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="siteLocation"
                  value="1"
                  checked={Number(selectedLocationId) === 1}
                  onChange={() => setSelectedLocationId(1)}
                  className="hidden"
                />
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Site Mariuk (Subang)</span>
              </label>

              <label
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                  Number(selectedLocationId) === 2
                    ? 'bg-indigo-100/70 border-indigo-400 text-indigo-900 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="siteLocation"
                  value="2"
                  checked={Number(selectedLocationId) === 2}
                  onChange={() => setSelectedLocationId(2)}
                  className="hidden"
                />
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>Site Cimalaka (Sumedang)</span>
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/70 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 cursor-pointer transition-all text-xs font-medium text-slate-700">
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>
                  {fileInfo ? fileInfo.name : 'Pilih / Drop File Log Fingerprint (.xlsx, .csv, .dat)'}
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
              className="text-xs shrink-0 font-medium border-amber-300 text-amber-800 hover:bg-amber-50 gap-1.5"
              title="Muat data simulasi log mesin untuk pengujian instan"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Muat Log Simulasi Mesin</span>
            </Button>
          </div>
        </div>

        {/* Step 2: Tabs Pratinjau Cerdas */}
        {previewResult && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('ready')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'ready'
                      ? 'bg-navy text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Siap Diimpor ({previewResult.ready.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('anomalies')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'anomalies'
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Anomali Single Punch ({previewResult.anomalies.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('unmapped')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'unmapped'
                      ? 'bg-rose-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-300" />
                  <span>ID Belum Terhubung ({previewResult.unmapped.length})</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500 font-medium">
                Total Scan: <strong>{previewResult.totalScans} baris</strong>
              </span>
            </div>

            {/* Konten Tab 1: Siap Diimpor */}
            {activeTab === 'ready' && (
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 text-xs">
                      <TableHead>Karyawan</TableHead>
                      <TableHead>PIN Mesin</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Jam Masuk</TableHead>
                      <TableHead>Jam Pulang</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewResult.ready.map((row, idx) => (
                      <TableRow key={idx} className="text-xs">
                        <TableCell>
                          <span className="font-bold text-slate-900 block">{row.employeeName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{row.nip}</span>
                        </TableCell>
                        <TableCell className="font-mono text-slate-600">PIN: {row.pin}</TableCell>
                        <TableCell className="text-slate-600">{row.date}</TableCell>
                        <TableCell className="font-mono font-bold text-slate-800">{row.checkIn}</TableCell>
                        <TableCell className="font-mono text-slate-600">{row.checkOut}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              row.status === 'Hadir'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                                : 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                            }
                          >
                            {row.status} {row.lateMinutes > 0 && `(+${row.lateMinutes}m)`}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Konten Tab 2: Anomali Single Punch */}
            {activeTab === 'anomalies' && (
              <div className="border border-amber-200 bg-amber-50/20 rounded-xl p-3 space-y-2">
                <div className="text-xs text-amber-800 flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Karyawan di bawah ini hanya menempelkan jari 1 kali di hari dinas (Lupa tap pulang). Data tetap tersimpan sebagai Anomali.</span>
                </div>
                <div className="border border-amber-200 rounded-lg bg-white overflow-hidden max-h-56 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-amber-50/60 text-xs">
                        <TableHead>Karyawan</TableHead>
                        <TableHead>PIN Mesin</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Jam Masuk</TableHead>
                        <TableHead>Keterangan Anomali</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewResult.anomalies.map((row, idx) => (
                        <TableRow key={idx} className="text-xs">
                          <TableCell className="font-bold text-slate-900">{row.employeeName}</TableCell>
                          <TableCell className="font-mono text-slate-600">PIN: {row.pin}</TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell className="font-mono font-bold text-slate-800">{row.checkIn}</TableCell>
                          <TableCell className="text-amber-700 font-medium">{row.anomalyReason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Konten Tab 3: ID Belum Terhubung */}
            {activeTab === 'unmapped' && (
              <div className="border border-rose-200 bg-rose-50/20 rounded-xl p-3 space-y-2">
                <div className="text-xs text-rose-800 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Nomor PIN di bawah ini ditemukan di mesin, namun belum tercatat di data karyawan HRIS:</span>
                </div>
                {previewResult.unmapped.length === 0 ? (
                  <p className="text-xs text-emerald-700 font-medium py-3 text-center">
                    Semua nomor PIN di file log telah terhubung 100% dengan data karyawan HRIS.
                  </p>
                ) : (
                  <div className="border border-rose-200 rounded-lg bg-white overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-rose-50/60 text-xs">
                          <TableHead>PIN Mesin</TableHead>
                          <TableHead>Jumlah Scan</TableHead>
                          <TableHead>Sampel Waktu</TableHead>
                          <TableHead>Hubungkan ke Karyawan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewResult.unmapped.map((u, idx) => (
                          <TableRow key={idx} className="text-xs">
                            <TableCell className="font-mono font-bold text-rose-700">PIN: {u.pin}</TableCell>
                            <TableCell>{u.totalScans} kali</TableCell>
                            <TableCell className="font-mono text-slate-500">{u.sampleScan}</TableCell>
                            <TableCell>
                              <span className="text-[11px] text-slate-500 italic">
                                Masukkan PIN ini di menu Edit Karyawan untuk mengaitkannya secara permanen.
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
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
          disabled={!previewResult || (previewResult.ready.length === 0 && previewResult.anomalies.length === 0)}
          className="bg-navy hover:bg-navy/90 text-white text-xs gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>
            Simpan {previewResult ? previewResult.ready.length + previewResult.anomalies.length : 0} Catatan Presensi
          </span>
        </Button>
      </ModalFooter>
    </Modal>
  );
}
