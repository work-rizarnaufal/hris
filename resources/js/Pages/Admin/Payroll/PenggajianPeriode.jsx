import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Banknote,
  ArrowLeft,
  CalendarCheck,
  Calculator,
  CreditCard,
  FileSpreadsheet,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  PageHeader,
} from '@/components/ui';

export default function PenggajianPeriode() {
  return (
    <>
      <Head title="Penggajian & Periode Payroll" />

      <PageHeader
        eyebrow="PENGGAJIAN (PAYROLL SYSTEM)"
        title="Penggajian & Periode Payroll"
        subtitle="Kalkulasi gaji pokok, tunjangan kehadiran shift, kompensasi lembur, potongan PPh 21, dan iuran BPJS."
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
              href="/slip-gaji"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md bg-[#10273f] text-white hover:bg-[#1a3a5c] transition-colors shadow-xs"
            >
              <Banknote className="w-3.5 h-3.5 text-[#c4a266]" />
              <span>Arsip Slip Gaji</span>
            </Link>
          </div>
        }
      />

      {/* Banner Periode Aktif */}
      <div className="bg-[#f7f2e8] border border-[#c4a266]/40 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-[#c4a266]/30 flex items-center justify-center text-[#ab874b] shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-navy flex items-center gap-2">
              <span>Periode Penggajian: November 2026 (Cut-Off: 25 Okt - 24 Nov)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-[#ab874b] border border-[#c4a266]/30">
                Otomatisasi Presensi
              </span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Tunjangan kehadiran dihitung otomatis berdasarkan data presensi tepat waktu dan menit keterlambatan pada modul Kehadiran.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Kartu KPI Payroll */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Total Anggaran Gaji
              </div>
              <div className="text-2xl font-bold font-display text-navy mt-0.5">
                Rp 84.5M <span className="text-xs font-normal text-slate-400">est.</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Gaji pokok 12 personel aktif
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <Banknote className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Tunjangan Shift & Presensi
              </div>
              <div className="text-2xl font-bold font-display text-[#398872] mt-0.5">
                Rp 11.2M <span className="text-xs font-normal text-slate-400">est.</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Reward tepat waktu & shift malam
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#eef7f1] flex items-center justify-center text-[#398872] shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Iuran BPJS Ketenagakerjaan
              </div>
              <div className="text-2xl font-bold font-display text-[#ac8848] mt-0.5">
                Rp 6.8M
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                JHT, JKK, JKM, & Jaminan Pensiun
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#fcf6e9] flex items-center justify-center text-[#ac8848] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Potongan Pajak PPh 21
              </div>
              <div className="text-2xl font-bold font-display text-[#698eb0] mt-0.5">
                Rp 4.1M
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Skema TER (Tarif Efektif Rata-rata)
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#eff5fa] flex items-center justify-center text-[#698eb0] shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rencana Fitur Modul Payroll */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">1. Engine Kalkulasi Otomatis</CardTitle>
            <CardDescription className="text-xs">Integrasi data presensi harian</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Menghitung kehadiran penuh, potongan menit telat, jam lembur resmi dari SPL, serta insentif shift malam dalam satu klik pemrosesan periode.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Bebas dari kesalahan input manual spreadsheet.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">2. Formula Standar PPh 21 & BPJS</CardTitle>
            <CardDescription className="text-xs">Kepatuhan regulasi fiskal terkini</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Perhitungan tarif pajak PPh 21 TER 2024 (Kategori A, B, C) serta BPJS Kesehatan (4% perusahaan, 1% pekerja) dan BPJS Ketenagakerjaan.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Output berkas siap impor format e-Bupot DJP.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">3. Ekspor Pembayaran Bank (Payroll Batch)</CardTitle>
            <CardDescription className="text-xs">Format transfer korporat terenkripsi</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Hasilkan file transfer massal (BCA Payroll, Mandiri MCM, BRI CMS) yang siap diunggah ke portal perbankan operasional.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Validasi nomor rekening bank per karyawan.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
