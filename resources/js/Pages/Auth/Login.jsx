import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
  Layers,
  Sparkles,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { siteConfig } from '@/config/site.js';

export default function Login() {
  const [email, setEmail] = useState('nabiel@hrd.com');
  const [password, setPassword] = useState('nabiel123');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Silakan lengkapi alamat email dan kata sandi.');
      setLoading(false);
      return;
    }

    router.post(
      '/login',
      { email, password, remember },
      {
        onError: (errors) => {
          setErrorMessage(errors.email || errors.password || 'Gagal masuk. Periksa kembali kredensial Anda.');
          setLoading(false);
        },
        onFinish: () => {
          setLoading(false);
        },
      }
    );
  };

  const handleQuickFill = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setErrorMessage('');
  };

  return (
    <>
      <Head title="Masuk Administrator" />

      <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 no-scrollbar">
        {/* Kolom Kiri: Showcase Branding Korporat */}
        <div className="relative md:w-5/12 lg:w-1/2 bg-[#10273f] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden">
          {/* Latar Belakang Dekoratif Halus */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,162,102,0.15),transparent_50%)] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#193750]/50 blur-3xl pointer-events-none" />

          {/* Bagian Atas: Logo & Perusahaan */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#c4a266] to-[#ab874b] p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-[#10273f] rounded-[10px] flex items-center justify-center text-[#c4a266]">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-xs font-bold tracking-widest text-[#c4a266] uppercase block">
                  HCGA WORKFORCE SYSTEM
                </span>
                <span className="text-sm font-semibold text-slate-200">
                  PT Manufaktur Nusantara Perkasa Tbk
                </span>
              </div>
            </div>

            <div className="space-y-3 max-w-md">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white leading-tight">
                Monitoring Disiplin & Presensi Shift Terpadu.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Platform operasional terintegrasi untuk pengelolaan presensi real-time, rotasi 2-grup selang-seling, dan rekapitulasi evaluasi 12 personel aktif.
              </p>
            </div>
          </div>

          {/* Bagian Tengah: 3 Kartu Keunggulan Sistem */}
          <div className="relative z-10 my-8 space-y-3">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#c4a266]/20 text-[#c4a266] flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Roster Rotasi 2-Grup Terstandarisasi</div>
                <div className="text-[11px] text-slate-300">Pola otomatis dinas dan libur selang-seling Grup A & B</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Geofencing & Anti-Fake GPS</div>
                <div className="text-[11px] text-slate-300">Radius validasi 3 titik lokasi pabrik dan kantor utama</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Evaluasi Rapor Kedisiplinan Personel</div>
                <div className="text-[11px] text-slate-300">Heatmap 30 hari & log pembinaan terintegrasi</div>
              </div>
            </div>
          </div>

          {/* Bagian Bawah: Footer & Keamanan */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Standar Keamanan ISO 27001</span>
            <span>WIB (UTC+7) • Mariuk & Cimalaka</span>
          </div>
        </div>

        {/* Kolom Kanan: Form Login Eksekutif */}
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-md mx-auto my-auto">
            {/* Header Form */}
            <div className="mb-8">
              <Link
                href="/ringkasan-publik"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy mb-6 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Lihat Ringkasan Publik</span>
              </Link>

              <h2 className="text-2xl font-bold font-display text-navy tracking-tight">
                Masuk ke Panel Kontrol
              </h2>
              <p className="text-xs text-slate-500 mt-1.5">
                Masukkan kredensial akun administrator Anda untuk mengelola presensi dan roster kerja.
              </p>
            </div>

            {/* Quick Fill Pills untuk Pengujian Cepat */}
            <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-[#c4a266]" />
                  <span>Akun Super Admin:</span>
                </span>
                <span className="text-[10px] text-slate-400">Klik untuk mengisi</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('nabiel@hrd.com', 'nabiel123')}
                  className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-[#c4a266] hover:text-navy transition-colors text-center shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c4a266]" />
                  <span>Super Admin (nabiel@hrd.com)</span>
                </button>
              </div>
            </div>

            {/* Notifikasi Error */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Autentikasi */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="email">
                  Alamat Email / NIP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="nama@perusahaan.com atau HC-XXXX"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:border-[#c4a266] focus:ring-2 focus:ring-[#c4a266]/20 transition-all outline-none bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="password">
                    Kata Sandi
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Untuk reset kata sandi akun korporat, hubungi tim IT Support di internal HCGA (ext. 104).');
                    }}
                    className="text-[11px] font-medium text-[#ab874b] hover:text-navy transition-colors"
                  >
                    Lupa sandi?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-lg border border-slate-300 focus:border-[#c4a266] focus:ring-2 focus:ring-[#c4a266]/20 transition-all outline-none bg-white text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded text-[#10273f] focus:ring-[#c4a266] border-slate-300"
                  />
                  <span className="text-xs text-slate-600 select-none">Ingat sesi di perangkat ini</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 mt-2 rounded-lg bg-[#10273f] text-white hover:bg-[#1a3a5c] text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <span>Memverifikasi kredensial...</span>
                ) : (
                  <>
                    <span>Masuk ke Panel Kontrol</span>
                    <ArrowRight className="w-4 h-4 text-[#c4a266]" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Bawah */}
          <div className="w-full max-w-md mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>&copy; 2026 PT Manufaktur Nusantara Perkasa Tbk</span>
            <span>Versi {siteConfig.version}</span>
          </div>
        </div>
      </div>
    </>
  );
}

// Standalone Page Layout (Tanpa Sidebar / Topbar Admin)
Login.layout = (page) => page;
