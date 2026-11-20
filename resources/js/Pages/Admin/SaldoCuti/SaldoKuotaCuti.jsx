import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  WalletCards,
  ArrowLeft,
  CalendarCheck,
  CalendarDays,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  PageHeader,
} from '@/components/ui';

export default function SaldoKuotaCuti() {
  return (
    <>
      <Head title="Saldo & Kuota Cuti" />

      <PageHeader
        eyebrow="CUTI & PERIZINAN (LEAVE MANAGEMENT)"
        title="Saldo & Kuota Cuti Karyawan"
        subtitle="Pemantauan hak plafon cuti tahunan 12 hari kerja, pemotongan cuti bersama pemerintah, dan masa kedaluwarsa kuota."
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
              href="/cuti"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md bg-[#10273f] text-white hover:bg-[#1a3a5c] transition-colors shadow-xs"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#c4a266]" />
              <span>Form Pengajuan Cuti</span>
            </Link>
          </div>
        }
      />

      {/* Banner Ringkasan Kebijakan */}
      <div className="bg-[#f7f2e8] border border-[#c4a266]/40 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-[#c4a266]/30 flex items-center justify-center text-[#ab874b] shrink-0">
            <WalletCards className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-navy flex items-center gap-2">
              <span>Rekapitulasi Hak Plafon Cuti 2026</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-[#ab874b] border border-[#c4a266]/30">
                Regulasi UU Cipta Kerja
              </span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Setiap karyawan berhak atas 12 hari cuti tahunan setelah masa kerja 12 bulan berturut-turut. Batas hangus: 31 Maret tahun berikutnya.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Kartu KPI Saldo Cuti */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Total Plafon Terbit
              </div>
              <div className="text-2xl font-bold font-display text-navy mt-0.5">
                144 <span className="text-xs font-normal text-slate-400">hari</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Basis 12 personel aktif (12 hari/org)
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Cuti Telah Diambil
              </div>
              <div className="text-2xl font-bold font-display text-[#ac8848] mt-0.5">
                31 <span className="text-xs font-normal text-slate-400">hari</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                21.5% utilisasi kuota tahunan
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#fcf6e9] flex items-center justify-center text-[#ac8848] shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Sisa Saldo Kuota
              </div>
              <div className="text-2xl font-bold font-display text-[#398872] mt-0.5">
                113 <span className="text-xs font-normal text-slate-400">hari</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Rata-rata 9.4 hari per personel
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
                Potongan Cuti Bersama
              </div>
              <div className="text-2xl font-bold font-display text-[#698eb0] mt-0.5">
                4 <span className="text-xs font-normal text-slate-400">hari</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Sesuai SKB 3 Menteri 2026
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#eff5fa] flex items-center justify-center text-[#698eb0] shrink-0">
              <Percent className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rencana Fitur Monitoring Saldo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">1. Buku Rekening Cuti Individu</CardTitle>
            <CardDescription className="text-xs">Ledger debet & kredit hak cuti</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Setiap transaksi pengambilan cuti dicatat kronologis lengkap dengan nomor tiket permohonan, tanggal efektif, dan sisa saldo berjalan.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Karyawan dapat melihat buku saldo langsung dari portal mandiri.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">2. Skema Potong Cuti Bersama</CardTitle>
            <CardDescription className="text-xs">Sinkronisasi kalender hari libur</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Otomatis memotong kuota tahunan jika perusahaan menetapkan cuti bersama wajib, atau mengecualikan jika status hari libur tidak memotong cuti.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Dikonfigurasi terpusat melalui Pengaturan Sistem.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">3. Peringatan Dini Kedaluwarsa</CardTitle>
            <CardDescription className="text-xs">Pencegahan hangus kuota tahunan</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Sistem mengirimkan notifikasi 60 hari dan 30 hari sebelum batas kedaluwarsa 31 Maret kepada karyawan yang masih memiliki sisa saldo signifikan.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Membantu perencanaan libur regu tanpa mengganggu operasional.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
