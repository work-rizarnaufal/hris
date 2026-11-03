# LAPORAN KOMPREHENSIF PROYEK HRIS (HANDOVER REPORT)

> **Proyek**: HCGA Human Resource Information System (HRIS)  
> **Repository GitHub**: [`git@github.com:work-rizarnaufal/hris.git`](https://github.com/work-rizarnaufal/hris) (Branch: `main`)  
> **Tech Stack**: Laravel 11.57, Inertia.js React v2.0, React 18, Tailwind CSS v3.4, Recharts, SheetJS (XLSX)  
> **Status**: Kode sumber bersih, teruji, dan telah berhasil di-push ke repositori Git.

---

## 1. Arsitektur Inti & Pencapaian Proyek

### A. Aturan Persistent Layout (Anti-Flicker)
- **Implementasi**: Pada [`resources/js/app.jsx`](resources/js/app.jsx), layout admin dibungkus menggunakan referensi fungsi stabil di tingkat modul (`const renderAdminLayout = (page) => <LayoutUtama>{page}</LayoutUtama>`).
- **Hasil**: Komponen `<Sidebar>` dan `<Topbar>` tetap hidup (*persistent*) di Virtual DOM saat navigasi antar-halaman. **Sidebar tidak berkedip / reload sama sekali**, scroll posisi terjaga, dan hanya konten `{children}` yang diperbarui.
- **Transisi Halus**: Progress bar transisi halaman disesuaikan ke warna aksen emas resmi `#c4a266`.

### B. Penguncian Identitas Warna (Locked Color Tokens)
Identitas warna resmi terkunci secara konsisten di 3 pilar:
1. **JavaScript**: [`resources/js/config/theme.js`](resources/js/config/theme.js)
2. **Tailwind CSS**: [`tailwind.config.js`](tailwind.config.js)
3. **CSS Variables**: [`resources/css/app.css`](resources/css/app.css)

| Token Warna | Nilai Hex | Fungsi Operasional |
| :--- | :--- | :--- |
| **Primary Navy** | `#10273f` | Warna dominan korporat, sidebar, tombol primer |
| **Gold Accent** | `#c4a266` | Aksen kehormatan, indikator fokus, highlight aktif |
| **Soft Gold** | `#f7f2e8` | Latar belakang aksen lembut, badge grup |
| **Dark Ink** | `#1d3046` | Tipografi utama, teks judul |
| **Status Hadir** | `#398872` (bg `#eef7f1`) | Presensi tepat waktu & status aktif |
| **Status Terlambat** | `#ac8848` (bg `#fcf6e9`) | Keterlambatan presensi kerja |
| **Status Izin / Cuti** | `#698eb0` / `#489490` | Legalitas ketidakhadiran resmi |
| **Status Alpha** | `#b36a74` (bg `#fbf0f2`) | Mangkir / Karyawan non-aktif |

### C. Desain Proporsional Layar Lebar & Hidden Scrollbar
- **Lebar Kontainer**: Ditingkatkan ke `max-w-[1600px]` dengan padding responsif `px-4 sm:px-6 lg:px-8 xl:px-10` pada `PageContainer`, `Topbar`, dan `Footer`.
- **Hidden Scrollbar**: Bilah gulir sidebar dan tabel disembunyikan menggunakan utility `.no-scrollbar` dan vendor prefix cross-browser tanpa mematikan scroll mousewheel / touch.

---

## 2. Peta Menu Standar HRIS & Struktur Folder

Navigasi sidebar telah dirombak mengikuti 7 domain standar HRIS enterprise:

```
├── 1. UTAMA
│   └── Beranda                     (/beranda)       -> Dashboard KPI, Metrik Kehadiran, Presensi Hari ini
│
├── 2. MANAJEMEN KARYAWAN (Core HR)
│   ├── Data Karyawan               (/karyawan)      -> Master Data Induk, Profil Karyawan, Status PKWT/PKWTT
│   └── Organisasi & Jabatan        (/organisasi)    -> Departemen, Divisi, Level Jabatan, Garis Pelaporan
│
├── 3. WAKTU & KEHADIRAN (Time & Attendance)
│   ├── Catatan Kehadiran           (/kehadiran)     -> Log Presensi Harian, Jam Masuk/Pulang, Terlambat
│   ├── Jadwal & Shift              (/jadwal)        -> Roster Shift 2-Grup (A/B), Pola Rotasi, Kalender Shift
│   └── Lembur (Overtime)           (/lembur)        -> Surat Perintah Lembur (SPL), Akumulasi Jam Lembur
│
├── 4. CUTI & PERIZINAN (Leave Management)
│   ├── Pengajuan Cuti & Izin       (/cuti)          -> Permohonan Cuti Tahunan, Izin, Sakit, Alur Approval
│   └── Saldo & Kuota Cuti          (/saldo-cuti)    -> Plafon Cuti 12 Hari, Sisa Kuota, Potongan Cuti Bersama
│
├── 5. PENGGAJIAN (PAYROLL)
│   ├── Penggajian & Periode        (/payroll)       -> Kalkulasi Gaji, Tunjangan Kehadiran, Potongan BPJS/PPh 21
│   └── Slip Gaji                   (/slip-gaji)     -> Distribusi & Arsip Dokumen Slip Gaji Karyawan
│
├── 6. LAPORAN & ANALITIK (Reports & Analytics)
│   └── Laporan & Rekap             (/laporan)       -> Rekapitulasi Performa, Turnover, Ekspor PDF/Excel
│
└── 7. PENGATURAN & AUDIT (Administration)
    ├── Pengaturan Sistem           (/pengaturan)    -> Kalender Kerja Perusahaan, Libur Nasional, Parameter HR
    └── Log Audit                   (/audit)         -> Jejak Rekam Perubahan Data Sistem & Keamanan
```

### Pemetaan Direktori di `resources/js/Pages/Admin/`:
- `Beranda/` $\to$ **Beranda.jsx** *(Dashboard KPI & Grafik Recharts)*
- `Karyawan/` $\to$ **DataKaryawan.jsx** *(Direktori Data Karyawan, Form Modal, Impor/Ekspor)*
- `Organisasi/` $\to$ **OrganisasiJabatan.jsx** *(Departemen & Hirarki Jabatan)*
- `Kehadiran/` $\to$ **CatatanKehadiran.jsx** *(Log Presensi Harian)*
- `Jadwal/` $\to$ **JadwalShift.jsx** *(Roster Rotasi Shift 2-Grup A/B)*
- `Lembur/` $\to$ **LemburOvertime.jsx** *(Pencatatan Surat Perintah Lembur / SPL)*
- `Cuti/` $\to$ **PengajuanCutiIzin.jsx** *(Form Pengajuan Cuti & Izin)*
- `SaldoCuti/` $\to$ **SaldoKuotaCuti.jsx** *(Monitoring Plafon 12 Hari Cuti)*
- `Payroll/` $\to$ **PenggajianPeriode.jsx** *(Kalkulasi Gaji & Tunjangan)*
- `SlipGaji/` $\to$ **SlipGaji.jsx** *(Arsip & Download Slip Gaji)*
- `Laporan/` $\to$ **LaporanRekap.jsx** *(Rekapitulasi Performa Bulanan)*
- `Pengaturan/` $\to$ **PengaturanSistem.jsx** *(Kebijakan HR & Kalender Libur)*
- `Audit/` $\to$ **LogAudit.jsx** *(Rekam Jejak Log Audit)*

---

## 3. Komponen Atomik UI ([`resources/js/components/ui/`](resources/js/components/ui/))

1. **[`modal.jsx`](resources/js/components/ui/modal.jsx) (BARU)**:
   - `<Modal>`: Kontainer dialog modern dengan *backdrop blur*, *ESC key close*, *outside-click close*, *body scroll lock*, dan varian ukuran (`sm`, `md`, `lg`, `xl`, `2xl`, `full`).
   - `<ModalHeader>`: Header modal dengan ikon branding, judul, deskripsi, dan tombol silang `X`.
   - `<ModalBody>`: Area isi formulir dengan *auto-scroll* tersembunyi (`no-scrollbar`).
   - `<ModalFooter>`: Area tombol aksi bawah (*Batal*, *Simpan*, *Impor*).
2. **[`table.jsx`](resources/js/components/ui/table.jsx)**:
   - `<Table>`, `<TableHeader>`, `<TableBody>`, `<TableFooter>`, `<TableRow>`, `<TableHead>`, `<TableCell>`, `<TableCaption>`, `<TableEmpty>`.
   - **Toolbar & Filter Atomik (BARU)**: `<TableToolbar>`, `<TableSearch>`, `<TableFilterGroup>`, `<TableSelect>`.
   - Menghilangkan *CSS clash* lama (`th { font-size: 8px; }`), menyediakan tata letak dropdown filter yang konsisten, tinggi seragam (`h-9`), ikon panah kustom (`ChevronDown`), dan tata letak responsif bebas pembungkusan (*wrapping*) canggung pada layar mobile/tablet.
3. **[`text.jsx`](resources/js/components/ui/text.jsx)**:
   - Komponen tipografi polimorfik: `h1`-`h4`, `lead`, `body`, `small`, `muted`, `caption`, `eyebrow`, `code`, `metric`.
4. **Komponen Atomik Lainnya**:
   - `button.jsx`, `badge.jsx`, `card.jsx`, `input.jsx`, `page-header.jsx`, `page-container.jsx`, `sidebar.jsx`, `topbar.jsx`, `footer.jsx`, `toast.jsx`.

---

## 4. Halaman Data Karyawan Yang Sudah Berjalan Penuh

Lokasi: [`resources/js/Pages/Admin/Karyawan/DataKaryawan.jsx`](resources/js/Pages/Admin/Karyawan/DataKaryawan.jsx)
- **10 Kolom Tabel**: No, Nama Karyawan, Divisi, Lokasi Kerja, Grup, Kategori Jadwal, Jam Masuk, Jam Pulang, Status, Aksi.
- **Head Table Rapi & Simetris**: Kolom data badge/jam/status telah terpusat (*center-aligned*) simetris dengan kolom header.
- **Fitur Aksi**:
  - **Tambah Karyawan**: Menggunakan atomik `ModalFormKaryawan.jsx` dengan preset shift cepat.
  - **Ubah & Hapus Karyawan**: Edit inline data dan konfirmasi hapus langsung.
  - **Impor Excel (`ModalImporKaryawan.jsx`)**: Menggunakan atomik modal, unggah `.xlsx`/`.csv`, unduh template resmi, dan live preview.
  - **Ekspor Excel**: 1-klik unduh `.xlsx` terfilter via SheetJS.
  - **Live Filter**: Pencarian teks nama/NIP + dropdown filter Divisi, Grup, dan Status.

---

## 5. Halaman Catatan Kehadiran Yang Sudah Berjalan Penuh

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

---

## 6. Rencana Aksi untuk Sesi Selanjutnya (Next Steps)

1. **Modul Roster Jadwal & Grup (`Admin/Jadwal/JadwalShift.jsx`)**:
   - Visualisasi kalender rotasi shift 2-grup (Grup A & Grup B).
   - Pengaturan pengecualian jadwal / tukar shift antar-karyawan via modal atomik.
2. **Persistensi Database (Backend Migrations)**:
   - Menghubungkan data dummy React ke tabel database riil (`employees`, `attendances`, `shifts`, `leaves`).

