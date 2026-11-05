import {
  LayoutDashboard,
  Users,
  Network,
  CalendarCheck,
  CalendarDays,
  Timer,
  CalendarX2,
  WalletCards,
  Banknote,
  FileText,
  FileSpreadsheet,
  Settings,
  History,
  Eye,
} from 'lucide-react';

export const navigationConfig = [
  {
    group: 'UTAMA',
    items: [
      {
        title: 'Beranda',
        subtitle: 'Dashboard eksekutif KPI, metrik kehadiran, dan ringkasan aktivitas HR.',
        href: '/beranda',
        icon: LayoutDashboard,
        exact: false,
      },
    ],
  },
  {
    group: 'MANAJEMEN KARYAWAN',
    items: [
      {
        title: 'Data Karyawan',
        subtitle: 'Direktori data induk, profil lengkap, berkas, dan status kontrak kerja.',
        href: '/karyawan',
        icon: Users,
      },
      {
        title: 'Organisasi & Jabatan',
        subtitle: 'Kelola departemen, divisi, level jabatan, dan struktur hirarki perusahaan.',
        href: '/organisasi',
        icon: Network,
        disabled: true,
        badge: 'TBA',
      },
    ],
  },
  {
    group: 'WAKTU & KEHADIRAN',
    items: [
      {
        title: 'Catatan Kehadiran',
        subtitle: 'Monitoring log presensi harian, tracking absensi, dan jam masuk/pulang.',
        href: '/kehadiran',
        icon: CalendarCheck,
      },
      {
        title: 'Jadwal & Shift',
        subtitle: 'Pengaturan roster rotasi shift, kalender kerja, dan penugasan grup.',
        href: '/jadwal',
        icon: CalendarDays,
      },
      {
        title: 'Lembur (Overtime)',
        subtitle: 'Pencatatan surat perintah lembur (SPL) dan perhitungan kompensasi jam kerja.',
        href: '/lembur',
        icon: Timer,
        disabled: true,
        badge: 'TBA',
      },
    ],
  },
  {
    group: 'CUTI & PERIZINAN',
    items: [
      {
        title: 'Pengajuan Cuti & Izin',
        subtitle: 'Alur permohonan, verifikasi sakit, dan persetujuan izin operasional.',
        href: '/cuti',
        icon: CalendarX2,
        disabled: true,
        badge: 'TBA',
      },
      {
        title: 'Saldo & Kuota Cuti',
        subtitle: 'Pemantauan plafon cuti tahunan, hak cuti bersama, dan riwayat cuti.',
        href: '/saldo-cuti',
        icon: WalletCards,
        disabled: true,
        badge: 'TBA',
      },
    ],
  },
  {
    group: 'PENGGAJIAN (PAYROLL)',
    items: [
      {
        title: 'Penggajian & Periode',
        subtitle: 'Kalkulasi gaji pokok, tunjangan kehadiran, potongan PPh 21, dan BPJS.',
        href: '/payroll',
        icon: Banknote,
        disabled: true,
        badge: 'TBA',
      },
      {
        title: 'Slip Gaji',
        subtitle: 'Arsip dan distribusi dokumen slip gaji resmi kepada setiap karyawan.',
        href: '/slip-gaji',
        icon: FileText,
        disabled: true,
        badge: 'TBA',
      },
    ],
  },
  {
    group: 'LAPORAN & ANALITIK',
    items: [
      {
        title: 'Laporan & Rekap',
        subtitle: 'Rekapitulasi performa kehadiran, turnover, kedisiplinan, dan ekspor data.',
        href: '/laporan',
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    group: 'PENGATURAN & AUDIT',
    items: [
      {
        title: 'Pengaturan Sistem',
        subtitle: 'Konfigurasi kalender kerja, libur nasional, kebijakan HR, dan parameter.',
        href: '/pengaturan',
        icon: Settings,
      },
      {
        title: 'Log Audit',
        subtitle: 'Telusuri rekam jejak setiap tindakan penambahan, pengubahan, dan penghapusan data.',
        href: '/audit',
        icon: History,
        disabled: true,
        badge: 'TBA',
      },
    ],
  },
  {
    group: 'PORTAL PUBLIK',
    items: [
      {
        title: 'Ringkasan Publik',
        subtitle: 'Portal agregat statistik kehadiran terbuka tanpa data pribadi karyawan.',
        href: '/ringkasan-publik',
        icon: Eye,
        isPublic: true,
        disabled: true,
        badge: 'TBA',
      },
    ],
  },
];

/**
 * Mencari metadata halaman (judul, subjudul, ikon) berdasarkan URL aktif saat ini.
 * Memudahkan penambahan halaman baru secara otomatis tanpa mengubah layout.
 */
export function getPageMetadata(pathname = '') {
  const cleanPath = (typeof pathname === 'string' ? pathname : '').split('?')[0];

  for (const group of navigationConfig) {
    for (const item of group.items) {
      if (item.href === cleanPath) {
        return item;
      }
      if (item.href === '/beranda' && (cleanPath === '/' || cleanPath === '')) {
        return item;
      }
      if (item.href !== '/' && cleanPath.startsWith(item.href)) {
        return item;
      }
    }
  }

  return {
    title: 'Halaman',
    subtitle: '',
    href: cleanPath,
    icon: null,
  };
}

export default navigationConfig;
