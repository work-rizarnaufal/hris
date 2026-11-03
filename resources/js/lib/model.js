import { groupAt, schedule, planAt, recordMinutes } from './rotation.js';

export const STATUSES = ['Hadir', 'Terlambat', 'Izin', 'Sakit', 'Cuti', 'Alpha', 'Libur'];

export const defaultConfig = {
  workdays: [1, 2, 3, 4, 5, 6],
  holidays: [],
  company: 'HCGA · Area Operasional',
  rotation: {
    plans: [],
    overrides: [],
  },
};

export const todayWIB = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

export function addDays(date, n) {
  const d = new Date(date + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function dateList(from, to) {
  const dates = [];
  if (!from || !to || from > to) return dates;
  for (let d = from; d <= to && dates.length < 366; d = addDays(d, 1)) {
    dates.push(d);
  }
  return dates;
}

export function monthRange(month) {
  const [y, m] = month.split('-').map(Number);
  return {
    from: `${month}-01`,
    to: new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10),
  };
}

export function timeMinutes(t) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(t)) return null;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function normalizeAttendance(a) {
  if (a.status === 'Hadir' || a.status === 'Terlambat') {
    const minute = timeMinutes(a.checkIn);
    if (minute === null) throw new Error('Jam masuk wajib diisi untuk Hadir/Terlambat.');
    if (a.checkOut && timeMinutes(a.checkOut) === null) {
      throw new Error('Jam pulang tidak valid.');
    }
    if (
      a.checkOut &&
      (timeMinutes(a.checkOut) ?? 0) + ((a.endMinute ?? 960) < (a.startMinute ?? 480) ? 1440 : 0) <
        recordMinutes(a)
    ) {
      throw new Error('Jam pulang harus setelah atau sama dengan jam masuk (shift harian).');
    }
    return {
      ...a,
      status: recordMinutes(a) > (a.startMinute ?? 480) ? 'Terlambat' : 'Hadir',
    };
  }
  return { ...a, checkIn: '', checkOut: '' };
}

export const lateMinutes = (a) =>
  a.status === 'Terlambat' ? Math.max(0, recordMinutes(a) - (a.startMinute ?? 480)) : 0;

export function employeeStats(e, records, config, from, to, today = todayWIB(), view = {}) {
  const list = records.filter(
    (a) =>
      (!view.shift || (a.shift || 0) === view.shift) &&
      (!view.group || (a.groupName || groupAt(config, e.id, a.date)) === view.group) &&
      a.employeeId === e.id &&
      a.date >= from &&
      a.date <= to &&
      a.date <= today &&
      (!planAt(config, a.date) || !!a.shift)
  );

  const map = new Map(list.map((a) => [`${a.date}:${a.shift || 0}`, a]));
  let scheduled = 0;
  let pending = 0;

  for (const d of dateList(from, to < today ? to : today)) {
    if (d < e.startDate || (e.endDate && d > e.endDate)) continue;
    if (planAt(config, d)) {
      for (const shift of [1, 2]) {
        const r = map.get(`${d}:${shift}`);
        const actual = schedule(config, e, d, shift);
        if (
          actual &&
          (!view.shift || view.shift === shift) &&
          (!view.group || actual.group === view.group)
        ) {
          if (r?.status !== 'Libur') {
            scheduled++;
            if (!r) pending++;
          }
        }
      }
      continue;
    }
    if (view.shift || view.group) continue;
    const r = map.get(`${d}:0`);
    const weekday = new Date(`${d}T00:00:00Z`).getUTCDay();
    const work = r ? r.status !== 'Libur' : config.workdays.includes(weekday) && !config.holidays.includes(d);
    if (work) {
      scheduled++;
      if (!r) pending++;
    }
  }

  const counts = Object.fromEntries(
    STATUSES.map((s) => [s, list.filter((a) => a.status === s).length])
  );
  const present = counts.Hadir + counts.Terlambat;
  const percent = scheduled ? Math.round((present / scheduled) * 1000) / 10 : 0;
  const absent = counts.Izin + counts.Sakit + counts.Cuti + counts.Alpha;

  return {
    employee: e,
    list,
    counts,
    present,
    percent,
    scheduled,
    pending,
    absent,
    minutes: list.reduce((n, a) => n + lateMinutes(a), 0),
    consistency: scheduled ? Math.round((counts.Hadir / scheduled) * 1000) / 10 : 0,
  };
}

export function allStats(data, from, to) {
  return data.employees.map((e) =>
    employeeStats(e, data.attendance, data.config, from, to, todayWIB(), data.view)
  );
}

export function totals(stats) {
  const sum = (fn) => stats.reduce((n, s) => n + fn(s), 0);
  const scheduled = sum((s) => s.scheduled);
  const present = sum((s) => s.present);
  return {
    present,
    scheduled,
    late: sum((s) => s.counts.Terlambat),
    absent: sum((s) => s.absent),
    alpha: sum((s) => s.counts.Alpha),
    pending: sum((s) => s.pending),
    minutes: sum((s) => s.minutes),
    onTime: sum((s) => s.counts.Hadir),
    percent: scheduled ? Math.round((present / scheduled) * 1000) / 10 : 0,
  };
}

export function formatDate(d, short = false) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: short ? 'short' : 'long',
    year: short ? undefined : 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${d}T00:00:00Z`));
}

export function periodConclusion(stats) {
  const t = totals(stats);
  return `Kehadiran tercatat ${t.present} dari ${t.scheduled} jadwal karyawan/shift (${t.percent}%). Terdapat ${t.late} keterlambatan dengan total ${t.minutes} menit, ${t.absent} ketidakhadiran (izin, sakit, cuti, alpha), dan ${t.pending} jadwal karyawan/shift belum diinput. Persentase bersifat sementara selama data belum lengkap.`;
}

export function filterData(data, from, to, view = {}, query = '', location = '') {
  const dates = dateList(from, to);
  const employees = data.employees.filter(
    (e) =>
      (!view.role || e.role === view.role) &&
      e.name.toLowerCase().includes(query.toLowerCase()) &&
      (!location || e.location === location) &&
      (!view.group || dates.some((d) => groupAt(data.config, e.id, d) === view.group))
  );
  const ids = new Set(employees.map((e) => e.id));
  return {
    ...data,
    view,
    employees,
    attendance: data.attendance.filter(
      (a) =>
        ids.has(a.employeeId) &&
        (!view.shift || (a.shift || 0) === view.shift) &&
        (!view.group || (a.groupName || groupAt(data.config, a.employeeId, a.date)) === view.group)
    ),
  };
}

