import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CalendarCheck, ArrowLeft } from 'lucide-react';
import { Card, CardContent, PageHeader } from '@/components/ui';

export default function KehadiranIndex() {
  return (
    <>
      <Head title="Catatan Kehadiran" />
      <PageHeader
        eyebrow="MODUL HCGA"
        title="Catatan Kehadiran"
        subtitle="Monitoring kehadiran harian, absensi shift operasional, dan tracking keterlambatan."
      />
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-navy mx-auto mb-4">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-navy mb-1">Modul Catatan Kehadiran</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Modul ini sedang disiapkan untuk pencatatan absensi harian dan input massal shift kerja.
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

