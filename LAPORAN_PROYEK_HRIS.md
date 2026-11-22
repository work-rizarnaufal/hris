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
> 3. **Mandatory Atomic UI Consistency & Design System ([`DESIGN.md`](DESIGN.md))**:
>    - Seluruh halaman **WAJIB** merujuk dan mematuhi spesifikasi desain tunggal pada [`DESIGN.md`](DESIGN.md).
>    - Seluruh elemen antarmuka **WAJIB** menggunakan komponen atomik dari [`resources/js/components/ui/`](resources/js/components/ui/) (`Table`, `Card`, `Badge`, `Button`, `Modal`, `Toast`, `Input`, `PageHeader`, dll).
>    - **Dilarang keras** membuat alert, dialog modal, atau tabel floating ad-hoc inline di masing-masing file halaman.
> 4. **Kebijakan Git Push (Strictly Manual)**:
>    - **Dilarang keras menjalankan `git push` otomatis** ke remote repository tanpa instruksi atau konfirmasi eksplisit dari USER. Seluruh push remote wajib manual.
>
> *(Aturan ini juga dikunci pada [`DESIGN.md`](DESIGN.md), [`.agents/rules/antislop-ponytail.md`](.agents/rules/antislop-ponytail.md), dan [`AGENTS.md`](AGENTS.md)).*

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
16. [Implementasi Backend Fase 1 (Database Migrations, Eloquent Models, & Controllers)](#16-implementasi-backend-fase-1-database-migrations-eloquent-models--controllers)
17. [Rencana Aksi Sesi Selanjutnya (Roadmap Backend Lanjutan)](#17-rencana-aksi-sesi-selanjutnya-roadmap-backend-lanjutan)

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

## 3. Standar Desain Sistem Komponen Atomik UI & DESIGN.md

Spesifikasi desain sistem lengkap dan token mesin telah dikunci pada dokumen pedoman tunggal **[`DESIGN.md`](DESIGN.md)** di root repositori. Seluruh komponen antarmuka pengguna telah terstandarisasi di direktori [`resources/js/components/ui/`](resources/js/components/ui/):

1. **[`modal.jsx`](resources/js/components/ui/modal.jsx)**:
   - `<Modal>`: Kontainer dialog modern dengan *backdrop blur*, *ESC key close*, *outside-click close*, *body scroll lock*, dan varian ukuran (`sm`, `md`, `lg`, `xl`, `2xl`, `full`).
   - `<ModalHeader>`: Header modal dengan ikon branding, judul, deskripsi, dan tombol silang `X`.
   - `<ModalBody>`: Area formulir dengan *hidden scrollbar* (`no-scrollbar`).
   - `<ModalFooter>`: Area tombol aksi bawah (*Batal*, *Simpan*, *Impor*).
2. **[`table.jsx`](resources/js/components/ui/table.jsx)**:
   - `<Table>`, `<TableHeader>`, `<TableBody>`, `<TableFooter>`, `<TableRow>`, `<TableHead>`, `<TableCell>`, `<TableCaption>`, `<TableEmpty>`.
   - **Toolbar & Filter Atomik**: `<TableToolbar>`, `<TableSearch>`, `<TableFilterGroup>`, `<TableSelect>`.
   - **Pagination Atomik**: `<TablePagination>` dengan navigasi halaman dinamis, pemilih jumlah baris (10, 25, 50, 100), ringkasan data terfilter (`from - to dari total`), dan penomoran halaman dengan elipsis cerdas.
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
9. **[`topbar.jsx`](resources/js/components/ui/topbar.jsx) & Card Profile Popover dengan Role Switcher**:
   - Komponen Topbar responsif dengan jam WIB terintegrasi, breadcrumb, dan trigger **Card Profile Popover** interaktif.
   - Dilengkapi header visual Deep Navy (`#10273f`) dan Warm Gold (`#c4a266`), inisial avatar dinamis, informasi unit operasional (Mariuk & Cimalaka), dan tombol keluar (*Logout*) yang terlindungi *outside-click* dan tombol *Escape*.
   - **Interactive Role Switcher (Simulasi RBAC Opsi A)**:
     - Ditenagai oleh modul [`resources/js/services/authRole.js`](resources/js/services/authRole.js).
     - Pengguna dapat beralih peran dengan 1-klik di dalam Card Profile:
       1. **Super Administrator HCGA** (`SUPER_ADMIN`): Hak akses tak terbatas ke seluruh modul sistem, pengaturan geofence, master data, dan audit log.
       2. **Supervisor Operasional Site** (`SUPERVISOR`): Akses operasional lapangan (Beranda, Kehadiran, Jadwal Shift, Laporan, Lembur, Cuti, Master Karyawan); terisolasi dari Pengaturan Sistem & Audit Log.
       3. **Personel Lapangan / ESS** (`KARYAWAN`): Self-service portal (Beranda, Kehadiran GPS/Selfie, Jadwal Roster pribadi, Rapor individu); menu master data dan administrasi sistem otomatis disembunyikan.
     - Terkoneksi secara reaktif via custom event `hris:role-changed` dan persistensi `localStorage`.
     - **Pelindung Rute Shell ([`LayoutUtama.jsx`](resources/js/Layouts/LayoutUtama.jsx))**: Menampilkan kartu peringatan *Akses Modul Dibatasi* jika peran aktif mencoba mengakses rute yang berada di luar wewenangnya.

---

## 4. Modul Beranda Eksekutif Terpadu (`Beranda.jsx`)

Lokasi: [`resources/js/Pages/Admin/Beranda/Beranda.jsx`](resources/js/Pages/Admin/Beranda/Beranda.jsx)

### A. Metrik Realistis Berbasis 86 Karyawan Riil Database SQLite
- Menghapus 100% data dummy hardcoded (12 nama personel lama) dan menghubungkan Beranda langsung ke controller backend `BerandaController.php`.
- Metrik real-time: **86 Personil Aktif** (35 di Site Mariuk dan 51 di Site Cimalaka).
- **Deteksi Dinamis Status Rotasi Shift Hari Ini**:
  - Menghitung jadwal bergulir Kelompok A dan Kelompok B secara otomatis.
  - Menampilkan ringkasan jam kerja operasional Shift Pagi (`08:00 – 17:00 WIB`) dan Shift Malam (`20:00 – 05:00 WIB`).

### B. 4 Kartu KPI Eksekutif Real-Time
1. **Total Personel Aktif**: Menghitung dinamis total personil (86 orang gabungan, 35 Mariuk, 51 Cimalaka).
2. **Tingkat Kehadiran**: Rasio kehadiran harian riil dari tabel `attendances` database.
3. **Terlambat Masuk**: Pemantauan presensi dengan deviasi waktu keterlambatan.
4. **Tidak Hadir (Legalitas)**: Rekapitulasi personel izin, sakit, atau cuti resmi.

### C. 4 Kartu Navigasi Cepat (Quick Nav Cards)
Pintasan alur kerja eksekutif dengan badge dinamis:
- *Catatan Kehadiran* $\to$ Akses cepat pencatatan presensi hari ini.
- *Jadwal & Shift Kerja* $\to$ Akses pengaturan rotasi dan roster shift.
- *Data Karyawan* $\to$ Akses master data karyawan (badge dinamis 86 personil).
- *Laporan & Rekap* $\to$ Akses dual-tab rekapitulasi & rapor individu.

### D. Visual Analytics & Feed Kehadiran Hari Ini
- **Grafik Tren Kehadiran Mingguan (Recharts)**: `BarChart` dinamis berbasis data presensi riil 7 hari terakhir dari database.
- **Tabel Feed Presensi Hari Ini**: Menggunakan `<Table>` atomik. Menampilkan empty state terstruktur jika belum ada catatan presensi hari ini dan menyajikan feed presensi riil karyawan saat data tercatat.

---

## 5. Modul Data Karyawan - Core HR (`DataKaryawan.jsx`)

Lokasi: [`resources/js/Pages/Admin/Karyawan/DataKaryawan.jsx`](resources/js/Pages/Admin/Karyawan/DataKaryawan.jsx)

- **Sinkronisasi Penuh ke Backend & Database SQLite**:
  - Seluruh operasi CRUD (Tambah Karyawan, Edit Karyawan, Hapus Karyawan, dan Batch Impor Excel) kini terhubung langsung ke `KaryawanController.php` dan database SQLite (`employees`, `locations`, `shifts`).
  - Menggunakan Inertia router (`router.post`, `router.put`, `router.delete`) dengan state `isSubmitting` dan error feedback presisi di level input form.
  - Data dummy lama telah dibersihkan secara tuntas dan digantikan 86 data karyawan riil operasional site (35 Lokasi Mariuk & 51 Lokasi Cimalaka) dengan format NIP Opsi B (`HC-0001` - `HC-0120`) dan mapping `biometric_pin` mesin fisik.
- **10 Kolom Tabel Simetris & Navigasi Pagination**:
  - Kolom: No, Nama Karyawan, Divisi, Lokasi Kerja, Grup, Kategori Jadwal, Jam Masuk, Jam Pulang, Status, Aksi.
  - Penomoran baris kontinu berdasarkan halaman aktif `(currentPage - 1) * perPage + index + 1`.
  - Dilengkapi `<TablePagination>` dengan pemilih baris per halaman (10, 25, 50, 100 baris, default 10 baris), tombol Sebelumnya/Berikutnya, dan tombol nomor halaman berelipsis.
  - Otomatis mereset ke halaman 1 saat pengguna mengetik pencarian atau mengubah filter lokasi/divisi/grup/status.
- **Head Table Rapi & Terpusat**: Kolom data badge/jam/status terpusat simetris dengan kolom header.
- **Fitur Aksi**:
  - **Tambah Karyawan (`ModalFormKaryawan.jsx`)**: Menggunakan modal atomik, preset shift cepat, auto-generate NIP jika dikosongkan (`HC-0121+`), auto-resolve ID lokasi dan shift.
  - **Ubah & Hapus Karyawan**: Edit inline data modal dan konfirmasi hapus langsung tersinkron ke SQLite dengan pembaruan otomatis `assigned_count` di tabel `locations`.
  - **Impor Excel (`ModalImporKaryawan.jsx`)**: Menggunakan endpoint batch `POST /karyawan/batch-import` dengan `DB::transaction`, memetakan NIP, PIN mesin finger, divisi, lokasi, dan shift secara atomik.
  - **Ekspor Excel**: 1-klik unduh `.xlsx` terfilter via SheetJS.
  - **Live Filter**: Pencarian teks nama/NIP/PIN + dropdown filter Divisi, Grup, Lokasi, dan Status.
  - **Notifikasi**: Menggunakan notifikasi atomik `<Toast />`.

---

## 6. Modul Catatan Kehadiran - Time & Attendance (`CatatanKehadiran.jsx`)

Lokasi: [`resources/js/Pages/Admin/Kehadiran/CatatanKehadiran.jsx`](resources/js/Pages/Admin/Kehadiran/CatatanKehadiran.jsx)

- **Sinkronisasi Penuh Database SQLite & Backend Controller**:
  - Seluruh data presensi terhubung langsung ke model `Attendance`, `Employee`, `Location`, dan `Shift` via `KehadiranController.php`.
  - CRUD manual presensi (`POST /kehadiran/manual`), presensi massal (`POST /kehadiran/mass`), dan hapus presensi (`DELETE /kehadiran/{id}`) terhubung menggunakan Inertia router.
- **Implementasi Aturan Shift 9 Jam (8 Jam Kerja Efektif + 1 Jam Istirahat)**:
  - **Shift Pagi**: Jam kerja operasional `08:00 - 17:00 WIB`. Jendela absen dibuka mulai `07:00 WIB` dan ditutup pada `18:00 WIB`.
  - **Shift Malam**: Jam kerja operasional `20:00 - 05:00 WIB` (lintas hari). Jendela absen dibuka mulai `19:00 WIB` dan ditutup pada `06:00 WIB` pagi hari berikutnya.
  - Toleransi keterlambatan dikonfigurasi dinamis (default: 15 menit).
- **Integrasi Impor Mesin Biometric Fingerprint Fisik (`FingerprintImportService.php`)**:
  - Mendukung format ekstraksi mesin fingerprint 9 kolom (`Cloud ID`, `ID/PIN`, `Nama`, `Tanggal Absensi`, `Jam Absensi`, `Verifikasi`, `Tipe Absensi`, `Jabatan`, `Kantor`).
  - Pemisahan site otomatis (`MARIUK` vs `CIMALAKA`).
  - Algoritma deduplikasi scan ganda dalam 5 menit, pengelompokan time-window cerdas (masuk & pulang), serta deteksi anomali single punch (lupa tap masuk/pulang).
  - Alur commit langsung ke database via `POST /kehadiran/commit-fingerprint`.
- **Komponen Atomik `<TablePagination>`**:
  - Dilengkapi kontrol navigasi halaman cerdas dengan ellipsis, pilihan ukuran baris (`10, 25, 50, 100`), dan penomoran baris kontinu `(currentPage - 1) * perPage + index + 1`.
  - Ukuran font dan tombol diperbesar sesuai preferensi operasional (`text-xs sm:text-sm`).
  - Otomatis reset ke halaman 1 saat filter pencarian, lokasi, divisi, status, atau tanggal diubah.
- **Navigasi Tanggal Cepat**: Navigasi harian (kemarin, besok, date-picker kalender, tombol *Hari Ini*), lengkap dengan format bahasa Indonesia.
- **5 Kartu KPI Real-time**: Total Jadwal, Tepat Waktu (dengan persentase), Terlambat (dengan total akumulasi menit keterlambatan), Izin/Sakit/Cuti, dan Alpha/Mangkir.
- **Fitur Aksi**:
  - **Catat / Ubah Presensi (`ModalFormPresensi.jsx`)**: Menggunakan modal atomik, auto-detect shift karyawan, kalkulasi live menit terlambat berdasarkan jam masuk, dan pengubahan status otomatis.
  - **Presensi Massal Cepat (`ModalPresensiMassal.jsx`)**: 1-klik tandai seluruh atau per-shift karyawan terjadwal sebagai *Hadir Tepat Waktu*.
  - **Ekspor Excel**: 1-klik unduh `.xlsx` seluruh data terfilter per tanggal aktif via SheetJS.
  - **Live Filter**: Pencarian teks nama/NIP + filter Status, Divisi, dan Shift.
  - **Navigasi Pagination Tunggal & Atomik**: Menggunakan satu komponen `<TablePagination />` terpadu dengan pemilih baris per halaman (10, 25, 50, 100 baris) dan nomor halaman berelipsis, mengeliminasi duplikasi footer baris ganda.
  - **Modularisasi & Pembersihan Kode Usang**: Memecah file 1.045 baris menjadi orchestrator ringkas 507 baris dan 4 sub-komponen terisolasi di `Partials/` (`AttendanceDateRibbon.jsx`, `AttendanceKpiCards.jsx`, `AttendanceToolbar.jsx`, `AttendanceTable.jsx`). Sanitasi total 100% dead code: menghapus 8 import mati di file utama, 5 import mati di modal fingerprint, 2 import mati di modal form presensi, 1 import mati di tabel, 3 konstanta usang (`MASTER_EMPLOYEES`, `INITIAL_ATTENDANCES`, `SHIFT_OPTIONS`), menghilangkan duplikasi state React, mendinamisasi filter divisi dari master karyawan, serta mengoneksikan props `locations` dan `existingAttendances` antar komponen.
  - **Notifikasi**: Menggunakan notifikasi atomik `<Toast />`.

---

## 7. Modul Laporan & Rapor Evaluasi Kehadiran (`LaporanRekap.jsx`)

Lokasi: [`resources/js/Pages/Admin/Laporan/LaporanRekap.jsx`](resources/js/Pages/Admin/Laporan/LaporanRekap.jsx) dan subkomponen di [`Partials/`](resources/js/Pages/Admin/Laporan/Partials/)

Modul ini mengusung arsitektur **Tab Switcher Terpadu** yang memisahkan ranah makro (organisasi) dan mikro (individu) dalam satu halaman tanpa reload rute:

### A. Sinkronisasi Penuh Database SQLite & Backend Controller (`LaporanController.php`)
- **100% Data Riil**: Menghapus seluruh dataset dummy fiktif (12 orang pada `evaluationDataset.js`) dan mengoneksikan halaman langsung ke model `Employee`, `Attendance`, dan `Location` melalui `LaporanController.php`.
- **Cakupan 86 Karyawan Riil**: Data evaluasi otomatis dihitung secara live untuk seluruh 86 karyawan operasional (35 Site Mariuk, 51 Site Cimalaka).
- **Kalkulasi Metrik & Skor Kedisiplinan Otomatis**:
  - Menghitung hari kerja aktif (default 22 hari), hari hadir, jumlah keterlambatan & akumulasi menit keterlambatan, cuti, sakit, izin, dan alpa berdasarkan log presensi riil di bulan/periode terpilih.
  - Skor Kedisiplinan terhitung otomatis (0–100%) dengan klasifikasi status: *Sangat Baik*, *Disiplin Baik*, *Perlu Pembinaan*, dan *Peringatan / SP*.
  - Rekomendasi tindakan dinamis dan pencatatan insiden indisipliner otomatis.

### B. Tab 1: Rekap Organisasi & Divisi (Makro)
- **Segmented Location Controller Dinamis (Mariuk & Cimalaka)**:
  - Tab pengontrol segmen instan yang menghitung counter riil karyawan: **Semua Lokasi (86)**, **Mariuk (35)** (amber), dan **Cimalaka (51)** (indigo).
  - Dilengkapi indikator detak operasional live: *Monitoring Disiplin & Evaluasi 24/7 Non-Stop*.
- **Filter Periode Dinamis**: Pemilihan bulan berjalan dan arsip periode sebelumnya yang memicu kueri Inertia reaktif ke controller backend.
- **4 Kartu Metrik KPI Evaluasi Reaktif**:
  - Dihitung dinamis mengikuti pilihan lokasi kerja aktif:
    1. *Rata-rata Kehadiran Organisasi* (Target $\ge 95\%$).
    2. *Karyawan Hadir 100%* (Kedisiplinan penuh tanpa telat).
    3. *Total Keterlambatan* (Akumulasi frekuensi dan durasi menit).
    4. *Perhatian Disiplin / SP* (Early warning deteksi indisipliner).
- **Visual Analytics (Recharts)**: Grafik batang rata-rata skor kedisiplinan per divisi aktual karyawan menggunakan palet warna resmi Deep Navy & Gold.
- **Panel Sorotan (Top Stars & Early Warning)**:
  - *Duta Keteladanan*: Karyawan dengan skor tertinggi untuk nominasi reward (klik langsung membuka rapor individu).
  - *Panggilan / Pembinaan Khusus*: Karyawan dengan akumulasi keterlambatan atau catatan alpa (klik langsung membuka dossier pembinaan).
- **Matriks Evaluasi Kedisiplinan Karyawan & `<TablePagination>`**:
  - **Identitas Lengkap & Interaktif**: Avatar inisial visual, nama karyawan interaktif, NIP font-mono, jabatan, serta pill badge lokasi penempatan (`Mariuk` / `Cimalaka`) dan kelompok regu (`Grup A` / `Grup B`).
  - Kolom metrik: Kehadiran (Hadir/Hari & %), Keterlambatan, Cuti/Sakit, Alpa, Indikator Progress Skor Disiplin (0–100%), Status Evaluasi.
  - **Navigasi Pagination Atomik**: Menggunakan `<TablePagination>` dengan pemilih baris per halaman (10, 25, 50, 100 baris, default 25 baris), penomoran kontinu, tombol navigasi Previous/Next, dan ellipsis halaman.
  - Tombol **"Buka Rapor"**: 1-klik beralih mulus ke Tab 2 dengan karyawan terkait langsung terpilih.
- **Ekspor Dokumen Excel (`.xlsx`)**: 1-klik unduh rekapitulasi evaluasi kehadiran seluruh karyawan via SheetJS lengkap dengan NIP, Divisi, Jabatan, Lokasi, dan Rekomendasi Tindakan.

### C. Tab 2: Rapor Evaluasi Individu / Dossier Personel (Mikro)
- **Toolbar Navigasi Cepat**: Tombol kembali ke rekap organisasi, dropdown pemilih karyawan aktif (seluruh 86 personil riil), cetak rapor (`window.print()`), dan ekspor XLSX personal (profil lengkap + log dinamis).
- **Dossier Header Card**:
  - Profil korporat lengkap dengan avatar inisial, NIP font-mono, badge lokasi kerja (Mariuk/Cimalaka), badge kelompok regu (Grup A/B), dan badge shift operasional (Pagi/Malam).
  - Skor kedisiplinan (0–100%) dan kotak rekomendasi resmi tindakan manajemen HCGA.
- **8 Scorecard KPI Terperinci**: Total Kehadiran, Tepat Waktu, Terlambat, Menit Terlambat, Izin, Sakit, Cuti, dan Alpha.
- **Kalender Visual Presensi 30 Hari (Heatmap Grid 24/7)**:
  - Kotak visual per tanggal (1 s/d 30) berkode warna interaktif: Hadir (Hijau), Terlambat (Kuning), Izin (Biru), Sakit (Ungu), Cuti (Teal), Alpha (Merah), Libur (Abu-abu).
  - Selaras dengan pola dinas operasional (Shift Pagi `08:00–17:00` / Shift Malam `20:00–05:00`) dan rotasi selang-seling Grup A & B.
- **Grafik Tren Kedisiplinan 6 Bulan**: `BarChart` Recharts menampilkan histori skor kedisiplinan 6 bulan ke belakang.
- **Buku Pembinaan & Sanksi Disiplin (Disciplinary Log)**: Daftar riwayat teguran lisan, bimbingan supervisor, atau SP-1 resmi, dilengkapi form interaktif penambahan catatan pembinaan baru dengan notifikasi atomik `<Toast />`.

### D. Dekomposisi Modular, Sinkronisasi Riil, & Sanitasi Total Dead Code
- **Perampingan Kode & Eliminasi Dummy**:
  - Memecah file utama [LaporanRekap.jsx](resources/js/Pages/Admin/Laporan/LaporanRekap.jsx) dari 1.245 baris menjadi ~350 baris (>70% reduksi baris kode) dengan arsitektur modular di `Partials/`:
    - [`LaporanController.php`](app/Http/Controllers/Admin/LaporanController.php): Mengambil 86 karyawan riil dari database SQLite, menghitung agregasi presensi, dan mempassing data ke Inertia.
    - Menghapus total file dummy fiktif `evaluationDataset.js`.
    - [`LaporanKpiCards.jsx`](resources/js/Pages/Admin/Laporan/Partials/LaporanKpiCards.jsx): 4 kartu metrik evaluasi kehadiran reaktif.
    - [`LaporanAnalyticsGrid.jsx`](resources/js/Pages/Admin/Laporan/Partials/LaporanAnalyticsGrid.jsx): Visual analytics Recharts per divisi dan panel sorotan Duta Keteladanan / Early Warning.
    - [`LaporanEvaluasiTable.jsx`](resources/js/Pages/Admin/Laporan/Partials/LaporanEvaluasiTable.jsx): Toolbar pencarian/filter, matriks evaluasi 10 kolom, dan dilengkapi komponen atomik `<TablePagination>` untuk menavigasi 86 baris data.
- **Pembersihan Import Usang**:
  - Menghapus 6 import usang di [LaporanRekap.jsx](resources/js/Pages/Admin/Laporan/LaporanRekap.jsx) (`Download`, `Search`, `Filter`, `X`, `Info`, `colors`).
  - Menghapus 2 import usang di [RaporIndividu.jsx](resources/js/Pages/Admin/Laporan/Partials/RaporIndividu.jsx) (`TrendingDown`, `Sparkles`), serta mengganti hardcoded NIP malam dan supervisor mock dengan resolusi dinamis.
- **Dampak Performa**: Ukuran *JS chunk bundle* [LaporanRekap.jsx](resources/js/Pages/Admin/Laporan/LaporanRekap.jsx) menyusut drastis dari **31.05 kB menjadi 16.31 kB** (~48% lebih ringan).

---

## 8. Modul Jadwal & Roster Shift Operasional (`JadwalShift.jsx`)

Lokasi: [`resources/js/Pages/Admin/Jadwal/JadwalShift.jsx`](resources/js/Pages/Admin/Jadwal/JadwalShift.jsx), [`resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx), [`resources/js/Pages/Admin/Jadwal/Partials/ModalFormTukarShift.jsx`](resources/js/Pages/Admin/Jadwal/Partials/ModalFormTukarShift.jsx), dan [`app/Http/Controllers/Admin/JadwalController.php`](app/Http/Controllers/Admin/JadwalController.php)

### A. Sinkronisasi Penuh Database SQLite (86 Karyawan Riil) & Backend Controller
- **Integrasi Backend `JadwalController.php`**:
  - Halaman `/jadwal` kini menyajikan 100% data riil dari database SQLite (seluruh 86 karyawan dari site Mariuk dan Cimalaka) melalui relasi Eloquent `location` dan `shift`.
  - Endpoint pembaruan grup karyawan (`PUT /jadwal/employee/{employee}/group`), rotasi massal (`POST /jadwal/bulk-update-group`), dan swap siklus grup A ⇄ B (`POST /jadwal/swap-group`) terhubung langsung ke database dengan validasi atomik dan notifikasi `<Toast />`.
- **Integrasi Komponen Atomik `<TablePagination>`**:
  - Dilengkapi paginasi responsif 25 karyawan per halaman dengan penomoran baris kontinu `(currentPage - 1) * perPage + index + 1`.
  - Pilihan ukuran baris dinamis (10, 25, 50, 100) dan reset otomatis saat filter pencarian, lokasi, divisi, atau grup berubah.

### B. Implementasi Aturan Shift 9 Jam (8 Jam Efektif + 1 Jam Istirahat)
- **Shift Pagi**: `08:00 – 17:00 WIB` (Jendela absen buka `07:00`, tutup `18:00`).
- **Shift Malam**: `20:00 – 05:00 WIB` (Jendela absen buka `19:00`, tutup `06:00`).
- Rata-rata jam kerja dihitung 8 jam dinas efektif per shift reguler.

### C. 4 Kartu KPI Roster Jadwal Operasional (Reaktif terhadap Filter Lokasi)
1. *Total Personil Terjadwal*: Total karyawan aktif dari database (distribusi per site Mariuk & Cimalaka serta staf Non-Shift).
2. *Grup Operasional A*: Personil Grup A dengan shift operasional 9 jam (08:00 - 17:00 & 20:00 - 05:00).
3. *Grup Operasional B*: Personil Grup B dengan shift operasional 9 jam (08:00 - 17:00 & 20:00 - 05:00).
4. *Jadwal Khusus & Tukar Shift*: Pemantauan real-time kasus tukar shift dan penyesuaian jadwal aktif.

### D. Segmented Location Controller (Mariuk & Cimalaka)
- Tab switcher segmen satu sentuhan di atas tabel roster:
  - **Semua Lokasi**: Pandangan makro seluruh personil lintas pabrik.
  - **Mariuk**: Terfilter otomatis personil Lokasi Mariuk dengan badge amber.
  - **Cimalaka**: Terfilter otomatis personil Lokasi Cimalaka dengan badge indigo.
- Indikator status live: *Roster Operasional · Shift Pagi 08:00-17:00 & Shift Malam 20:00-05:00 WIB*.

### E. Tab 1: Matriks Roster Mingguan (`roster`)
- **Tabel Matriks Roster 7 Hari Dinamis**:
  - Kolom karyawan dilengkapi inisial avatar visual, NIP font-mono, jabatan, dan pill badge lokasi penempatan (`Mariuk` / `Cimalaka`).
  - Kalkulasi total jam kerja mingguan aktual dan hari dinas per karyawan berbasis 8 jam efektif per hari.
  - Legenda kode terstandarisasi: `PAGI (08-17)`, `MALAM (20-05)`, `NON (Office 08-17)`, `SWAP`, `LIBUR`, `OFF`.
- **Ekspor Dokumen Excel (.xlsx)**:
  - Unduh roster mingguan via SheetJS mencakup nama, NIP, lokasi pabrik, divisi, 7 kolom hari, dan kalkulasi dinas aktual.

### F. Tab 2: Rotasi Grup & Jadwal Manual (`patterns`) — `PanelRotasiGrup.jsx`
- Alur rotasi kelompok A & B selang-seling serta formulir penyesuaian jadwal ad-hoc dengan rentang jam shift operasional (`08:00 - 17:00` dan `20:00 - 05:00`).
- Fitur *Tukar Siklus Grup A ⇄ Grup B* terhubung ke `POST /jadwal/swap-group`.

### G. Tab 3: Log Pengecualian & Tukar Shift (`exceptions`) & Modal Atomik (`ModalFormTukarShift.jsx`)
- Rekam pertukaran shift resmi antar-rekan kerja atau penugasan khusus yang disetujui HCGA dengan preset shift operasional 9 jam.

### H. Dekomposisi Modular & Sanitasi Total Dead Code
- **Perampingan Kode**: Memecah file utama [JadwalShift.jsx](resources/js/Pages/Admin/Jadwal/JadwalShift.jsx) dari 1.202 baris menjadi 631 baris dengan mengekstrak 3 sub-komponen modular di `Partials/`:
  - [`JadwalKpiCards.jsx`](resources/js/Pages/Admin/Jadwal/Partials/JadwalKpiCards.jsx) (~85 baris): 4 scorecard KPI roster operasional.
  - [`JadwalRosterTab.jsx`](resources/js/Pages/Admin/Jadwal/Partials/JadwalRosterTab.jsx) (~320 baris): Matriks kalender roster 7 hari, selektor minggu, controller lokasi Mariuk & Cimalaka, filter dinamis, dan paginasi atomik.
  - [`JadwalExceptionsTab.jsx`](resources/js/Pages/Admin/Jadwal/Partials/JadwalExceptionsTab.jsx) (~115 baris): Tabel log permohonan tukar shift dan penugasan khusus.
- **Pembersihan Import & State Redundan**:
  - Menghapus 1 import usang (`Text`) di file utama.
  - Menghapus 7 import usang di [ModalFormTukarShift.jsx](resources/js/Pages/Admin/Jadwal/Partials/ModalFormTukarShift.jsx) (`Calendar`, `User`, `FileText`, `MapPin`, `AlertCircle`, `Building`, `RotateCw`).
  - Menghilangkan *state mirroring* `const [employees, setEmployees] = useState(initialEmployees)` dengan `useMemo` normalisasi langsung.
  - Mengganti opsi divisi hardcoded dengan `availableDivisions` dinamis dari master karyawan.
- **Dampak Performa**: Ukuran *JS chunk bundle* berkurang dari **29.22 kB menjadi 13.45 kB** (>53% lebih ringan).

---

## 9. Modul Pengaturan Sistem & Kebijakan HR (`PengaturanSistem.jsx`)

Lokasi: [`resources/js/Pages/Admin/Pengaturan/PengaturanSistem.jsx`](resources/js/Pages/Admin/Pengaturan/PengaturanSistem.jsx) dan [`resources/js/services/systemSettings.js`](resources/js/services/systemSettings.js)

### A. 4 Kartu KPI Konfigurasi Utama
- **Toleransi Keterlambatan**: 15 Menit (*grace period* presensi aktif).
- **Hari Libur Nasional 2026**: 14 Hari (termasuk cuti bersama resmi pemerintah).
- **Geofence Presensi Mobile**: 3 Titik Lokasi Operasional Aktif (**Lokasi Mariuk**, **Lokasi Cimalaka**, dan **Head Office**) dengan proteksi Anti-Mock GPS.
- **Kesehatan & Status Cadangan**: Terkini (*auto-sync* data pengaturan & cadangan database lokal).

### B. Tab 1: Kebijakan Presensi & Kerja (`attendance`)
- Parameter toleransi keterlambatan (15 menit), batas buka check-in awal (120 menit), batas kepulangan lebih awal (0 menit), dan jam kerja mingguan (40 jam sesuai standar Depnaker; operasional shift 12 jam rolling rata-rata 42 jam/minggu).
- Validasi wajib swafoto / selfie wajah dan proteksi Anti-Fake GPS / Mock Location.
- Parameter lembur Depnaker (koefisien 1.5x jam pertama dan 2.0x jam berikutnya) serta kuota cuti tahunan (12 hari).

### C. Tab 2: Konfigurasi Shift Fleksibel & Tukar Shift (`shift`)
- **Panel Parameter Jam Shift Lapangan**:
  - Konfigurasi fleksibel waktu mulai dan selesai untuk **Shift Pagi** (`08:00 – 17:00 WIB`) dan **Shift Malam** (`20:00 – 05:00 WIB`).
  - Dilengkapi perhitungan durasi otomatis (9 jam per shift) dan indikator status *Operational Rolling Schedule*.
- **Parameter Handover & Serah Terima Tugas**:
  - Waktu tukar shift terjadwal tepat pukul `08:00` dan `20:00` WIB.
  - Durasi toleransi pergantian tugas shift (*handover*) 15 menit.
- **Kebijakan Pengajuan Tukar Shift Antar-Karyawan**:
  - Batas waktu pengajuan tukar shift maksimal 4 jam sebelum shift dimulai.
  - Opsi wajib persetujuan atasan (*supervisor approval*) sebelum jadwal dinyatakan efektif.

### D. Tab 3: Kalender Libur & Cuti Bersama (`holiday`)
- Daftar Hari Libur Resmi 2026 dengan format standar `dd/mm/yyyy`.
- Modal atomik tambah, edit, dan hapus hari libur dengan pilihan pemotongan cuti (*Tidak Potong Cuti* vs *Potong Cuti Tahunan*).
- **Sinkronisasi Otomatis ke Jadwal & Roster**: Tanggal libur resmi otomatis ditandai `LIBUR (Hari Libur Resmi)` di Roster Mingguan tanpa perlu ubah jadwal satu per satu.

### E. Tab 4: Geofencing & Lokasi Pabrik (`location`)
- **Master Switch / Toggle Penonaktifan Geofence**:
  - Disediakan kartu kontrol utama di bagian atas tab untuk mengaktifkan atau menonaktifkan validasi radius geofence secara global dengan 1-klik (`enableGeofence: true/false`).
  - **Mode Dinonaktifkan (*Bypass Radius*)**: Seluruh karyawan dapat melakukan presensi mobile dari mana saja tanpa batasan radius meter pabrik (berguna untuk penugasan luar site, dinas khusus, atau kondisi darurat), namun koordinat GPS tetap terekam secara transparan.
  - Kartu ringkasan KPI dan badge status di tab merefleksikan status secara dinamis: *Aktif (Radius Terkunci)* atau *Dinonaktifkan (Bebas Lokasi)*.
  - Opsi toggle ini juga disinkronkan ke Tab 1 (Kebijakan Presensi & Kerja) serta database backend `system_settings`.
- Konfigurasi titik radius presensi:
  - **Lokasi Mariuk** (Site Subang): Radius 120m, 6 personil terdaftar, koordinat GPS `-6.48512, 107.82145`.
  - **Lokasi Cimalaka** (Site Sumedang): Radius 120m, 6 personil terdaftar, koordinat GPS `-6.81234, 107.93512`.
- **Fitur Modal Edit Parameter Geofence**:
  - Tombol aksi *Edit* (ikon pensil) pada setiap baris tabel membuka dialog `<Modal>` atomik.
  - Memungkinkan penyesuaian nama lokasi, kategori titik, koordinat GPS, radius meter, dan alamat lengkap.
- Toggle status geofence (*Aktifkan* / *Nonaktifkan*) per lokasi operasional.

### F. Tab 5: Profil Perusahaan & Pemeliharaan Data (`maintenance`)
- Data legalitas perusahaan (PT Manufaktur Nusantara Perkasa Tbk, NIB, NPWP, Kontak HCGA).
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

### B. Shift Kerja Operasional & Operasional Non-Stop 7 Hari
- **Shift Pagi**: `08:00 – 17:00 WIB` (9 Jam kerja, jendela presensi 07:00–18:00).
- **Shift Malam**: `20:00 – 05:00 WIB` (9 Jam kerja lintas hari, jendela presensi 19:00–06:00).
- **Tukar Shift (Handover)**: Tepat pukul `08:00 WIB` dan `20:00 WIB`.
- **Roster 7 Hari Tanpa Libur Pabrik**:
  - Operasional berjalan 7 hari penuh setiap minggu tanpa hari libur operasional bersama (Sabtu dan Minggu tetap beroperasi penuh).
  - Kelompok A masuk hari Senin, Kelompok B hari Selasa, Kelompok A hari Rabu, Kelompok B hari Kamis, dan seterusnya bergulir adil sehingga giliran dinas hari Minggu berganti setiap 2 minggu.

### C. Panel Konfigurasi Fleksibel Shift (`PengaturanSistem.jsx`)
- Disediakan tab khusus **"Jam Kerja & Shift"** pada [`PengaturanSistem.jsx`](resources/js/Pages/Admin/Pengaturan/PengaturanSistem.jsx) yang terhubung ke service reaktif [`systemSettings.js`](resources/js/services/systemSettings.js).
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

## 16. Implementasi Backend Fase 1 (Database Migrations, Eloquent Models, & Controllers)

Tahap backend telah resmi diaktifkan dengan mengimplementasikan fondasi database dan arsitektur controller Laravel 11 yang selaras 100% dengan frontend HRIS:

### A. 9 Tabel Database & Migrations
1. `users`: Autentikasi sistem, role (`super_admin`, `supervisor`, `karyawan`), NIP, avatar, is_active.
2. `locations`: Data site operasional (Lokasi Mariuk & Lokasi Cimalaka), koordinat GPS, radius geofence (120m).
3. `shifts`: Konfigurasi shift kerja (Shift Pagi `08:00–17:00`, Shift Malam `20:00–05:00`, Non-Shift Office `08:00–17:00`).
4. `employees`: Master data induk 12 personel HCGA, relasi ke `users`, `locations`, dan `shifts`.
5. `system_settings`: Penyimpanan fleksibel key-value JSON untuk kebijakan toleransi (15 menit), shift, dan profil korporat.
6. `holidays`: Kalender 12 hari libur resmi nasional & operasional pabrik.
7. `attendances`: Log presensi real-time, GPS in/out, foto selfie, perhitungan otomatis keterlambatan.
8. `shift_schedules`: Roster jadwal rotasi harian 2-grup (Grup A & Grup B).
9. `shift_swaps`: Transaksi pertukaran jadwal shift antar personel lapangan.

### B. 9 Eloquent Models (`app/Models/`)
Model dilengkapi *casting* tipe data, relasi Eloquent (`hasMany`, `belongsTo`), dan atribut virtual aksesori cerdas (`role`, `location`, `group`, `scheduleCategory`, `checkInTime`, `checkOutTime`) pada `Employee.php` sehingga saat diserialisasi ke JSON untuk Inertia, propertinya 100% kompatibel dengan komponen React frontend tanpa memerlukan modifikasi UI.

### C. Seeding Master Data Resmi
Eksekusi seeder (`php artisan db:seed`) menyuntikkan:
- **86 Personel Riil Lapangan & Site** (hasil ekstraksi resmi dari `Data Karyawan.xlsx`, seluruh 12 data dummy lama telah dibersihkan 100%):
  - **Site Mariuk**: 35 Personil (termasuk Muhammad M - CEO Mariuk).
  - **Site Cimalaka**: 51 Personil (termasuk Nabiel F - CEO Cimalaka).
  - **Penomoran NIP Opsi B**: Format rapi ber-padding `HC-0001` s/d `HC-0120` unik.
  - **Identitas Biometric PIN**: Menyimpan User ID asli mesin sidik jari fisik (`biometric_pin`) untuk pemindaian log instan.
- **3 Akun Pengguna Terkoneksi** dengan password ter-enkripsi (`bcrypt`):
  - Super Admin: `admin@nusantaraperkasa.co.id`
  - Supervisor Site: `nabiel.f@nusantaraperkasa.co.id`
  - Personel Lapangan: `abdul.saepudin@nusantaraperkasa.co.id`
- **2 Lokasi Site**: Mariuk (Subang, 35 personil) & Cimalaka (Sumedang, 51 personil).
- **3 Master Shift**: Pagi 12 Jam, Malam 12 Jam, Office 8 Jam.
- **Kebijakan & Toleransi Sistem**: 15 menit batas keterlambatan.

### D. Controller & Rute Terpadu (`app/Http/Controllers/`)
- `AuthController`: Menangani alur `showLogin`, `login` (verifikasi kredensial asli), dan `logout`.
- `BerandaController`: Menyajikan metrik eksekutif terhitung langsung dari database SQLite.
- `KaryawanController`: Mengirimkan prop `employees`, `availableLocations`, `availableShifts`, serta menangani operasi `store`, `update`, dan `destroy`.
- `KehadiranController`: Menangani index log harian, input manual/koreksi admin (`storeManual`), preview parse log fingerprint (`previewFingerprint`), commit batch presensi (`commitFingerprint`), dan penautan biometric PIN (`linkBiometricPin`).
- `PengaturanController`: Mengelola konfigurasi toleransi, geofence, dan jadwal libur.
- **Automated Feature Tests**: Telah diuji dengan PHPUnit (`KaryawanBackendTest.php` dan `FingerprintAndManualAttendanceTest.php`) dengan hasil **7 passed (39 assertions), 100% sukses**.

---

## 17. Implementasi Ingesti Log Fingerprint & Penonaktifan GPS Sementara

Menindaklanjuti kebutuhan operasional riil pabrik bahwa data absensi tidak diinput mandiri oleh karyawan via GPS/selfie web, melainkan ditarik dari mesin absensi fisik (fingerprint) dan diinput/dikoreksi oleh Admin jika berhalangan scan:

1. **Decoupling `biometric_pin` dari `id` / `nip` Database**:
   - Menambahkan kolom `biometric_pin` (nullable, index) pada tabel `employees` dan accessor di `Employee.php` dengan fallback ke digit numerik NIP jika belum disetel manual.
   - Admin dapat menambahkan, melihat, dan memperbarui nomor PIN mesin fingerprint langsung melalui formulir `ModalFormKaryawan.jsx`.
   - Isolasi PIN per-site: Query pencocokan PIN selalu mengombinasikan `location_id` dan `biometric_pin` agar PIN yang sama pada mesin di Site Mariuk dan Site Cimalaka tidak tertukar.

2. **Mesin Parser & Deduplikasi Log (`FingerprintImportService.php`)**:
   - **Multi-Format Ingestion**: Mendukung file Excel (`.xlsx`), CSV (`.csv`), dan format mesin ZKTeco/Solution (`.dat` / `.txt`).
   - **Deduplikasi 5 Menit**: Mengeliminasi scan ganda (double-punch) yang dilakukan karyawan dalam rentang waktu < 5 menit.
   - **Windowing Shift & Midnight Crossing**: Mengelompokkan scan Shift Pagi (08:00–17:00) dan Shift Malam (20:00–05:00 hari berikutnya) ke tanggal buku tugas yang tepat tanpa membuat duplikasi baris harian.
   - **Deteksi Anomali Single-Punch**: Memisahkan presensi yang lengkap (*ready*) dengan presensi anomali (hanya tap masuk atau hanya tap pulang).
   - **Penanganan Unmapped PIN**: Menampung log dari nomor PIN baru yang belum terdaftar di database HRIS dan menyediakan aksi 1-klik untuk menautkannya ke karyawan.

3. **Input Presensi Manual oleh Admin (`manual_admin`)**:
   - Disediakan endpoint `POST /kehadiran/manual` dan modal `ModalFormPresensi.jsx` untuk input presensi jika karyawan lupa scan, dinas luar, atau melampirkan surat dokter.
   - Setiap catatan presensi manual ditandai dengan `method = 'manual_admin'` dan badge amber khusus di tabel presensi.

4. **Penonaktifan Validasi GPS & Selfie**:
   - `enableGeofence` disetel ke `false` secara default di `systemSettings.js` dan database seeder.
   - Seluruh validasi radius geofence dan kewajiban selfie mobile dinonaktifkan sementara.
   - Antarmuka `CatatanKehadiran.jsx` menampilkan notice banner informatif: *Mode Operasional: Presensi Mesin Biometric Fingerprint (Validasi GPS Dinonaktifkan)*.

---

## 18. Restrukturisasi Data Karyawan Riil & Penugasan Fleksibel (Belum Ditetapkan)

Berdasarkan data operasional pabrik terkini dari `Data Karyawan.xlsx`:
1. **Pembersihan Database & Re-Impor Data Riil**:
   - Menghapus seluruh data karyawan dummy dan catatan kehadiran lama.
   - Mengimpor 86 personil riil dari file `Data Karyawan.xlsx` (35 personil di Site Mariuk, 51 personil di Site Cimalaka).
   - Seluruh entri ganda/duplikat (misal nama Tarma ID 34 & ID 38) dipertahankan sesuai permintaan pengguna untuk ditelaah lebih lanjut oleh Admin.
2. **Pelepasan Divisi & Nullable di Database**:
   - Menjalankan migrasi `2026_11_22_030401_make_division_nullable_in_employees_table.php` agar kolom `division` bersifat `nullable`.
   - Menghapus seluruh data divisi lama pada 86 karyawan menjadi `null` (`-`).
3. **Penugasan Grup & Shift "Belum Ditetapkan"**:
   - Kolom `shift_id` disetel ke `null`, dan `shift_group` disetel ke `'Belum Ditetapkan'`.
   - Jam kerja masuk dan pulang default disetel ke `'-'` pada model accessor.
4. **Pembaruan Modal Edit Karyawan (`ModalFormKaryawan.jsx`)**:
   - **Opsi Divisi**: Menambahkan `<option value="">Belum Ditetapkan (-)</option>` pada dropdown divisi. Tanda bintang merah wajib dihilangkan.
   - **Opsi Grup Shift**: Menyediakan pilihan `'Belum Ditetapkan'` pada opsi grup.
   - **Preset Jadwal Kerja**: Menyediakan tombol preset `'Belum Ditetapkan (-)'` di samping Shift Pagi, Shift Malam, dan Non-Shift Kantor.
   - **Validasi Waktu Fleksibel**: Jam masuk dan jam pulang kerja hanya divalidasi sebagai *required* jika shift berstatus aktif (bukan `'Belum Ditetapkan'`).
5. **Pembaruan Backend Controller (`KaryawanController.php`)**:
   - Validasi `division`, `shift_id`, dan `shift_group` diubah menjadi `nullable`.
   - Metode `resolvePayload` menangani normalisasi string `'Belum Ditetapkan'` atau kosong menjadi `null` pada kolom `division` dan `shift_id`.

---

## 19. Modularisasi Modul Pengaturan Sistem (Refactoring File 1.994 Baris & Eliminasi Redundansi)

Menindaklanjuti audit kode bahwa file `PengaturanSistem.jsx` membengkak hingga hampir 2.000 baris dan mengandung sejumlah duplikasi/dead code:
1. **Dekomposisi Menjadi 7 Sub-Komponen Terisolasi (`resources/js/Pages/Admin/Pengaturan/Partials/`)**:
   - `TabKebijakanPresensi.jsx`: Konfigurasi grace period keterlambatan, batas early check-in, batas pulang awal, kewajiban selfie, dan mock GPS.
   - `TabJamKerjaShift.jsx`: Konfigurasi Shift Pagi (08:00 - 17:00), Shift Malam (20:00 - 05:00), handover operasional, dan personil terdaftar dinamis.
   - `TabKalenderLibur.jsx`: Tabel daftar hari libur nasional & cuti bersama 2026 dengan filter pencarian dan badge status.
   - `TabGeofencingLokasi.jsx`: Master switch geofence dan tabel titik koordinat radius lokasi site.
   - `TabProfilPemeliharaan.jsx`: Profil resmi perusahaan, NIB/NPWP, serta status database dan cadangan snapshot JSON.
   - `ModalHariLibur.jsx`: Dialog modal penambahan/perubahan hari libur resmi.
   - `ModalEditLokasi.jsx`: Dialog modal pengubahan koordinat GPS dan radius geofence lokasi.
2. **Eliminasi Redundansi & Dead Code**:
   - Menghapus 4 ikon tak terpakai: `Settings`, `FileText`, `Bell`, `Fingerprint`.
   - Menghilangkan redundansi toggle switch ganda pada validasi geofence GPS di Tab 1 dan Tab 3.
   - Mengganti teks statis *"6 Personil Terdaftar"* menjadi pembacaan dinamis dari state `locations` (35 personil Mariuk, 51 personil Cimalaka).
   - Memperbarui keterangan shift agar selaras dengan aturan baru (Pagi 08-17 buka 07-18; Malam 20-05 buka 19-06).
   - Menyelaraskan informasi database menjadi SQLite 3 (bukan teks statis MariaDB/Redis).
   - Memperbaiki bug prop modal: mengganti `maxWidth="max-w-xl"` menjadi `size="lg"` dan `subtitle` menjadi `description` agar deskripsi modal tampil di layar.
3. **Dampak Optimasi Performa**:
   - Ukuran bundle JavaScript `PengaturanSistem` terpangkas drastis dari **53.72 kB menjadi 12.09 kB** (turun >75%).
   - File induk `PengaturanSistem.jsx` kini hanya berukuran ~440 baris sebagai orchestrator yang bersih.

---

## 20. Sinkronisasi Jam Operasional Shift Pagi (08:00–17:00) & Shift Malam (20:00–05:00)

Menindaklanjuti penetapan jam operasional pabrik yang baru:
1. **Penetapan Waktu Resmi**:
   - **Shift Pagi**: Jam dinas `08:00 - 17:00 WIB` (durasi 9 jam). Jendela presensi dibuka pukul `07:00 WIB` dan ditutup pukul `18:00 WIB`.
   - **Shift Malam**: Jam dinas `20:00 - 05:00 WIB` (durasi 9 jam lintas hari / midnight crossing). Jendela presensi dibuka pukul `19:00 WIB` dan ditutup pukul `06:00 WIB` pagi hari berikutnya.
   - **Handover / Tukar Shift**: Tepat pukul `08:00 WIB` dan `20:00 WIB`.
2. **Sinkronisasi Seluruh Lapisan Sistem**:
   - **Database SQLite**: `shifts` table dan `system_settings` (`shift_configuration`) diselaraskan melalui `SystemSettingSeeder.php` dan `ShiftSeeder.php`.
   - **Frontend Settings Service (`systemSettings.js`)**: Dilengkapi skema auto-migration agar cache lokal browser pengguna (`localStorage`) lama otomatis dimutakhirkan ke `08:00 - 17:00` dan `20:00 - 05:00`.
   - **Tampilan Beranda, Jadwal, & Laporan**: Seluruh mock preview, badge indikator, dan rapor kehadiran diselaraskan secara konsisten.
   - **Modal Form Karyawan (`ModalFormKaryawan.jsx`)**: Tombol preset dan time picker default menggunakan `08:00 - 17:00` dan `20:00 - 05:00`.

---

## 21. Rencana Aksi Sesi Selanjutnya (Roadmap Backend Lanjutan)

Langkah strategis yang direkomendasikan untuk pengembangan tahap berikutnya:

1. **Backend Engine Roster Rotasi 2-Grup (`JadwalController`)**:
   - Generator otomatis jadwal dinas bergantian 12 jam (Senin, Rabu, Jumat Grup A; Selasa, Kamis, Sabtu Grup B).
   - Logika verifikasi dan persetujuan tukar shift antar rekan kerja.
2. **Pengembangan Modul Lembur & SPL ([`LemburOvertime.jsx`](resources/js/Pages/Admin/Lembur/LemburOvertime.jsx))**:
   - Membangun formulir permohonan Surat Perintah Lembur (SPL).
   - Mengkalkulasi tarif upah lembur otomatis berdasarkan formula Depnaker yang telah disetel di Pengaturan Sistem.
3. **Pengembangan Alur Cuti & Saldo Cuti ([`PengajuanCutiIzin.jsx`](resources/js/Pages/Admin/Cuti/PengajuanCutiIzin.jsx))**:
   - Menyediakan form permohonan cuti tahunan dengan validasi sisa kuota (12 hari).
   - Alur persetujuan bertingkat (Supervisor $\to$ HCGA Manager).
4. **Otomatisasi Penarikan Log Mesin (Background Sync)**:
   - Menyediakan scheduled command (`php artisan attendance:pull-fingerprint`) atau webhook listener jika mesin absensi site mendukung direct push via ADMS/Cloud.

---
*Laporan handover ini diperbarui secara komprehensif pada 21 November 2026 sebagai dokumentasi resmi arsitektur sistem HRIS.*
