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
    name: 'Nabiel',
    shortTitle: 'Super Admin',
    roleLabel: 'Super Administrator HCGA',
    email: 'nabiel@hrd.com',
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
    description: 'Portal mandiri: Monitoring presensi fingerprint site, cek jadwal shift pribadi, dan pengajuan tukar shift.',
    allowedRoutes: ['/beranda', '/kehadiran', '/jadwal', '/laporan'],
  },
};

export function mapUserRoleToKey(role) {
  const roleKeyMap = {
    super_admin: ROLES.SUPER_ADMIN,
    supervisor: ROLES.SUPERVISOR,
    karyawan: ROLES.KARYAWAN,
  };
  return roleKeyMap[role] || ROLES.SUPER_ADMIN;
}

export function resolveUserRoleProfile(user) {
  if (!user) return getActiveRoleProfile();

  const mappedKey = user.role_key || mapUserRoleToKey(user.role);
  const baseProfile = ROLE_PROFILES[mappedKey] || ROLE_PROFILES[ROLES.SUPER_ADMIN];

  return {
    ...baseProfile,
    id: user.id ? `user-${user.id}` : baseProfile.id,
    roleKey: mappedKey,
    name: user.name || baseProfile.name,
    email: user.email || baseProfile.email,
    nip: user.nip || baseProfile.nip,
    roleLabel: user.role_label || baseProfile.roleLabel,
    shortTitle: user.short_title || baseProfile.shortTitle,
    unit: user.unit || baseProfile.unit,
  };
}

export function syncUserRole(user) {
  if (!isClient || !user) return;
  const mappedKey = user.role_key || mapUserRoleToKey(user.role);
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, mappedKey);
  } catch {
    // Abaikan kegagalan localStorage
  }
}

export function clearSimulatedRole() {
  if (!isClient) return;
  try {
    localStorage.removeItem(ROLE_STORAGE_KEY);
  } catch {
    // Abaikan kegagalan localStorage
  }
}

export function getActiveRoleKey(user) {
  if (user?.role || user?.role_key) {
    return user.role_key || mapUserRoleToKey(user.role);
  }
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

export function getActiveRoleProfile(user) {
  if (user) {
    return resolveUserRoleProfile(user);
  }
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
