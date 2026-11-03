import { schedule, recordEndDate, shiftLabel } from './rotation.js';
import { dateList, allStats, formatDate, lateMinutes, periodConclusion, totals } from './model.js';

export function downloadJSON(value, name) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' })
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportReport(kind, data, from, to, employeeId = '') {
  const stats = allStats(data, from, to).filter((s) => !employeeId || s.employee.id === employeeId);
  const t = totals(stats);
  const records = stats
    .flatMap((s) => s.list.map((a) => ({ ...a, name: s.employee.name, role: s.employee.role })))
    .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));

  const scope = `Filter: ${data.view?.group || 'Semua grup/kategori'} | Shift ${
    data.view?.shift || 'semua'
  } | Jabatan ${data.view?.role || 'semua'}`;
  const headers = [
    'Nama',
    'Jabatan',
    'Jadwal/shift',
    'Hadir',
    'Tepat',
    'Terlambat',
    'Menit',
    'Izin',
    'Sakit',
    'Cuti',
    'Alpha',
    'Belum input',
    '% hadir',
  ];
  const rows = stats.map((s) => [
    s.employee.name,
    s.employee.role,
    s.scheduled,
    s.present,
    s.counts.Hadir,
    s.counts.Terlambat,
    s.minutes,
    s.counts.Izin,
    s.counts.Sakit,
    s.counts.Cuti,
    s.counts.Alpha,
    s.pending,
    s.percent,
  ]);

  const detailHeaders = [
    'Tanggal',
    'Nama',
    'Jabatan',
    'Grup / Shift',
    'Masuk',
    'Pulang',
    'Status',
    'Menit terlambat',
    'Keterangan',
    'Catatan HCGA',
  ];
  const detail = records.map((a) => [
    a.date,
    a.name,
    a.role,
    (a.groupName || '-') + ' / ' + shiftLabel(a),
    a.checkIn || '-',
    (a.checkOut || '-') + (recordEndDate(a) && recordEndDate(a) !== a.date ? ' (+1 hari)' : ''),
    a.status,
    lateMinutes(a),
    a.remarks,
    a.notes,
  ]);

  if (kind === 'excel') {
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet([
      [data.config.company],
      ['LAPORAN MONITORING KEHADIRAN HCGA'],
      ['Periode', from, to],
      [
        'Rumus',
        'Kehadiran / jadwal kerja/shift terjadwal × 100%; izin/sakit/cuti/alpha dalam penyebut; libur dikecualikan.',
      ],
      [],
      headers,
      ...rows,
      [],
      ['FILTER', scope],
      ['KESIMPULAN', periodConclusion(stats)],
    ]);
    sheet['!cols'] = headers.map((_, i) => ({ wch: i < 2 ? 26 : 14 }));
    XLSX.utils.book_append_sheet(wb, sheet, 'Rekap Karyawan');

    const ds = XLSX.utils.aoa_to_sheet([detailHeaders, ...detail]);
    ds['!cols'] = detailHeaders.map((_, i) => ({ wch: i > 6 ? 35 : 22 }));
    XLSX.utils.book_append_sheet(wb, ds, 'Riwayat Kehadiran');

    const dates = [...new Set(records.map((a) => a.date))].sort();
    const chart = XLSX.utils.aoa_to_sheet([
      ['DATA GRAFIK HARIAN'],
      ['Tanggal', 'Hadir', 'Terlambat', 'Tidak hadir'],
      ...dates.map((d) => {
        const r = records.filter((a) => a.date === d);
        return [
          d,
          r.filter((a) => ['Hadir', 'Terlambat'].includes(a.status)).length,
          r.filter((a) => a.status === 'Terlambat').length,
          r.filter((a) => ['Izin', 'Sakit', 'Cuti', 'Alpha'].includes(a.status)).length,
        ];
      }),
    ]);
    XLSX.utils.book_append_sheet(wb, chart, 'Data Grafik');
    XLSX.writeFile(wb, `HCGA_${from}_${to}${employeeId ? '_Individu' : ''}.xlsx`);
    return;
  }

  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const width = 297;
  const height = 210;

  const pageTitle = (title) => {
    doc.setFillColor(16, 39, 63);
    doc.rect(0, 0, width, 27, 'F');
    doc.setTextColor(211, 175, 108);
    doc.setFontSize(10);
    doc.text('HCGA / HUMAN CAPITAL & GENERAL AFFAIRS', 12, 10);
    doc.setTextColor(255);
    doc.setFontSize(15);
    doc.text(title, 12, 20);
    doc.setTextColor(70);
    doc.setFontSize(9);
    doc.text(`${data.config.company} | ${formatDate(from)} - ${formatDate(to)}`, 12, 35);
    doc.setFontSize(7);
    doc.text(scope, 12, 39);
  };

  pageTitle(employeeId ? 'EVALUASI KEHADIRAN INDIVIDU' : 'LAPORAN MONITORING KEHADIRAN');

  const metric = [
    ['Kehadiran', String(t.present)],
    ['Terlambat', String(t.late)],
    ['Tidak hadir', String(t.absent)],
    ['Persentase', t.percent + '%'],
  ];

  metric.forEach((m, i) => {
    const x = 12 + i * 69;
    doc.setFillColor(242, 245, 248);
    doc.roundedRect(x, 42, 65, 22, 2, 2, 'F');
    doc.setFontSize(8);
    doc.text(m[0], x + 5, 49);
    doc.setTextColor(16, 39, 63);
    doc.setFontSize(16);
    doc.text(m[1], x + 5, 59);
    doc.setTextColor(70);
  });

  doc.setFontSize(10);
  doc.text('Tren kehadiran harian', 12, 74);
  const dates = [...new Set(records.map((a) => a.date))].sort();
  const max = Math.max(
    1,
    ...dates.map((d) => records.filter((a) => a.date === d && ['Hadir', 'Terlambat'].includes(a.status)).length)
  );
  const chartX = 15;
  const chartY = 109;
  const chartW = 267;
  const chartH = 30;
  doc.setDrawColor(220);
  doc.line(chartX, chartY, chartX + chartW, chartY);

  dates.forEach((date, i) => {
    const rs = records.filter((a) => a.date === date);
    const h = rs.filter((a) => ['Hadir', 'Terlambat'].includes(a.status)).length;
    const l = rs.filter((a) => a.status === 'Terlambat').length;
    const step = chartW / Math.max(1, dates.length);
    doc.setFillColor(16, 39, 63);
    doc.rect(chartX + i * step, chartY - (chartH * h) / max, Math.max(0.4, step * 0.55), (chartH * h) / max, 'F');
    doc.setFillColor(193, 148, 66);
    doc.rect(chartX + i * step + step * 0.55, chartY - (chartH * l) / max, Math.max(0.3, step * 0.25), (chartH * l) / max, 'F');
  });

  autoTable(doc, {
    startY: 126,
    head: [headers],
    body: rows,
    margin: { left: 12, right: 12, bottom: 14 },
    styles: { fontSize: 7, cellPadding: 2.5 },
    headStyles: { fillColor: [16, 39, 63] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
  });

  doc.addPage();
  pageTitle('KESIMPULAN & DASAR PERHITUNGAN');
  doc.setFontSize(11);
  doc.text(doc.splitTextToSize(periodConclusion(stats), 270), 12, 48);

  autoTable(doc, {
    startY: 85,
    head: [detailHeaders],
    body: detail,
    margin: { left: 12, right: 12, bottom: 14 },
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [16, 39, 63] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    didDrawPage: () => {
      doc.setFontSize(8);
      doc.setTextColor(110);
      doc.text(
        'HCGA | Dicetak ' + new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB',
        12,
        height - 6
      );
    },
  });

  if (kind === 'print') {
    const url = URL.createObjectURL(doc.output('blob'));
    const frame = document.createElement('iframe');
    frame.style.display = 'none';
    frame.src = url;
    document.body.appendChild(frame);
    frame.onload = () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    };
    setTimeout(() => {
      frame.remove();
      URL.revokeObjectURL(url);
    }, 120000);
  } else {
    doc.save(`HCGA_${from}_${to}${employeeId ? '_Individu' : ''}.pdf`);
  }
}

