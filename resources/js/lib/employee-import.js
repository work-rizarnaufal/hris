export const EMPLOYEE_HEADERS = [
  'Nama Karyawan',
  'Jabatan',
  'Divisi',
  'Lokasi Kerja',
  'Status',
  'Tanggal Mulai Aktif',
  'Tanggal Akhir Aktif',
];
export const MAX_IMPORT_ROWS = 500;
export const cleanText = (value) => String(value ?? '').trim().replace(/\s+/g, ' ');
export const nameKey = (name) => cleanText(name).toLocaleLowerCase('id-ID');
export const employeeRevision = (es) =>
  [...es]
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    .map((e) => e.id + ':' + e.version)
    .join('|');

const aliases = {
  nama: 'name',
  namakaryawan: 'name',
  namalengkap: 'name',
  jabatan: 'role',
  posisi: 'role',
  divisi: 'division',
  departemen: 'division',
  department: 'division',
  lokasi: 'location',
  lokasikerja: 'location',
  penempatan: 'location',
  status: 'active',
  statuskaryawan: 'active',
  tanggalmulai: 'startDate',
  tanggalmulaiaktif: 'startDate',
  tanggalbergabung: 'startDate',
  tanggalmasuk: 'startDate',
  tanggalakhir: 'endDate',
  tanggalakhiraktif: 'endDate',
  hariterakhiraktif: 'endDate',
  tanggalnonaktif: 'endDate',
};

const headerKey = (value) =>
  cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

function validDate(s) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(s) &&
    !Number.isNaN(Date.parse(s + 'T00:00:00Z')) &&
    new Date(s + 'T00:00:00Z').toISOString().slice(0, 10) === s
  );
}

export function importDate(value, date1904 = false) {
  if (value === null || value === undefined || value === '') return '';
  let result = '';
  if (value instanceof Date) {
    if (!Number.isNaN(value.getTime())) result = value.toISOString().slice(0, 10);
  } else if (typeof value === 'number') {
    if (Number.isFinite(value) && value >= (date1904 ? 0 : 61) && value < 2957000) {
      result = new Date(
        (Math.floor(value) + (date1904 ? 1462 : 0) - 25569) * 86400000
      )
        .toISOString()
        .slice(0, 10);
    }
  } else {
    const s = cleanText(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) result = s;
    else {
      const m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
      if (m) result = `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
    }
  }
  return validDate(result) ? result : 'INVALID';
}

export function parseEmployeeGrid(grid, existing, fallbackDate, date1904 = false) {
  const first = grid.findIndex((row) => row.some((cell) => cleanText(cell) !== ''));
  if (first < 0) throw new Error('File atau sheet masih kosong.');
  const headers = grid[first];
  const positions = new Map();
  const ignored = [];

  headers.forEach((h, i) => {
    const k = aliases[headerKey(h)];
    if (k) {
      if (positions.has(k)) throw new Error(`Kolom ${cleanText(h)} muncul lebih dari sekali.`);
      positions.set(k, i);
    } else if (cleanText(h)) ignored.push(cleanText(h));
  });

  for (const [key, label] of [
    ['name', 'Nama Karyawan'],
    ['role', 'Jabatan'],
    ['division', 'Divisi'],
    ['location', 'Lokasi Kerja'],
  ]) {
    if (!positions.has(key)) {
      throw new Error(`Kolom ${label} tidak ditemukan. Gunakan template yang tersedia.`);
    }
  }

  if (!validDate(fallbackDate)) {
    throw new Error('Pilih tanggal mulai untuk kolom yang kosong.');
  }

  const rows = [];
  const seen = new Set();
  const current = new Set(existing.map((e) => nameKey(e.name)));

  for (let index = first + 1; index < grid.length; index++) {
    const row = grid[index];
    if (!row.some((cell) => cleanText(cell) !== '')) continue;
    if (rows.length >= MAX_IMPORT_ROWS) throw new Error('Maksimal 500 karyawan dalam satu file.');

    const value = (key) => {
      const i = positions.get(key);
      return i === undefined ? '' : row[i] ?? '';
    };

    const errors = [];
    const name = cleanText(value('name'));
    const role = cleanText(value('role'));
    const division = cleanText(value('division'));
    const location = cleanText(value('location'));
    const status = cleanText(value('active')).toLowerCase();
    let active = 1;

    if (['nonaktif', 'non aktif', 'tidak aktif', 'inactive', '0'].includes(status)) {
      active = 0;
    } else if (!['', 'aktif', 'active', '1'].includes(status)) {
      errors.push('Status harus Aktif atau Nonaktif.');
    }

    const start = importDate(value('startDate'), date1904);
    const end = importDate(value('endDate'), date1904);
    const startDate = start || fallbackDate;
    const endDate = end || null;

    for (const [label, v, max] of [
      ['Nama Karyawan', name, 120],
      ['Jabatan', role, 100],
      ['Divisi', division, 100],
      ['Lokasi Kerja', location, 100],
    ]) {
      if (v.length < (label === 'Nama Karyawan' ? 2 : 1)) {
        errors.push(`${label} wajib diisi${label === 'Nama Karyawan' ? ' minimal 2 karakter' : ''}.`);
      }
      if (v.length > max) errors.push(`${label} maksimal ${max} karakter.`);
    }

    if (start === 'INVALID' || end === 'INVALID') {
      errors.push('Tanggal harus YYYY-MM-DD atau DD/MM/YYYY dan merupakan tanggal yang valid.');
    }
    if (active && endDate) errors.push('Karyawan aktif tidak boleh memiliki tanggal akhir aktif.');
    if (!active && !endDate) errors.push('Tanggal akhir aktif wajib untuk karyawan nonaktif.');
    if (startDate !== 'INVALID' && endDate && endDate !== 'INVALID' && endDate < startDate) {
      errors.push('Tanggal akhir aktif sebelum tanggal mulai.');
    }

    const key = nameKey(name);
    let duplicate = '';
    if (key) {
      if (current.has(key)) duplicate = 'Nama sudah terdaftar; dilewati.';
      else if (seen.has(key)) duplicate = 'Nama berulang di file; dilewati.';
      seen.add(key);
    }
    rows.push({
      row: index + 1,
      employee: { name, role, division, location, active, startDate, endDate },
      errors,
      duplicate,
    });
  }

  if (!rows.length) throw new Error('Tidak ada baris data setelah judul kolom.');
  return { rows, ignored };
}

