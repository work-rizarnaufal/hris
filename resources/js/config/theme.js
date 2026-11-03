/**
 * HCGA Color Identity & Design Tokens (Locked Specification)
 * Sistem Penguncian Warna Resmi HCGA Attendance Monitoring
 */

export const colors = {
  // Brand Identity Utama
  navy: {
    DEFAULT: '#10273f',
    50: '#f0f4f9',
    100: '#dce5f0',
    200: '#b9cce2',
    300: '#8da9cf',
    400: '#5a80b8',
    500: '#39609e',
    600: '#284880',
    700: '#1d3763',
    800: '#193750',
    900: '#10273f', // Corporate Deep Navy (Primary)
    950: '#0a1929',
  },

  // Aksen Kehormatan & Kedisiplinan
  gold: {
    DEFAULT: '#c4a266',
    light: '#f7f2e8',
    50: '#fdfbf7',
    100: '#f7f2e8',
    200: '#ede3ce',
    300: '#dfcea9',
    400: '#d3b87d',
    500: '#c4a266', // Signature HCGA Gold Accent
    600: '#ab874b',
    700: '#8a6a3b',
    800: '#705534',
    900: '#5c462e',
  },

  // Tipografi & Kanvas
  ink: {
    DEFAULT: '#1d3046',
    light: '#2d4156',
    muted: '#8290a2',
  },

  // Latar & Permukaan
  surface: {
    bg: '#f6f8fb',
    card: '#ffffff',
    border: '#e8ecf1',
    borderDark: '#31455b',
  },

  // Status Kehadiran Operasional (Standard Legalitas HCGA)
  status: {
    hadir: {
      text: '#398872',
      bg: '#eef7f1',
      dot: '#398872',
    },
    terlambat: {
      text: '#ac8848',
      bg: '#fcf6e9',
      dot: '#c4a266',
    },
    izin: {
      text: '#698eb0',
      bg: '#eff5fa',
      dot: '#698eb0',
    },
    sakit: {
      text: '#ab7b9b',
      bg: '#f7f0f7',
      dot: '#ab7b9b',
    },
    cuti: {
      text: '#489490',
      bg: '#edf6f6',
      dot: '#489490',
    },
    alpha: {
      text: '#b36a74',
      bg: '#fbf0f2',
      dot: '#b36a74',
    },
    libur: {
      text: '#7f8b9a',
      bg: '#eef2f6',
      dot: '#7f8b9a',
    },
  },

  // Palet Grafik / Recharts
  chart: {
    hadir: '#398872',
    terlambat: '#c4a266',
    absen: '#b36a74',
    neutral: '#8da9cf',
  },
};

export default colors;

