import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Card, CardContent, PageHeader } from '@/components/ui';

export default function SlipGaji() {
  return (
    <>
      <Head title="Slip Gaji" />
      <PageHeader
        eyebrow="MODUL HRIS"
        title="Dokumen & Slip Gaji Karyawan"
        subtitle="Arsip dan distribusi dokumen slip gaji resmi kepada setiap karyawan."
      />
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-navy mx-auto mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-navy mb-1">Modul Dokumen Slip Gaji</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Modul ini dipersiapkan untuk generator PDF slip gaji terenkripsi password dan riwayat download slip gaji per bulan.
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

