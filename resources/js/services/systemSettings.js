// Layanan penyimpanan dan sinkronisasi konfigurasi sistem lintas halaman HRIS
const isClient = typeof window !== 'undefined';

const STORAGE_KEYS = {
  ATTENDANCE: 'hris_settings_attendance',
  SHIFTS: 'hris_settings_shifts',
  HOLIDAYS: 'hris_settings_holidays',
  LOCATIONS: 'hris_settings_locations',
  COMPANY: 'hris_settings_company',
};

export const DEFAULT_SHIFT_SETTINGS = {
  shiftPagiName: 'Shift Pagi (08:00 - 17:00)',
  shiftPagiIn: '08:00',
  shiftPagiOut: '17:00',
  shiftPagiOpenIn: '07:00',
  shiftPagiCloseOut: '18:00',
  shiftMalamName: 'Shift Malam (20:00 - 05:00)',
  shiftMalamIn: '20:00',
  shiftMalamOut: '05:00',
  shiftMalamOpenIn: '19:00',
  shiftMalamCloseOut: '06:00',
  tukarShiftHour: '08:00 Pagi & 20:00 Malam',
  durationHours: 9,
  effectiveWorkHours: 8,
  operatingDaysPerWeek: 7, // 7 hari operasional roster
  rotationModel: 'continuous_alternate', // Kelompok A & B bergantian setiap hari
};

export const DEFAULT_ATTENDANCE_SETTINGS = {
  lateToleranceMinutes: 15,
  earlyCheckInMinutes: 60,
  earlyDepartureToleranceMinutes: 0,
  weeklyMinHours: 40,
  enableGeofence: false, // Default dinonaktifkan (Mode Presensi Fingerprint Site)
  requireSelfie: false,
  preventMockGps: false,
  minOvertimeMinutes: 60,
  standardAnnualLeaveDays: 12,
  leaveExpiryPeriod: '31 Maret (Tahun Berikutnya)',
  overtimeFirstHourRate: 1.5,
  overtimeSubsequentHourRate: 2.0,
  autoNotifyShiftReminder: true,
};

export const INITIAL_HOLIDAYS = [];

export const INITIAL_LOCATIONS = [
  {
    id: 1,
    name: 'Lokasi Mariuk',
    type: 'Site Operasional & Pabrik Mariuk',
    latitude: -6.48512,
    longitude: 107.82145,
    radiusMeters: 120,
    assignedCount: 6,
    status: 'Aktif',
    address: 'Kawasan Industri & Operasional Mariuk, Subang',
  },
  {
    id: 2,
    name: 'Lokasi Cimalaka',
    type: 'Site Operasional & Gudang Cimalaka',
    latitude: -6.81234,
    longitude: 107.93512,
    radiusMeters: 120,
    assignedCount: 6,
    status: 'Aktif',
    address: 'Kawasan Operasional Cimalaka, Sumedang',
  },
];

export const DEFAULT_COMPANY_PROFILE = {
  companyName: 'PT Manufaktur Nusantara Perkasa Tbk',
  division: 'Human Capital & General Affairs (HCGA)',
  registrationNumber: 'NIB: 9120004561230',
  taxId: '01.234.567.8-042.000',
  headOfficeAddress: 'Jl. Rungkut Industri Raya No. 45, Surabaya, Jawa Timur 60293',
  phone: '(031) 843-9821',
  officialEmail: 'hcga-system@nusantaraperkasa.co.id',
  adminPicName: 'Bambang Trihatmodjo, S.H., M.M.',
  adminPicRole: 'Head of Human Capital & General Affairs',
};

function dispatchSyncEvent(key, data) {
  if (!isClient) return;
  window.dispatchEvent(
    new CustomEvent('hris:settings-updated', {
      detail: { key, data },
    })
  );
}

export function getAttendanceSettings() {
  if (!isClient) return DEFAULT_ATTENDANCE_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!raw) return DEFAULT_ATTENDANCE_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ATTENDANCE_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_ATTENDANCE_SETTINGS;
  }
}

export function isGeofenceEnabled() {
  const settings = getAttendanceSettings();
  return settings.enableGeofence !== false;
}

export function saveAttendanceSettings(settings) {
  if (isClient) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(settings));
    dispatchSyncEvent(STORAGE_KEYS.ATTENDANCE, settings);
  }
}

export function getHolidays() {
  if (!isClient) return INITIAL_HOLIDAYS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
    return raw ? JSON.parse(raw) : INITIAL_HOLIDAYS;
  } catch {
    return INITIAL_HOLIDAYS;
  }
}

export function saveHolidays(holidays) {
  if (isClient) {
    localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(holidays));
    dispatchSyncEvent(STORAGE_KEYS.HOLIDAYS, holidays);
  }
}

export function getLocations() {
  if (!isClient) return INITIAL_LOCATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    return raw ? JSON.parse(raw) : INITIAL_LOCATIONS;
  } catch {
    return INITIAL_LOCATIONS;
  }
}

export function saveLocations(locations) {
  if (isClient) {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
    dispatchSyncEvent(STORAGE_KEYS.LOCATIONS, locations);
  }
}

export function getCompanyProfile() {
  if (!isClient) return DEFAULT_COMPANY_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPANY);
    return raw ? JSON.parse(raw) : DEFAULT_COMPANY_PROFILE;
  } catch {
    return DEFAULT_COMPANY_PROFILE;
  }
}

export function saveCompanyProfile(profile) {
  if (isClient) {
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(profile));
    dispatchSyncEvent(STORAGE_KEYS.COMPANY, profile);
  }
}

export function getShiftSettings() {
  if (!isClient) return DEFAULT_SHIFT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHIFTS);
    if (!raw) return DEFAULT_SHIFT_SETTINGS;
    const parsed = JSON.parse(raw);
    // Auto-migrate stale 12-hour values (07:00 - 19:00) to current operational rules (08:00 - 17:00 & 20:00 - 05:00)
    if (parsed.shiftPagiIn === '07:00' || parsed.shiftMalamIn === '19:00' || parsed.durationHours === 12) {
      const upgraded = { ...DEFAULT_SHIFT_SETTINGS, ...parsed, ...DEFAULT_SHIFT_SETTINGS };
      localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(upgraded));
      return upgraded;
    }
    return parsed;
  } catch {
    return DEFAULT_SHIFT_SETTINGS;
  }
}

export function saveShiftSettings(settings) {
  if (isClient) {
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(settings));
    dispatchSyncEvent(STORAGE_KEYS.SHIFTS, settings);
  }
}

export function resetAllSettings() {
  if (isClient) {
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.SHIFTS);
    localStorage.removeItem(STORAGE_KEYS.HOLIDAYS);
    localStorage.removeItem(STORAGE_KEYS.LOCATIONS);
    localStorage.removeItem(STORAGE_KEYS.COMPANY);
    dispatchSyncEvent('ALL', null);
  }
}

export function formatDateDMY(dateStr) {
  if (!dateStr) return '-';
  if (dateStr.includes('/')) return dateStr;
  const parts = dateStr.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr;
}


