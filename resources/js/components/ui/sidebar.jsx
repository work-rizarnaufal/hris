import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Building2, LogOut } from 'lucide-react';
import { navigationConfig } from '@/config/navigation.js';
import { siteConfig } from '@/config/site.js';
import { getActiveRoleProfile, isRouteAllowed } from '@/services/authRole.js';

// Daftar rute modul yang sudah memiliki implementasi halaman penuh
const IMPLEMENTED_ROUTES = new Set([
  '/beranda',
  '/karyawan',
  '/kehadiran',
  '/jadwal',
  '/laporan',
  '/pengaturan',
]);

export function Sidebar({
  open = false,
  onClose,
  companyName = siteConfig.defaultCompany,
  actorName = siteConfig.defaultActor,
  currentUrl = '',
}) {
  const [roleProfile, setRoleProfile] = useState(() => getActiveRoleProfile());

  useEffect(() => {
    const handleRoleChange = (e) => {
      if (e.detail?.profile) {
        setRoleProfile(e.detail.profile);
      }
    };
    window.addEventListener('hris:role-changed', handleRoleChange);
    return () => window.removeEventListener('hris:role-changed', handleRoleChange);
  }, []);

  const isItemActive = (href) => {
    const cleanUrl = (typeof currentUrl === 'string' ? currentUrl : '').split('?')[0];
    if (href === '/beranda') return cleanUrl === '/beranda' || cleanUrl === '/' || cleanUrl === '';
    return cleanUrl.startsWith(href);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-30 md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${open ? 'open' : ''} flex flex-col justify-between overflow-y-auto no-scrollbar`}
        aria-label="Sidebar Navigasi"
      >
        <div>
          {/* Brand header */}
          <div className="brand">
            <div className="brand-icon">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              {siteConfig.shortName}
              <span>{siteConfig.tagline.toUpperCase()}</span>
            </div>
          </div>

          {/* Workspace label */}
          <div className="workspace-label">
            <span className="workspace-dot animate-pulse" />
            <span className="truncate" title={companyName}>
              {companyName}
            </span>
          </div>

          {/* Navigation groups terfilter hak akses role */}
          {navigationConfig.map((group, groupIdx) => {
            const allowedItems = group.items.filter((item) =>
              isRouteAllowed(item.href, roleProfile.roleKey)
            );
            if (allowedItems.length === 0) return null;

            return (
              <div key={group.group}>
                <div className={`nav-caption ${groupIdx > 0 ? 'second' : ''}`}>
                  {group.group}
                </div>
                <nav className="flex flex-col gap-1">
                  {allowedItems.map((item) => {
                    const Icon = item.icon;
                    const isDisabled = item.disabled ?? !IMPLEMENTED_ROUTES.has(item.href);
                    const active = !isDisabled && isItemActive(item.href);

                    if (isDisabled) {
                      return (
                        <div
                          key={item.href}
                          className="nav-item opacity-45 cursor-not-allowed select-none hover:bg-transparent hover:text-[#a8b9cc] transition-none"
                          title={`${item.title} (Dalam Pengembangan / TBA)`}
                          aria-disabled="true"
                        >
                          {Icon && <Icon className="w-4 h-4 shrink-0 text-slate-500" />}
                          <span className="flex-1 text-slate-400">{item.title}</span>
                          <small className="text-[10px] font-mono font-bold tracking-wider bg-slate-800 text-amber-300/90 border border-amber-400/20 px-2 py-0.5 rounded shadow-2xs">
                            TBA
                          </small>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`nav-item ${active ? 'active' : ''}`}
                        onClick={onClose}
                      >
                        {Icon && <Icon className="w-4 h-4 shrink-0" />}
                        <span>{item.title}</span>
                        {item.badge && <small>{item.badge}</small>}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        {/* User profile bottom */}
        <div className="sidebar-bottom">
          <div className="sidebar-user flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="avatar small text-slate-800 font-bold bg-amber-200 shrink-0">
                {roleProfile.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <strong className="truncate block" title={roleProfile.name}>
                  {roleProfile.name}
                </strong>
                <small className="truncate block text-[#c4a266] font-medium" title={roleProfile.roleLabel}>
                  {roleProfile.shortTitle}
                </small>
              </div>
            </div>
            <Link
              href="/logout"
              method="post"
              as="button"
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-md hover:bg-white/10 transition-colors shrink-0"
              title="Keluar dari sistem"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
