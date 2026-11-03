import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Banknote, ArrowLeft } from 'lucide-react';
import { Card, CardContent, PageHeader } from '@/components/ui';

export default function PenggajianPeriode() {
  return (
    <>
      <Head title="Penggajian & Periode" />
      <PageHeader
        eyebrow="MODUL HRIS"
        title="Penggajian & Periode Payroll"
        subtitle="Kalkulasi gaji pokok, tunjangan kehadiran, potongan PPh 21, dan BPJS."
      />
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-navy mx-auto mb-4">
            <Banknote className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-navy mb-1">Modul Penggajian (Payroll)</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Modul ini dipersiapkan untuk integrasi data kehadiran harian ke dalam komponen payroll, potongan keterlambatan, dan iuran BPJS.
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

