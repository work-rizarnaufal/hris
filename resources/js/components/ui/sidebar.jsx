import React from 'react';
import { Link } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import { navigationConfig } from '@/config/navigation.js';
import { siteConfig } from '@/config/site.js';

export function Sidebar({
  open = false,
  onClose,
  companyName = siteConfig.defaultCompany,
  actorName = siteConfig.defaultActor,
  currentUrl = '',
}) {
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

          {/* Navigation groups */}
          {navigationConfig.map((group, groupIdx) => (
            <div key={group.group}>
              <div className={`nav-caption ${groupIdx > 0 ? 'second' : ''}`}>
                {group.group}
              </div>
              <nav className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.href);
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
          ))}
        </div>

        {/* User profile bottom */}
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="avatar small text-slate-800 font-bold bg-amber-200 shrink-0">
              {actorName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <strong className="truncate block" title={actorName}>
                {actorName}
              </strong>
              <small>Administrator HCGA</small>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
