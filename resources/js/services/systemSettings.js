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
  shiftPagiName: 'Shift Pagi (12 Jam)',
  shiftPagiIn: '07:00',
  shiftPagiOut: '19:00',
  shiftMalamName: 'Shift Malam (12 Jam)',
  shiftMalamIn: '19:00',
  shiftMalamOut: '07:00',
  tukarShiftHour: '07:00 Pagi & 19:00 Malam',
  durationHours: 12,
  operatingDaysPerWeek: 7, // 7 hari non-stop tanpa libur operasional
  rotationModel: 'continuous_alternate', // Kelompok A & B bergantian setiap hari
};

export const DEFAULT_ATTENDANCE_SETTINGS = {
  lateToleranceMinutes: 15,
  earlyCheckInMinutes: 60,
  earlyDepartureToleranceMinutes: 0,
  weeklyMinHours: 40,
  enableGeofence: true, // Master switch validasi radius geofence presensi mobile
  requireSelfie: true,
  preventMockGps: true,
  minOvertimeMinutes: 60,
  standardAnnualLeaveDays: 12,
  leaveExpiryPeriod: '31 Maret (Tahun Berikutnya)',
  overtimeFirstHourRate: 1.5,
  overtimeSubsequentHourRate: 2.0,
  autoNotifyShiftReminder: true,
};

export const INITIAL_HOLIDAYS = [
  {
    id: 1,
    date: '2026-01-01',
    dayName: 'Kamis',
    name: 'Tahun Baru 2026 Masehi',
    category: 'Libur Nasional',
    deductsLeave: false,
    operationalNote: 'Seluruh operasional pabrik dan kantor libur',
  },
  {
    id: 2,
    date: '2026-01-16',
    dayName: 'Jumat',
    name: "Isra Mi'raj Nabi Muhammad SAW",
    category: 'Libur Nasional',
    deductsLeave: false,
    operationalNote: 'Libur resmi keagamaan nasional',
  },
  {
    id: 3,
    date: '2026-02-17',
    dayName: 'Selasa',
    name: 'Tahun Baru Imlek 2577 Kongzili',
    category: 'Libur Nasional',
    deductsLeave: false,
    operationalNote: 'Libur resmi nasional',
  },
  {
    id: 4,
    date: '2026-03-20',
    dayName: 'Jumat',
    name: 'Hari Suci Nyepi (Tahun Baru Saka 1948)',
    category: 'Libur Nasional',
    deductsLeave: false,
    operationalNote: 'Libur resmi nasional',
  },
  {
    id: 5,
    date: '2026-03-23',
    dayName: 'Senin',
    name: 'Hari Raya Idul Fitri 1447 H (Hari Pertama)',
    category: 'Libur Nasional',
    deductsLeave: false,
    operationalNote: 'Hari raya keagamaan nasional',
  },
  {
    id: 6,
    date: '2026-03-24',
    dayName: 'Selasa',
    name: 'Hari Raya Idul Fitri 1447 H (Hari Kedua)',
    category: 'Libur Nasional',
    deductsLeave: false,
    operationalNote: 'Hari raya keagamaan nasional',
  },
  {
    id: 7,
    date: '2026-03-25',
    dayName: 'Rabu',
    name: 'Cuti Bersama Hari Raya Idul Fitri',
    category: 'Cuti Bersama',
    deductsLeave: false,
    operationalNote: 'Cuti bersama pemerintah Republik Indonesia',
  },
  {
    id: 8,
    date: '2026-05-01',
    dayName: 'Jumat',
    name: 'Hari Buruh Internasional (May Day)',
    category: 'Libur Nasional',
    deductsLeave: false,
    operationalNote: 'Libur resmi ketenagakerjaan',
  },
  {
    id: 9,
    date: '2026-05-14',
    dayName: 'Kamis',
    name: 'Kenaikan Yesus Kristus',
    category: 'Libur Nasional',
    deductsLeave: false,
    operationalNote: 'Libur resmi keagamaan nasional',
  },
  {
    id: 10,
    date: '2026-05-27',
    dayName: 'Rabu',
    name: 'Hari Raya Idul Adha 1447 H',
    category: 'Libur Nasional',
    deductsLeave: false,
    operationalNote: 'Libur resmi keagamaan nasional',
  },
  {
    id: 11,
    date: '2026-06-01',
    dayName: 'Senin',
    name: 'Hari Lahir Pancasila',
    category: 'Libur Nasional',
    deductsLeave: false,
    operationalNote: 'Libur resmi kenegaraan',
  },
  {
    id: 12,
    date: '2026-08-17',
    dayName: 'Senin',
    name: 'Hari Kemerdekaan Republik Indonesia Ke-81',
    category: 'Libur Nasional',
    deductsLeave: false,
    operationalNote: 'Peringatan HUT Kemerdekaan RI',
  },
  {
    id: 13,
    date: '2026-10-15',
    dayName: 'Kamis',
    name: 'Maintenance Tahunan Turbin Utama Pabrik',
    category: 'Libur Khusus Pabrik',
    deductsLeave: false,
    operationalNote: 'Penyesuaian jadwal operasional lini Mariuk & Cimalaka',
  },
  {
    id: 14,
    date: '2026-11-10',
    dayName: 'Selasa',
    name: 'Hari Pahlawan Nasional (Libur Penyesuaian)',
    category: 'Libur Khusus Pabrik',
    deductsLeave: false,
    operationalNote: 'Penyesuaian jam operasional & libur bersama peringatan Hari Pahlawan',
  },
  {
    id: 15,
    date: '2026-12-25',
    dayName: 'Jumat',
    name: 'Hari Raya Natal',
    category: 'Libur Nasional',
    deductsLeave: false,
    operationalNote: 'Libur resmi keagamaan nasional',
  },
];

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
    return raw ? JSON.parse(raw) : DEFAULT_SHIFT_SETTINGS;
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


