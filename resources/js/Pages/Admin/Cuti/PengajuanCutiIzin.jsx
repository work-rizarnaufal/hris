import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CalendarX2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, PageHeader } from '@/components/ui';

export default function PengajuanCutiIzin() {
  return (
    <>
      <Head title="Pengajuan Cuti & Izin" />
      <PageHeader
        eyebrow="MODUL HRIS"
        title="Pengajuan Cuti & Izin"
        subtitle="Alur permohonan, verifikasi surat sakit, dan persetujuan izin operasional."
      />
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-navy mx-auto mb-4">
            <CalendarX2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-navy mb-1">Modul Pengajuan Cuti & Izin</h3>
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

