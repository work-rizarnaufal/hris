import React from 'react';
import {
  Building,
  Database,
  Download,
  RefreshCw,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Input,
} from '@/components/ui';

export default function TabProfilPemeliharaan({
  companyProfile,
  setCompanyProfile,
  onDownloadBackup,
  onClearCache,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Profil Resmi Entitas Perusahaan */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
            <Building className="w-4 h-4 text-[#c4a266]" />
            Profil Legal Perusahaan & Kontak HCGA
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Informasi identitas resmi entitas perusahaan yang dicantumkan pada slip gaji dan laporan.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Resmi Perusahaan
            </label>
            <Input
              type="text"
              value={companyProfile.companyName}
              onChange={(e) =>
                setCompanyProfile({ ...companyProfile, companyName: e.target.value })
              }
              className="h-9 text-xs bg-white text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Induk Berusaha (NIB)
              </label>
              <Input
                type="text"
                value={companyProfile.registrationNumber}
                onChange={(e) =>
                  setCompanyProfile({
                    ...companyProfile,
                    registrationNumber: e.target.value,
                  })
                }
                className="h-9 text-xs bg-white text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NPWP Badan Perusahaan
              </label>
              <Input
                type="text"
                value={companyProfile.taxId}
                onChange={(e) =>
                  setCompanyProfile({ ...companyProfile, taxId: e.target.value })
                }
                className="h-9 text-xs bg-white text-slate-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Alamat Kantor Pusat
            </label>
            <Input
              type="text"
              value={companyProfile.headOfficeAddress}
              onChange={(e) =>
                setCompanyProfile({
                  ...companyProfile,
                  headOfficeAddress: e.target.value,
                })
              }
              className="h-9 text-xs bg-white text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Telepon Operasional
              </label>
              <Input
                type="text"
                value={companyProfile.phone}
                onChange={(e) =>
                  setCompanyProfile({ ...companyProfile, phone: e.target.value })
                }
                className="h-9 text-xs bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Resmi HCGA
              </label>
              <Input
                type="email"
                value={companyProfile.officialEmail}
                onChange={(e) =>
                  setCompanyProfile({
                    ...companyProfile,
                    officialEmail: e.target.value,
                  })
                }
                className="h-9 text-xs bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block font-semibold text-slate-700 mb-1">
              Penanggung Jawab HCGA (PIC Administrator)
            </label>
            <Input
              type="text"
              value={companyProfile.adminPicName}
              onChange={(e) =>
                setCompanyProfile({
                  ...companyProfile,
                  adminPicName: e.target.value,
                })
              }
              className="h-9 text-xs bg-white text-slate-800 font-medium"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Nama penandatangan sah dokumen laporan rekapitulasi dan surat tugas resmi.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pemeliharaan Sistem & Pencadangan Data */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
            <Database className="w-4 h-4 text-[#c4a266]" />
            Pencadangan Data & Pemeliharaan Server
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Operasi pencadangan instan, status database sistem, dan pembersihan cache aplikasi.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Database Engine:</span>
              <span className="font-mono font-bold text-navy">SQLite 3 (Local Integrated)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Skema & Tabel Sistem:</span>
              <span className="font-mono font-bold text-slate-800">10 Tabel Terindeks</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Status Sinkronisasi Konfigurasi:</span>
              <span className="font-bold text-emerald-700">Tersinkronisasi Otomatis</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Status Biometric & Geolocation:</span>
              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                Normal & Siap Operasi
              </Badge>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-navy">
                  Unduh Snapshot Cadangan (JSON)
                </p>
                <p className="text-[11px] text-slate-500">
                  Ekspor seluruh parameter konfigurasi, kalender libur, dan koordinat ke berkas lokal.
                </p>
              </div>
              <Button
                size="sm"
                onClick={onDownloadBackup}
                className="gap-1.5 text-xs bg-navy hover:bg-[#193750] text-white shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Backup</span>
              </Button>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-navy">
                  Bersihkan Cache & Session Presensi
                </p>
                <p className="text-[11px] text-slate-500">
                  Hapus cache memori sesi sementara untuk me-refresh sinkronisasi data sistem.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearCache}
                className="gap-1.5 text-xs text-slate-700 hover:bg-slate-50 shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Bersihkan Cache</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
