import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import { Card, CardContent, PageHeader } from '@/components/ui';

export default function JadwalShift() {
  return (
    <>
      <Head title="Jadwal & Grup" />
      <PageHeader
        eyebrow="MODUL HCGA"
        title="Jadwal & Grup"
        subtitle="Pengaturan roster rotasi shift 2 grup (A/B) dan pengecualian operasional manual."
      />
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-navy mx-auto mb-4">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-navy mb-1">Modul Jadwal & Roster Grup</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Modul ini sedang disiapkan untuk konfigurasi pola rotasi 2-grup (A/B) dan kalender shift.
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

