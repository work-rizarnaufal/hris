import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Eye,
  ShieldCheck,
  LogIn,
  Users,
  CheckCircle2,
  Clock,
  Layers,
  Building2,
  ArrowRight,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  PageHeader,
} from '@/components/ui';

// Ringkasan divisi publik (teragregat & anonim tanpa identitas individu)
const publicDivisionSummary = [
  { name: 'Operasional & Lapangan (Pabrik Sidoarjo)', presentRate: '100%', status: 'Aktif Normal' },
  { name: 'Security & Safety (Pos Pengamanan)', presentRate: '100%', status: 'Siaga Penuh' },
  { name: 'Logistik & Gudang (Hub Rungkut)', presentRate: '100%', status: 'Aktif Normal' },
  { name: 'Human Capital & GA (Kantor Surabaya)', presentRate: '100%', status: 'Operasional' },
];

export default function RingkasanPublik() {
  const currentDateFormatted = useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }).format(new Date());
  }, []);

  return (
    <>
      <Head title="Ringkasan Kehadiran Publik" />

      <PageHeader
        eyebrow="PORTAL STATISTIK TERBUKA HCGA"
        title="Ringkasan Operasional & Kehadiran Terbuka"
        subtitle={`Monitoring agregat kesiapan personil dan disiplin operasional perusahaan — ${currentDateFormatted}.`}
        actions={
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-[#10273f] text-white hover:bg-[#1a3a5c] transition-colors shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5 text-[#c4a266]" />
            <span>Masuk Portal Admin</span>
          </Link>
        }
      />

      {/* Jaminan Privasi UU PDP */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-900">
              Kepatuhan Privasi Data & UU Pelindungan Data Pribadi (UU PDP)
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              Portal publik ini hanya menyajikan data statistik agregat operasional tanpa menampilkan nama, NIP, lokasi gps riil, atau data pribadi karyawan lainnya.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Kartu KPI Ringkasan Publik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Tingkat Kesiapan Tim
              </div>
              <div className="text-2xl font-bold font-display text-[#398872] mt-0.5">
                91.7%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Kondisi operasional normal
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#eef7f1] flex items-center justify-center text-[#398872] shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Status Roster Lini
              </div>
              <div className="text-2xl font-bold font-display text-navy mt-0.5">
                Aktif
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Pola rotasi 2-grup (A & B) berjalan
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <Layers className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Titik Operasional
              </div>
              <div className="text-2xl font-bold font-display text-[#ac8848] mt-0.5">
                3 Site
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Pabrik, Gudang, & Head Office
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#fcf6e9] flex items-center justify-center text-[#ac8848] shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Jam Layanan Operasional
              </div>
              <div className="text-2xl font-bold font-display text-navy mt-0.5">
                24 Jam
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Pengamanan site & shift bergilir
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-navy shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rekapitulasi Kesiapan Unit Kerja */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm text-navy">Kesiapan Operasional Lintas Unit Kerja</CardTitle>
          <CardDescription className="text-xs">
            Persentase personil bertugas di setiap fasilitas perusahaan hari ini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {publicDivisionSummary.map((item) => (
            <div
              key={item.name}
              className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="text-xs font-semibold text-navy">{item.name}</div>
                <div className="text-[11px] text-slate-500">Status Operasional: {item.status}</div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-bold text-[#398872]">{item.presentRate}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#eef7f1] text-[#398872]">
                  Tepat Waktu
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
