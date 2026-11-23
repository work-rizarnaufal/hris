import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { siteConfig } from '@/config/site.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Silakan lengkapi alamat email atau NIP dan kata sandi Anda.');
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

  return (
    <>
      <Head title="Masuk Administrator" />

      <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex flex-col justify-center items-center p-4 sm:p-6 no-scrollbar">
        {/* Card Kontainer Tunggal (Single Layer) */}
        <div className="w-full max-w-[440px] bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
          {/* Header Identitas Korporat */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c4a266] to-[#ab874b] p-0.5 shadow-md flex items-center justify-center mb-3">
              <div className="w-full h-full bg-[#10273f] rounded-[10px] flex items-center justify-center text-[#c4a266]">
                <Building2 className="w-6 h-6" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3 h-3 text-[#c4a266]" />
              <span>{siteConfig.shortName} • HCGA System</span>
            </div>

            <h1 className="text-xl font-bold font-display text-navy tracking-tight">
              Masuk ke Panel Kontrol
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Masukkan alamat email atau NIP terdaftar serta kata sandi akun Anda.
            </p>
          </div>

          {/* Notifikasi Error */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulir Autentikasi */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
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
                  name="email"
                  type="text"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Masukkan alamat email atau NIP"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#c4a266] focus:ring-2 focus:ring-[#c4a266]/20 transition-all outline-none bg-white text-slate-900 placeholder:text-slate-400"
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
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#c4a266] focus:ring-2 focus:ring-[#c4a266]/20 transition-all outline-none bg-white text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded text-[#10273f] focus:ring-[#c4a266] border-slate-300 cursor-pointer"
                />
                <span className="text-xs text-slate-600 select-none">Ingat sesi di perangkat ini</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-1 rounded-xl bg-[#10273f] text-white hover:bg-[#18395b] text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

          {/* Tautan Alternatif */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center">
            <Link
              href="/ringkasan-publik"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-navy transition-colors font-medium group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Buka Portal Ringkasan Publik</span>
            </Link>
          </div>
        </div>

        {/* Footer Eksternal Card */}
        <div className="mt-6 text-center text-[11px] text-slate-400 space-y-1">
          <div>&copy; 2026 PT Manufaktur Nusantara Perkasa Tbk</div>
          <div className="text-[10px] text-slate-400/80">
            Sistem Monitoring Presensi Terpadu • Versi {siteConfig.version}
          </div>
        </div>
      </div>
    </>
  );
}

// Standalone Page Layout (Tanpa Sidebar / Topbar Admin)
Login.layout = (page) => page;
