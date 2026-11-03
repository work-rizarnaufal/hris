import { addDays, timeMinutes } from './model.js';

export function planAt(c, date) {
  return [...(c.rotation?.plans || [])]
    .filter((p) => p.from <= date)
    .sort((a, b) => b.from.localeCompare(a.from))[0];
}

export function groupAt(c, id, date) {
  const p = planAt(c, date);
  return p?.fixed?.includes(id) ? 'Tetap' : p?.members?.[id];
}

export function schedule(c, e, date, shift) {
  const p = planAt(c, date);
  if (!p || !shift) return null;

  if (p.fixed?.includes(e.id)) {
    if (shift !== 1 || date < e.startDate || (e.endDate && date > e.endDate)) return null;
    return {
      group: 'Tetap',
      start: '08:00',
      end: '16:00',
      startMinute: 480,
      endMinute: 960,
      outDate: date,
    };
  }

  const group = p.members[e.id];
  if (!group || date < e.startDate || (e.endDate && date > e.endDate)) return null;

  const override = c.rotation?.overrides.find((o) => o.date === date);
  const days = Math.round((Date.parse(date) - Date.parse(p.from)) / 86400000);
  const working = days % 2 === 0 ? p.first : p.first === 'A' ? 'B' : 'A';

  if (override ? override.group !== 'Both' && override.group !== group : working !== group) {
    return null;
  }

  const start = override
    ? shift === 1
      ? override.start1
      : override.start2
    : shift === 1
    ? '08:00'
    : '20:00';

  const end = override
    ? shift === 1
      ? override.end1
      : override.end2
    : shift === 1
    ? '16:00'
    : '04:00';

  return {
    group,
    start,
    end,
    startMinute: timeMinutes(start),
    endMinute: timeMinutes(end),
    outDate: timeMinutes(end) < timeMinutes(start) ? addDays(date, 1) : date,
  };
}

export function recordMinutes(a) {
  let m = timeMinutes(a.checkIn) ?? 0;
  if (a.shift === 2 && m < 720) m += 1440;
  return m;
}

export function recordEndDate(a) {
  return a.checkOut
    ? (a.endMinute ?? 960) < (a.startMinute ?? 480)
      ? addDays(a.date, 1)
      : a.date
    : '';
}

export const shiftLabel = (a) =>
  a.shift ? `Shift ${a.shift}` : 'Arsip jadwal lama';

