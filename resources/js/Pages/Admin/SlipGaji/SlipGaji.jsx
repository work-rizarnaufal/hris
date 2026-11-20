import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  FileText,
  ArrowLeft,
  Banknote,
  Download,
  Mail,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  PageHeader,
} from '@/components/ui';

export default function SlipGaji() {
  return (
    <>
      <Head title="Slip Gaji Digital" />

      <PageHeader
        eyebrow="PENGGAJIAN (PAYROLL SYSTEM)"
        title="Arsip & Distribusi Slip Gaji"
        subtitle="Dokumen digital rincian gaji, penerimaan bersih (take home pay), dan bukti pemotongan pajak resmi karyawan."
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
              href="/payroll"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md bg-[#10273f] text-white hover:bg-[#1a3a5c] transition-colors shadow-xs"
            >
              <Banknote className="w-3.5 h-3.5 text-[#c4a266]" />
              <span>Proses Payroll Periode</span>
            </Link>
          </div>
        }
      />

      {/* Banner Status Distribusi */}
      <div className="bg-[#f7f2e8] border border-[#c4a266]/40 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-[#c4a266]/30 flex items-center justify-center text-[#ab874b] shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-navy flex items-center gap-2">
              <span>Slip Gaji Terenkripsi & Password Protected</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-[#ab874b] border border-[#c4a266]/30">
                Format PDF Legal
              </span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Setiap berkas slip gaji diamankan dengan kata sandi (kombinasi tanggal lahir & 4 digit terakhir NIP) demi perlindungan data pribadi.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Kartu KPI Slip Gaji */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Dokumen Slip Terbit
              </div>
              <div className="text-2xl font-bold font-display text-navy mt-0.5">
                12 <span className="text-xs font-normal text-slate-400">berkas</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                100% personel aktif tercakup
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Status Distribusi Email
              </div>
              <div className="text-2xl font-bold font-display text-[#398872] mt-0.5">
                100% <span className="text-xs font-normal text-slate-400">terkirim</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Terkirim ke email terdaftar karyawan
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#eef7f1] flex items-center justify-center text-[#398872] shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Telah Diunduh Karyawan
              </div>
              <div className="text-2xl font-bold font-display text-[#ac8848] mt-0.5">
                9 <span className="text-xs font-normal text-slate-400">personel</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Akses mandiri via aplikasi mobile
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#fcf6e9] flex items-center justify-center text-[#ac8848] shrink-0">
              <Download className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Keamanan & Integritas
              </div>
              <div className="text-2xl font-bold font-display text-[#1d3046] mt-0.5">
                AES-256
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Standar enkripsi dokumen korporat
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rencana Fitur Slip Gaji */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">1. Layout Slip Formal Standar HCGA</CardTitle>
            <CardDescription className="text-xs">Rincian pendapatan & potongan</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Memuat kop surat resmi PT Manufaktur Nusantara Perkasa Tbk, identitas karyawan, rincian tunjangan shift, dan pemotongan BPJS/Pajak secara transparan.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Dilengkapi tanda tangan digital barcode QR-Code.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">2. Pengiriman Email Massal</CardTitle>
            <CardDescription className="text-xs">Distribusi 1-klik ke seluruh staf</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Kirimkan ratusan berkas slip gaji PDF terenkripsi langsung ke alamat email pribadi seluruh karyawan dengan pelacakan status pengiriman real-time.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Log pengiriman mencatat waktu deliveri sukses.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-navy">3. Portal Unduh Mandiri Karyawan</CardTitle>
            <CardDescription className="text-xs">Akses riwayat slip 12 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>Karyawan dapat melihat dan mengunduh arsip slip gaji periode lampau kapan saja tanpa perlu meminta ulang ke bagian administrasi HCGA.</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Menghemat waktu operasional staf HR hingga 80%.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
