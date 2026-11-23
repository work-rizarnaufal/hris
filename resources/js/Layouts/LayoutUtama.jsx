import React, { useState, useEffect } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { ShieldAlert, ArrowLeft, Building2 } from 'lucide-react';
import {
  Sidebar,
  Topbar,
  Footer,
  Toast,
  PageHeader,
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
} from '@/components/ui';
import { getPageMetadata } from '@/config/navigation.js';
import { siteConfig } from '@/config/site.js';
import { getActiveRoleProfile, isRouteAllowed, ROLE_PROFILES } from '@/services/authRole.js';

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
  const [roleProfile, setRoleProfile] = useState(() => getActiveRoleProfile());

  const meta = getPageMetadata(url);
  const pageTitle = title !== undefined ? title : meta.title;
  const pageSubtitle = subtitle !== undefined ? subtitle : meta.subtitle;

  const actorName = props.auth?.user?.name || props.appData?.actor || siteConfig.defaultActor;
  const companyName = props.appData?.config?.company || siteConfig.defaultCompany;

  // Sinkronkan peran dengan user terautentikasi jika ada
  useEffect(() => {
    if (props.auth?.user?.role) {
      const roleKeyMap = {
        super_admin: 'SUPER_ADMIN',
        supervisor: 'SUPERVISOR',
        karyawan: 'KARYAWAN',
      };
      const mappedKey = roleKeyMap[props.auth.user.role] || 'SUPER_ADMIN';
      if (ROLE_PROFILES[mappedKey]) {
        setRoleProfile(ROLE_PROFILES[mappedKey]);
      }
    }
  }, [props.auth?.user]);

  // Dengarkan perubahan role simulasi secara real-time
  useEffect(() => {
    const handleRoleChange = (e) => {
      if (e.detail?.profile) {
        setRoleProfile(e.detail.profile);
      }
    };
    window.addEventListener('hris:role-changed', handleRoleChange);
    return () => window.removeEventListener('hris:role-changed', handleRoleChange);
  }, []);

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

  const isAllowed = isRouteAllowed(url, roleProfile.roleKey);

  return (
    <div className="app-shell min-h-screen bg-slate-50 flex no-scrollbar">
      {/* Sidebar Navigation */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        companyName={companyName}
        actorName={actorName}
        user={props.auth?.user}
        currentUrl={url}
      />

      {/* Main Shell */}
      <div className="main-shell flex-1 flex flex-col min-w-0 min-h-screen no-scrollbar">
        <Topbar
          title={pageTitle}
          actorName={actorName}
          user={props.auth?.user}
          companyName={companyName}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 w-full">
          <PageContainer maxWidth={maxWidth}>
            {!isAllowed ? (
              <div className="py-12 flex justify-center items-center">
                <Card className="max-w-xl w-full border-rose-200 shadow-sm bg-white overflow-hidden">
                  <div className="bg-rose-50 border-b border-rose-100 p-6 flex items-center gap-4">
                    <div className="p-3 bg-rose-100 rounded-xl text-rose-600 shrink-0">
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 leading-snug">
                        Akses Modul Dibatasi
                      </h2>
                      <p className="text-xs text-rose-700 font-medium">
                        Otorisasi Keamanan Berbasis Peran (RBAC)
                      </p>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Peran aktif Anda saat ini{' '}
                      <span className="font-semibold text-slate-800">
                        ({roleProfile.roleLabel})
                      </span>{' '}
                      tidak memiliki hak akses ke modul{' '}
                      <span className="font-mono font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        {url}
                      </span>
                      .
                    </p>

                    <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2 text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Pengguna Simulasi:</span>
                        <span className="font-semibold text-slate-800">{roleProfile.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Tingkat Hak Akses:</span>
                        <Badge variant="outline" className="text-xs font-semibold">
                          {roleProfile.shortTitle}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Penugasan Site:</span>
                        <span className="text-slate-700">{roleProfile.unit}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <Link href="/beranda" className="flex-1">
                        <Button variant="default" className="w-full flex items-center justify-center gap-2">
                          <ArrowLeft className="w-4 h-4" />
                          Kembali ke Beranda
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {headerActions && (
                  <PageHeader
                    title={pageTitle}
                    subtitle={pageSubtitle}
                    actions={headerActions}
                  />
                )}
                {children}
              </>
            )}
          </PageContainer>
        </main>

        <Footer />
      </div>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
