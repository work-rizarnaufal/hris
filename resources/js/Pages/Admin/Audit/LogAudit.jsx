import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  History,
  ArrowLeft,
  ShieldCheck,
  Activity,
  FileCheck,
  UserCheck,
  Lock,
  Search,
  Database,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  PageHeader,
} from '@/components/ui';

export default function LogAudit() {
  return (
    <>
      <Head title="Log Audit & Riwayat Aktivitas" />

      <PageHeader
        eyebrow="PENGATURAN & AUDIT (ADMINISTRATION)"
        title="Log Audit & Riwayat Keamanan"
        subtitle="Telusuri rekam jejak setiap aksi penambahan, pengubahan, penghapusan data, serta aktivitas autentikasi administrator."
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
              href="/pengaturan"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md bg-[#10273f] text-white hover:bg-[#1a3a5c] transition-colors shadow-xs"
            >
              <Database className="w-3.5 h-3.5 text-[#c4a266]" />
              <span>Pengaturan Sistem</span>
            </Link>
          </div>
        }
      />

      {/* Banner Informasi Keamanan */}
      <div className="bg-[#f7f2e8] border border-[#c4a266]/40 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-[#c4a266]/30 flex items-center justify-center text-[#ab874b] shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-navy flex items-center gap-2">
              <span>Audit Trail Kepatuhan Regulasi ISO 27001</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-[#ab874b] border border-[#c4a266]/30">
                Immutable Ledger
              </span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Setiap catatan tersimpan dengan timestamp presisi WIB, alamat IP pemanggil, user-agent, dan diff data sebelum-sesudah perubahan.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Kartu KPI Audit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Total Peristiwa Tercatat
              </div>
              <div className="text-2xl font-bold font-display text-navy mt-0.5">
                1,280 <span className="text-xs font-normal text-slate-400">log</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                30 hari terakhir
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <Activity className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Perubahan Data Master
              </div>
              <div className="text-2xl font-bold font-display text-[#398872] mt-0.5">
                48 <span className="text-xs font-normal text-slate-400">aksi</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Karyawan & jadwal shift
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#eef7f1] flex items-center justify-center text-[#398872] shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Sesi Autentikasi
              </div>
              <div className="text-2xl font-bold font-display text-[#ac8848] mt-0.5">
                100% <span className="text-xs font-normal text-slate-400">aman</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                0 percobaan login mencurigakan
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
                Retensi Arsip Log
              </div>
              <div className="text-2xl font-bold font-display text-[#1d3046] mt-0.5">
                365 <span className="text-xs font-normal text-slate-400">hari</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Rotasi otomatis ke cold storage
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <Lock className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rencana Fitur Log Audit */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">1. Pencarian & Filter Multi-Kriteria</CardTitle>
            <CardDescription className="text-xs">Penyaringan cepat insiden data</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Filter berdasarkan nama operator, modul yang diubah (Karyawan, Presensi, Roster), rentang tanggal, hingga tipe aksi (CREATE, UPDATE, DELETE).</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Ekspor hasil audit ke format CSV/Excel terenkripsi.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">2. Inspeksi Diff Nilai Sebelum & Sesudah</CardTitle>
            <CardDescription className="text-xs">Transparansi perubahan data</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Melihat dengan jelas teks mana yang diubah, siapa yang menyetujui, dan alasan koreksi data jika terjadi penyesuaian jam presensi manual.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Mencegah pemalsuan absensi di lapangan.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">3. Peringatan Aksi Kritis (Alerting)</CardTitle>
            <CardDescription className="text-xs">Deteksi anomali real-time</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Notifikasi otomatis ke email manajer jika terdeteksi penghapusan data massal, perubahan master payroll, atau reset konfigurasi sistem.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Kunci keamanan tingkat enterprise.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
