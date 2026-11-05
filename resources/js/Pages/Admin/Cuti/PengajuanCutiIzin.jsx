import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CalendarX2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, PageHeader, Badge } from '@/components/ui';
import { useActiveSite } from '@/services/systemSettings.js';

export default function PengajuanCutiIzin() {
  const activeSite = useActiveSite();
  return (
    <>
      <Head title="Pengajuan Cuti & Izin" />
      <PageHeader
        eyebrow={`MODUL HRIS ${activeSite.id !== 'all' ? `· ${activeSite.code}` : ''}`}
        title="Pengajuan Cuti & Izin"
        subtitle={`Alur permohonan, verifikasi surat sakit, dan persetujuan izin operasional area operasional ${activeSite.name}.`}
      />
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-navy mx-auto mb-4">
            <CalendarX2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-navy mb-1">Modul Pengajuan Cuti & Izin</h3>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f7f2e8] text-[#ab874b] border border-[#c4a266]/30 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c4a266] animate-pulse" />
            <span>Site Operasional: {activeSite.name}</span>
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Modul ini dipersiapkan untuk formulir pengajuan cuti tahunan, sakit dengan surat dokter, dan alur bertingkat (approval flow).
          </p>
          <Link href="/beranda" className="button secondary">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </CardContent>
      </Card>
    </>
  );
}

