import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  CalendarX2,
  ArrowLeft,
  CalendarCheck,
  FileCheck2,
  Clock,
  HeartPulse,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  PageHeader,
} from '@/components/ui';

export default function PengajuanCutiIzin() {
  return (
    <>
      <Head title="Pengajuan Cuti & Izin" />

      <PageHeader
        eyebrow="CUTI & PERIZINAN (LEAVE MANAGEMENT)"
        title="Pengajuan Cuti & Izin Karyawan"
        subtitle="Alur permohonan hak cuti tahunan, dispensasi sakit berdokumen, dan surat izin urusan keluarga/kedukaan."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/beranda"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-navy transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>
            <Link
              href="/saldo-cuti"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md bg-[#10273f] text-white hover:bg-[#1a3a5c] transition-colors shadow-xs"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#c4a266]" />
              <span>Cek Saldo Cuti</span>
            </Link>
          </div>
        }
      />

      {/* Banner Informasi Modul */}
      <div className="bg-[#f7f2e8] border border-[#c4a266]/40 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-[#c4a266]/30 flex items-center justify-center text-[#ab874b] shrink-0">
            <CalendarX2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-navy flex items-center gap-2">
              <span>Modul Pengajuan Cuti & Izin Mandiri</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-[#ab874b] border border-[#c4a266]/30">
                Plafon Standar 12 Hari Kerja
              </span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Terhubung otomatis ke kuota saldo cuti dan status absensi harian pada log presensi.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Kartu KPI Cuti & Perizinan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Pengajuan Aktif
              </div>
              <div className="text-2xl font-bold font-display text-navy mt-0.5">
                1 <span className="text-xs font-normal text-slate-400">permohonan</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Rina Marlina (Izin Resmi)
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Cuti Disetujui
              </div>
              <div className="text-2xl font-bold font-display text-[#398872] mt-0.5">
                8 <span className="text-xs font-normal text-slate-400">hari</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Akumulasi seluruh personil
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#eef7f1] flex items-center justify-center text-[#398872] shrink-0">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Surat Dokter Valid
              </div>
              <div className="text-2xl font-bold font-display text-[#698eb0] mt-0.5">
                100% <span className="text-xs font-normal text-slate-400">terverifikasi</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                0 kasus sakit tanpa surat
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#eff5fa] flex items-center justify-center text-[#698eb0] shrink-0">
              <HeartPulse className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Rata-rata Kuota Tersisa
              </div>
              <div className="text-2xl font-bold font-display text-[#ac8848] mt-0.5">
                9.4 <span className="text-xs font-normal text-slate-400">hari</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Dari plafon tahunan 12 hari
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#fcf6e9] flex items-center justify-center text-[#ac8848] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rencana Fitur Alur Cuti */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">1. Form Pengajuan Multi-Kategori</CardTitle>
            <CardDescription className="text-xs">Cuti Tahunan, Izin, & Dispensasi Khusus</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Mendukung pengajuan Cuti Tahunan, Cuti Menikah (3 hari), Melahirkan (3 bulan), Kedukaan (2 hari), dan Izin Ibadah.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Pencegahan pengajuan bentrok dengan rekan satu regu kerja (Grup A / B).
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">2. Unggah Dokumen Pendukung</CardTitle>
            <CardDescription className="text-xs">Lampiran surat dokter atau bukti resmi</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Fitur unggah berkas surat keterangan dokter (PDF / JPEG) langsung diverifikasi oleh HCGA sebelum status presensi disetujui.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Terkoneksi langsung ke dossier rekam medis personel.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">3. Alokasi Pengganti Tugas</CardTitle>
            <CardDescription className="text-xs">Delegasi tanggung jawab dinas</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Memastikan setiap personil yang cuti menunjuk rekan kerja pengganti agar lini operasional pabrik tidak mengalami kekosongan pos.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Notifikasi otomatis dikirimkan ke email PIC pengganti.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
