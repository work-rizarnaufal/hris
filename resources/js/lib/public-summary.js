import { allStats, dateList, totals } from './model.js';

export function publicSummary(data, from, to) {
  const stats = allStats(data, from, to);
  const t = totals(stats);
  const dates = dateList(from, to);

  const daily = dates.map((date) => {
    const list = data.attendance.filter((a) => a.date === date);
    const present = list.filter((a) => ['Hadir', 'Terlambat'].includes(a.status)).length;
    const late = list.filter((a) => a.status === 'Terlambat').length;
    return { date, present, late };
  });

  return {
    from,
    to,
    company: data.config.company,
    employees: data.employees.filter((e) => e.active).length,
    present: t.present,
    late: t.late,
    absent: t.absent,
    scheduled: t.scheduled,
    pending: t.pending,
    percent: t.percent,
    daily,
  };
}

