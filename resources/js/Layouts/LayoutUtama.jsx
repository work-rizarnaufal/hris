import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Sidebar, Topbar, Footer, Toast, PageHeader, PageContainer } from '@/components/ui';
import { getPageMetadata } from '@/config/navigation.js';
import { siteConfig } from '@/config/site.js';

export default function LayoutUtama({
  children,
  title,
  subtitle,
  headerActions,
  maxWidth = 'max-w-[1600px]',
}) {
  const { url, props } = usePage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const meta = getPageMetadata(url);
  const pageTitle = title !== undefined ? title : meta.title;
  const pageSubtitle = subtitle !== undefined ? subtitle : meta.subtitle;

  const actorName = props.auth?.user?.name || props.appData?.actor || siteConfig.defaultActor;
  const companyName = props.appData?.config?.company || siteConfig.defaultCompany;

  // Tutup drawer mobile saat URL berpindah
  useEffect(() => {
    setSidebarOpen(false);
  }, [url]);

  useEffect(() => {
    if (props.flash?.success) {
      setToast({ message: props.flash.success, type: 'success' });
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
    if (props.flash?.error) {
      setToast({ message: props.flash.error, type: 'error' });
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [props.flash]);

  return (
    <div className="app-shell min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        companyName={companyName}
        actorName={actorName}
        currentUrl={url}
      />

      {/* Main Shell */}
      <div className="main-shell flex-1 flex flex-col min-w-0 min-h-screen">
        <Topbar
          title={pageTitle}
          actorName={actorName}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 w-full">
          <PageContainer maxWidth={maxWidth}>
            {headerActions && (
              <PageHeader
                title={pageTitle}
                subtitle={pageSubtitle}
                actions={headerActions}
              />
            )}
            {children}
          </PageContainer>
        </main>

        <Footer />
      </div>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
