import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
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
  ArrowLeft,
  Calendar,
  CalendarDays,
  Filter,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Input,
  TablePagination,
  Toast,
} from '@/components/ui';

export default function ImporFingerprint({
  dbEmployees = [],
  dbLocations = [],
  dbShifts = [],
}) {
  const [fileInfo, setFileInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editableRecords, setEditableRecords] = useState([]);
  const [unmappedRecords, setUnmappedRecords] = useState([]);
  const [totalScansCount, setTotalScansCount] = useState(0);

  // Filter & Search Preview States
  const [selectedDateFilter, setSelectedDateFilter] = useState('ALL'); // ALL | 'YYYY-MM-DD'
  const [previewFilter, setPreviewFilter] = useState('ALL'); // ALL | ANOMALY | READY | UNMAPPED
  const [locationFilter, setLocationFilter] = useState('ALL'); // ALL | 'Mariuk' | 'Cimalaka'
  const [searchPreview, setSearchPreview] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  // Toast feedback
  const [alertInfo, setAlertInfo] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlertInfo({ message, type });
    setTimeout(() => setAlertInfo(null), 3500);
  };

  // Reset state
  const handleReset = () => {
    setFileInfo(null);
    setEditableRecords([]);
    setUnmappedRecords([]);
    setTotalScansCount(0);
    setSelectedDateFilter('ALL');
    setPreviewFilter('ALL');
    setLocationFilter('ALL');
    setSearchPreview('');
    setCurrentPage(1);
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
          showAlert('Gagal membaca file Excel/CSV: ' + err.message, 'error');
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
          showAlert('Gagal membaca file DAT/TXT: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  // Demo scan generator untuk pengujian cepat
  const handleLoadDemoLog = () => {
    const realPins = dbEmployees
      .map((e) => String(e.biometricPin || e.biometric_pin || e.id))
      .filter((p) => p && p !== '-');
    const targetPins = realPins.length >= 4 ? realPins : ['96', '81', '37', '40'];
    const today = new Date().toISOString().slice(0, 10);

    const demoScans = [
      { pin: targetPins[0], timestamp: `${today} 07:48:10` },
      { pin: targetPins[0], timestamp: `${today} 07:48:30` },
      { pin: targetPins[0], timestamp: `${today} 17:04:15` },

      { pin: targetPins[1], timestamp: `${today} 08:22:10` },
      { pin: targetPins[1], timestamp: `${today} 17:10:00` },

      { pin: targetPins[2], timestamp: `${today} 07:55:00` },

      { pin: targetPins[3], timestamp: `${today} 07:58:12` },
      { pin: targetPins[3], timestamp: `${today} 17:02:40` },

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
      // Pemetaan PIN Karyawan komprehensif (global Mariuk & Cimalaka)
      const empMap = {};
      dbEmployees.forEach((emp) => {
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
            division: emp.division || 'Operasional & Lapangan',
            role: emp.role || emp.position || 'Staff',
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

      // Urutkan rekaman berdasarkan tanggal (terbaru di atas), lalu nama
      stagingList.sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return a.employeeName.localeCompare(b.employeeName);
      });

      setEditableRecords(stagingList);
      setUnmappedRecords(unmapped);
      setTotalScansCount(scans.length);
      setIsProcessing(false);
      showAlert(`Berhasil memproses ${scans.length} scan log menjadi ${stagingList.length} rekaman presensi.`);
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
    let filledCount = 0;
    setEditableRecords((prev) =>
      prev.map((item) => {
        if (item.isAnomaly && item.checkIn && !item.checkOut) {
          filledCount++;
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
    showAlert(`Berhasil mengisi otomatis jam pulang untuk ${filledCount} karyawan.`);
  };

  // Daftar Tanggal Unik yang Ada di File (untuk Tab Pemilih Tanggal)
  const availableDates = useMemo(() => {
    const dates = Array.from(new Set(editableRecords.map((r) => r.date))).sort();
    return dates;
  }, [editableRecords]);

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

      // 2. Filter Tanggal
      const matchDate = selectedDateFilter === 'ALL' || rec.date === selectedDateFilter;

      // 3. Filter Lokasi
      const matchLocation =
        locationFilter === 'ALL' ||
        (locationFilter === 'Mariuk' && rec.location?.includes('Mariuk')) ||
        (locationFilter === 'Cimalaka' && rec.location?.includes('Cimalaka'));

      // 4. Tab Status Filter
      if (previewFilter === 'ANOMALY') {
        return matchSearch && matchDate && matchLocation && (rec.isAnomaly || !rec.checkIn || !rec.checkOut);
      }
      if (previewFilter === 'READY') {
        return matchSearch && matchDate && matchLocation && (!rec.isAnomaly && rec.checkIn && rec.checkOut);
      }

      return matchSearch && matchDate && matchLocation;
    });
  }, [editableRecords, searchPreview, selectedDateFilter, previewFilter, locationFilter]);

  // Data Terpaginasi
  const totalFiltered = filteredPreview.length;
  const totalPages = Math.ceil(totalFiltered / perPage) || 1;
  const paginatedPreview = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredPreview.slice(start, start + perPage);
  }, [filteredPreview, currentPage, perPage]);

  // Reset page saat filter berubah
  const handleDateFilterChange = (date) => {
    setSelectedDateFilter(date);
    setCurrentPage(1);
  };

  const handleTabFilterChange = (tab) => {
    setPreviewFilter(tab);
    setCurrentPage(1);
  };

  // Commit: Simpan Data Preview Final ke Database
  const handleCommit = () => {
    if (editableRecords.length === 0) return;

    const payloadRecords = editableRecords.map((r) => ({
      employee_id: r.employeeId,
      date: r.date,
      check_in_time: (r.checkIn && r.checkIn !== '-') ? r.checkIn : null,
      check_out_time: (r.checkOut && r.checkOut !== '-') ? r.checkOut : null,
      status: r.status ? r.status.toLowerCase() : 'hadir',
      late_minutes: r.lateMinutes || 0,
      work_duration_hours: (r.checkIn && r.checkOut && r.checkIn !== '-' && r.checkOut !== '-') ? 8.0 : 0,
      location_id: r.location_id,
      notes: r.notes || r.anomalyReason || 'Presensi biometric fingerprint site',
      anomaly_reason: r.anomalyReason || null,
    }));

    router.post('/kehadiran/commit-fingerprint', {
      batch_id: `FP-PAGE-${Date.now()}`,
      records: payloadRecords,
    }, {
      preserveScroll: false,
      onSuccess: () => {
        showAlert(`Berhasil menyimpan ${editableRecords.length} data presensi ke database.`);
      },
      onError: (err) => {
        showAlert('Gagal menyimpan data presensi: ' + Object.values(err).join(', '), 'error');
      },
    });
  };

  return (
    <>
      <Head title="Meja Kerja Impor Fingerprint" />

      {/* Atomic Toast Feedback */}
      <Toast toast={alertInfo} onClose={() => setAlertInfo(null)} />

      {/* Header Halaman Penuh */}
      <PageHeader
        eyebrow="WAKTU & KEHADIRAN (TIME & ATTENDANCE)"
        title="Meja Kerja Review & Impor Log Fingerprint"
        subtitle="Verifikasi, kurasi, dan edit langsung hasil ekstraksi scan mesin presensi sebelum disimpan resmi ke database."
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/kehadiran"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Kembali ke Presensi</span>
            </Link>

            {editableRecords.length > 0 && (
              <Button
                size="sm"
                onClick={handleCommit}
                className="gap-2 bg-navy hover:bg-navy/90 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#c4a266]" />
                <span>Simpan {editableRecords.length} Data ke Database</span>
              </Button>
            )}
          </div>
        }
      />

      <div className="space-y-6">
        {/* STEP 1: UPLOAD AREA / DROPZONE */}
        {editableRecords.length === 0 ? (
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-navy/5 text-navy border border-navy/10 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-6 h-6 text-navy" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-navy">
                    Unggah Berkas Ekstraksi Mesin Fingerprint
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Mendukung berkas Excel format resmi mesin finger (<code>report_scan_*.xlsx</code> atau <code>FORMAT MESIN FINGER.xlsx</code>). Sistem otomatis memetakan PIN dan site Mariuk & Cimalaka.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-navy/60 bg-slate-50/60 hover:bg-indigo-50/20 cursor-pointer transition-all text-center group shadow-2xs">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-navy shadow-xs group-hover:scale-105 transition-transform">
                      <Upload className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Klik untuk memilih atau seret file laporan mesin ke sini
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Format yang didukung: <strong>.xlsx, .xls, .csv, .dat, .txt</strong>
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv,.dat,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="sm:w-56 w-full flex flex-col justify-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-xs font-semibold text-slate-700">Uji Coba Cepat:</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLoadDemoLog}
                    className="w-full text-xs font-medium border-amber-300 text-amber-800 hover:bg-amber-100/60 gap-1.5 h-10 shadow-2xs"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Muat Data Simulasi</span>
                  </Button>
                  <p className="text-[10px] text-slate-400">
                    Mensimulasikan 10 log scan masuk, telat, dan anomali missing out.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Format Kolom Mesin yang Didukung Otomatis:
                </p>
                <p className="font-mono text-[11px] text-slate-600">
                  Cloud ID • ID / PIN • Nama • Tanggal Absensi • Jam Absensi • Verifikasi • Tipe Absensi • Jabatan • Kantor
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* STEP 2: STAGING WORKBENCH LAYAR PENUH */
          <div className="space-y-6">
            {/* Strip Ringkasan File & Tombol Cepat */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-sm font-bold text-navy">{fileInfo?.name}</h3>
                    <Badge className="bg-slate-100 text-slate-700 font-mono text-[10px]">
                      {totalScansCount} raw scan
                    </Badge>
                    <Badge className="bg-navy/10 text-navy font-bold text-[10px]">
                      {availableDates.length} Tanggal Dinas
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rentang tanggal: <strong>{availableDates[0]}</strong> s/d <strong>{availableDates[availableDates.length - 1]}</strong> • Otomatis dikelompokkan per dinas shift 9 jam.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {stats.anomalies > 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAutoFillMissingOut}
                    className="h-9 px-3 text-xs text-amber-900 border-amber-300 bg-amber-50 hover:bg-amber-100 gap-1.5 font-bold shadow-2xs"
                    title="Otomatis isi jam pulang standar (17:00 Pagi / 05:00 Malam) untuk seluruh karyawan yang lupa tap pulang"
                  >
                    <Wand2 className="w-4 h-4 text-amber-600" />
                    <span>Auto-Fill Jam Pulang ({stats.anomalies} Anomali)</span>
                  </Button>
                )}

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                  className="h-9 px-3 text-xs text-slate-600 hover:text-navy gap-1.5 bg-white border-slate-200"
                  title="Ganti atau unggah berkas laporan lain"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ganti File</span>
                </Button>
              </div>
            </div>

            {/* 4 Kartu Metrik Staging */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-slate-200 shadow-2xs">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Total Rekaman Dinas
                    </p>
                    <p className="text-2xl font-bold font-display text-navy mt-1">
                      {stats.total} <span className="text-sm font-normal text-slate-400">Baris</span>
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Seluruh personil & tanggal dinas
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-navy/5 text-navy flex items-center justify-center">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-2xs">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Lengkap & Siap Simpan
                    </p>
                    <p className="text-2xl font-bold font-display text-emerald-700 mt-1">
                      {stats.ready} <span className="text-sm font-normal text-slate-400">Rekaman</span>
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      Tap masuk & pulang lengkap
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-2xs">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Perlu Review (Anomali)
                    </p>
                    <p className="text-2xl font-bold font-display text-amber-700 mt-1">
                      {stats.anomalies} <span className="text-sm font-normal text-slate-400">Kasus</span>
                    </p>
                    <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                      Lupa tap pulang / masuk
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-2xs">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      PIN Belum Terdaftar
                    </p>
                    <p className="text-2xl font-bold font-display text-rose-700 mt-1">
                      {stats.unmapped} <span className="text-sm font-normal text-slate-400">PIN</span>
                    </p>
                    <p className="text-[11px] text-rose-600 font-medium mt-0.5">
                      Tidak cocok dengan master NIP
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* TAB PEMILIH TANGGAL (DATE NAVIGATION RIBBON) */}
            {availableDates.length > 1 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
                  <Calendar className="w-4 h-4 text-[#c4a266]" />
                  <span>Pilih Tanggal Dinas untuk Ditinjau:</span>
                </div>
                <div className="flex items-center gap-2 pt-2.5 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => handleDateFilterChange('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedDateFilter === 'ALL'
                        ? 'bg-navy text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Semua Tanggal ({editableRecords.length})
                  </button>

                  {availableDates.map((dateStr) => {
                    const countOnDate = editableRecords.filter((r) => r.date === dateStr).length;
                    const anomaliesOnDate = editableRecords.filter(
                      (r) => r.date === dateStr && (r.isAnomaly || !r.checkIn || !r.checkOut)
                    ).length;

                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => handleDateFilterChange(dateStr)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                          selectedDateFilter === dateStr
                            ? 'bg-navy text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{dateStr}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            selectedDateFilter === dateStr
                              ? 'bg-white/20 text-white'
                              : anomaliesOnDate > 0
                              ? 'bg-amber-100 text-amber-800 font-bold'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {countOnDate} {anomaliesOnDate > 0 && `(⚠️${anomaliesOnDate})`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TABEL PREVIEW INTERAKTIF & TOOLBAR LENGKAP */}
            <Card className="border-slate-200 shadow-2xs">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold text-navy flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-indigo-600" />
                    <span>Tabel Staging Pratinjau Presensi</span>
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Seluruh sel <strong>Jam Masuk</strong>, <strong>Jam Pulang</strong>, dan <strong>Status</strong> dapat diedit langsung pada tabel di bawah.
                  </CardDescription>
                </div>

                {/* Filter Status Badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleTabFilterChange('ALL')}
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
                    onClick={() => handleTabFilterChange('ANOMALY')}
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
                    onClick={() => handleTabFilterChange('READY')}
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
                      onClick={() => handleTabFilterChange('UNMAPPED')}
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
              </CardHeader>

              {/* Toolbar Pencarian & Filter Lokasi */}
              {previewFilter !== 'UNMAPPED' && (
                <div className="p-3.5 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="text"
                      value={searchPreview}
                      onChange={(e) => {
                        setSearchPreview(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Cari nama karyawan, NIP, atau PIN..."
                      className="h-9 pl-9 text-xs bg-white text-slate-800 shadow-2xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={locationFilter}
                      onChange={(e) => {
                        setLocationFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-9 text-xs rounded-lg border border-slate-200 bg-white px-3 font-medium text-slate-700 shadow-2xs focus:border-navy focus:ring-navy"
                    >
                      <option value="ALL">Semua Lokasi Site</option>
                      <option value="Mariuk">📍 Site Mariuk</option>
                      <option value="Cimalaka">📍 Site Cimalaka</option>
                    </select>

                    <span className="text-xs text-slate-500 font-medium">
                      Menampilkan <strong>{paginatedPreview.length}</strong> dari <strong>{totalFiltered}</strong> rekaman
                    </span>
                  </div>
                </div>
              )}

              {/* Tabel Staging Lebar Penuh */}
              {previewFilter !== 'UNMAPPED' ? (
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/90 text-xs border-b border-slate-200">
                        <TableHead className="w-12 text-center text-slate-600 font-bold">No</TableHead>
                        <TableHead className="min-w-[220px] text-slate-800 font-bold">Karyawan & Profil</TableHead>
                        <TableHead className="min-w-[150px] text-slate-700 font-bold">Shift & Divisi</TableHead>
                        <TableHead className="w-28 text-center text-slate-700 font-bold">Tgl Dinas</TableHead>
                        <TableHead className="w-32 text-center text-slate-800 font-bold">Jam Masuk (WIB)</TableHead>
                        <TableHead className="w-32 text-center text-slate-800 font-bold">Jam Pulang (WIB)</TableHead>
                        <TableHead className="w-28 text-center text-slate-700 font-bold">Deviasi</TableHead>
                        <TableHead className="w-36 text-slate-800 font-bold">Status Presensi</TableHead>
                        <TableHead className="min-w-[180px] text-slate-700 font-bold">Catatan / Keterangan</TableHead>
                        <TableHead className="w-12 text-center text-slate-600 font-bold">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {paginatedPreview.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-12 text-slate-400 text-xs">
                            Tidak ada data presensi yang cocok dengan filter aktif.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedPreview.map((row, idx) => {
                          const globalIdx = (currentPage - 1) * perPage + idx + 1;
                          const hasAnomaly = row.isAnomaly || !row.checkIn || !row.checkOut;
                          const isMariuk = row.location?.includes('Mariuk');

                          return (
                            <TableRow
                              key={row.id}
                              className={`text-xs transition-colors ${
                                hasAnomaly ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/70'
                              }`}
                            >
                              <TableCell className="text-center font-medium text-slate-500">
                                {globalIdx}
                              </TableCell>

                              {/* Karyawan & Profil Gabungan (Mudah Dibaca) */}
                              <TableCell className="py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded-full bg-navy/10 text-navy font-bold flex items-center justify-center text-xs shrink-0">
                                    {row.employeeName
                                      .split(' ')
                                      .map((n) => n[0])
                                      .slice(0, 2)
                                      .join('')}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <p className="font-bold text-navy text-sm">{row.employeeName}</p>
                                      <span
                                        className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                          isMariuk
                                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                            : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                                        }`}
                                      >
                                        {isMariuk ? 'Mariuk' : 'Cimalaka'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-0.5">
                                      <span>{row.nip}</span>
                                      <span>•</span>
                                      <span className="font-semibold text-slate-700">PIN: {row.pin}</span>
                                      <span>•</span>
                                      <span className="text-slate-400">{row.role}</span>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>

                              {/* Shift & Divisi */}
                              <TableCell>
                                <span className="inline-block text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                  {row.shift}
                                </span>
                                <p className="text-[11px] text-slate-500 mt-0.5">{row.division}</p>
                              </TableCell>

                              {/* Tanggal Dinas */}
                              <TableCell className="text-center font-mono text-xs font-bold text-slate-700 whitespace-nowrap">
                                {row.date}
                              </TableCell>

                              {/* Jam Masuk (Editable Input Waktu) */}
                              <TableCell className="text-center p-2">
                                <Input
                                  type="time"
                                  value={row.checkIn}
                                  onChange={(e) => handleFieldChange(row.id, 'checkIn', e.target.value)}
                                  className={`h-9 w-28 text-sm font-mono text-center font-bold mx-auto shadow-2xs ${
                                    !row.checkIn
                                      ? 'border-amber-400 bg-amber-50 text-amber-900 ring-1 ring-amber-400'
                                      : 'bg-white text-slate-900 border-slate-300'
                                  }`}
                                />
                              </TableCell>

                              {/* Jam Pulang (Editable Input Waktu) */}
                              <TableCell className="text-center p-2">
                                <Input
                                  type="time"
                                  value={row.checkOut}
                                  onChange={(e) => handleFieldChange(row.id, 'checkOut', e.target.value)}
                                  className={`h-9 w-28 text-sm font-mono text-center font-bold mx-auto shadow-2xs ${
                                    !row.checkOut
                                      ? 'border-amber-400 bg-amber-50 text-amber-900 ring-1 ring-amber-400'
                                      : 'bg-white text-slate-900 border-slate-300'
                                  }`}
                                />
                              </TableCell>

                              {/* Deviasi / Keterlambatan */}
                              <TableCell className="text-center">
                                {row.lateMinutes > 0 ? (
                                  <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-mono text-xs font-bold">
                                    +{row.lateMinutes}m
                                  </Badge>
                                ) : row.checkIn ? (
                                  <span className="text-xs text-emerald-700 font-bold inline-flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5" />
                                    Tepat
                                  </span>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </TableCell>

                              {/* Status Presensi (Dropdown) */}
                              <TableCell className="p-2">
                                <select
                                  value={row.status}
                                  onChange={(e) => handleFieldChange(row.id, 'status', e.target.value)}
                                  className="h-9 w-full text-xs font-semibold rounded-lg border border-slate-300 bg-white px-2.5 focus:border-navy focus:ring-navy shadow-2xs"
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

                              {/* Catatan / Keterangan */}
                              <TableCell className="p-2">
                                <Input
                                  type="text"
                                  value={row.notes || ''}
                                  onChange={(e) => handleFieldChange(row.id, 'notes', e.target.value)}
                                  placeholder="Keterangan..."
                                  className="h-9 text-xs bg-white text-slate-700 border-slate-300 shadow-2xs"
                                />
                              </TableCell>

                              {/* Tombol Hapus Baris */}
                              <TableCell className="text-center p-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteRow(row.id)}
                                  className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                  title="Hapus baris ini dari daftar impor"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>

                  {/* Kontrol Paginasi */}
                  <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRows={totalFiltered}
                    perPage={perPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    onPerPageChange={(newPerPage) => {
                      setPerPage(newPerPage);
                      setCurrentPage(1);
                    }}
                  />
                </CardContent>
              ) : (
                /* TAB KHUSUS PIN TIDAK TERDAFTAR */
                <CardContent className="p-6">
                  <div className="border border-rose-200 bg-rose-50/30 rounded-2xl p-4 space-y-3">
                    <div className="text-xs text-rose-800 flex items-center gap-2 font-bold">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>
                        Nomor PIN di bawah ini ditemukan di mesin presensi, namun belum tercatat di data karyawan HRIS:
                      </span>
                    </div>

                    <div className="border border-rose-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-rose-50/60 text-xs font-bold text-slate-700">
                            <TableHead>PIN Mesin</TableHead>
                            <TableHead>Jumlah Scan Log</TableHead>
                            <TableHead>Sampel Scan Terakhir</TableHead>
                            <TableHead>Solusi Tindak Lanjut</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {unmappedRecords.map((u, idx) => (
                            <TableRow key={idx} className="text-xs">
                              <TableCell className="font-mono font-bold text-rose-700 text-sm">
                                PIN: {u.pin}
                              </TableCell>
                              <TableCell className="font-semibold">{u.totalScans} kali scan</TableCell>
                              <TableCell className="font-mono text-slate-500">{u.sampleScan}</TableCell>
                              <TableCell className="text-slate-600 text-[11px]">
                                Masukkan PIN ini pada menu <strong>Data Karyawan</strong> untuk mengaitkannya secara permanen ke profil karyawan.
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* STICKY BOTTOM ACTION BAR */}
            <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  <strong>{editableRecords.length}</strong> rekaman siap disimpan ke database
                  {stats.anomalies > 0 && (
                    <strong className="text-amber-700 ml-1">
                      ({stats.anomalies} anomali tersisa)
                    </strong>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs border-slate-300 text-slate-700"
                >
                  Batal & Unggah Ulang
                </Button>

                <Button
                  size="sm"
                  onClick={handleCommit}
                  disabled={editableRecords.length === 0}
                  className="gap-2 bg-navy hover:bg-navy/90 text-white font-bold text-xs shadow-md"
                >
                  <Save className="w-4 h-4 text-[#c4a266]" />
                  <span>Simpan Seluruh Data ke Database</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
