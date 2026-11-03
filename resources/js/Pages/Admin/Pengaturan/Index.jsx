import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Settings as SettingsIcon, ArrowLeft } from 'lucide-react';
import { Card, CardContent, PageHeader } from '@/components/ui';

export default function PengaturanIndex() {
  return (
    <>
      <Head title="Pengaturan Sistem" />
      <PageHeader
        eyebrow="MODUL HCGA"
        title="Pengaturan Sistem"
        subtitle="Konfigurasi kalender kerja perusahaan, libur khusus, backup database, dan data pengujian."
      />
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-navy mx-auto mb-4">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-navy mb-1">Modul Pengaturan Sistem</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Modul ini sedang disiapkan untuk pengaturan kalender kerja, libur nasional, dan pencadangan data.
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

