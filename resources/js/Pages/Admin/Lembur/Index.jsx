import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Timer, ArrowLeft } from 'lucide-react';
import { Card, CardContent, PageHeader } from '@/components/ui';

export default function LemburIndex() {
  return (
    <>
      <Head title="Lembur (Overtime)" />
      <PageHeader
        eyebrow="MODUL HRIS"
        title="Lembur & Kompensasi Jam Kerja"
        subtitle="Pencatatan surat perintah lembur (SPL) dan perhitungan kompensasi jam kerja."
      />
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-navy mx-auto mb-4">
            <Timer className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-navy mb-1">Modul Lembur (Overtime)</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Modul ini dipersiapkan untuk pengajuan lembur, approval supervisor, dan akumulasi jam lembur legal Depnaker.
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

