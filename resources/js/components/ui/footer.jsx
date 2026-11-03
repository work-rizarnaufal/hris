import React from 'react';
import { siteConfig } from '@/config/site.js';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60 text-slate-400 text-xs py-5">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span>© {currentYear} </span>
          <strong className="text-slate-600 font-medium">{siteConfig.name}</strong>
          <span className="hidden md:inline text-slate-400"> — {siteConfig.tagline}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>{siteConfig.version}</span>
          <span>•</span>
          <span>Zona {siteConfig.timezone}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
