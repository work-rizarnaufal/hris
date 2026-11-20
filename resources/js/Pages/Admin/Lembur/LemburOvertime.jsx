import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Timer,
  ArrowLeft,
  CalendarCheck,
  FileCheck,
  AlertCircle,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  PageHeader,
  Badge,
} from '@/components/ui';

export default function LemburOvertime() {
  return (
    <>
      <Head title="Lembur (Overtime) & SPL" />

      <PageHeader
        eyebrow="WAKTU & KEHADIRAN (TIME & ATTENDANCE)"
        title="Lembur & Kompensasi Jam Kerja"
        subtitle="Pencatatan Surat Perintah Lembur (SPL), persetujuan berjenjang supervisor, dan kalkulasi jam kerja legal Depnaker."
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
              href="/kehadiran"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md bg-[#10273f] text-white hover:bg-[#1a3a5c] transition-colors shadow-xs"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#c4a266]" />
              <span>Buka Catatan Presensi</span>
            </Link>
          </div>
        }
      />

      {/* Banner Status Pengembangan */}
      <div className="bg-[#f7f2e8] border border-[#c4a266]/40 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-[#c4a266]/30 flex items-center justify-center text-[#ab874b] shrink-0">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-navy flex items-center gap-2">
              <span>Modul Lembur (Overtime) & SPL</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-[#ab874b] border border-[#c4a266]/30">
                Tahap Finalisasi UI & Logika
              </span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Skema perhitungan otomatis koefisien pengali Depnaker (Jam ke-1: 1.5x, Jam ke-2+: 2.0x) terintegrasi dengan mesin presensi.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Kartu Metrik Rencana Lembur */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Akumulasi Jam Lembur
              </div>
              <div className="text-2xl font-bold font-display text-navy mt-0.5">
                42.5 <span className="text-xs font-normal text-slate-400">jam</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Bulan berjalan (12 personel)
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
                SPL Perlu Approval
              </div>
              <div className="text-2xl font-bold font-display text-[#ac8848] mt-0.5">
                2 <span className="text-xs font-normal text-slate-400">berkas</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Menunggu verifikasi supervisor
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#fcf6e9] flex items-center justify-center text-[#ac8848] shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Kepatuhan Batas Depnaker
              </div>
              <div className="text-2xl font-bold font-display text-[#398872] mt-0.5">
                100% <span className="text-xs font-normal text-slate-400">legal</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Maksimal 4 jam/hari terpenuhi
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#eef7f1] flex items-center justify-center text-[#398872] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Koefisien Kompensasi
              </div>
              <div className="text-2xl font-bold font-display text-navy mt-0.5">
                1.5x - 2x
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Formula resmi tarif ketenagakerjaan
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rencana Fitur Operasional Modul Lembur */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">1. Form Surat Perintah Lembur (SPL)</CardTitle>
            <CardDescription className="text-xs">Pengajuan penugasan pra-lembur</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Pengisian personil dinas lembur, estimasi jam mulai & akhir, rincian pekerjaan operasional darurat/maintenance pabrik.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Mendukung multi-select personil dari Grup A / B sekaligus.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">2. Alur Approval Bertingkat</CardTitle>
            <CardDescription className="text-xs">Persetujuan supervisor & HCGA</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Verifikasi wewenang oleh Danru/Kepala Regu, dilanjutkan validasi anggaran operasional oleh Departemen HCGA.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Status real-time: Diajukan, Disetujui, Ditolak, Dibatalkan.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">3. Rekonsiliasi Presensi Fisik</CardTitle>
            <CardDescription className="text-xs">Validasi silang jam check-out</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Klaim lembur dicocokkan otomatis dengan rekaman check-out mesin presensi atau titik geofencing mobile presensi.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Mencegah klaim fiktif di luar jam kehadiran aktual.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
