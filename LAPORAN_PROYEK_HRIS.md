# LAPORAN KOMPREHENSIF PROYEK HRIS (HANDOVER REPORT)

> **Proyek**: HCGA Human Resource Information System (HRIS)  
> **Repository GitHub**: [`git@github.com:work-rizarnaufal/hris.git`](https://github.com/work-rizarnaufal/hris) (Branch: `main`)  
> **Tech Stack**: Laravel 11.57, Inertia.js React v2.0, React 18.3, Tailwind CSS v3.4, Recharts, SheetJS (XLSX)  
> **Status Kode**: Bersih, teruji, 0 build error (`npm run build` sukses), dan terstandarisasi UI atomik.

---

> [!IMPORTANT]
> **INSTRUKSI WAJIB UNTUK AI AGENT / PENGEMBANG SESI BERIKUTNYA:**  
> Setiap AI Agent atau pengembang yang melanjutkan proyek ini **WAJIB** secara otomatis membaca dan mematuhi standar berikut:
> 1. **Skill `antislop`** ([`.agents/skills/antislop/SKILL.md`](.agents/skills/antislop/SKILL.md)):
>    - Kode bersih, pragmatis, dan transparan.
>    - Hapus seluruh komentar banner/basa-basi/dekoratif (`// ===`, `/* --- */`).
>    - Tanpa abstraksi spekulatif (hindari generic wrapper, helper redundan, atau factory berlebih).
>    - UI berdensitas informasi tinggi, konsisten dengan token warna resmi HCGA.
>    - Komunikasi lugas, to-the-point, dan bebas dari klise AI.
> 2. **Skill `ponytail`** ([`.agents/skills/ponytail/SKILL.md`](.agents/skills/ponytail/SKILL.md)):
>    - Pola pikir *laziest senior developer* (YAGNI ladder).
>    - Jangan pernah menulis kode yang tidak mutlak diperlukan saat ini.
>    - Maksimalkan penggunaan ulang (*reuse*) utilitas, token `theme.js`, dan komponen UI yang sudah ada.
>    - Menghasilkan patch terkecil yang benar tanpa mengorbankan keamanan, validasi, dan integritas data.
> 3. **Mandatory Atomic UI Consistency (Konsistensi Komponen Atomik)**:
>    - Seluruh halaman **WAJIB** menggunakan komponen atomik dari [`resources/js/components/ui/`](resources/js/components/ui/) (`Table`, `Card`, `Badge`, `Button`, `Modal`, `Toast`, `Input`, `PageHeader`, dll).
>    - **Dilarang keras** membuat alert, dialog modal, atau tabel floating ad-hoc inline di masing-masing file halaman.
> 4. **Kebijakan Git Push (Strictly Manual)**:
>    - **Dilarang keras menjalankan `git push` otomatis** ke remote repository tanpa instruksi atau konfirmasi eksplisit dari USER. Seluruh push remote wajib manual.
>
> *(Aturan ini juga dikunci pada [`.agents/rules/antislop-ponytail.md`](.agents/rules/antislop-ponytail.md) dan [`AGENTS.md`](AGENTS.md)).*

---

## Daftar Isi (Table of Contents)
1. [Arsitektur Inti & Penguncian Identitas Brand](#1-arsitektur-inti--penguncian-identitas-brand)
2. [Peta Menu Navigasi 7 Domain HRIS & Struktur Folder](#2-peta-menu-navigasi-7-domain-hris--struktur-folder)
3. [Standar Desain Sistem Komponen Atomik UI](#3-standar-desain-sistem-komponen-atomik-ui)
4. [Modul Beranda Eksekutif Terpadu (`Beranda.jsx`)](#4-modul-beranda-eksekutif-terpadu-berandajsx)
5. [Modul Data Karyawan - Core HR (`DataKaryawan.jsx`)](#5-modul-data-karyawan---core-hr-datakaryawanjsx)
6. [Modul Catatan Kehadiran - Time & Attendance (`CatatanKehadiran.jsx`)](#6-modul-catatan-kehadiran---time--attendance-catatankehadiranjsx)
7. [Modul Laporan & Rapor Evaluasi Kehadiran (`LaporanRekap.jsx`)](#7-modul-laporan--rapor-evaluasi-kehadiran-laporanrekapjsx)
8. [Modul Jadwal & Roster Shift 2-Grup (`JadwalShift.jsx`)](#8-modul-jadwal--roster-shift-2-grup-jadwalshiftjsx)
9. [Modul Pengaturan Sistem & Kebijakan HR (`PengaturanSistem.jsx`)](#9-modul-pengaturan-sistem--kebijakan-hr-pengaturansistemjsx)
10. [Modul Autentikasi & Login Administrator (`Login.jsx`)](#10-modul-autentikasi--login-administrator-loginjsx)
11. [Standarisasi Seluruh Halaman Staging / Roadmap](#11-standarisasi-seluruh-halaman-staging--roadmap)
12. [Implementasi Universal Hidden Scrollbar](#12-implementasi-universal-hidden-scrollbar)
13. [Hasil Audit Rekayasa & Higienitas Kode](#13-hasil-audit-rekayasa--higienitas-kode)
14. [Arsitektur Multi-Lokasi (Mariuk & Cimalaka) & Shift 12 Jam Non-Stop 24/7](#14-arsitektur-multi-lokasi-mariuk--cimalaka--shift-12-jam-non-stop-247)
15. [Knowledge Graph Project (Graphify) & Visualisasi Arsitektur](#15-knowledge-graph-project-graphify--visualisasi-arsitektur)
16. [Rencana Aksi Sesi Selanjutnya (Roadmap Backend & DB)](#16-rencana-aksi-sesi-selanjutnya-roadmap-backend--db)

---

## 1. Arsitektur Inti & Penguncian Identitas Brand

### A. Aturan Persistent Layout (Anti-Flicker)
- **Implementasi**: Pada [`resources/js/app.jsx`](resources/js/app.jsx), layout admin dibungkus menggunakan referensi fungsi stabil di tingkat modul:
  ```jsx
  const renderAdminLayout = (page) => <LayoutUtama>{page}</LayoutUtama>;
  ```
- **Hasil**: Komponen `<Sidebar>` dan `<Topbar>` tetap hidup (*persistent*) di Virtual DOM saat berpindah halaman. **Sidebar tidak berkedip atau mereload sama sekali**, posisi scroll sidebar terjaga, dan hanya area konten `{children}` yang diperbarui.
- **Transisi Halus**: Progress bar transisi Inertia disesuaikan ke warna aksen emas resmi `#c4a266`.

### B. Penguncian Identitas Warna (Locked Color Tokens)
Identitas warna resmi terkunci konsisten di 3 file konfigurasi:
1. **JavaScript**: [`resources/js/config/theme.js`](resources/js/config/theme.js)
2. **Tailwind CSS**: [`tailwind.config.js`](tailwind.config.js)
3. **CSS Variables**: [`resources/css/app.css`](resources/css/app.css)

| Token Warna | Nilai Hex | Fungsi Operasional |
| :--- | :--- | :--- |
| **Primary Navy** | `#10273f` | Warna dominan korporat, sidebar latar, header, tombol primer |
| **Gold Accent** | `#c4a266` | Aksen kehormatan, indikator fokus, highlight aktif, badge VIP |
| **Soft Gold** | `#f7f2e8` | Latar belakang aksen lembut, badge grup operasional |
| **Dark Ink** | `#1d3046` | Tipografi utama, teks judul, kontras teks tinggi |
| **Status Hadir** | `#398872` (bg `#eef7f1`) | Presensi tepat waktu & status operasional aktif |
| **Status Terlambat** | `#ac8848` (bg `#fcf6e9`) | Keterlambatan presensi kerja |
| **Status Izin / Cuti** | `#698eb0` / `#489490` | Legalitas ketidakhadiran resmi |
| **Status Alpha** | `#b36a74` (bg `#fbf0f2`) | Mangkir / Karyawan non-aktif |

### C. Desain Proporsional Layar Lebar (Executive Layout)
- **Lebar Kontainer**: Maksimum kontainer diatur ke `max-w-[1600px]` dengan padding responsif `px-4 sm:px-6 lg:px-8 xl:px-10` pada `PageContainer`, `Topbar`, dan `Footer`.
- **Penguncian Viewport**: Mencegah horizontal layout shaking saat berpindah tab atau membuka dialog modal.

---

## 2. Peta Menu Navigasi 7 Domain HRIS & Struktur Folder

Navigasi sidebar telah ditata mengikuti 7 domain standar HRIS enterprise:

```
├── 1. UTAMA
│   └── Beranda                     (/beranda)       [AKTIF] -> Dashboard KPI, Metrik Kehadiran, Presensi Hari Ini
│
├── 2. MANAJEMEN KARYAWAN (Core HR)
│   ├── Data Karyawan               (/karyawan)      [AKTIF] -> Master Data Induk, Profil Karyawan, Status PKWT/PKWTT
│   └── Organisasi & Jabatan        (/organisasi)    [STAGING] -> Departemen, Divisi, Level Jabatan, Garis Pelaporan
│
├── 3. WAKTU & KEHADIRAN (Time & Attendance)
│   ├── Catatan Kehadiran           (/kehadiran)     [AKTIF] -> Log Presensi Harian, Jam Masuk/Pulang, Terlambat
│   ├── Jadwal & Shift              (/jadwal)        [AKTIF] -> Roster Shift 2-Grup (A/B), Pola Rotasi, Kalender Shift
│   └── Lembur (Overtime)           (/lembur)        [STAGING] -> Surat Perintah Lembur (SPL), Akumulasi Jam Lembur
│
├── 4. CUTI & PERIZINAN (Leave Management)
│   ├── Pengajuan Cuti & Izin       (/cuti)          [STAGING] -> Permohonan Cuti Tahunan, Izin, Sakit, Alur Approval
│   └── Saldo & Kuota Cuti          (/saldo-cuti)    [STAGING] -> Plafon Cuti 12 Hari, Sisa Kuota, Potongan Cuti Bersama
│
├── 5. PENGGAJIAN (PAYROLL)
│   ├── Penggajian & Periode        (/payroll)       [STAGING] -> Kalkulasi Gaji, Tunjangan Kehadiran, Potongan BPJS/PPh 21
│   └── Slip Gaji                   (/slip-gaji)     [STAGING] -> Distribusi & Arsip Dokumen Slip Gaji Karyawan
│
├── 6. LAPORAN & ANALITIK (Reports & Analytics)
│   └── Laporan & Rekap             (/laporan)       [AKTIF] -> Rekapitulasi Performa, Evaluasi Kehadiran, Ekspor PDF/Excel
│
├── 7. PENGATURAN & AUDIT (Administration)
│   ├── Pengaturan Sistem           (/pengaturan)    [AKTIF] -> Kalender Kerja Perusahaan, Libur Nasional, Parameter HR
│   └── Log Audit                   (/audit)         [STAGING] -> Jejak Rekam Perubahan Data Sistem & Keamanan
│
└── 8. AUTENTIKASI & PUBLIK
    ├── Halaman Login               (/login)         [AKTIF] -> Autentikasi Administrator HCGA & SPV Operasional
    └── Ringkasan Publik            (/ringkasan-publik) [AKTIF] -> Portal Informasi Terbuka Tanpa Login
```

### Pemetaan File Halaman di `resources/js/Pages/`:
- `Admin/Beranda/` $\to$ **[`Beranda.jsx`](resources/js/Pages/Admin/Beranda/Beranda.jsx)** *(Dashboard Eksekutif)*
- `Admin/Karyawan/` $\to$ **[`DataKaryawan.jsx`](resources/js/Pages/Admin/Karyawan/DataKaryawan.jsx)** *(Master Data Karyawan)*
- `Admin/Kehadiran/` $\to$ **[`CatatanKehadiran.jsx`](resources/js/Pages/Admin/Kehadiran/CatatanKehadiran.jsx)** *(Log Presensi Harian)*
- `Admin/Jadwal/` $\to$ **[`JadwalShift.jsx`](resources/js/Pages/Admin/Jadwal/JadwalShift.jsx)** *(Roster Rotasi Shift 2-Grup A/B)*
- `Admin/Laporan/` $\to$ **[`LaporanRekap.jsx`](resources/js/Pages/Admin/Laporan/LaporanRekap.jsx)** *(Dual-Tab Rekap & Rapor)*
- `Admin/Pengaturan/` $\to$ **[`PengaturanSistem.jsx`](resources/js/Pages/Admin/Pengaturan/PengaturanSistem.jsx)** *(Konfigurasi HR)*
- `Admin/Organisasi/` $\to$ **[`OrganisasiJabatan.jsx`](resources/js/Pages/Admin/Organisasi/OrganisasiJabatan.jsx)** *(Staging Organisasi)*
- `Admin/Lembur/` $\to$ **[`LemburOvertime.jsx`](resources/js/Pages/Admin/Lembur/LemburOvertime.jsx)** *(Staging Lembur SPL)*
- `Admin/Cuti/` $\to$ **[`PengajuanCutiIzin.jsx`](resources/js/Pages/Admin/Cuti/PengajuanCutiIzin.jsx)** *(Staging Alur Cuti)*
- `Admin/SaldoCuti/` $\to$ **[`SaldoKuotaCuti.jsx`](resources/js/Pages/Admin/SaldoCuti/SaldoKuotaCuti.jsx)** *(Staging Saldo Cuti)*
- `Admin/Payroll/` $\to$ **[`PenggajianPeriode.jsx`](resources/js/Pages/Admin/Payroll/PenggajianPeriode.jsx)** *(Staging Penggajian)*
- `Admin/SlipGaji/` $\to$ **[`SlipGaji.jsx`](resources/js/Pages/Admin/SlipGaji/SlipGaji.jsx)** *(Staging Dokumen Slip Gaji)*
- `Admin/Audit/` $\to$ **[`LogAudit.jsx`](resources/js/Pages/Admin/Audit/LogAudit.jsx)** *(Staging Jejak Audit)*
- `Auth/` $\to$ **[`Login.jsx`](resources/js/Pages/Auth/Login.jsx)** *(Halaman Login Mandiri)*
- `User/` $\to$ **[`RingkasanPublik.jsx`](resources/js/Pages/User/RingkasanPublik.jsx)** *(Portal Informasi Publik)*

---

## 3. Standar Desain Sistem Komponen Atomik UI

Komponen antarmuka pengguna telah terstandarisasi di direktori [`resources/js/components/ui/`](resources/js/components/ui/):

1. **[`modal.jsx`](resources/js/components/ui/modal.jsx)**:
   - `<Modal>`: Kontainer dialog modern dengan *backdrop blur*, *ESC key close*, *outside-click close*, *body scroll lock*, dan varian ukuran (`sm`, `md`, `lg`, `xl`, `2xl`, `full`).
   - `<ModalHeader>`: Header modal dengan ikon branding, judul, deskripsi, dan tombol silang `X`.
   - `<ModalBody>`: Area formulir dengan *hidden scrollbar* (`no-scrollbar`).
   - `<ModalFooter>`: Area tombol aksi bawah (*Batal*, *Simpan*, *Impor*).
2. **[`table.jsx`](resources/js/components/ui/table.jsx)**:
   - `<Table>`, `<TableHeader>`, `<TableBody>`, `<TableFooter>`, `<TableRow>`, `<TableHead>`, `<TableCell>`, `<TableCaption>`, `<TableEmpty>`.
   - **Toolbar & Filter Atomik**: `<TableToolbar>`, `<TableSearch>`, `<TableFilterGroup>`, `<TableSelect>`.
   - Menghilangkan *CSS clash* lama, menyediakan tata letak dropdown filter yang konsisten, tinggi seragam (`h-9`), ikon panah kustom (`ChevronDown`), dan tata letak responsif bebas pembungkusan (*wrapping*) canggung pada layar mobile/tablet. Dilengkapi utility container `.table-scroll` dengan *universal hidden scrollbar*.
3. **[`toast.jsx`](resources/js/components/ui/toast.jsx)**:
   - Komponen notifikasi mengambang standar resmi HCGA (`success`, `warning`, `error`).
   - Seluruh halaman diwajibkan menggunakan `<Toast toast={alertInfo} onClose={() => setAlertInfo(null)} />` untuk konsistensi pengalaman pengguna.
4. **[`button.jsx`](resources/js/components/ui/button.jsx)**:
   - Komponen tombol standar dengan varian: `primary` (Deep Navy), `secondary`, `outline`, `ghost`, `danger`. 100% tombol raw HTML telah dimigrasi ke komponen ini.
5. **[`card.jsx`](resources/js/components/ui/card.jsx)**:
   - Struktur kartu seragam: `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, `<CardFooter>`.
6. **[`badge.jsx`](resources/js/components/ui/badge.jsx)**:
   - Indikator status visual terstandarisasi (`default`, `secondary`, `outline`, `success`, `warning`, `danger`, `info`).
7. **[`input.jsx`](resources/js/components/ui/input.jsx)**:
   - Input formulir konsisten dengan fokus ring emas `#c4a266`.
8. **[`page-header.jsx`](resources/js/components/ui/page-header.jsx) & [`page-container.jsx`](resources/js/components/ui/page-container.jsx)**:
   - Pembungkus halaman standar dengan judul, deskripsi, area aksi kanan, dan lebar kontainer proporsional.

---

## 4. Modul Beranda Eksekutif Terpadu (`Beranda.jsx`)

Lokasi: [`resources/js/Pages/Admin/Beranda/Beranda.jsx`](resources/js/Pages/Admin/Beranda/Beranda.jsx)

### A. Metrik Realistis Berbasis 12 Karyawan Master
- Menghapus angka hardcoded fiktif (48 orang) menjadi basis **12 Personel Aktif** yang 100% selaras dengan Master Karyawan, Roster Shift 2-Grup, dan Log Kehadiran.
- **Deteksi Dinamis Status Rotasi Shift Hari Ini**:
  - Hari Senin, Rabu, Jumat: **Grup A Dinas** (5 personel), Grup B Libur.
  - Hari Selasa, Kamis, Sabtu: **Grup B Dinas** (4 personel), Grup A Libur.
  - Hari Minggu: Seluruh lini libur reguler.
  - Personel Kantor Non-Shift (3 orang) selalu terjadwal Senin-Jumat.

### B. 4 Kartu KPI Eksekutif Real-Time
1. **Total Karyawan Aktif**: 12 Personel (100% terdata di master).
2. **Jadwal Dinas Hari Ini**: Menghitung personel yang aktif bertugas hari ini berdasarkan hari berjalan (misal: 8 personel di hari dinas Grup A).
3. **Presensi Tepat Waktu**: Rasio kedisiplinan dan jumlah personel yang hadir tanpa keterlambatan.
4. **Perhatian Disiplin**: Pemantauan personel terlambat atau berstatus alpa.

### C. 4 Kartu Navigasi Cepat (Quick Nav Cards)
Pintasan alur kerja eksekutif dengan ikon representatif:
- *Log Kehadiran* $\to$ Akses cepat pencatatan presensi hari ini.
- *Roster & Shift* $\to$ Akses pengaturan rotasi Grup A & Grup B.
- *Direktori Karyawan* $\to$ Akses master data karyawan.
- *Laporan & Evaluasi* $\to$ Akses dual-tab rekapitulasi & rapor individu.

### D. Visual Analytics & Feed Kehadiran Hari Ini
- **Grafik Tren Kehadiran Mingguan (Recharts)**: `BarChart` proporsional dengan domain skala `[0, 14]` yang merefleksikan tren kehadiran 7 hari ke belakang.
- **Tabel Feed Presensi Hari Ini**: Menggunakan `<Table>` atomik lengkap dengan avatar personel, jam check-in berformat monospace, lokasi kerja, dan badge status presensi.

---

## 5. Modul Data Karyawan - Core HR (`DataKaryawan.jsx`)

Lokasi: [`resources/js/Pages/Admin/Karyawan/DataKaryawan.jsx`](resources/js/Pages/Admin/Karyawan/DataKaryawan.jsx)

- **10 Kolom Tabel Simetris**: No, Nama Karyawan, Divisi, Lokasi Kerja, Grup, Kategori Jadwal, Jam Masuk, Jam Pulang, Status, Aksi.
- **Head Table Rapi & Terpusat**: Kolom data badge/jam/status terpusat simetris dengan kolom header.
- **Fitur Aksi**:
  - **Tambah Karyawan**: Menggunakan modal atomik `ModalFormKaryawan.jsx` dengan preset shift cepat.
  - **Ubah & Hapus Karyawan**: Edit inline data dan konfirmasi hapus langsung.
  - **Impor Excel (`ModalImporKaryawan.jsx`)**: Menggunakan modal atomik, unggah `.xlsx`/`.csv`, unduh template resmi, dan live preview validasi data.
  - **Ekspor Excel**: 1-klik unduh `.xlsx` terfilter via SheetJS.
  - **Live Filter**: Pencarian teks nama/NIP + dropdown filter Divisi, Grup, dan Status.
  - **Notifikasi**: Menggunakan notifikasi atomik `<Toast />`.

---

## 6. Modul Catatan Kehadiran - Time & Attendance (`CatatanKehadiran.jsx`)

Lokasi: [`resources/js/Pages/Admin/Kehadiran/CatatanKehadiran.jsx`](resources/js/Pages/Admin/Kehadiran/CatatanKehadiran.jsx)

- **Navigasi Tanggal Cepat**: Navigasi harian (kemarin, besok, date-picker kalender, tombol *Hari Ini*), lengkap dengan format bahasa Indonesia.
- **5 Kartu KPI Real-time**: Total Jadwal, Tepat Waktu (dengan persentase), Terlambat (dengan total akumulasi menit keterlambatan), Izin/Sakit/Cuti, dan Alpha/Mangkir.
- **Tabel Log Presensi**:
  - Kolom: No, Karyawan (NIP & Jabatan), Divisi & Lokasi, Shift Terjadwal, Jam Masuk, Jam Pulang, Keterlambatan, Status Kehadiran (`.status-hadir`, `.status-terlambat`, dll.), Keterangan, dan Aksi.
- **Fitur Aksi**:
  - **Catat / Ubah Presensi (`ModalFormPresensi.jsx`)**: Menggunakan modal atomik, auto-detect shift karyawan, kalkulasi live menit terlambat berdasarkan jam masuk, dan pengubahan status otomatis.
  - **Presensi Massal Cepat (`ModalPresensiMassal.jsx`)**: 1-klik tandai seluruh atau per-shift karyawan terjadwal sebagai *Hadir Tepat Waktu*.
  - **Ekspor Excel**: 1-klik unduh `.xlsx` seluruh data terfilter per tanggal aktif via SheetJS.
  - **Live Filter**: Pencarian teks nama/NIP + filter Status, Divisi, dan Shift.
  - **Notifikasi**: Menggunakan notifikasi atomik `<Toast />`.

---

## 7. Modul Laporan & Rapor Evaluasi Kehadiran (`LaporanRekap.jsx`)

Lokasi: [`resources/js/Pages/Admin/Laporan/LaporanRekap.jsx`](resources/js/Pages/Admin/Laporan/LaporanRekap.jsx)

Modul ini mengusung arsitektur **Tab Switcher Terpadu** yang memisahkan ranah makro (organisasi) dan mikro (individu) dalam satu halaman tanpa reload rute:

### A. Tab 1: Rekap Organisasi & Divisi (Makro)
- **Filter Periode Dinamis**: Pemilihan bulan berjalan dan arsip periode sebelumnya.
- **4 Kartu Metrik KPI Evaluasi**:
  1. *Rata-rata Kehadiran Organisasi* (Target $\ge 95\%$).
  2. *Karyawan Hadir 100%* (Kedisiplinan penuh tanpa telat).
  3. *Total Keterlambatan* (Akumulasi frekuensi dan durasi menit).
  4. *Perhatian Disiplin / SP* (Early warning deteksi indisipliner).
- **Visual Analytics (Recharts)**: Grafik batang rata-rata skor kedisiplinan per divisi menggunakan palet warna resmi Deep Navy & Gold.
- **Panel Sorotan (Top Stars & Early Warning)**:
  - *Duta Keteladanan*: Karyawan dengan skor 100% tepat waktu tanpa telat untuk nominasi reward (klik langsung membuka rapor individu).
  - *Panggilan / Pembinaan Khusus*: Karyawan yang melewati batas toleransi keterlambatan atau memiliki alpa (klik langsung membuka dossier pembinaan).
- **Matriks Evaluasi Kedisiplinan Karyawan**:
  - Kolom: No, Karyawan, Divisi & Lokasi, Kehadiran, Keterlambatan, Cuti/Sakit, Alpa, Indikator Progress Skor Disiplin (0–100%), Status Evaluasi (*Sangat Baik*, *Disiplin Baik*, *Perlu Pembinaan*, *Peringatan / SP*).
  - Tombol **"Buka Rapor"**: 1-klik beralih mulus ke Tab 2 dengan karyawan terkait langsung terpilih.
- **Ekspor Dokumen Excel (`.xlsx`)**: 1-klik unduh rekapitulasi evaluasi kehadiran seluruh karyawan via SheetJS.

### B. Tab 2: Rapor Evaluasi Individu / Dossier Personel (Mikro)
- **Toolbar Navigasi Cepat**: Dropdown pemilih karyawan aktif (12 karyawan), cetak rapor (`window.print()`), dan ekspor XLSX personal.
- **Dossier Header Card**: Profil korporat lengkap, skor disiplin (0–100%), badge evaluasi, dan rekomendasi tindakan operasional HCGA.
- **8 Scorecard KPI Terperinci**: Total Kehadiran, Tepat Waktu, Terlambat, Menit Terlambat, Izin, Sakit, Cuti, dan Alpha.
- **Kalender Visual Presensi 30 Hari (Heatmap Grid)**: Kotak visual per tanggal (1 s/d 30) berkode warna interaktif: Hadir (Hijau), Terlambat (Kuning), Izin (Biru), Sakit (Ungu), Cuti (Teal), Alpha (Merah), Libur (Abu-abu), lengkap dengan jam check-in.
- **Grafik Tren Kedisiplinan 6 Bulan**: `BarChart` Recharts menampilkan histori skor kedisiplinan 6 bulan ke belakang.
- **Buku Pembinaan & Sanksi Disiplin (Disciplinary Log)**: Daftar riwayat teguran lisan, bimbingan supervisor, atau SP-1 resmi, dilengkapi form interaktif penambahan catatan pembinaan baru dengan notifikasi atomik `<Toast />`.

---

## 8. Modul Jadwal & Roster Shift 2-Grup (`JadwalShift.jsx`)

Lokasi: [`resources/js/Pages/Admin/Jadwal/JadwalShift.jsx`](resources/js/Pages/Admin/Jadwal/JadwalShift.jsx), [`resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx), dan [`resources/js/Pages/Admin/Jadwal/Partials/ModalFormTukarShift.jsx`](resources/js/Pages/Admin/Jadwal/Partials/ModalFormTukarShift.jsx)

### A. 4 Kartu KPI Roster Jadwal Operasional (Reaktif terhadap Filter Lokasi)
1. *Total Personil Terjadwal*: 12 Personil (6 Lokasi Mariuk + 6 Lokasi Cimalaka, 100% ter-cover roster operasional 24/7).
2. *Grup Operasional A*: 6 Personil (3 Mariuk, 3 Cimalaka) - Shift 12 Jam (Pagi 07:00–19:00 & Malam 19:00–07:00).
3. *Grup Operasional B*: 6 Personil (3 Mariuk, 3 Cimalaka) - Shift 12 Jam (Pagi 07:00–19:00 & Malam 19:00–07:00).
4. *Jadwal Khusus & Tukar Shift*: Pemantauan real-time kasus tukar shift dan penugasan operasional dengan handover terpadu pukul 07:00 & 19:00 WIB.

### B. Segmented Location Controller (Mariuk & Cimalaka)
- Tab switcher segmen satu sentuhan di atas tabel roster:
  - **Semua Lokasi (12)**: Pandangan makro seluruh personil lintas pabrik.
  - **Mariuk (6)**: Terfilter otomatis hanya personil Lokasi Mariuk dengan badge kuning amber.
  - **Cimalaka (6)**: Terfilter otomatis hanya personil Lokasi Cimalaka dengan badge ungu indigo.
- Indikator status live: *Roster 24/7 Non-Stop · Pergantian Shift 07:00 & 19:00 WIB*.

### C. Tab 1: Matriks Roster Mingguan (`roster`)
- **Aturan Baku Operasional 24/7 (Non-Stop 7 Hari Kerja)**:
  - 1 hari 2 shift 12 jam: **Shift Pagi** (07:00–19:00 WIB) dan **Shift Malam** (19:00–07:00 WIB), tukar shift tepat jam 07:00 dan 19:00.
  - Tidak ada libur akhir pekan untuk regu shift lapangan pabrik (beroperasi 7 hari seminggu).
- **Logika Continuous Rolling Selang-Seling**:
  - Minggu ganjil (Minggu 1 & 3): Grup A masuk hari Senin, Rabu, Jumat, Minggu (4 hari dinas = 48 jam); Grup B masuk Selasa, Kamis, Sabtu (3 hari dinas = 36 jam).
  - Minggu genap (Minggu 2 & 4): Grup B masuk Senin, Rabu, Jumat, Minggu (48 jam); Grup A masuk Selasa, Kamis, Sabtu (36 jam).
  - Rata-rata jam kerja adil dan proporsional: 42 jam/minggu.
- **Tabel Matriks Roster 7 Hari Dinamis**:
  - Kolom karyawan dilengkapi inisial avatar visual, NIP font-mono, jabatan, dan pill badge lokasi penempatan (`Mariuk` / `Cimalaka`).
  - Kalkulasi total jam kerja mingguan aktual per karyawan: `48 Jam (4 Hari Dinas)` atau `36 Jam (3 Hari Dinas)`.
  - Legenda kode terstandarisasi: `PAGI (07-19)`, `MALAM (19-07)`, `NON (Office 08-17)`, `SWAP`, `LIBUR`, `OFF`.
- **Ekspor Dokumen Excel (.xlsx)**:
  - Unduh roster mingguan via SheetJS mencakup nama, NIP, lokasi pabrik, divisi, 7 kolom hari, dan kalkulasi dinas aktual.

### D. Tab 2: Rotasi Grup & Jadwal Manual (`patterns`) — `PanelRotasiGrup.jsx`
- **Tabel Alur Rotasi 7 Hari Non-Stop**:
  - Alur dinas Senin s/d Minggu menampilkan giliran masuk 2 shift 12 jam dan pasca-dinas (OFF).
- **Penetapan & Pemindahan Personil**:
  - Dropdown per baris, bulk transfer dengan multi-select checkbox, dan tombol *Tukar Semua Giliran (Grup A ⇄ Grup B)*.
  - Dilengkapi pill badge lokasi (`Mariuk` / `Cimalaka`) dan shift badge 12 jam (`Pagi 07:00–19:00` / `Malam 19:00–07:00`).
- **Form Perubahan Jadwal Operasional Manual**:
  - Konfigurasi ad-hoc dengan rentang jam shift 12 jam (Shift 1 Masuk 07:00 / Pulang 19:00; Shift 2 Masuk 19:00 / Pulang 07:00), grup sasaran, tanggal, dan alasan.

### E. Tab 3: Log Pengecualian & Tukar Shift (`exceptions`)
- Rekam pertukaran shift resmi antar-rekan kerja atau penugasan khusus yang disetujui HCGA.
- Nama pemohon dapat diklik langsung untuk membuka modal form ubah (*inline edit*), dilengkapi tombol aksi pensil dan hapus.

### F. Modal Atomik Tukar Shift (`ModalFormTukarShift.jsx`)
- Dialog modal atomik terstandarisasi dengan pilihan shift 12 jam (`Shift Pagi 07:00–19:00`, `Shift Malam 19:00–07:00`, `Off Pasca-Dinas`, `Penugasan Khusus`).
- Preview card komparasi real-time antara *Karyawan Pemohon* dan *Rekan Pengganti* lengkap dengan identitas avatar, NIP, jabatan, dan badge lokasi kerja.

---

## 9. Modul Pengaturan Sistem & Kebijakan HR (`PengaturanSistem.jsx`)

Lokasi: [`resources/js/Pages/Admin/Pengaturan/PengaturanSistem.jsx`](resources/js/Pages/Admin/Pengaturan/PengaturanSistem.jsx)

### A. 4 Kartu KPI Konfigurasi Utama
- **Toleransi Keterlambatan**: 15 Menit (*grace period* presensi aktif).
- **Hari Libur Nasional 2026**: 14 Hari (termasuk cuti bersama resmi pemerintah).
- **Geofence Presensi Mobile**: 3 Titik Lokasi Operasional Aktif (Pabrik Sidoarjo, Site Gresik, Head Office Surabaya).
- **Kesehatan & Status Cadangan**: Terkini (*auto-sync* data pengaturan).

### B. Tab 1: Kebijakan Presensi & Kerja (`attendance`)
- Parameter toleransi keterlambatan, batas buka check-in, batas kepulangan lebih awal, dan jam kerja mingguan (40 jam).
- Validasi wajib swafoto / selfie wajah dan proteksi Anti-Fake GPS / Mock Location.
- Parameter lembur Depnaker (koefisien 1.5x dan 2.0x) serta kuota cuti tahunan (12 hari).

### C. Tab 2: Kalender Libur & Cuti Bersama (`calendar`)
- Daftar Hari Libur Resmi 2026 dengan format standar `dd/mm/yyyy`.
- Modal atomik tambah, edit, dan hapus hari libur dengan pilihan pemotongan cuti (*Tidak Potong Cuti* vs *Potong Cuti Tahunan*).
- **Sinkronisasi Otomatis ke Jadwal & Roster**: Tanggal libur resmi otomatis ditandai `LIBUR (Hari Libur Resmi)` di Roster Mingguan tanpa perlu ubah jadwal satu per satu.

### D. Tab 3: Geofencing & Lokasi Pabrik (`location`)
- Konfigurasi titik radius presensi: Pabrik Sidoarjo (120m), Site Gresik (150m), Kantor Surabaya (80m) dengan toggle aktif/nonaktif.

### E. Tab 4: Profil Perusahaan & Pemeliharaan Data (`maintenance`)
- Data legalitas perusahaan (PT Manufaktur Nusantara Perkasa Tbk, NIB, NPWP, Kontak PIC).
- Tombol **Unduh Backup JSON/SQL**, **Bersihkan Cache Presensi**, dan **Reset Default**.

---

## 10. Modul Autentikasi & Login Administrator (`Login.jsx`)

Lokasi: [`resources/js/Pages/Auth/Login.jsx`](resources/js/Pages/Auth/Login.jsx) dan [`routes/web.php`](routes/web.php)

### A. Desain Korporat Split-Screen
- **Sisi Kiri (Brand Showcase)**: Latar Deep Navy `#10273f` dengan lambang HCGA emas `#c4a266`, menampilkan nilai operasional:
  1. *Roster Shift 2-Grup Otomatis*: Rotasi dinamis selang-seling Grup A & Grup B.
  2. *Geofencing & Anti-Fake GPS*: Presensi presisi berbasis radius pabrik dan swafoto.
  3. *Rapor Disiplin & Rekapitulasi*: Evaluasi kehadiran real-time dan dossier pembinaan.
- **Sisi Kanan (Formulir Masuk)**: Tata letak bersih, fokus form terpusat, dan responsif di perangkat bergerak.

### B. Fitur & Keamanan Antarmuka
- **Quick-Fill Akun Demo**: Tombol 1-klik untuk memasukkan kredensial pengujian tanpa repot mengetik:
  - *Admin HCGA*: `admin@hcga-manufaktur.co.id`
  - *SPV Operasional*: `spv.ops@hcga-manufaktur.co.id`
- **Toggle Intip Kata Sandi**: Ikon mata (`Eye` / `EyeOff`) untuk melihat kata sandi.
- **Opsi Remember Me & Lupa Sandi**: Penanganan sesi masuk pengguna.
- **Navigasi Balik**: Tautan langsung ke portal terbuka *Ringkasan Publik*.
- **Rute Autentikasi**:
  - `GET /login`: Menampilkan halaman login (bebas dari wrapper LayoutUtama via `Login.layout = (page) => page`).
  - `POST /login`: Validasi kredensial dan pengalihan ke `/beranda`.
  - `MATCH /logout`: Aksi keluar sesi dan pengalihan kembali ke `/login`.
- **Tombol Keluar Resmi**: Disediakan tombol **Keluar** berwarna merah/danger pada [`topbar.jsx`](resources/js/components/ui/topbar.jsx) dan [`sidebar.jsx`](resources/js/components/ui/sidebar.jsx).

---

## 11. Standarisasi Seluruh Halaman Staging / Roadmap

Seluruh 7 halaman placeholder serta portal publik telah dirombak dari stub kosong menjadi antarmuka eksekutif lengkap dengan:
1. **4 Kartu KPI Metrik per Domain**: Menyajikan visualisasi data yang relevan dengan domain bisnis masing-masing.
2. **Banner Roadmap Terstandarisasi**: Menggunakan aksen Deep Navy `#10273f` dan Gold `#c4a266` dengan badge fase rilis.
3. **3 Pilar Fitur Operasional**: Menggunakan komponen atomik `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, dan `<CardContent>`.
4. **Eliminasi 100% Raw Button**: Seluruh class lama `button primary` / `button secondary` dihapus total menjadi komponen atomik `<Button>`.

| Halaman | Rute | Domain HRIS | Fitur & Pilar Utama |
| :--- | :--- | :--- | :--- |
| **Lembur (Overtime)** | `/lembur` | Time & Attendance | Pengajuan Surat Perintah Lembur (SPL), Verifikasi Jam Aktual, Kalkulasi Tarif Depnaker (1.5x & 2x) |
| **Pengajuan Cuti & Izin** | `/cuti` | Leave Management | Formulir Cuti Tahunan & Izin Sakit, Multi-Level Approval Supervisor, Lampiran Surat Medis |
| **Saldo & Kuota Cuti** | `/saldo-cuti` | Leave Management | Monitoring Plafon 12 Hari Cuti, Histori Pengambilan, Pemotongan Otomatis Cuti Bersama |
| **Penggajian Periode** | `/payroll` | Payroll | Perhitungan Gaji Pokok & Lembur, Rekap Kehadiran Pengurang, Potongan BPJS & PPh 21 |
| **Slip Gaji** | `/slip-gaji` | Payroll | Arsip Dokumen Digital Bulanan, Unduh Format PDF, Pengiriman Terenkripsi via Email/Portal |
| **Organisasi & Jabatan** | `/organisasi` | Core HR | Bagan Hirarki Perusahaan, Matriks Departemen & Divisi, Pengaturan Batas Wewenang & Approval |
| **Log Audit** | `/audit` | Administration | Rekam Jejak Aktivitas Pengguna, Riwayat Perubahan Konfigurasi, Deteksi Anomali Keamanan |
| **Ringkasan Publik** | `/ringkasan-publik` | Public Portal | Rangkuman Kedisiplinan Terbuka, Jam Layanan Operasional, Tautan Masuk Portal Admin |

---

## 12. Implementasi Universal Hidden Scrollbar

Untuk menjaga estetika minimalis modern ala aplikasi native tanpa merusak fungsionalitas scroll, fitur **Universal Hidden Scrollbar** diterapkan secara menyeluruh:

### A. Cross-Browser CSS Engine
Pada [`resources/css/app.css`](resources/css/app.css) dan [`tailwind.config.js`](tailwind.config.js), utility `.no-scrollbar` dan `.scrollbar-none` didaftarkan dengan vendor prefix lengkap:
```css
/* Universal cross-browser scrollbar hiding */
-ms-overflow-style: none; /* IE dan Edge lama */
scrollbar-width: none;    /* Firefox */

::-webkit-scrollbar {
    display: none !important; /* Chrome, Safari, Edge, Opera */
    width: 0 !important;
    height: 0 !important;
}
```

### B. Lingkup Penerapan
1. **Viewport Tingkat Jendela (`html`, `body`, `#app`, `.app-shell`)**: Tidak ada bilah scrollbar abu-abu di sisi kanan layar.
2. **Komponen Tabel Atomik ([`table.jsx`](resources/js/components/ui/table.jsx))**: Kontainer `.table-scroll` dapat digeser secara horizontal menggunakan mousewheel, trackpad, atau swipe tanpa memunculkan bilah gulir tebal.
3. **Modal Dialog ([`modal.jsx`](resources/js/components/ui/modal.jsx))**: Area `<ModalBody>` memiliki scroll vertikal tersembunyi.
4. **Navigasi & Tab Switcher**: Sidebar navigasi, tab rotasi shift, tab laporan rekap, dan tab pengaturan sistem bebas dari scrollbar horizontal yang mengganggu.

---

## 13. Hasil Audit Rekayasa & Higienitas Kode

Pembersihan menyeluruh telah dieksekusi dengan kepatuhan penuh pada skill `antislop` dan `ponytail`:

1. **Pembersihan Berkas Usang (`app/public-summary.tsx`)**:
   - Dihapus berkas mati sisa implementasi lama Next.js yang mengimpor pustaka non-eksisten (`lib/model`).
2. **Pembersihan Berkas Mati (`resources/js/lib/`)**:
   - Dihapus 5 berkas yang tidak pernah diimpor: `employee-import.js`, `export.js`, `model.js`, `public-summary.js`, `rotation.js`.
   - Dipertahankan satu berkas inti yang aktif digunakan: [`resources/js/lib/utils.js`](resources/js/lib/utils.js) (`cn`).
3. **Pembersihan Dependensi NPM (YAGNI)**:
   - Dihapus 3 paket tak terpakai: `radix-ui`, `jspdf`, `jspdf-autotable`. Total 94 sub-paket dibersihkan dari `node_modules`, menghemat memori dan mempercepat waktu build menjadi 7.88 detik.
4. **Pembersihan Komentar Banner**:
   - Berkas [`routes/web.php`](routes/web.php) dibersihkan dari komentar banner pemisah dekoratif `// ==========================`.
5. **Standarisasi Notifikasi Atomik**:
   - Komponen [`toast.jsx`](resources/js/components/ui/toast.jsx) diperluas mendukung varian `warning`, `success`, dan `error`. Seluruh alert inline custom di halaman karyawan dan kehadiran direfaktor menggunakan `<Toast />`.
6. **Verifikasi Kompilasi Aset (Zero Errors)**:
   - Menjalankan `npm run build` dengan hasil 54 chunks JS/CSS terkompilasi bersih tanpa peringatan sintaks.

---

## 14. Arsitektur Multi-Lokasi (Mariuk & Cimalaka) & Shift 12 Jam Non-Stop 24/7

Berdasarkan kebutuhan operasional nyata perusahaan, sistem telah distandarisasi untuk mendukung operasi pabrik dan site non-stop:

### A. Pembagian 2 Lokasi Kerja Resmi & Dataset Karyawan
Sistem memisahkan operasional menjadi 2 lokasi resmi dengan basis 12 personel aktif (6 personel per lokasi):
1. **Lokasi Mariuk** (Subang):
   - `Budi Santoso` (HC-0101, Kelompok A, Shift Pagi)
   - `Dewi Anggraini` (HC-0104, Kelompok A, Shift Pagi)
   - `Hendra Wijaya` (HC-0105, Kelompok A, Shift Malam)
   - `Ahmad Fauzi` (HC-0103, Kelompok B, Shift Pagi)
   - `Eko Prasetyo` (HC-0107, Kelompok B, Shift Pagi)
   - `Joko Susilo` (HC-0109, Kelompok B, Shift Malam)
2. **Lokasi Cimalaka** (Sumedang):
   - `Siti Rahmawati` (HC-0102, Kelompok A, Shift Pagi)
   - `Wahyu Hidayat` (HC-0111, Kelompok A, Shift Pagi)
   - `Dian Kusuma` (HC-0110, Kelompok A, Shift Malam)
   - `Rina Marlina` (HC-0106, Kelompok B, Shift Pagi)
   - `Maya Indah Lestari` (HC-0108, Kelompok B, Shift Pagi)
   - `Nurul Aini` (HC-0112, Kelompok B, Shift Malam)

### B. Shift Kerja 12 Jam & Operasional Non-Stop 7 Hari (24/7)
- **Shift Pagi**: `07:00 – 19:00 WIB` (12 Jam kerja).
- **Shift Malam**: `19:00 – 07:00 WIB` (12 Jam kerja).
- **Tukar Shift (Handover)**: Tepat pukul `07:00 WIB` dan `19:00 WIB`.
- **Roster 7 Hari Tanpa Libur Pabrik**:
  - Operasional berjalan 7 hari penuh setiap minggu tanpa hari libur operasional bersama (Sabtu dan Minggu tetap beroperasi penuh).
  - Kelompok A masuk hari Senin, Kelompok B hari Selasa, Kelompok A hari Rabu, Kelompok B hari Kamis, dan seterusnya bergulir adil sehingga giliran dinas hari Minggu berganti setiap 2 minggu.

### C. Panel Konfigurasi Fleksibel Shift 12 Jam (`PengaturanSistem.jsx`)
- Disediakan tab khusus **"Jam Kerja & Shift 12 Jam"** pada [`PengaturanSistem.jsx`](resources/js/Pages/Admin/Pengaturan/PengaturanSistem.jsx) yang terhubung ke service reaktif [`systemSettings.js`](resources/js/services/systemSettings.js).
- Administrator dapat mengubah nama shift, jam masuk, jam pulang, toleransi keterlambatan, dan jam handover sewaktu-waktu secara fleksibel tanpa mengubah kode sumber.
- Perubahan tersinkronisasi otomatis secara instan ke seluruh antarmuka aplikasi via event bus `hris:settings-updated`.

---

## 15. Knowledge Graph Project (Graphify) & Visualisasi Arsitektur

### A. Graphify Knowledge Graph
Proyek telah dipetakan secara mendalam ke dalam graph pengetahuan AST (*Abstract Syntax Tree*) menggunakan `graphify`:
- **Jumlah Node**: 338 komponen, rute, model, dan modul utilitas.
- **Jumlah Edge**: 1010 relasi pemanggilan dan dependensi antar file.
- **Komunitas Arsitektur**: 39 komunitas fungsional terisolasi.
- **Aset Visual & Laporan**:
  - [`graphify-out/graph.html`](graphify-out/graph.html): Visualisasi interaktif berbasis D3 force-directed graph.
  - [`graphify-out/GRAPH_REPORT.md`](graphify-out/GRAPH_REPORT.md): Laporan struktur dependensi dan komunitas arsitektur.
  - [`graphify-out/graph.json`](graphify-out/graph.json): Data graph mesin untuk navigasi agen (`graphify query`, `graphify path`).

### B. Keputusan Retensi `LAPORAN_PROYEK_HRIS.md`
**Berkas `LAPORAN_PROYEK_HRIS.md` TIDAK BOLEH DIHAPUS**:
1. `graphify` memetakan relasi kode sintaktis teknis, sedangkan `LAPORAN_PROYEK_HRIS.md` mencatat **konteks keputusan bisnis, arsitektur non-fungsional, handover catatan proyek, dan pedoman kerja agen (`AGENTS.md`)**.
2. Berkas ini berfungsi sebagai *single source of truth* operasional bagi manajemen dan pengembang manusia maupun agen AI di masa mendatang.

---

## 16. Rencana Aksi Sesi Selanjutnya (Roadmap Backend & DB)

Langkah strategis yang direkomendasikan untuk pengembangan tahap berikutnya:

1. **Persistensi Database (Backend Migrations & Eloquent Models)**:
   - Membuat migrasi tabel database Laravel riil: `employees`, `attendances`, `shifts`, `shift_rosters`, `leaves`, `overtimes`, `holidays`, `system_settings`.
   - Menghubungkan state dummy React ke database melalui controller Laravel dan Inertia shared props.
2. **Pengembangan Modul Lembur & SPL ([`LemburOvertime.jsx`](resources/js/Pages/Admin/Lembur/LemburOvertime.jsx))**:
   - Membangun formulir permohonan Surat Perintah Lembur (SPL).
   - Mengkalkulasi tarif upah lembur otomatis berdasarkan formula Depnaker yang telah disetel di Pengaturan Sistem.
3. **Pengembangan Alur Cuti & Saldo Cuti ([`PengajuanCutiIzin.jsx`](resources/js/Pages/Admin/Cuti/PengajuanCutiIzin.jsx))**:
   - Menyediakan form permohonan cuti tahunan dengan validasi sisa kuota (12 hari).
   - Alur persetujuan bertingkat (Supervisor $\to$ HCGA Manager).
4. **Integrasi Perangkat Presensi / Mobile API**:
   - Menyediakan API endpoint untuk integrasi mesin sidik jari/fingerprint atau aplikasi presensi mobile GPS + selfie.

---
*Laporan handover ini diperbarui secara komprehensif pada 21 November 2026 sebagai dokumentasi resmi arsitektur sistem HRIS.*
