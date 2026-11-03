import React from 'react';
import { Menu, X, Clock } from 'lucide-react';
import { siteConfig } from '@/config/site.js';

export function Topbar({
  title = 'Beranda',
  actorName = siteConfig.defaultActor,
  sidebarOpen = false,
  onToggleSidebar,
}) {
  const currentDateWIB = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date());

  return (
    <header className="topbar sticky top-0 z-20 backdrop-blur-md bg-white/95 border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center transition-all">
      <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between gap-4">
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

        <div className="topbar-right flex items-center gap-3 sm:gap-4 text-xs text-slate-500 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 font-medium text-slate-600 bg-slate-50 border border-slate-200/60 rounded-full px-3 py-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentDateWIB} {siteConfig.timezoneLabel}</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 bg-slate-50/80 border border-slate-200/60 rounded-full py-1 pl-1 pr-3">
            <div className="avatar small bg-navy text-amber-200 font-bold shrink-0">
              {actorName.charAt(0)}
            </div>
            <span className="hidden md:inline font-medium text-slate-700 text-xs">
              {actorName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
