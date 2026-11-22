import * as XLSX from 'xlsx';

/**
 * Generator 4 Minggu Roster Operasional (Format DD/MM/YYYY)
 */
export const WEEKS = [1, 2, 3, 4].map((w) => {
  const startDay = 2 + (w - 1) * 7;
  const endDay = startDay + 6;
  const pad = (n) => String(n).padStart(2, '0');
  const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  return {
    id: w,
    label: `Minggu ${w}: ${pad(startDay)}/11/2026 - ${pad(endDay)}/11/2026`,
    days: dayNames.map((label, idx) => ({
      key: `d${idx + 1}`,
      label,
      date: `${pad(startDay + idx)}/11/2026`,
      isWeekend: idx >= 5,
    })),
  };
});

/**
 * Resolusi shift dinamis per karyawan per hari.
 * Mengakomodasi:
 * 1. Pengecualian / Tukar Shift / Override Mandiri
 * 2. Karyawan Non-Shift (Kantor) & Belum Ditetapkan
 * 3. Hari Libur Nasional & Penugasan Lembur Libur
 * 4. Jadwal Manual Operasional Khusus Grup
 * 5. Siklus Rotasi 2-Grup (A/B) Bergantian antar-minggu
 */
export function getEmployeeShiftForDay(
  emp,
  day,
  {
    exceptions = [],
    holidays = [],
    manualSchedules = [],
    shiftSettings = {},
    selectedWeekIndex = 0,
  } = {}
) {
  const parts = day.date.split('/');
  const dayDateStr = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : day.date;

  // 1. Pengecualian & Tukar Shift
  const activeException = exceptions.find(
    (ex) =>
      ex.date === dayDateStr &&
      (ex.employeeId === emp.id || (ex.type === 'swap' && ex.targetEmployeeId === emp.id))
  );

  if (activeException) {
    if (activeException.type === 'override') {
      const shiftLabel = activeException.targetShift || 'Khusus';
      const isOff = shiftLabel.toLowerCase().includes('off');
      const isMalam = shiftLabel.toLowerCase().includes('malam');
      const code = isOff ? 'OFF' : isMalam ? 'MALAM (20-05)' : 'PAGI (08-17)';
      return {
        code: `${code}*`,
        label: `Pengecualian Mandiri (${shiftLabel}): ${activeException.reason}`,
        badgeClass: isOff
          ? 'bg-slate-100 text-slate-600 border-slate-300 font-bold'
          : 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
      };
    }
    const isTarget = activeException.type === 'swap' && activeException.targetEmployeeId === emp.id;
    return {
      code: isTarget ? 'S1 (SWAP)' : 'S2 (SWAP)',
      label: `Tukar Shift: ${activeException.reason}`,
      badgeClass: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
    };
  }

  // 2. Status Grup Dasar
  if (emp.group === 'Belum Ditetapkan') {
    return {
      code: 'UNSET',
      label: 'Grup Kerja Belum Ditetapkan',
      badgeClass: 'bg-slate-100 text-slate-400 border-slate-200 font-medium',
    };
  }

  if (emp.group === 'Non-Shift') {
    if (day.isWeekend) {
      return {
        code: 'OFF',
        label: 'Libur Akhir Pekan',
        badgeClass: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
      };
    }
    return {
      code: 'NON',
      label: 'Office (08:00 - 17:00)',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-200 font-semibold',
    };
  }

  // 3. Libur Nasional & Jadwal Manual
  const activeHoliday = holidays.find((h) => h.date === dayDateStr);
  const activeManual = manualSchedules.find((m) => m.startDate === dayDateStr);

  if (activeHoliday) {
    const isTargetGroup =
      activeManual &&
      (activeManual.targetGroup === emp.group || activeManual.targetGroup === 'Semua Grup (A & B)');

    if (isTargetGroup) {
      const isShift2 = emp.shiftCode === 'S2' || (emp.baseShift && emp.baseShift.includes('Shift 2'));
      const timeStr = isShift2
        ? `${activeManual.shift2In}-${activeManual.shift2Out}`
        : `${activeManual.shift1In}-${activeManual.shift1Out}`;
      const shiftCodeStr = isShift2 ? `S2 (${timeStr})` : `S1 (${timeStr})`;
      return {
        code: shiftCodeStr,
        label: `Penugasan Lembur Libur [${activeHoliday.name}]: ${activeManual.reason}`,
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      };
    }

    return {
      code: 'LIBUR',
      label: `${activeHoliday.category}: ${activeHoliday.name} - ${activeHoliday.operationalNote || ''}`,
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-200 font-bold',
    };
  }

  if (activeManual) {
    const isTargetGroup =
      activeManual.targetGroup === emp.group || activeManual.targetGroup === 'Semua Grup (A & B)';

    if (isTargetGroup) {
      const isShift2 = emp.shiftCode === 'S2' || (emp.baseShift && emp.baseShift.includes('Shift 2'));
      const timeStr = isShift2
        ? `${activeManual.shift2In}-${activeManual.shift2Out}`
        : `${activeManual.shift1In}-${activeManual.shift1Out}`;
      const shiftCodeStr = isShift2 ? `S2 (${timeStr})` : `S1 (${timeStr})`;
      const shiftName = isShift2 ? 'Shift 2' : 'Shift 1';
      return {
        code: shiftCodeStr,
        label: `Jadwal Manual [${activeManual.targetGroup}]: ${shiftName} (${timeStr}) - ${activeManual.reason}`,
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      };
    }

    return {
      code: 'OFF',
      label: `Libur Operasional (Jadwal Manual Khusus ${activeManual.targetGroup})`,
      badgeClass: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
    };
  }

  // 4. Pola Rotasi 2-Grup (A/B) Bergantian
  const isGroupA = emp.group === 'Grup A';
  const isGroupB = emp.group === 'Grup B';
  const dayNum = parseInt(day.key.replace('d', ''), 10);

  const isWeekEven = (selectedWeekIndex || 0) % 2 === 1;
  const isGroupAWorking = !isWeekEven ? dayNum % 2 === 1 : dayNum % 2 === 0;
  const isWorkingDay = isGroupA ? isGroupAWorking : isGroupB ? !isGroupAWorking : false;

  if (!isWorkingDay) {
    return {
      code: 'OFF',
      label: 'Libur Roster Bergantian (OFF)',
      badgeClass: 'bg-slate-100 text-slate-500 border-slate-200 font-semibold',
    };
  }

  const isMalam =
    emp.shiftCode === 'MALAM' || (emp.baseShift && emp.baseShift.toLowerCase().includes('malam'));
  if (isMalam) {
    return {
      code: 'MALAM (20-05)',
      label: `${shiftSettings?.shiftMalamName || 'Shift Malam'} (${shiftSettings?.shiftMalamIn || '20:00'} - ${shiftSettings?.shiftMalamOut || '05:00'})`,
      badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200 font-bold',
    };
  }

  return {
    code: 'PAGI (08-17)',
    label: `${shiftSettings?.shiftPagiName || 'Shift Pagi'} (${shiftSettings?.shiftPagiIn || '08:00'} - ${shiftSettings?.shiftPagiOut || '17:00'})`,
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
  };
}

/**
 * Kalkulasi total jam kerja mingguan berdasarkan jadwal aktif (8 jam efektif per hari dinas).
 */
export function calculateWeeklyHours(emp, days, options = {}) {
  let totalHours = 0;
  for (const day of days) {
    const shiftInfo = getEmployeeShiftForDay(emp, day, options);
    if (
      shiftInfo.code.includes('PAGI') ||
      shiftInfo.code.includes('MALAM') ||
      shiftInfo.code.includes('SWAP') ||
      shiftInfo.code.includes('S1') ||
      shiftInfo.code.includes('S2') ||
      shiftInfo.code === 'NON'
    ) {
      totalHours += 8;
    }
  }
  return totalHours;
}

/**
 * Ekspor matriks roster mingguan ke file Excel (.xlsx).
 */
export function exportRosterToExcel(employees, currentWeek, selectedWeekIndex, options = {}) {
  const rows = employees.map((emp, index) => {
    const row = {
      No: index + 1,
      NIP: emp.nip,
      'Nama Karyawan': emp.name,
      Lokasi: emp.location || '-',
      Divisi: emp.division,
      Grup: emp.group,
      'Shift Dasar': emp.baseShift,
    };

    currentWeek.days.forEach((day) => {
      const shiftInfo = getEmployeeShiftForDay(emp, day, options);
      row[`${day.label} (${day.date})`] = shiftInfo.code;
    });

    const weeklyHours = calculateWeeklyHours(emp, currentWeek.days, options);
    row['Total Jam Kerja'] = `${weeklyHours} Jam`;
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Roster Shift');

  worksheet['!cols'] = [
    { wch: 4 },
    { wch: 12 },
    { wch: 22 },
    { wch: 18 },
    { wch: 24 },
    { wch: 12 },
    { wch: 28 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 16 },
  ];

  XLSX.writeFile(workbook, `Roster_Shift_HCGA_Minggu_${selectedWeekIndex + 1}_Nov_2026.xlsx`);
}
