import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  Menu,
  X,
  Clock,
  LayoutGrid,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Building2,
  MapPin,
} from 'lucide-react';
import { siteConfig } from '@/config/site.js';
import { CORE_MODULES, UPCOMING_MODULES } from '@/config/navigation.js';
import { cn } from '@/lib/utils.js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './modal.jsx';
import { Badge } from './badge.jsx';
import { Button } from './button.jsx';
import {
  AVAILABLE_SITES,
  useActiveSite,
  setActiveSiteId,
} from '@/services/systemSettings.js';

export function Topbar({
  title = 'Beranda',
  actorName = siteConfig.defaultActor,
  sidebarOpen = false,
  onToggleSidebar,
}) {
  const { url } = usePage();
  const activeSite = useActiveSite();
  const [siteSwitcherOpen, setSiteSwitcherOpen] = useState(false);
  const [modulOpen, setModulOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [submenuModulOpen, setSubmenuModulOpen] = useState(false);

  const siteSwitcherRef = useRef(null);
  const modulRef = useRef(null);
  const profileRef = useRef(null);

  const currentDateWIB = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date());

  const handleSelectSite = (siteId) => {
    setActiveSiteId(siteId);
    setSiteSwitcherOpen(false);
  };

  // Tutup dropdown saat navigasi halaman berpindah
  useEffect(() => {
    setSiteSwitcherOpen(false);
    setModulOpen(false);
    setProfileOpen(false);
    setSubmenuModulOpen(false);
  }, [url]);

  // Tutup dropdown saat klik di luar area atau tekan tombol Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (siteSwitcherRef.current && !siteSwitcherRef.current.contains(event.target)) {
        setSiteSwitcherOpen(false);
      }
      if (modulRef.current && !modulRef.current.contains(event.target)) {
        setModulOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
        setSubmenuModulOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setSiteSwitcherOpen(false);
        setModulOpen(false);
        setProfileOpen(false);
        setSubmenuModulOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isModuleActive = (href) => {
    const cleanUrl = (typeof url === 'string' ? url : '').split('?')[0];
    if (href === '/beranda') return cleanUrl === '/beranda' || cleanUrl === '/' || cleanUrl === '';
    return cleanUrl.startsWith(href);
  };

  return (
    <>
      <header className="topbar sticky top-0 z-20 backdrop-blur-md bg-white/95 border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center transition-all">
        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between gap-3 sm:gap-4">
          {/* Sisi Kiri: Hamburger, Breadcrumbs & Menu Modul */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              className="mobile-menu md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none transition-colors shrink-0"
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

            <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0 mx-1" />

            {/* Global Site Switcher */}
            <div className="relative shrink-0" ref={siteSwitcherRef}>
              <button
                type="button"
                onClick={() => {
                  setSiteSwitcherOpen((prev) => !prev);
                  setModulOpen(false);
                  setProfileOpen(false);
                }}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border shrink-0 cursor-pointer',
                  siteSwitcherOpen
                    ? 'bg-[#10273f] text-white border-[#10273f] shadow-xs'
                    : 'text-slate-800 bg-[#f7f2e8] hover:bg-[#ede3ce] border-[#c4a266]/40 hover:border-[#c4a266]'
                )}
                aria-expanded={siteSwitcherOpen}
                aria-haspopup="true"
                aria-label="Pilih site operasional aktif"
                title={`Site Operasional Aktif: ${activeSite.name}`}
              >
                <MapPin className={cn('w-3.5 h-3.5', siteSwitcherOpen ? 'text-amber-300' : 'text-[#c4a266]')} />
                <span className="font-bold tracking-tight">{activeSite.code || activeSite.shortName}</span>
                <ChevronDown
                  className={cn(
                    'w-3 h-3 transition-transform duration-200',
                    siteSwitcherOpen ? 'rotate-180 text-white' : 'text-[#c4a266]'
                  )}
                />
              </button>

              {/* Popover Global Site Switcher */}
              {siteSwitcherOpen && (
                <div className="fixed left-4 right-4 top-[66px] sm:absolute sm:left-0 sm:right-auto sm:top-full sm:mt-2 sm:w-[320px] rounded-2xl bg-white shadow-2xl border border-slate-200/90 p-3 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#f7f2e8] border border-[#c4a266]/30 flex items-center justify-center text-[#c4a266]">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#10273f]">Site Operasional Aktif</h3>
                        <p className="text-[10px] text-slate-500">Filter context data global</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-mono text-slate-500">
                      Context
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    {AVAILABLE_SITES.map((site) => {
                      const isSelected = activeSite.id === site.id;
                      return (
                        <button
                          key={site.id}
                          type="button"
                          onClick={() => handleSelectSite(site.id)}
                          className={cn(
                            'w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all text-left cursor-pointer border',
                            isSelected
                              ? 'bg-[#10273f] text-white border-[#10273f] shadow-xs'
                              : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/60 hover:border-slate-300'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono',
                                isSelected
                                  ? 'bg-white/10 text-amber-300 border border-white/20'
                                  : 'bg-white text-slate-700 border border-slate-200'
                              )}
                            >
                              {site.code.replace('SITE ', '')}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold truncate text-[11px] leading-tight">
                                {site.name}
                              </div>
                              <div
                                className={cn(
                                  'text-[10px] truncate leading-tight mt-0.5',
                                  isSelected ? 'text-slate-300' : 'text-slate-400'
                                )}
                              >
                                {site.location}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Menu Dropdown Modul */}
            <div className="relative shrink-0" ref={modulRef}>
              <button
                type="button"
                onClick={() => {
                  setModulOpen((prev) => !prev);
                  setProfileOpen(false);
                }}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border shrink-0 cursor-pointer',
                  modulOpen
                    ? 'bg-[#10273f] text-white border-[#10273f] shadow-xs'
                    : 'text-slate-700 bg-slate-50 hover:bg-slate-100/90 border-slate-200/80 hover:border-slate-300'
                )}
                aria-expanded={modulOpen}
                aria-haspopup="true"
                aria-label="Katalog modul HRIS"
              >
                <LayoutGrid className={cn('w-3.5 h-3.5', modulOpen ? 'text-[#c4a266]' : 'text-slate-500')} />
                <span className="font-medium">Modul</span>
                <ChevronDown
                  className={cn(
                    'w-3 h-3 text-slate-400 transition-transform duration-200',
                    modulOpen && 'rotate-180 text-white'
                  )}
                />
              </button>

              {/* Popover Katalog Modul */}
              {modulOpen && (
                <div className="fixed left-4 right-4 top-[66px] sm:absolute sm:left-0 sm:right-auto sm:top-full sm:mt-2 sm:w-[440px] rounded-2xl bg-white shadow-2xl border border-slate-200/90 p-4 z-40 animate-in fade-in zoom-in-95 duration-150 max-h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#f7f2e8] border border-[#c4a266]/30 flex items-center justify-center text-[#c4a266]">
                        <LayoutGrid className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#10273f]">Modul HRIS Operasional</h3>
                        <p className="text-[10px] text-slate-500">Peralihan cepat antar-domain sistem</p>
                      </div>
                    </div>
                    <Badge variant="default" className="text-[10px] px-2 py-0.5 bg-[#10273f] text-[#c4a266]">
                      {CORE_MODULES.length} Aktif
                    </Badge>
                  </div>

                  {/* Grid Modul Inti Aktif */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {CORE_MODULES.map((mod) => {
                      const Icon = mod.icon;
                      const active = isModuleActive(mod.href);

                      return (
                        <Link
                          key={mod.href}
                          href={mod.href}
                          onClick={() => setModulOpen(false)}
                          className={cn(
                            'flex items-start gap-2.5 p-2.5 rounded-xl border transition-all text-left group',
                            active
                              ? 'bg-[#10273f] text-white border-[#10273f] shadow-xs'
                              : 'bg-slate-50/70 hover:bg-slate-100/90 text-slate-800 border-slate-200/70 hover:border-slate-300'
                          )}
                        >
                          <div
                            className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
                              active
                                ? 'bg-white/10 text-[#c4a266] border border-white/20'
                                : 'bg-[#f7f2e8] text-[#c4a266] border border-[#c4a266]/30'
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold leading-tight truncate">
                                {mod.title}
                              </span>
                              {active && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              )}
                            </div>
                            <p
                              className={cn(
                                'text-[10px] mt-0.5 leading-snug line-clamp-1',
                                active ? 'text-slate-300' : 'text-slate-500'
                              )}
                            >
                              {mod.subtitle}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Modul Segera Hadir (TBA) */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      <span>Modul Dalam Pengembangan</span>
                      <span className="font-mono">{UPCOMING_MODULES.length} Modul</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {UPCOMING_MODULES.map((item) => (
                        <span
                          key={item.href}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200/60 font-medium cursor-not-allowed select-none"
                          title="Segera Hadir / TBA"
                        >
                          <span>{item.title}</span>
                          <span className="text-[9px] font-mono text-amber-700 bg-amber-50 px-1 rounded">
                            TBA
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sisi Kanan: Jam WIB & Card Profil */}
          <div className="topbar-right flex items-center gap-3 sm:gap-4 text-xs text-slate-500 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 font-medium text-slate-600 bg-slate-50 border border-slate-200/60 rounded-full px-3 py-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentDateWIB} {siteConfig.timezoneLabel}</span>
            </div>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            {/* Interactive Card Profile Button & Dropdown */}
            <div className="relative shrink-0" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((prev) => !prev);
                  setModulOpen(false);
                }}
                className={cn(
                  'flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 border transition-all cursor-pointer',
                  profileOpen
                    ? 'bg-slate-100 border-[#c4a266] ring-2 ring-[#c4a266]/20 shadow-xs'
                    : 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/60'
                )}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label="Menu profil administrator"
              >
                <div className="avatar small bg-navy text-amber-200 font-bold shrink-0">
                  {actorName.charAt(0)}
                </div>
                <span className="hidden md:inline font-medium text-slate-700 text-xs">
                  {actorName}
                </span>
                <ChevronDown
                  className={cn(
                    'w-3 h-3 text-slate-400 transition-transform duration-200',
                    profileOpen && 'rotate-180 text-navy'
                  )}
                />
              </button>

              {/* Popover Card Profil */}
              {profileOpen && (
                <div className="fixed left-4 right-4 top-[66px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 rounded-2xl bg-white shadow-2xl border border-slate-200/90 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-150">
                  {/* Header Ringkasan Identitas Akun */}
                  <div className="p-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="avatar small w-10 h-10 rounded-xl bg-navy text-amber-300 font-bold text-sm shrink-0 flex items-center justify-center shadow-xs">
                        {actorName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <strong className="text-xs font-bold text-navy truncate block" title={actorName}>
                          {actorName}
                        </strong>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Administrator HCGA
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Sesi Aktif
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {siteConfig.timezoneLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Navigasi Akun */}
                  <div className="p-2 space-y-1.5">
                    {/* Menu MODUL */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setSubmenuModulOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100/80 transition-colors cursor-pointer"
                        aria-expanded={submenuModulOpen}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#f7f2e8] text-[#c4a266] border border-[#c4a266]/30 flex items-center justify-center shrink-0">
                            <LayoutGrid className="w-3.5 h-3.5" />
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-navy text-xs tracking-wide">MODUL</div>
                            <div className="text-[10px] text-slate-400 font-normal">Pilihan modul site operasional</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold bg-[#f7f2e8] text-[#c4a266] px-1.5 py-0.5 rounded border border-[#c4a266]/30">
                            2 Modul
                          </span>
                          <ChevronDown
                            className={cn(
                              'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
                              submenuModulOpen && 'rotate-180 text-navy'
                            )}
                          />
                        </div>
                      </button>

                      {/* Modul Site di dalam Menu MODUL */}
                      {submenuModulOpen && (
                        <div className="px-2 pb-2 pt-1 space-y-1 border-t border-slate-200/60 bg-white">
                          {/* Modul 1: SITE A CIMALAKA */}
                          <button
                            type="button"
                            onClick={() => handleSelectSite('site-a')}
                            className={cn(
                              'w-full flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all text-left cursor-pointer group border',
                              activeSite.id === 'site-a'
                                ? 'bg-[#10273f] text-white border-[#10273f] shadow-xs'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-navy border-slate-100 hover:border-slate-200'
                            )}
                          >
                            <div
                              className={cn(
                                'w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
                                activeSite.id === 'site-a'
                                  ? 'bg-white/10 text-amber-300 border border-white/20'
                                  : 'bg-[#f7f2e8] text-[#c4a266]'
                              )}
                            >
                              <MapPin className="w-3 h-3" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-[11px] leading-tight">
                                SITE A CIMALAKA
                              </div>
                              <div
                                className={cn(
                                  'text-[10px] leading-tight mt-0.5',
                                  activeSite.id === 'site-a' ? 'text-slate-300' : 'text-slate-400'
                                )}
                              >
                                Area Operasional Cimalaka
                              </div>
                            </div>
                            <span
                              className={cn(
                                'text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0',
                                activeSite.id === 'site-a'
                                  ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                                  : 'bg-slate-100 text-slate-400'
                              )}
                            >
                              {activeSite.id === 'site-a' ? 'Aktif' : 'Site A'}
                            </span>
                          </button>

                          {/* Modul 2: SITE B PASEH */}
                          <button
                            type="button"
                            onClick={() => handleSelectSite('site-b')}
                            className={cn(
                              'w-full flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all text-left cursor-pointer group border',
                              activeSite.id === 'site-b'
                                ? 'bg-[#10273f] text-white border-[#10273f] shadow-xs'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-navy border-slate-100 hover:border-slate-200'
                            )}
                          >
                            <div
                              className={cn(
                                'w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
                                activeSite.id === 'site-b'
                                  ? 'bg-white/10 text-amber-300 border border-white/20'
                                  : 'bg-[#f7f2e8] text-[#c4a266]'
                              )}
                            >
                              <MapPin className="w-3 h-3" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-[11px] leading-tight">
                                SITE B PASEH
                              </div>
                              <div
                                className={cn(
                                  'text-[10px] leading-tight mt-0.5',
                                  activeSite.id === 'site-b' ? 'text-slate-300' : 'text-slate-400'
                                )}
                              >
                                Area Operasional Paseh
                              </div>
                            </div>
                            <span
                              className={cn(
                                'text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0',
                                activeSite.id === 'site-b'
                                  ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                                  : 'bg-slate-100 text-slate-400'
                              )}
                            >
                              {activeSite.id === 'site-b' ? 'Aktif' : 'Site B'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Profil Administrator */}
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100/80 hover:text-navy transition-colors text-left cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-800">Profil Administrator</div>
                        <div className="text-[10px] text-slate-400">Informasi akun & level hak akses</div>
                      </div>
                    </button>

                    {/* Pengaturan Sistem */}
                    <Link
                      href="/pengaturan"
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100/80 hover:text-navy transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0">
                        <Settings className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-800">Pengaturan Sistem</div>
                        <div className="text-[10px] text-slate-400">Parameter HR & kalender kerja</div>
                      </div>
                    </Link>
                  </div>

                  {/* Tombol Keluar Sesi */}
                  <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>Keluar Sesi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal Detail Profil Administrator */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        size="md"
      >
        <ModalHeader
          icon={<User className="w-5 h-5 text-[#c4a266]" />}
          title="Profil Administrator"
          description="Informasi identitas akun dan kewenangan hak akses operasional."
          onClose={() => setShowProfileModal(false)}
        />
        <ModalBody className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-navy text-amber-300 font-bold text-lg flex items-center justify-center shadow-xs shrink-0">
              {actorName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-navy truncate">{actorName}</div>
              <div className="text-xs text-slate-500">Administrator Utama HCGA</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="success" className="text-[10px] px-2 py-0">Online</Badge>
                <span className="text-[10px] text-slate-400 font-mono">ID: HCGA-ADM-01</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden bg-white text-xs">
            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Unit / Area Kerja
              </span>
              <span className="font-semibold text-slate-800">{siteConfig.defaultCompany}</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                Tingkat Kewenangan
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#10273f]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Super Admin (Akses Penuh)
              </span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Zona Waktu Sistem
              </span>
              <span className="font-semibold text-slate-800 font-mono">Asia/Jakarta (WIB · UTC+7)</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500">Versi Sistem</span>
              <span className="font-semibold text-slate-800 font-mono">{siteConfig.version}</span>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setShowProfileModal(false)}>
            Tutup
          </Button>
          <Link href="/pengaturan" onClick={() => setShowProfileModal(false)}>
            <Button variant="default" size="sm">
              Ke Pengaturan Sistem
            </Button>
          </Link>
        </ModalFooter>
      </Modal>

      {/* Modal Konfirmasi Keluar Sesi */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        size="sm"
      >
        <ModalHeader
          icon={<LogOut className="w-5 h-5 text-rose-600" />}
          title="Konfirmasi Keluar Sesi"
          description="Pastikan seluruh pekerjaan telah disimpan sebelum mengakhiri sesi."
          onClose={() => setShowLogoutModal(false)}
        />
        <ModalBody>
          <p className="text-xs text-slate-600 leading-relaxed">
            Apakah Anda yakin ingin keluar dari sesi kerja <strong>{actorName}</strong>? Anda dapat masuk kembali kapan saja.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setShowLogoutModal(false)}>
            Batal
          </Button>
          <Link href="/beranda" onClick={() => setShowLogoutModal(false)}>
            <Button variant="destructive" size="sm">
              Ya, Keluar
            </Button>
          </Link>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Topbar;
