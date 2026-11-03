import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { History, ArrowLeft } from 'lucide-react';
import { Card, CardContent, PageHeader } from '@/components/ui';

export default function AuditIndex() {
  return (
    <>
      <Head title="Log Audit" />
      <PageHeader
        eyebrow="MODUL HCGA"
        title="Log Audit & Riwayat"
        subtitle="Telusuri rekam jejak setiap tindakan penambahan, pengubahan, dan penghapusan data."
      />
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-navy mx-auto mb-4">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-navy mb-1">Modul Log Audit</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Modul ini sedang disiapkan untuk transparansi riwayat aktivitas dan log audit pengguna.
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

