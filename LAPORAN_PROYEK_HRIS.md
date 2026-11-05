# LAPORAN KOMPREHENSIF PROYEK HRIS (HANDOVER REPORT)

> **Proyek**: HCGA Human Resource Information System (HRIS)  
> **Repository GitHub**: [`git@github.com:work-rizarnaufal/hris.git`](https://github.com/work-rizarnaufal/hris) (Branch: `main`)  
> **Tech Stack**: Laravel 11.57, Inertia.js React v2.0, React 18, Tailwind CSS v3.4, Recharts, SheetJS (XLSX)  
> **Status**: Kode sumber bersih, teruji, dan telah berhasil di-push ke repositori Git.

> [!IMPORTANT]
> **INSTRUKSI WAJIB UNTUK AI AGENT / SESI BERIKUTNYA:**
> Setiap AI Agent atau pengembang yang melanjutkan proyek ini **WAJIB** secara otomatis membaca dan mematuhi standar berikut:
> 1. **Skill `antislop`** ([`.agents/skills/antislop/SKILL.md`](.agents/skills/antislop/SKILL.md)):
>    - Standar kode bersih & pragmatis.
>    - Hapus semua komentar banner/basa-basi/dekoratif (`// ===`, `/* --- */`).
>    - Tanpa abstraksi spekulatif (hindari generic wrapper/factory berlebih).
>    - UI purpose-built dengan densitas informasi tinggi, konsisten dengan token warna resmi HCGA.
>    - Komunikasi lugas, to-the-point, dan bebas dari klise AI.
> 2. **Skill `ponytail`** ([`.agents/skills/ponytail/SKILL.md`](.agents/skills/ponytail/SKILL.md)):
>    - Pola pikir *laziest senior developer* (YAGNI ladder).
>    - Jangan pernah menulis kode yang tidak mutlak diperlukan saat ini.
>    - Maksimalkan penggunaan ulang (*reuse*) utilitas, token `theme.js`, dan komponen UI yang sudah ada.
>    - Menghasilkan patch terkecil yang benar tanpa mengorbankan keamanan dan integritas data.
> 3. **Mandatory Atomic UI Consistency (Konsistensi Komponen Atomik)**:
>    - Seluruh halaman **WAJIB** menggunakan komponen atomik dari [`resources/js/components/ui/`](resources/js/components/ui/) (`Table`, `Card`, `Badge`, `Button`, `Modal`, `Toast`, `Input`, `PageHeader`, dll).
>    - **Dilarang keras** membuat alert, dialog, atau tabel floating ad-hoc inline di masing-masing file halaman yang merusak keseragaman UI.
>
> *(Aturan global agen ini juga tercatat di [`.agents/rules/antislop-ponytail.md`](.agents/rules/antislop-ponytail.md) dan [`AGENTS.md`](AGENTS.md)).*

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
│   └── Beranda                     (/beranda)       [AKTIF] -> Dashboard KPI, Metrik Kehadiran, Presensi Hari ini
│
├── 2. MANAJEMEN KARYAWAN (Core HR)
│   ├── Data Karyawan               (/karyawan)      [AKTIF] -> Master Data Induk, Profil Karyawan, Status PKWT/PKWTT
│   └── Organisasi & Jabatan        (/organisasi)    [TBA]   -> Departemen, Divisi, Level Jabatan, Garis Pelaporan
│
├── 3. WAKTU & KEHADIRAN (Time & Attendance)
│   ├── Catatan Kehadiran           (/kehadiran)     [AKTIF] -> Log Presensi Harian, Jam Masuk/Pulang, Terlambat
│   ├── Jadwal & Shift              (/jadwal)        [AKTIF] -> Roster Shift 2-Grup (A/B), Pola Rotasi, Kalender Shift
│   └── Lembur (Overtime)           (/lembur)        [TBA]   -> Surat Perintah Lembur (SPL), Akumulasi Jam Lembur
│
├── 4. CUTI & PERIZINAN (Leave Management)
│   ├── Pengajuan Cuti & Izin       (/cuti)          [TBA]   -> Permohonan Cuti Tahunan, Izin, Sakit, Alur Approval
│   └── Saldo & Kuota Cuti          (/saldo-cuti)    [TBA]   -> Plafon Cuti 12 Hari, Sisa Kuota, Potongan Cuti Bersama
│
├── 5. PENGGAJIAN (PAYROLL)
│   ├── Penggajian & Periode        (/payroll)       [TBA]   -> Kalkulasi Gaji, Tunjangan Kehadiran, Potongan BPJS/PPh 21
│   └── Slip Gaji                   (/slip-gaji)     [TBA]   -> Distribusi & Arsip Dokumen Slip Gaji Karyawan
│
├── 6. LAPORAN & ANALITIK (Reports & Analytics)
│   └── Laporan & Rekap             (/laporan)       [AKTIF] -> Rekapitulasi Performa, Evaluasi Kehadiran, Ekspor PDF/Excel
│
└── 7. PENGATURAN & AUDIT (Administration)
    ├── Pengaturan Sistem           (/pengaturan)    [AKTIF] -> Kalender Kerja Perusahaan, Libur Nasional, Parameter HR
    └── Log Audit                   (/audit)         [TBA]   -> Jejak Rekam Perubahan Data Sistem & Keamanan
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
- `Laporan/` $\to$ **LaporanRekap.jsx** *(Rekapitulasi Performa Bulanan & Evaluasi Kehadiran)*
- `Pengaturan/` $\to$ **PengaturanSistem.jsx** *(Kebijakan HR & Kalender Libur)*
- `Audit/` $\to$ **LogAudit.jsx** *(Rekam Jejak Log Audit)*

---

## 3. Komponen Atomik UI ([`resources/js/components/ui/`](resources/js/components/ui/))

1. **[`modal.jsx`](resources/js/components/ui/modal.jsx)**:
   - `<Modal>`: Kontainer dialog modern dengan *backdrop blur*, *ESC key close*, *outside-click close*, *body scroll lock*, dan varian ukuran (`sm`, `md`, `lg`, `xl`, `2xl`, `full`).
   - `<ModalHeader>`: Header modal dengan ikon branding, judul, deskripsi, dan tombol silang `X`.
   - `<ModalBody>`: Area isi formulir dengan *auto-scroll* tersembunyi (`no-scrollbar`).
   - `<ModalFooter>`: Area tombol aksi bawah (*Batal*, *Simpan*, *Impor*).
2. **[`table.jsx`](resources/js/components/ui/table.jsx)**:
   - `<Table>`, `<TableHeader>`, `<TableBody>`, `<TableFooter>`, `<TableRow>`, `<TableHead>`, `<TableCell>`, `<TableCaption>`, `<TableEmpty>`.
   - **Toolbar & Filter Atomik**: `<TableToolbar>`, `<TableSearch>`, `<TableFilterGroup>`, `<TableSelect>`.
   - Menghilangkan *CSS clash* lama, menyediakan tata letak dropdown filter yang konsisten, tinggi seragam (`h-9`), ikon panah kustom (`ChevronDown`), dan tata letak responsif bebas pembungkusan (*wrapping*) canggung pada layar mobile/tablet.
3. **[`toast.jsx`](resources/js/components/ui/toast.jsx)**:
   - Komponen notifikasi mengambang standar resmi HCGA (`success`, `warning`, `error`).
   - Seluruh halaman diwajibkan menggunakan `<Toast toast={alertInfo} onClose={() => setAlertInfo(null)} />` untuk konsistensi pengalaman pengguna.
4. **[`text.jsx`](resources/js/components/ui/text.jsx)**:
   - Komponen tipografi polimorfik: `h1`-`h4`, `lead`, `body`, `small`, `muted`, `caption`, `eyebrow`, `code`, `metric`.
5. **Komponen Atomik Lainnya**:
   - `button.jsx`, `badge.jsx`, `card.jsx`, `input.jsx`, `page-header.jsx`, `page-container.jsx`, `sidebar.jsx`, `topbar.jsx`, `footer.jsx`.

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
  - **Notifikasi**: Menggunakan atomik `<Toast />`.

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
  - **Notifikasi**: Menggunakan atomik `<Toast />`.

---

## 6. Halaman Laporan & Evaluasi Kehadiran Yang Sudah Berjalan Penuh (Dual-Tab Architecture)

Lokasi: [`resources/js/Pages/Admin/Laporan/LaporanRekap.jsx`](resources/js/Pages/Admin/Laporan/LaporanRekap.jsx)

Modul ini mengusung arsitektur **Tab Switcher Terpadu** yang memisahkan ranah makro (organisasi) dan mikro (individu) dalam satu halaman tanpa reload rute:

### A. Tab 1: Rekap Organisasi & Divisi (Makro)
- **Filter Periode Dinamis**: Pemilihan bulan berjalan (November 2026) dan arsip periode sebelumnya (Oktober, September).
- **4 Kartu Metrik KPI Evaluasi**:
  1. *Rata-rata Kehadiran Organisasi* (Target $\ge 95\%$).
  2. *Karyawan Hadir 100%* (Kedisiplinan penuh tanpa telat).
  3. *Total Keterlambatan* (Akumulasi frekuensi dan durasi menit).
  4. *Perhatian Disiplin / SP* (Early warning deteksi indisipliner).
- **Visual Analytics (Recharts)**: Grafik batang rata-rata skor kedisiplinan per divisi menggunakan palet warna resmi Deep Navy & Gold.
- **Panel Sorotan (Top Stars & Early Warning)**:
  - *Duta Keteladanan*: Karyawan dengan skor 100% tepat waktu tanpa telat untuk nominasi reward (klik langsung membuka rapor individu).
  - *Panggilan / Pembinaan Khusus*: Karyawan yang melewati batas toleransi keterlambatan atau tercatat memiliki alpa (klik langsung membuka dossier pembinaan).
- **Matriks Evaluasi Kedisiplinan Karyawan**:
  - Kolom: No, Karyawan (Nama & NIP), Divisi & Lokasi, Kehadiran (Hadir/Hari & %), Keterlambatan (Frekuensi & Menit), Cuti/Sakit, Alpa, Indikator Progress Skor Disiplin (0–100%), Status Evaluasi (*Sangat Baik*, *Disiplin Baik*, *Perlu Pembinaan*, *Peringatan / SP*).
  - Toolbar Atomik Terstandarisasi: Menggunakan `<TableToolbar>`, `<TableSearch>`, `<TableFilterGroup>`, dan `<TableSelect>`.
  - Tombol **"Buka Rapor"**: 1-klik beralih mulus ke Tab 2 dengan karyawan terkait langsung terpilih.
- **Ekspor Dokumen Excel (`.xlsx`)**: 1-klik unduh rekapitulasi evaluasi kehadiran seluruh karyawan via SheetJS.

### B. Tab 2: Rapor Evaluasi Individu / Dossier Personel (Mikro)
- **Toolbar Navigasi Cepat**:
  - Dropdown pemilih karyawan aktif (12 karyawan).
  - Tombol aksi cetak rapor (`window.print()`) dan ekspor rapor personal via SheetJS.
- **Dossier Header Card**:
  - Profil korporat lengkap (Avatar inisial, NIP, Jabatan, Divisi, Lokasi Pabrik/Kantor, Pola Shift, Tanggal Bergabung).
  - Skor Disiplin Rapor (0–100%) dan Badge Status Evaluasi resmi.
  - Kotak rekomendasi tindakan operasional HCGA.
- **8 Scorecard KPI Terperinci**:
  1. *Total Kehadiran*: Akumulasi hari hadir fisik dan rasio terhadap total hari kerja efektif.
  2. *Tepat Waktu*: Presensi tepat waktu tanpa insiden keterlambatan.
  3. *Terlambat*: Frekuensi insiden kedatangan melewati batas jadwal.
  4. *Menit Terlambat*: Akumulasi durasi menit keterlambatan dan rata-rata per kejadian.
  5. *Izin*: Hari izin pribadi resmi yang telah disetujui.
  6. *Sakit*: Ketidakhadiran karena kondisi medis dengan surat dokter.
  7. *Cuti*: Penggunaan hak cuti tahunan resmi karyawan.
  8. *Alpha*: Ketidakhadiran tanpa keterangan / mangkir indisipliner.
- **Kalender Visual Presensi 30 Hari (Heatmap Grid)**:
  - Kotak visual per tanggal (1 s/d 30 November) berkode warna interaktif: Hadir/Tepat Waktu (Hijau), Terlambat (Kuning), Izin (Biru/Sky), Sakit (Ungu), Cuti (Teal), Alpha (Merah/Rose), Libur (Abu-abu), lengkap dengan jam check-in dan tooltip catatan.
- **Grafik Tren Kedisiplinan 6 Bulan**:
  - `BarChart` Recharts menampilkan histori skor kedisiplinan 6 bulan ke belakang (Juni - November 2026).
- **Buku Pembinaan & Sanksi Disiplin (Disciplinary Log)**:
  - Daftar riwayat teguran lisan, bimbingan supervisor, atau SP-1 resmi.
  - Form interaktif untuk menambahkan catatan pembinaan baru (dilengkapi notifikasi atomik `<Toast />`).

---

## 7. Halaman Jadwal & Roster Shift Yang Sudah Berjalan Penuh

Lokasi: [`resources/js/Pages/Admin/Jadwal/JadwalShift.jsx`](resources/js/Pages/Admin/Jadwal/JadwalShift.jsx) dan [`resources/js/Pages/Admin/Jadwal/Partials/ModalFormTukarShift.jsx`](resources/js/Pages/Admin/Jadwal/Partials/ModalFormTukarShift.jsx)

Modul ini mengusung sistem manajemen shift komprehensif berbasis 3 tab terstandarisasi:

### A. 4 Kartu KPI Roster Jadwal
1. *Total Terjadwal*: 12 Karyawan (100% tercover roster operasional).
2. *Grup Operasional A*: 5 Personil (Masuk: Senin, Rabu, Jumat • Libur: Selasa, Kamis, Sabtu).
3. *Grup Operasional B*: 3 Personil (Masuk: Selasa, Kamis, Sabtu • Libur: Senin, Rabu, Jumat).
4. *Pengecualian & Status Grup*: Rekam tukar shift aktif dan pemantauan personil yang belum ditetapkan.

### B. Tab 1: Matriks Roster Mingguan (`roster`)
- **Aturan Permanen Operasional**: Sistem permanen 1 hari 2 shift (Pagi 07:00-15:00 & Sore 15:00-23:00) dengan pembagian tepat 2 grup (Grup A & Grup B).
- **Logika Rotasi Selang-Seling**: Jika Grup A masuk hari Senin, maka otomatis hari Selasa libur (OFF). Sebaliknya, Grup B libur hari Senin dan masuk hari Selasa. Minggu seluruh lini libur.
- **Pembersihan Opsi Model**: Seluruh dropdown/pilihan model aturan yang membingungkan telah dihapus menjadi aturan baku operasional.
- **Navigasi Siklus Minggu**: Pemilih periode per minggu (Minggu 1 s/d Minggu 4 November 2026) dengan tombol cepat `ChevronLeft` dan `ChevronRight`.
- **Toolbar Atomik Terstandarisasi**: Menggunakan `<TableToolbar>`, `<TableSearch>`, `<TableFilterGroup>`, dan `<TableSelect>` (filter Divisi & Grup A, B, Belum Ditetapkan, Non-Shift).
- **Tabel Matriks Roster 7 Hari Dinamis**: Menampilkan kode shift harian yang terhitung otomatis (`S1`, `S2`, `NON`, `SEC1`, `SEC2`, `OFF`, `UNSET`) sesuai aturan permanen.
- **Ekspor Dokumen Excel (.xlsx)**: 1-klik unduh matriks jadwal mingguan via SheetJS yang selaras dengan aturan permanen.

### C. Tab 2: Master Shift & Rotasi 2-Grup (`patterns`) — [`PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx)
- **Matriks Alur Kerja Bergantian 7 Hari (Senin s/d Minggu)**: Tabel visual komparasi yang memperlihatkan status dinas dan libur Grup A, Grup B, serta Staf Kantor:
  - *Senin*: Grup A **MASUK** (Pagi & Sore), Grup B **LIBUR (OFF)**.
  - *Selasa*: Grup A **LIBUR (OFF)** (otomatis paska dinas Senin), Grup B **MASUK** (Pagi & Sore).
  - *Rabu*: Grup A **MASUK**, Grup B **LIBUR (OFF)**.
  - *Kamis*: Grup A **LIBUR (OFF)**, Grup B **MASUK**.
  - *Jumat*: Grup A **MASUK**, Grup B **LIBUR (OFF)**.
  - *Sabtu*: Grup A **LIBUR (OFF)**, Grup B **MASUK**.
  - *Minggu*: Seluruh lini operasional & kantor **LIBUR (OFF)**.
- **Redesign Container Penugasan Personil (Kolom Dropdown Default)**:
  - Menggantikan antarmuka dual-board kaku dengan tabel terpadu berperforma tinggi di mana setiap baris personil memiliki **Kolom Dropdown Grup** dengan gaya netral/default (`bg-white border-slate-200 text-slate-700`) tanpa warna mencolok:
    1. `Grup A`
    2. `Grup B`
    3. `Belum Ditetapkan`
  - Pengubahan dropdown per baris langsung memperbarui jadwal personil, kartu KPI, dan matriks roster secara real-time.
  - **Toolbar Aksi Massal (Bulk Transfer)**: Checkbox multi-select untuk memindahkan banyak personil sekaligus ke grup target dalam 1 klik.
  - **Filter Cepat (Chips Tab)**: Filter instan `Semua`, `Grup A`, `Grup B`, dan `Belum Ditetapkan`.
  - **Tombol Tukar Giliran**: `Tukar Semua Giliran (Grup A ⇄ Grup B)` untuk membalik alur kerja serentak.
- **Pengecualian Staf Kantor (General Office)**:
  - 4 staf non-shift (HCGA, Payroll, Gudang Kantor, IT) ditampilkan dalam kartu terpisah dengan jadwal tetap Senin-Jumat (08:00 - 17:00).
- **Perubahan Jadwal Operasional Manual (Revisi 7 Kriteria Operasional)**:
  - Menggantikan katalog statis lama dengan formulir ad-hoc tingkat operasional grup yang terstruktur dengan 7 input spesifik:
    1. *Tanggal Mulai Shift* (input format `date`).
    2. *Grup Yang Bekerja* (pilihan: `Grup A`, `Grup B`, atau `Semua Grup (A & B)`).
    3. *Masuk Shift 1* (input format `time`, default `07:00`).
    4. *Pulang Shift 1* (input format `time`, default `15:00`).
    5. *Masuk Shift 2* (input format `time`, default `15:00`).
    6. *Pulang Shift 2* (input format `time`, default `23:00`).
    7. *Alasan Perubahan* (catatan keperluan operasional / maintenance).
  - Dilengkapi tabel riwayat penyesuaian manual aktif dengan aksi pembatalan/hapus, serta sinkronisasi otomatis ke kalender roster mingguan dan ekspor XLSX.
- **Pembersihan & Perapian Tampilan Tab Rotasi Grup**:
  - Banner informasi aturan permanen disederhanakan dengan aksen Deep Navy `#10273f` dan Gold `#c4a266`.
  - Matriks alur kerja 7-hari ditata rapi dengan status dinas/libur yang kontras dan bersih.
  - Tabel penetapan personil dilengkapi toolbar ringkas dan kolom dropdown default atomik tanpa warna berlebihan.
  - Kartu staf kantor (non-shift) diringkas sebagai catatan pelengkap.

### D. Tab 3: Log Pengecualian & Tukar Shift (`exceptions`)
- Tabel riwayat penugasan shift khusus dan pertukaran shift antar-rekan kerja yang telah disetujui HCGA.
- Fitur pembatalan / hapus pengecualian untuk mengembalikan jadwal ke pola normal.

### E. Modal Atomik Tukar Shift (`ModalFormTukarShift.jsx`)
- Menggunakan komponen atomik `<Modal>`, `<ModalHeader>`, `<ModalBody>`, `<ModalFooter>`.
- Mendukung 2 mode penugasan:
  1. *Tukar Shift Antar-Karyawan*: Pertukaran jadwal antar dua karyawan pada hari yang sama.
  2. *Pengecualian Shift Mandiri*: Penggantian jadwal satu karyawan khusus pada tanggal tertentu.
- Terintegrasi langsung dengan komponen atomik `<Toast />`.

---

## 8. Modul Pengaturan Sistem & Kebijakan HR (`PengaturanSistem.jsx`)

Lokasi: [`resources/js/Pages/Admin/Pengaturan/PengaturanSistem.jsx`](resources/js/Pages/Admin/Pengaturan/PengaturanSistem.jsx)

Halaman ini menyediakan pusat konfigurasi operasional, kebijakan kehadiran, dan administrasi database dengan 4 tab utama:

### A. 4 Kartu KPI Konfigurasi Utama
- **Toleransi Keterlambatan**: 15 Menit (*grace period* presensi aktif).
- **Hari Libur Nasional 2026**: 14 Hari (termasuk cuti bersama resmi pemerintah).
- **Geofence Presensi Mobile**: 3 Titik Lokasi Operasional Aktif (Pabrik Sidoarjo, Site Gresik, Head Office Surabaya).
- **Kesehatan & Status Cadangan**: Terkini (*auto-sync* database MariaDB).

### B. Tab 1: Kebijakan Presensi & Kerja (`attendance`)
- **Parameter Waktu Kehadiran**:
  - Batas toleransi keterlambatan masuk (menit).
  - Batas buka check-in awal (menit).
  - Toleransi kepulangan lebih awal (menit).
  - Kewajiban jam kerja minimal mingguan (40 jam kerja Depnaker).
- **Keamanan & Validasi Presensi Mobile**:
  - Validasi wajib swafoto / selfie wajah karyawan.
  - Deteksi Anti-Fake GPS / Mock Location otomatis untuk mencegah manipulasi titik koordinat.
- **Parameter Lembur & Cuti**:
  - Ambang batas minimum durasi lembur (60 menit).
  - Koefisien pengali lembur Depnaker (Jam ke-1: 1.5x, Jam ke-2+: 2.0x).
  - Hak kuota cuti tahunan standar (12 hari/tahun).
  - Batas kedaluwarsa sisa cuti tahunan (31 Maret tahun berikutnya).
  - Pengingat notifikasi jadwal shift otomatis.

### C. Tab 2: Kalender Libur & Cuti Bersama (`calendar`)
- **Daftar Hari Libur Resmi 2026**:
  - Dilengkapi fitur pencarian instan dan filter kategori (*Libur Nasional*, *Cuti Bersama*, *Libur Khusus Pabrik*).
  - Kolom status pemotongan cuti (*Tidak Potong Cuti* vs *Potong Cuti Tahunan*).
- **Modal Atomik Tambah & Edit Hari Libur**:
  - Menggunakan komponen atomik `<Modal>`, `<ModalHeader>`, `<ModalBody>`, `<ModalFooter>`.
  - Formulir input tanggal, nama acara/libur, kategori, dan aturan pemotongan kuota cuti tahunan.
  - Aksi edit dan hapus hari libur dengan umpan balik atomik `<Toast />`.

### D. Tab 3: Geofencing & Lokasi Pabrik (`location`)
- Konfigurasi titik radius meter presensi mobile per lokasi kerja:
  1. *Pabrik A (Sidoarjo)*: Radius 120m (-7.447812, 112.718319) - 28 Personil.
  2. *Site Operasional (Gresik)*: Radius 150m (-7.160105, 112.653421) - 12 Personil.
  3. *Kantor Utama (Surabaya)*: Radius 80m (-7.257472, 112.752090) - 8 Personil.
- Pengaturan radius dinamis dan tombol aktivasi/nonaktif per lokasi geofence.

### E. Tab 4: Profil Perusahaan & Pemeliharaan Data (`maintenance`)
- **Profil Legalitas Perusahaan**:
  - Nama resmi: *PT Manufaktur Nusantara Perkasa Tbk*.
  - NIB, NPWP Badan, Alamat Kantor Pusat, Telepon, Email Resmi, dan Nama PIC Administrator HCGA.
- **Pencadangan & Pemeliharaan Database**:
  - Tombol **Unduh Backup JSON/SQL**: Men-generate berkas snapshot seluruh konfigurasi sistem dan langsung diunduh ke perangkat lokal.
  - Tombol **Bersihkan Cache Presensi**: Optimalisasi sesi presensi dan memori redis.
  - Tombol **Reset Default**: Mengembalikan seluruh parameter ke standar regulasi baku.

### F. Sinkronisasi Lintas Modul & Standarisasi Tanggal (`DD/MM/YYYY`)
- Mengimplementasikan layanan penyimpanan konfigurasi terpusat berbasis `localStorage` dan event listener reaktif (`hris:settings-updated`) pada [`resources/js/services/systemSettings.js`](resources/js/services/systemSettings.js).
- **Standarisasi Format Tanggal `dd/mm/yyyy`**:
  - Tabel Kalender Libur & Cuti Bersama ([`PengaturanSistem.jsx`](resources/js/Pages/Admin/Pengaturan/PengaturanSistem.jsx)): format tanggal diubah menjadi `dd/mm/yyyy` (misal: `01/01/2026`, `10/11/2026`).
  - Matriks Roster Mingguan ([`JadwalShift.jsx`](resources/js/Pages/Admin/Jadwal/JadwalShift.jsx)): header kolom kalender harian diubah dari `DD/MM` menjadi `dd/mm/yyyy` (misal: `02/11/2026`, `10/11/2026`).
  - Tabel Log Pengecualian & Tukar Shift: kolom Tanggal Efektif menggunakan format `dd/mm/yyyy` (misal: `04/11/2026`).
  - Matriks Alur 7 Hari & Perubahan Jadwal Operasional Manual ([`PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx)): tanggal ditampilkan konsisten dalam format `dd/mm/yyyy`.
- **Sinkronisasi Otomatis ke Modul Jadwal & Roster (`JadwalShift.jsx`)**:
  - Setiap penambahan, pembaruan, atau penghapusan hari libur (nasional/khusus) di Pengaturan Sistem langsung tersinkron ke kalender mingguan.
  - Tanggal libur resmi otomatis ditandai dengan badge `LIBUR (Hari Libur Resmi)` berwarna merah/rose, dan personil otomatis libur tanpa perlu konfigurasi manual per orang.
  - Jika ada kebutuhan darurat, *Perubahan Jadwal Operasional Manual* tetap dapat menugaskan personil lembur khusus di hari libur tersebut dengan status prioritas tinggi.

---

## 9. Hasil Audit Rekayasa (Anti-Slop & Ponytail Cleanup)

Pembersihan menyeluruh telah dieksekusi dengan hasil:
1. **Pembersihan Berkas Mati (`resources/js/lib/`)**:
   - Dihapus 5 berkas yang tidak pernah diimpor: `employee-import.js`, `export.js`, `model.js`, `public-summary.js`, `rotation.js`.
   - Dipertahankan satu berkas inti yang aktif digunakan: [`resources/js/lib/utils.js`](resources/js/lib/utils.js) (`cn`).
2. **Pembersihan Dependensi NPM (YAGNI)**:
   - Dihapus 3 paket tak terpakai: `radix-ui`, `jspdf`, `jspdf-autotable`. Total 94 sub-paket dibersihkan dari `node_modules`.
3. **Pembersihan Komentar Banner**:
   - File [`routes/web.php`](routes/web.php) dibersihkan dari banner separator dekoratif `// ==========================`.
4. **Standarisasi Notifikasi Atomik**:
   - Komponen [`toast.jsx`](resources/js/components/ui/toast.jsx) diperluas untuk mendukung varian `warning` selain `success` dan `error`.
   - Kode alert inline custom di [`DataKaryawan.jsx`](resources/js/Pages/Admin/Karyawan/DataKaryawan.jsx) dan [`CatatanKehadiran.jsx`](resources/js/Pages/Admin/Kehadiran/CatatanKehadiran.jsx) direfaktor menggunakan atomik `<Toast />`.

---

## 9. Rencana Aksi untuk Sesi Selanjutnya (Next Steps)

1. **Modul Lembur & Surat Perintah Lembur (`Admin/Lembur/LemburOvertime.jsx`)**:
   - Formulir pengajuan dan persetujuan lembur terintegrasi dengan kehadiran.
2. **Modul Pengajuan Cuti & Izin (`Admin/Cuti/PengajuanCutiIzin.jsx`)**:
   - Alur permohonan dan persetujuan cuti karyawan.
3. **Persistensi Database (Backend Migrations)**:
   - Menghubungkan data dummy React ke tabel database riil (`employees`, `attendances`, `shifts`, `leaves`).
