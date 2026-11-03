import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Network, ArrowLeft } from 'lucide-react';
import { Card, CardContent, PageHeader } from '@/components/ui';

export default function OrganisasiJabatan() {
  return (
    <>
      <Head title="Organisasi & Jabatan" />
      <PageHeader
        eyebrow="MODUL HRIS"
        title="Struktur Organisasi & Jabatan"
        subtitle="Kelola departemen, divisi, level jabatan, dan struktur hirarki perusahaan."
      />
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-navy mx-auto mb-4">
            <Network className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-navy mb-1">Modul Struktur Organisasi & Jabatan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Modul ini dipersiapkan untuk pemetaan departemen, divisi unit kerja, jenjang jabatan, dan garis pelaporan atasan.
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

