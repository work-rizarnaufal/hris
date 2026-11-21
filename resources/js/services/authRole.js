// Layanan role-based access control (RBAC) simulasi frontend untuk HRIS
const isClient = typeof window !== 'undefined';
const ROLE_STORAGE_KEY = 'hris_active_simulated_role';

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  KARYAWAN: 'KARYAWAN',
};

export const ROLE_PROFILES = {
  [ROLES.SUPER_ADMIN]: {
    id: 'user-superadmin',
    roleKey: ROLES.SUPER_ADMIN,
    name: 'Bambang Trihatmodjo, S.H., M.M.',
    shortTitle: 'Super Admin',
    roleLabel: 'Super Administrator HCGA',
    email: 'admin@nusantaraperkasa.co.id',
    nip: 'HC-0001',
    unit: 'Kantor Pusat & Lintas Site',
    badgeColor: 'amber',
    description: 'Akses penuh ke seluruh konfigurasi sistem, toleransi, geofence, master data, dan audit.',
    allowedRoutes: ['*'],
  },
  [ROLES.SUPERVISOR]: {
    id: 'user-supervisor',
    roleKey: ROLES.SUPERVISOR,
    name: 'Siti Rahmawati',
    shortTitle: 'Supervisor Site',
    roleLabel: 'Supervisor Operasional Site',
    email: 'siti.rahmawati@nusantaraperkasa.co.id',
    nip: 'HC-0102',
    unit: 'Lokasi Cimalaka (Pabrik 2)',
    badgeColor: 'indigo',
    description: 'Monitoring roster tim, verifikasi/approval tukar shift, dan presensi massal lapangan.',
    allowedRoutes: [
      '/beranda',
      '/karyawan',
      '/kehadiran',
      '/jadwal',
      '/laporan',
      '/organisasi',
      '/lembur',
      '/cuti',
    ],
  },
  [ROLES.KARYAWAN]: {
    id: 'user-karyawan',
    roleKey: ROLES.KARYAWAN,
    name: 'Budi Santoso',
    shortTitle: 'Personel Lapangan',
    roleLabel: 'Senior Operator Lapangan (Grup A)',
    email: 'budi.santoso@nusantaraperkasa.co.id',
    nip: 'HC-0101',
    unit: 'Lokasi Mariuk (Pabrik 1)',
    badgeColor: 'emerald',
    description: 'Portal mandiri: Presensi GPS & selfie, cek jadwal shift pribadi, dan pengajuan tukar shift.',
    allowedRoutes: ['/beranda', '/kehadiran', '/jadwal', '/laporan'],
  },
};

export function getActiveRoleKey() {
  if (!isClient) return ROLES.SUPER_ADMIN;
  try {
    const saved = localStorage.getItem(ROLE_STORAGE_KEY);
    if (saved && ROLES[saved]) {
      return saved;
    }
    return ROLES.SUPER_ADMIN;
  } catch {
    return ROLES.SUPER_ADMIN;
  }
}

export function getActiveRoleProfile() {
  const roleKey = getActiveRoleKey();
  return ROLE_PROFILES[roleKey] || ROLE_PROFILES[ROLES.SUPER_ADMIN];
}

export function setActiveRole(roleKey) {
  if (!isClient) return;
  if (!ROLES[roleKey]) return;
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, roleKey);
    window.dispatchEvent(
      new CustomEvent('hris:role-changed', {
        detail: {
          roleKey,
          profile: ROLE_PROFILES[roleKey],
        },
      })
    );
  } catch (err) {
    console.error('Failed to save active role', err);
  }
}

export function isRouteAllowed(routeHref, roleKey = getActiveRoleKey()) {
  const profile = ROLE_PROFILES[roleKey] || ROLE_PROFILES[ROLES.SUPER_ADMIN];
  if (profile.allowedRoutes.includes('*')) return true;

  const cleanRoute = (routeHref || '').split('?')[0];
  return profile.allowedRoutes.some((allowed) => {
    if (allowed === cleanRoute) return true;
    if (cleanRoute.startsWith(allowed)) return true;
    return false;
  });
}
