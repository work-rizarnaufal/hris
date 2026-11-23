import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import {
  Menu,
  X,
  Clock,
  LogOut,
  ChevronDown,
  Settings,
  CalendarDays,
  ShieldCheck,
  MapPin,
  Users,
} from 'lucide-react';
import { siteConfig } from '@/config/site.js';
import { resolveUserRoleProfile } from '@/services/authRole.js';

export function Topbar({
  title = 'Beranda',
  sidebarOpen = false,
  onToggleSidebar,
  user,
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [currentRole, setCurrentRole] = useState(() => resolveUserRoleProfile(user));

  const currentDateWIB = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date());

  // Sinkronkan profil peran saat data user autentikasi tersedia / berubah
  useEffect(() => {
    if (user) {
      setCurrentRole(resolveUserRoleProfile(user));
    }
  }, [user]);

  const displayName = user?.name || currentRole.name;
  const displayEmail = user?.email || currentRole.email;
  const displayNip = user?.nip || currentRole.nip;

  // Inisial 2 karakter
  const userInitials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'AD';

  // Tutup dropdown card profile saat klik di luar area atau tekan tombol Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileOpen]);

  return (
    <header className="topbar sticky top-0 z-20 backdrop-blur-md bg-white/95 border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center transition-all">
      <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Sisi Kiri: Tombol Hamburger & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            className="mobile-menu md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none transition-colors"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <nav aria-label="Breadcrumb" className="breadcrumbs flex items-center gap-2 text-xs truncate">
            <span className="font-semibold text-slate-400">{siteConfig.shortName}</span>
            <span className="text-slate-300">/</span>
            <strong className="text-slate-700 font-semibold truncate">{title || 'Beranda'}</strong>
          </nav>
        </div>

        {/* Sisi Kanan: Jam WIB & Dropdown Card Profile */}
        <div className="topbar-right flex items-center gap-3 sm:gap-4 text-xs text-slate-500 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 font-medium text-slate-600 bg-slate-50 border border-slate-200/60 rounded-full px-3 py-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentDateWIB} {siteConfig.timezoneLabel}</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Card Profile Trigger & Popover Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className={`group flex items-center gap-2.5 p-1 pr-3 rounded-full border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy/20 ${
                isProfileOpen
                  ? 'bg-slate-100 border-navy/40 ring-2 ring-navy/10'
                  : 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80 hover:border-slate-300'
              }`}
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
              title="Menu Profil Pengguna"
            >
              <div
                className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border shadow-2xs ${
                  currentRole.roleKey === 'SUPER_ADMIN'
                    ? 'bg-navy text-[#c4a266] border-[#c4a266]/40'
                    : currentRole.roleKey === 'SUPERVISOR'
                    ? 'bg-indigo-900 text-indigo-200 border-indigo-400/40'
                    : 'bg-emerald-900 text-emerald-200 border-emerald-400/40'
                }`}
              >
                {userInitials}
              </div>
              <div className="hidden md:flex flex-col text-left leading-tight">
                <span className="font-semibold text-slate-800 text-xs truncate max-w-[130px]">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {currentRole.shortTitle}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
                  isProfileOpen ? 'rotate-180 text-navy' : ''
                }`}
              />
            </button>

            {/* Profile Card Floating Popover */}
            {isProfileOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-80 sm:w-88 max-w-[calc(100vw-24px)] bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                role="menu"
                aria-orientation="vertical"
              >
                {/* 1. Header Card Profil: Brand Deep Navy & Warm Gold */}
                <div className="p-4 sm:p-5 bg-gradient-to-br from-[#10273f] via-[#142f4c] to-[#0d2135] text-white">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-xl border-2 font-display font-bold text-lg flex items-center justify-center shrink-0 shadow-md ${
                        currentRole.roleKey === 'SUPER_ADMIN'
                          ? 'bg-navy border-[#c4a266]/70 text-[#c4a266]'
                          : currentRole.roleKey === 'SUPERVISOR'
                          ? 'bg-indigo-950 border-indigo-400/70 text-indigo-300'
                          : 'bg-emerald-950 border-emerald-400/70 text-emerald-300'
                      }`}
                    >
                      {userInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-white truncate" title={displayName}>
                        {displayName}
                      </h4>
                      <p className="text-[11px] text-[#c4a266] font-medium mt-0.5 line-clamp-1" title={currentRole.roleLabel}>
                        {currentRole.roleLabel}
                      </p>
                      <p className="text-[11px] text-slate-300 font-mono mt-0.5 truncate" title={displayEmail}>
                        {displayEmail}
                      </p>
                    </div>
                  </div>

                  {/* Sesi Status & NIP Badge */}
                  <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Sesi {currentRole.shortTitle} Aktif
                    </span>
                    <span className="text-slate-300 font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                      NIP: {displayNip}
                    </span>
                  </div>
                </div>

                {/* 2. Informasi Konteks Operasional */}
                <div className="px-4 py-2.5 bg-white border-b border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 shadow-2xs">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#c4a266]" />
                      Unit Tugas
                    </span>
                    <span className="font-bold text-navy truncate block mt-0.5" title={currentRole.unit}>
                      {currentRole.unit}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 shadow-2xs">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Hak Akses
                    </span>
                    <span className="font-bold text-emerald-700 truncate block mt-0.5">
                      {currentRole.shortTitle}
                    </span>
                  </div>
                </div>

                {/* 4. Pintasan Navigasi Sistem Sesuai Izin Role */}
                <div className="p-2 space-y-0.5">
                  <Link
                    href="/beranda"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-100 hover:text-navy transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-md bg-slate-100 group-hover:bg-navy/10 text-slate-500 group-hover:text-navy flex items-center justify-center transition-colors shrink-0">
                      <CalendarDays className="w-4 h-4 text-slate-600 group-hover:text-navy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block font-semibold">Beranda & Dashboard</span>
                      <span className="text-[10px] text-slate-400 block -mt-0.5">Ringkasan KPI operasional</span>
                    </div>
                  </Link>

                  {currentRole.roleKey !== 'KARYAWAN' && (
                    <Link
                      href="/karyawan"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-100 hover:text-navy transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-md bg-slate-100 group-hover:bg-navy/10 text-slate-500 group-hover:text-navy flex items-center justify-center transition-colors shrink-0">
                        <Users className="w-4 h-4 text-slate-600 group-hover:text-navy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block font-semibold">Direktori Karyawan</span>
                        <span className="text-[10px] text-slate-400 block -mt-0.5">Master personil Mariuk & Cimalaka</span>
                      </div>
                    </Link>
                  )}

                  {currentRole.roleKey === 'SUPER_ADMIN' && (
                    <Link
                      href="/pengaturan"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-100 hover:text-navy transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-md bg-slate-100 group-hover:bg-navy/10 text-slate-500 group-hover:text-navy flex items-center justify-center transition-colors shrink-0">
                        <Settings className="w-4 h-4 text-slate-600 group-hover:text-navy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block font-semibold">Pengaturan Sistem & Kebijakan</span>
                        <span className="text-[10px] text-slate-400 block -mt-0.5">Shift 12 jam, toleransi & geofence</span>
                      </div>
                    </Link>
                  )}
                </div>

                {/* 5. Footer Logout */}
                <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar dari Sistem (Logout)</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
