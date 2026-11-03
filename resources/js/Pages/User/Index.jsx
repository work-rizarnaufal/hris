import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Eye, ShieldCheck, LogIn } from 'lucide-react';
import { Card, CardContent, PageHeader } from '@/components/ui';

export default function UserIndex() {
  return (
    <>
      <Head title="Ringkasan Publik" />
      <PageHeader
        eyebrow="PORTAL TERBUKA"
        title="Ringkasan Kehadiran Publik"
        subtitle="Portal statistik agregat kehadiran tanpa menampilkan data pribadi karyawan."
        actions={
          <Link href="/beranda" className="button primary">
            <LogIn className="w-4 h-4" />
            <span>Masuk Admin</span>
          </Link>
        }
      />
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-navy mx-auto mb-4">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-navy mb-1">Portal Ringkasan Publik</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Portal publik menyajikan metriks agregat kehadiran harian yang aman dan anonim.
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md">
            <ShieldCheck className="w-4 h-4" />
            <span>Privasi Terjaga: Menggunakan persistent User layout.</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

