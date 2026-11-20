import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Network,
  ArrowLeft,
  Building,
  Users,
  Briefcase,
  Layers,
  ShieldCheck,
  Building2,
  FolderTree,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  PageHeader,
} from '@/components/ui';

export default function OrganisasiJabatan() {
  return (
    <>
      <Head title="Struktur Organisasi & Jabatan" />

      <PageHeader
        eyebrow="MANAJEMEN KARYAWAN (CORE HR)"
        title="Struktur Organisasi & Level Jabatan"
        subtitle="Pemetaan departemen, divisi unit kerja, jenjang kepangkatan/eselon, dan rantai garis pelaporan atasan (reporting line)."
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
              href="/karyawan"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md bg-[#10273f] text-white hover:bg-[#1a3a5c] transition-colors shadow-xs"
            >
              <Users className="w-3.5 h-3.5 text-[#c4a266]" />
              <span>Direktori Karyawan</span>
            </Link>
          </div>
        }
      />

      {/* Banner Informasi Modul */}
      <div className="bg-[#f7f2e8] border border-[#c4a266]/40 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-[#c4a266]/30 flex items-center justify-center text-[#ab874b] shrink-0">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-navy flex items-center gap-2">
              <span>Matriks Organisasi PT Manufaktur Nusantara Perkasa Tbk</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-[#ab874b] border border-[#c4a266]/30">
                Hirarki Operasional
              </span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Struktur pembagian unit kerja memandu penugasan shift kerja, alur persetujuan cuti/lembur, dan wewenang operasional lapangan.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Kartu KPI Organisasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Unit Divisi Aktif
              </div>
              <div className="text-2xl font-bold font-display text-navy mt-0.5">
                4 <span className="text-xs font-normal text-slate-400">divisi</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Operasional, Logistik, Security, HCGA
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Titik Lokasi Kerja
              </div>
              <div className="text-2xl font-bold font-display text-[#398872] mt-0.5">
                3 <span className="text-xs font-normal text-slate-400">site</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Pabrik Sidoarjo, Gudang Rungkut, Kantor Pusat
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#eef7f1] flex items-center justify-center text-[#398872] shrink-0">
              <Building className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Level Jabatan
              </div>
              <div className="text-2xl font-bold font-display text-[#ac8848] mt-0.5">
                5 <span className="text-xs font-normal text-slate-400">tingkat</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Operator, Staf, Danru, Koordinator, SPV
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#fcf6e9] flex items-center justify-center text-[#ac8848] shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Personil Terpetakan
              </div>
              <div className="text-2xl font-bold font-display text-[#1d3046] mt-0.5">
                100%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                12 dari 12 karyawan memiliki atasan
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rencana Fitur Organisasi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">1. Bagan Struktur Interaktif</CardTitle>
            <CardDescription className="text-xs">Diagram pohon hierarki visual</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Visualisasi garis komando mulai dari Direksi, Manajer HCGA, Supervisor Lapangan, hingga tim regu kerja operasional.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Mendukung navigasi zoom dan klik detail jabatan.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">2. Manajemen Master Jabatan</CardTitle>
            <CardDescription className="text-xs">Kamus kompetensi & job description</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Kelola kode jabatan standar (misal: `OP-01`, `QC-02`, `HR-01`), rentang gaji pokok, dan kualifikasi minimum personil.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Tersinkron dengan formulir tambah data karyawan.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">3. Alur Garis Pelaporan (Approval Matrix)</CardTitle>
            <CardDescription className="text-xs">Penentuan approver otomatis</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Ketika karyawan mengajukan lembur atau cuti, sistem otomatis meneruskan permintaan ke atasan langsung sesuai struktur jabatan aktif.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Mencegah alur persetujuan salah sasaran.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
