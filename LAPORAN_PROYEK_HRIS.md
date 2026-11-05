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

---

## 10. Fungsionalisasi Card Profile & Menu Modul Topbar

Implementasi fungsionalitas interaktif penuh pada komponen [`resources/js/components/ui/topbar.jsx`](resources/js/components/ui/topbar.jsx) dan konfigurasi navigasi terpusat:

### A. Fungsionalisasi Card Profile Pengguna
- **Komponen Interaktif**: Mengubah elemen statis avatar/nama menjadi tombol trigger interaktif dengan transisi hover, rotasi chevron status, dan penanganan klik di luar area (*click-outside listener*) serta tombol `Escape`.
- **Dropdown Popover Profil**:
  - Ringkasan identitas akun: inisial avatar (Navy `#10273f` & Gold `#c4a266`), nama administrator (`actorName`), peran (*Administrator HCGA*), dan indikator *Online / Sesi Aktif*.
  - Opsi navigasi cepat:
    1. **Menu "MODUL" (Accordion / Group)**: Wadah menu modul site operasional (*default tertutup*) yang membawahi 2 modul:
       - **SITE A CIMALAKA**: Area kerja operasional Cimalaka (menu navigasi site).
       - **SITE B PASEH**: Area kerja operasional Paseh (menu navigasi site).
    2. **Profil Administrator**: Membuka modal atomik rincian profil pengguna.
    3. **Pengaturan Sistem**: Navigasi langsung ke rute `/pengaturan`.
    4. **Keluar Sesi**: Aksi keluar dengan konfirmasi dialog aman.
- **Integrasi Komponen Atomik `<Modal>`**:
  - **Modal Profil**: Menampilkan ringkasan komprehensif identitas akun, unit kerja (`siteConfig.defaultCompany`), tingkat kewenangan (*Super Admin Akses Penuh*), zona waktu (WIB · UTC+7), dan versi sistem.
  - **Modal Konfirmasi Keluar**: Dialog konfirmasi peringatan aman sebelum mengakhiri sesi.

### B. Penambahan Menu "Modul" di Topbar
- **Trigger Menu Modul**: Tombol navigasi "Modul" dengan ikon `LayoutGrid` pada area bilah atas di samping breadcrumb.
- **Katalog Popover Modul HRIS**:
  - Menampilkan 6 modul inti yang sudah aktif (`CORE_MODULES`) dalam tata letak grid responsif dengan penanda status aktif (*live dot*), ikon keemasan, dan rincian deskripsi singkat:
    1. *Beranda* (`/beranda`)
    2. *Data Karyawan* (`/karyawan`)
    3. *Catatan Kehadiran* (`/kehadiran`)
    4. *Jadwal & Shift* (`/jadwal`)
    5. *Laporan & Rekap* (`/laporan`)
    6. *Pengaturan Sistem* (`/pengaturan`)
  - Menampilkan daftar pill modul mendatang (`UPCOMING_MODULES`) dengan badge `TBA` (*To Be Announced*).
- **Sentralisasi Navigasi**:
  - Konfigurasi `IMPLEMENTED_ROUTES`, `CORE_MODULES`, dan `UPCOMING_MODULES` dipusatkan di [`resources/js/config/navigation.js`](resources/js/config/navigation.js) dan digunakan bersama oleh [`topbar.jsx`](resources/js/components/ui/topbar.jsx) dan [`sidebar.jsx`](resources/js/components/ui/sidebar.jsx) tanpa duplikasi kode (prinsip *Ponytail & Anti-Slop*).

### C. Implementasi Global Site Switcher (Multi-Site Context)
- **Arsitektur Best-Practice Enterprise**: Menerapkan konsep *Single Navigation Structure with Global Site Context* (mengikuti standar SAP / Workday / Odoo Multi-Company) alih-alih menduplikasi menu.
- **Komponen Switcher di Topbar & Card Profil**:
  - Tombol indikator `[ 📍 SITE A CIMALAKA ▾ ]` di Topbar sebelah breadcrumb dengan popover seleksi:
    1. *SITE A CIMALAKA* (Area Operasional Cimalaka)
    2. *SITE B PASEH* (Area Operasional Paseh)
    3. *Semua Site (Konsolidasi)* (Tinjauan gabungan seluruh area)
  - Dropdown Card Profil dilengkapi sub-menu "MODUL" (tertutup secara default) yang berisi switcher site langsung ke *SITE A CIMALAKA* dan *SITE B PASEH*.
- **Layanan Sinkronisasi Reaktif**:
  - State site aktif disimpan di `localStorage` melalui [`systemSettings.js`](resources/js/services/systemSettings.js) (`getActiveSiteId`, `setActiveSiteId`, `AVAILABLE_SITES`, hook `useActiveSite()`, dan helper `matchesActiveSite()`).
  - Pemilihan site memicu event reaktif `hris:site-changed` yang secara instan menyinkronkan Topbar, Card Profil, Sidebar Workspace Label, dan seluruh data halaman tanpa reload.

### D. Sinkronisasi Data Lintas Modul Sesuai Site Terpilih (Data Synchronization)
Seluruh 15 halaman dan modul sistem telah diverifikasi dan disinkronkan secara menyeluruh dengan context site aktif (`useActiveSite`):
1. **Modul Beranda (`Admin/Beranda/Beranda.jsx`)**:
   - KPI Cards (Total Personel Aktif, Tingkat Kehadiran %, Terlambat Masuk, dan Tidak Hadir/Legalitas) menghitung statistik secara dinamis berdasarkan site aktif.
   - Tabel Aktivitas Presensi Hari Ini dan keterangan lokasi personil difilter otomatis sesuai site yang dipilih.
2. **Modul Data Karyawan (`Admin/Karyawan/DataKaryawan.jsx`)**:
   - Master data 12 karyawan dipetakan: Personil ID 1–6 di `SITE A CIMALAKA`, Personil ID 7–12 di `SITE B PASEH`.
   - Scorecard KPI, filter divisi, ekspor data, dan modal tambah karyawan secara otomatis mengunci default lokasi sesuai site yang aktif.
3. **Modul Catatan Kehadiran (`Admin/Kehadiran/CatatanKehadiran.jsx`)**:
   - Log presensi harian (`currentDayAttendances`), perhitungan status (Hadir Tepat Waktu, Terlambat, Izin/Cuti, Alpha), dan deviasi menit disaring menurut site aktif (`matchesActiveSite`).
   - Perbaikan form modal edit (`ModalFormPresensi.jsx`): Normalisasi rendering ikon `ModalHeader`, inisialisasi jam presensi yang aman, dan persistensi kolom lokasi site saat menyimpan data.
   - Modal Catat Presensi dan Presensi Massal hanya menampilkan daftar personil yang beroperasi di site terpilih (`siteEmployees`).
   - Kolom Divisi menyertakan badge lokasi presensi bersangkutan.
4. **Modul Jadwal & Shift (`Admin/Jadwal/JadwalShift.jsx`)**:
   - Matriks kalender mingguan (Grup A & B) memfilter daftar baris personil sesuai site aktif.
   - Scorecard KPI roster (Total Terjadwal, Grup A, Grup B, Pengecualian) menyesuaikan jumlah personil site aktif.
   - Modal Form Tukar Shift dan Panel Rotasi Grup hanya memilih dan merotasi personil dalam lingkup site yang sama.
5. **Modul Laporan & Rekap (`Admin/Laporan/LaporanRekap.jsx` & `RaporIndividu.jsx`)**:
   - Metrik evaluasi kedisiplinan (Tingkat Kehadiran %, Total Keterlambatan, Total Alpa, Nominasi Best Attendance) diskalakan per site atau konsolidasi seluruh site.
   - Grafik performa per divisi, tabel skor evaluasi karyawan, dan pemilih personil pada Rapor Individu sepenuhnya tersinkronisasi.
6. **Modul Pengaturan Sistem (`Admin/Pengaturan/PengaturanSistem.jsx` & `services/systemSettings.js`)**:
   - Header terhubung ke site aktif dan data geofence otomatis bermigrasi ke `SITE A CIMALAKA` (Sumedang) dan `SITE B PASEH` (Sumedang).
7. **8 Modul Upcoming & Portal Terbuka**:
   - `Admin/Lembur/LemburOvertime.jsx`
   - `Admin/Cuti/PengajuanCutiIzin.jsx`
   - `Admin/SaldoCuti/SaldoKuotaCuti.jsx`
   - `Admin/Payroll/PenggajianPeriode.jsx`
   - `Admin/SlipGaji/SlipGaji.jsx`
   - `Admin/Organisasi/OrganisasiJabatan.jsx`
   - `Admin/Audit/LogAudit.jsx`
   - `User/RingkasanPublik.jsx`
   Semua modul ini menampilkan header kontekstual dan indikator site aktif (`Site Operasional: activeSite.name`).

### E. Penerapan Fitur Hidden Scrollbar Universal (Cross-Browser)
- **Desain Bersih & Elegan**: Mengeliminasi scrollbar tebal yang mengganggu estetika antarmuka enterprise tanpa mengurangi atau merusak kemampuan scroll alami pengguna (tetap mendukung trackpad, mouse wheel, gesture drag, touch, dan tombol panah).
- **Cakupan Pengaturan Global di [`resources/css/app.css`](resources/css/app.css)**:
  - `html, body`: Viewport utama dokumen memiliki scrollbar tersembunyi.
  - `.table-scroll`: Kontainer tabel atomik (`<Table>`) dapat digeser horizontal secara mulus tanpa scrollbar abu-abu tebal.
  - `.sidebar`: Bilah menu navigasi samping tetap dapat di-scroll tanpa menampilkan scrollbar.
  - Utilitas khusus: `.no-scrollbar`, `.scrollbar-none`, `.hide-scrollbar`, dan atribut `[data-hidden-scrollbar]`.
- **Kompatibilitas Lintas Browser**:
  - `-ms-overflow-style: none !important` (Internet Explorer & Edge legacy).
  - `scrollbar-width: none !important` (Firefox).
  - `::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }` (Chrome, Safari, Edge Chromium, Opera).

### F. Penataan Ulang Modul Data Karyawan Menjadi Master Database Personil (Core HR)
- **Pemisahan Domain Disiplin (*Domain Separation*)**:
  - Menghapus seluruh elemen operasional jadwal kerja, kategori shift (`scheduleCategory`), roster grup (`group`), serta jam masuk/pulang presensi (`checkInTime`, `checkOutTime`) dari halaman Data Karyawan. Seluruh urusan jadwal dan presensi kini terkonsentrasi secara eksklusif di modul [`JadwalShift.jsx`](resources/js/Pages/Admin/Jadwal/JadwalShift.jsx) dan [`CatatanKehadiran.jsx`](resources/js/Pages/Admin/Kehadiran/CatatanKehadiran.jsx).
  - Memfokuskan [`DataKaryawan.jsx`](resources/js/Pages/Admin/Karyawan/DataKaryawan.jsx) murni sebagai **Database Master Karyawan** (Core HR Personnel Records).
- **Struktur Kolom & Data Model Personil Baru**:
  1. `NIP`: Nomor Induk Pegawai unik karyawan.
  2. `Nama Karyawan`: Lengkap dengan inisial avatar profil.
  3. `Jabatan / Posisi Kerja`: Posisi fungsional pekerjaan.
  4. `Divisi`: Departemen penempatan (Operasional, HCGA, Logistik, Security, dll).
  5. `Lokasi Kerja`: Site penempatan (`SITE A CIMALAKA` / `SITE B PASEH`) terhubung ke switcher site global.
  6. `Status Hubungan Kerja`: Kategori kepegawaian (`Tetap`, `Kontrak (PKWT)`, `Magang`).
  7. `Kontak`: Alamat email korporat dan nomor telepon / WhatsApp dengan ikon.
  8. `Tanggal Bergabung`: Tanggal mulai aktif bekerja (*Join Date*).
  9. `Status Keaktifan`: `Aktif`, `Cuti`, `Non-Aktif`.
- **Refaktor Komponen Pendukung**:
  - **KPI Scorecards Personalia**: Ringkasan komposisi tenaga kerja (Total Karyawan, Karyawan Tetap, PKWT & Magang, Status Aktif).
  - **Toolbar Filter**: Pencarian menyeluruh (Nama, NIP, Jabatan, Email, No. HP), filter divisi, filter jenis hubungan kerja, dan filter status keaktifan.
  - **Modal Tambah/Ubah Karyawan (`ModalFormKaryawan.jsx`)**: Formulir lengkap profil karyawan tanpa kolom shift/jam hadir, dengan penanganan ikon aman.
  - **Modal Impor Excel (`ModalImporKaryawan.jsx`)**: Template unduhan dan pemetaan berkas spreadsheet disesuaikan ke skema database karyawan baru.
  - **Ekspor Excel**: File unduhan `.xlsx` menghasilkan lembar kerja database kepegawaian yang rapi dan terstandarisasi.

### G. Optimasi Tab Rotasi & Grup (Pembersihan Card Hero & Integrasi Aksi)
- **Pembersihan Elemen Dekoratif (*Anti-Slop*)**: Menghapus card hero/banner Navy gelap berukuran besar di bagian atas tab **Rotasi Grup & Jadwal Manual** ([`PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx)) guna menghemat ruang vertikal dan meningkatkan densitas informasi.
- **Relokasi Tombol Aksi**: Tombol aksi `Tukar Siklus Grup` (`onSwapAll`) dipindahkan secara rapi ke header tabel **Matriks Alur Kerja Bergantian (Senin s/d Minggu)** bersebelahan dengan ringkasan badge personil Grup A & B, menjaga fungsionalitas tetap utuh dan lebih ergonomis.

### H. Pemisahan Kolom Divisi dan Lokasi/Penugasan pada Modul Jadwal & Shift
- **Tabel Matriks Roster Mingguan ([`JadwalShift.jsx`](resources/js/Pages/Admin/Jadwal/JadwalShift.jsx))**:
  - Kolom sebelumnya `Divisi & Grup` dipecah menjadi 2 kolom terpisah:
    1. **Divisi**: Menampilkan nama divisi kerja personil secara eksklusif (`emp.division`).
    2. **Lokasi / Penugasan**: Menampilkan ikon dan nama lokasi kerja penempatan (`emp.location`) beserta badge roster grup (`emp.group`).
  - Menyesuaikan `colSpan` baris kosong (`TableEmpty`) menjadi 12 kolom dan menambahkan kolom lokasi kerja ke lembar ekspor Excel (`handleExportRoster`).
- **Tabel Daftar Penugasan Roster Grup ([`PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx))**:
  - Kolom sebelumnya `Divisi & Penugasan` dipecah menjadi 2 kolom terpisah:
    1. **Divisi**: Berisi nama divisi departemen kerja.
    2. **Lokasi / Penugasan**: Berisi badge penempatan kerja personil (`SITE A CIMALAKA` / `SITE B PASEH`) dengan ikon `MapPin`.
  - Menyesuaikan `colSpan` baris kosong menjadi 8 kolom.

### I. Optimasi Komponen Notifikasi Toast (Auto-Dismiss Timer & Responsivitas Mobile)
- **Timer Penutup Otomatis Terintegrasi (*Auto-Dismiss*)**:
  - Memperbaiki komponen atomik [`toast.jsx`](resources/js/components/ui/toast.jsx) dengan menyematkan timer `useEffect` internal secara mandiri (default: 4.000 ms).
  - Mengeliminasi keharusan setiap halaman mengatur `setTimeout` manual. Ketika notifikasi muncul, toast akan otomatis memanggil `onClose` dan tertutup sendiri dengan aman tanpa kebocoran memori (*cleanup timer on unmount/re-render*).
  - Mendukung kustomisasi durasi melalui properti `duration` atau objek `toast.duration`.
- **Peningkatan Responsivitas Mobile ([`app.css`](resources/css/app.css))**:
  - Pada layar kecil (`@media(max-width: 640px)`), posisi `.toast` beralih dari posisi pojok kanan bawah desktop (`right: 25px`) menjadi lebar penuh terpusat (`left: 16px; right: 16px; bottom: 16px; width: auto; max-width: calc(100vw - 32px)`).
  - Teks pesan panjang secara otomatis melipat baris (*word-break & line-wrap*) tanpa mendorong tombol tutup `X` atau ikon notifikasi ke luar batas layar HP.

### J. Penyelarasan Tipografi & Kerapihan Teks Data Table Jadwal & Shift
- **Standarisasi Header Tabel ([`JadwalShift.jsx`](resources/js/Pages/Admin/Jadwal/JadwalShift.jsx) & [`PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx))**:
  - Seluruh header kolom (`TableHead`) distandarisasikan dengan huruf kapital proporsional, bobot cetak tebal, dan pelacakan spasi konsisten (`text-[11px] font-bold text-slate-700 tracking-wider`).
  - Kolom kalender harian (7 hari kerja) dirapikan dengan pembagian tanggal monospaced yang simetris dan kontras warna yang nyaman dibaca.
- **Penyelarasan Kolom Personil (Atomic Person Cell)**:
  - Mengintegrasikan avatar inisial personil (`avatar small font-bold text-slate-700 bg-slate-100 border border-slate-200`) berdampingan dengan nama tebal (`text-navy font-semibold text-xs`) dan sub-caption NIP/Role (`text-[11px] text-slate-500`), menyelaraskan estetika visual dengan modul Data Karyawan dan Catatan Kehadiran.
- **Format Badge Shift & Jam Kerja**:
  - Badge kode shift (`renderShiftCellBadge`) menggunakan font monospaced tebal (`text-[10px] font-mono font-bold tracking-tight px-2 py-1`) sehingga kode shift (`S1`, `S2`, `OFF`, `LIBUR`) rata sempurna di setiap sel kalender.
  - Total jam kerja diformat menggunakan pill badge abu-abu terstandarisasi (`40 Jam`).

### K. Format Dua Baris Sel Kalender Roster Shift (Kode & Rentang Jam Kerja)
- **Struktur Tampilan 2 Baris (Vertical Stack)**:
  - Memperbarui komponen badge shift per sel kalender pada Tab 1 (Matriks Roster Mingguan) di [`JadwalShift.jsx`](resources/js/Pages/Admin/Jadwal/JadwalShift.jsx).
  - Setiap sel hari kerja aktif (Senin s/d Minggu) menampilkan informasi shift dalam 2 baris vertikal rapi:
    - **Baris 1 (Kode Shift)**: Huruf tebal monospaced (`font-bold font-mono text-xs leading-none`), contoh: `S1`, `S2`, `NON`, `SEC1`, `SEC2`, `SWAP`.
    - **Baris 2 (Jam Kerja Operasional)**: Teks jam kerja monospaced rapi (`font-mono text-[9px] opacity-90 mt-0.5 whitespace-nowrap leading-tight`), contoh: `15:00 - 23:00`, `07:00 - 15:00`, `08:00 - 17:00`, `06:30 - 14:30`.
- **Penanganan Hari Libur & Status Khusus**:
  - Untuk status tanpa jam kerja seperti `OFF` (Libur Roster Mingguan), `LIBUR` (Hari Libur Resmi Nasional), dan `UNSET` (Grup Belum Ditetapkan), nilai waktu (`time`) diset `null` sehingga badge tetap terpusat vertikal tanpa menyisakan baris kosong atau label redundan.
- **Lebar Kolom Kalender & Ekspor Spreadsheet**:
  - Lebar kolom kalender hari (`TableHead`) disesuaikan menjadi `min-w-[105px]` agar tampilan dua baris tidak terpotong pada berbagai resolusi layar.
  - Fungsi ekspor spreadsheet (`handleExportRoster`) diformat menjadi `${shiftInfo.code} (${shiftInfo.time})` untuk menghindari karakter newline (`\n`) yang berpotensi merusak tinggi baris sel di Microsoft Excel.

### L. Format Dua Baris pada Tab Rotasi (Penetapan & Pemindahan Grup Operasional Personil)
- **Kolom SHIFT OPERASIONAL ([`PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx))**:
  - Menerapkan format dua baris vertikal konsisten sesuai matriks roster mingguan:
    - **Baris 1**: Kode shift (`S1`, `S2`, `SEC1`, `SEC2`, `NON`) berbobot tebal monospaced (`font-bold font-mono text-xs leading-none`).
    - **Baris 2**: Jam kerja operasional (`07:00 - 15:00`, `15:00 - 23:00`, `06:30 - 14:30`, `14:30 - 22:30`, `08:00 - 17:00`) monospaced (`font-mono text-[9px] opacity-90 mt-0.5 whitespace-nowrap leading-tight`).
- **Kolom ALUR JADWAL MASUK ([`PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx))**:
  - Menerapkan format dua baris vertikal rapi terpusat (`text-center`):
    - **Grup A**:
      - **Baris 1**: `1 On • 1 Off (Bergulir)` (font-bold text-xs).
      - **Baris 2**: `Mgg Ganjil: 4H • Genap: 3H` (text-[9px] opacity-85).
    - **Grup B**:
      - **Baris 1**: `1 On • 1 Off (Bergulir)` (font-bold text-xs).
      - **Baris 2**: `Mgg Ganjil: 3H • Genap: 4H` (text-[9px] opacity-85).
    - **Belum Ditetapkan**:
      - **Baris 1**: `Belum Terjadwal`.
      - **Baris 2**: `Pilih Grup Roster`.

### M. Arsitektur Operasional 7 Hari Penuh (Senin s/d Minggu) & Siklus Bergulir 14 Hari (Rolling 14-Day Cycle)
- **Penerapan Operasional Non-Stop 7 Hari Penuh**:
  - Menghapus pembatasan libur total hari Minggu bagi personil shift operasional di [`JadwalShift.jsx`](resources/js/Pages/Admin/Jadwal/JadwalShift.jsx). Lini operasional pabrik, gudang, dan pos keamanan beroperasi penuh 7 hari (Senin s/d Minggu) dengan 2 shift per hari.
  - Staf kantor (`Non-Shift`) tetap menikmati libur akhir pekan resmi pada hari Sabtu dan Minggu (jam kerja Senin s/d Jumat, 40 jam).
- **Rumus Rotasi Bergulir Matematis (*Rolling Day Index*)**:
  - Mengimplementasikan rumus kesinambungan hari dinas: `continuousDayIndex = (selectedWeekIndex * 7) + dayNum`.
  - **Minggu 1 & 3 (Ganjil)**:
    - Grup A berdinas **4 hari**: Senin, Rabu, Jumat, Minggu (32 jam kerja).
    - Grup B berdinas **3 hari**: Selasa, Kamis, Sabtu (24 jam kerja).
  - **Minggu 2 & 4 (Genap)**:
    - Melanjutkan rotasi paska dinas hari Minggu Grup A: Grup B otomatis berdinas **4 hari**: Senin, Rabu, Jumat, Minggu (32 jam kerja).
    - Grup A berdinas **3 hari**: Selasa, Kamis, Sabtu (24 jam kerja).
  - **Rata-rata 2 Minggu**: Masing-masing grup bekerja **3,5 hari/minggu (28 jam kerja/minggu)**, memenuhi kepatuhan legalitas UU Ketenagakerjaan (< 40 jam/minggu).
- **Kalkulasi Dinamis Total Jam Kerja Mingguan**:
  - Kolom **Total Jam** pada tabel dan berkas ekspor Excel kini dihitung secara dinamis melalui helper `getEmployeeWeeklyHours(emp, currentWeek)` berdasarkan jumlah hari dinas riil (24 Jam / 32 Jam / 40 Jam / 0 Jam).
- **Interaktivitas Visual di Panel Rotasi Grup ([`PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx))**:
  - Menambahkan switcher interaktif `Minggu 1 & 3 (Ganjil)` vs `Minggu 2 & 4 (Genap)` pada header tabel **Matriks Alur Kerja Bergantian (Senin s/d Minggu)** sehingga HRD/Supervisor dapat melihat simulasi rotasi kedua minggu secara transparan.

### N. Penambahan Kolom Aksi & Modal Form Atur Penugasan Roster Personil
- **Penambahan Kolom AKSI pada Tabel Penetapan Grup ([`PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx))**:
  - Kolom ke-9 `AKSI` (`TableHead className="w-24 text-center"`) ditambahkan berdampingan dengan kolom `GRUP ROSTER`.
  - Tiga tombol aksi ergonomis disematkan pada setiap baris personil:
    1. **Tombol Edit / Atur Penugasan (`Pencil`)**: Membuka dialog modal atomik untuk mengonfigurasi grup dan shift operasional.
    2. **Tombol Tukar Grup Cepat (`ArrowLeftRight`)**: Aksi 1-klik untuk memindahkan personil secara instan antara Grup A dan Grup B tanpa harus membuka dropdown.
    3. **Tombol Reset Penugasan (`RotateCcw`)**: Aksi 1-klik untuk mengembalikan status personil menjadi *Belum Ditetapkan*.
- **Integrasi Modal Atomik Atur Penugasan & UI Polishing**:
  - Menggunakan komponen atomik `<Modal size="lg">`, `<ModalHeader>`, `<ModalBody>`, dan `<ModalFooter>`.
  - Tata letak visual berdensitas informasi tinggi (*high-density & domain-tailored*):
    1. **Ringkasan Profil Personil**: Wadah avatar inisial, nama tebal, NIP, peran, badge divisi kerja, dan site penugasan.
    2. **Kartu Interaktif Seleksi Grup Roster**: 3 kartu pilihan visual (Grup A [Emerald], Grup B [Amber], Belum Ditetapkan [Slate]) dengan rincian jadwal siklus bergulir (4H / 3H).
    3. **Kartu Interaktif Seleksi Shift Operasional**: 4 kartu pilihan visual (`S1` Pagi 07:00-15:00 WIB, `S2` Sore 15:00-23:00 WIB, `SEC1` Security 06:30-14:30 WIB, `SEC2` Security 14:30-22:30 WIB) dengan ikon matahari/bulan dan penanda waktu 24 jam.
    4. **Banner Pratinjau Alur Rotasi Efektif**: Menampilkan rangkuman instan kombinasi grup dan kode shift yang dipilih dalam siklus 14 hari sebelum disimpan.
  - Handler terhubung ke state induk `JadwalShift.jsx` (`handleUpdateEmployeeAssignment`), menyinkronkan data secara reaktif ke matriks kalender mingguan.

### O. Standardisasi 2 Shift Operasional Terpadu: Pagi dan Malam (Zero-Redundancy Shifts)
- **Keputusan Desain & Penyederhanaan Shift Operasional**:
  - Menyederhanakan seluruh sistem penjadwalan dan pencatatan presensi agar hanya memiliki **2 shift operasional**:
    1. **Shift 1: Pagi (`S1`)**: Jam dinas `07:00 - 15:00 WIB` (ikon matahari).
    2. **Shift 2: Malam (`S2`)**: Jam dinas `15:00 - 23:00 WIB` (ikon bulan).
  - Staf kantor (`NON`) tetap berjalan terpisah dengan jam reguler `Normal Office (08:00 - 17:00 WIB)` pada hari Senin s/d Jumat.
- **Pembersihan Kode Shift Redundan & Istilah Legacy**:
  - Mengeliminasi kode khusus security lama (`SEC1` 06:30 - 14:30 WIB dan `SEC2` 14:30 - 22:30 WIB). Seluruh personil operasional pabrik, gudang, dan satuan pengamanan (security/K3) kini menggunakan skema shift yang seragam (`S1` dan `S2`).
  - Mengganti istilah legacy "Siang" dan "Sore" menjadi **"Malam"** pada seluruh teks antarmuka, tabel, dan formulir sistem.
- **Cakupan Modul yang Distandarisasikan**:
  - **[`JadwalShift.jsx`](resources/js/Pages/Admin/Jadwal/JadwalShift.jsx)**: Pembaruan personil Hendra Wijaya (`S1`) dan Joko Susilo (`S2`), eliminasi logika `isSec`, penyederhanaan legenda tabel menjadi `S1 (Pagi 07-15)` dan `S2 (Malam 15-23)`.
  - **[`PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx)**:
    - Helper `getOperationalShiftBadge` dibersihkan dari `SEC1` & `SEC2`.
    - Modal interaktif atur penugasan dirapikan menjadi tepat 2 kartu shift operasional (`S1 - Shift 1 [Pagi]` dan `S2 - Shift 2 [Malam]`).
    - Form jadwal manual dan matriks alur bergulir distandarisasi ke istilah "Pagi & Malam".
  - **[`ModalFormTukarShift.jsx`](resources/js/Pages/Admin/Jadwal/Partials/ModalFormTukarShift.jsx)**: `SHIFT_OPTIONS` disederhanakan murni menjadi Shift 1 (Pagi), Shift 2 (Malam), Normal Office, dan Libur (OFF).
  - **[`ModalFormPresensi.jsx`](resources/js/Pages/Admin/Kehadiran/Partials/ModalFormPresensi.jsx)**: Opsi shift presensi distandarisasikan ke Shift 1 (Pagi), Shift 2 (Malam), dan Normal Office.
  - **[`CatatanKehadiran.jsx`](resources/js/Pages/Admin/Kehadiran/CatatanKehadiran.jsx) & [`ModalPresensiMassal.jsx`](resources/js/Pages/Admin/Kehadiran/Partials/ModalPresensiMassal.jsx)**: Penyelarasan mock data presensi dan opsi filter dropdown menjadi `Shift 2 (Malam)`.
  - **[`Beranda.jsx`](resources/js/Pages/Admin/Beranda/Beranda.jsx)**: Penyelarasan jam operasional `Shift 2 (15:00 - 23:00)` pada kartu live kehadiran personil keamanan dan widget status rotasi aktif.

### P. Penataan & Perapihan Filter Toolbar Matriks Alur Kerja Bergantian
- **Pemisahan Peran Header & Toolbar (*Component De-cluttering*)**:
  - Mengeliminasi penumpukan 5 elemen sekaligus di sudut kanan `CardHeader` pada Matriks Alur Kerja Bergantian (Senin s/d Minggu) di [`PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx).
  - Memfokuskan `CardHeader` murni untuk judul, deskripsi, dan tombol aksi utama `Tukar Siklus Grup` (`onSwapAll`).
- **Implementasi Toolbar Atomik Terdedikasi (`<TableToolbar>`)**:
  - Menyisipkan `<TableToolbar>` atomik di antara `CardHeader` dan `<Table>` dengan latar `bg-slate-50/70 border-b border-slate-200/80`.
  - **Sisi Kiri (Segmented Control Filter Siklus)**:
    - Dilengkapi label eksplisit `Siklus Roster:`.
    - Tombol segmen berdesain Deep Navy (`bg-navy text-white shadow-2xs` saat aktif) untuk `Minggu 1 & 3 (Ganjil)` dan `Minggu 2 & 4 (Genap)` dengan pill badge monospaced kontras tinggi.
  - **Sisi Kanan (Informative Distribution Badges)**:
    - Ringkasan distribusi hari dinas personil (`Grup A: 4 Hari [Sen, Rab, Jum, Min]` dan `Grup B: 3 Hari [Sel, Kam, Sab]`) dipisahkan secara rapi sebagai indikator status (non-clickable status badges).
  - Tampilan sepenuhnya responsif pada resolusi desktop maupun layar seluler tanpa masalah pemotongan teks atau baris bertingkat yang tidak rapi.

### Q. Penghapusan Kolom Keterangan Alur Rotasi pada Matriks Alur Kerja Bergantian
- **Pembersihan Kolom Redundan (*Minimal & Clean UI*)**:
  - Menghapus kolom `Keterangan Alur Rotasi` (`TableHead` dan `TableCell`) pada tabel **Matriks Alur Kerja Bergantian (Senin s/d Minggu)** di [`PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx).
  - Informasi alur dinas sudah terepresentasi secara jelas dan ringkas melalui badge kolom status `Grup A`, `Grup B`, dan `Staf Kantor` serta ringkasan badge distribusi di toolbar atas, sehingga teks narasi panjang di kolom keterangan tidak lagi diperlukan.
  - Membersihkan atribut `note` yang tidak lagi digunakan dari data objek `permanentScheduleRows` sesuai prinsip *YAGNI & Anti-Slop*.

### R. Penataan Proporsi Simetris 4 Kolom Matriks Alur Kerja Bergantian
- **Proporsi Sempurna 4 Kolom (*Equal 25% Grid Distribution*)**:
  - Mengonfigurasi tabel dengan `table-fixed` dan menetapkan lebar setiap kolom persis `w-1/4` (25% per kolom) di [`PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx):
    1. **Kolom 1 (Hari & Tanggal - 25%)**: Rata kiri dengan ikon kalender, nama hari tebal (`text-navy font-bold`), dan tanggal monospaced rapi.
    2. **Kolom 2 (Grup A - 25%)**: Rata tengah (`text-center`) dengan badge vertikal terpusat (`MASUK [2 Shift]` & `LIBUR [OFF]`).
    3. **Kolom 3 (Grup B - 25%)**: Rata tengah (`text-center`) dengan badge vertikal terpusat berbobot seimbang.
    4. **Kolom 4 (Staf Kantor Non-Shift - 25%)**: Rata tengah (`text-center`) dengan badge berdimensi sama (`MASUK [Reguler]` 08:00 - 17:00 & `LIBUR [OFF]`).
  - Mengeliminasi whitespace kosong yang tidak merata dan membuat antarmuka tabel tampak proporsional, seimbang, dan kokoh di seluruh resolusi layar.

### S. Penempatan Notifikasi Toast di Bagian Atas & Standarisasi Warna Semantik
- **Relokasi Posisi Toast ke Bagian Atas (*Top-Anchored Notification*)**:
  - Memindahkan posisi kemunculan notifikasi `<Toast>` ([`toast.jsx`](resources/js/components/ui/toast.jsx) & [`app.css`](resources/css/app.css)) dari pojok kanan bawah ke **bagian atas**:
    - **Desktop/Tablet**: Tersemat di pojok kanan atas (`top: 24px; right: 24px; z-index: 100`) dengan animasi geser masuk yang halus (`slide-in-from-top-4 duration-200`).
    - **Mobile**: Tersemat penuh di atas (`top: 16px; left: 16px; right: 16px; max-width: calc(100vw - 32px)`).
- **Prinsip Warna Semantik Tegas (*Strict Semantic Colors*)**:
  - Mengeliminasi warna murky teal/brownish lama dan menerapkan palet semantik murni:
    1. **Berhasil / Sukses (`success`)**: Latar **Hijau Emerald (`#059669` / `bg-emerald-600`)**, ikon `CheckCircle2`, border halus, dan bayangan lembut.
    2. **Gagal / Bahaya (`error` / `danger`)**: Latar **Merah Rose (`#e11d48` / `bg-rose-600`)**, ikon `AlertCircle`, dan bayangan merah transparan.
    3. **Peringatan (`warning`)**: Latar **Kuning-Jingga Amber (`#d97706` / `bg-amber-600`)**, ikon `AlertTriangle`.
    4. **Informasi (`info`)**: Latar **Biru Royal (`#2563eb` / `bg-blue-600`)**, ikon `Info`.

### T. Penyelarasan & Proporsionalitas Tabel Seluruh Modul Sistem
- **Standarisasi Kolom & Header Seluruh Halaman**:
  - Memperbarui tabel kehadiran langsung di [`Beranda.jsx`](resources/js/Pages/Admin/Beranda/Beranda.jsx), rekap evaluasi di [`LaporanRekap.jsx`](resources/js/Pages/Admin/Laporan/LaporanRekap.jsx), master kehadiran di [`CatatanKehadiran.jsx`](resources/js/Pages/Admin/Kehadiran/CatatanKehadiran.jsx), serta daftar hari libur & geofence di [`PengaturanSistem.jsx`](resources/js/Pages/Admin/Pengaturan/PengaturanSistem.jsx).
  - Seluruh header kolom distandarisasikan dengan tipografi `text-[11px] font-bold text-slate-700 tracking-wider uppercase` dan min-width proporsional.
  - Menghapus timer `setTimeout` manual yang berlebihan di halaman-halaman pemanggil sehingga auto-dismiss ditangani secara aman dan terpusat oleh komponen atomik `Toast`.

### U. Integrasi Fitur Cetak Laporan & Tab Rapor Kehadiran pada LaporanRekap.jsx
- **Fitur Cetak Laporan Terintegrasi (`window.print()` & `@media print`)**:
  - Menambahkan tombol aksi **Cetak Laporan** dengan ikon `<Printer />` pada header halaman [`LaporanRekap.jsx`](resources/js/Pages/Admin/Laporan/LaporanRekap.jsx).
  - Mengimplementasikan stylesheet `@media print` lengkap pada [`app.css`](resources/css/app.css):
    - Menyembunyikan navigasi shell (`.sidebar`, `.topbar`, `.toast`, `footer`, menu navigasi, dan tombol interaktif) secara otomatis saat mencetak.
    - Menyesuaikan ukuran halaman standar A4 potret dengan margin proporsional (10mm x 12mm).
    - Mempertahankan akurasi warna semantik status dan badge presensi (`print-color-adjust: exact`).
  - Menyisipkan **Kop Surat Resmi HCGA** (`PT RIAR KENCANA OPERASIONAL - DIVISI HUMAN CAPITAL & GENERAL AFFAIR`) yang otomatis muncul saat mode cetak dokumen PDF/kertas.
  - Menyisipkan **Lembar Pengesahan Resmi** (tanda tangan pembuat/verifikator HCGA dan persetujuan Head of Operational & HC) di bagian bawah cetakan.
- **Penyelarasan Tab: Rekap Kehadiran Bulanan & Rapor Kehadiran**:
  - Menyelaraskan tab navigasi utama pada [`LaporanRekap.jsx`](resources/js/Pages/Admin/Laporan/LaporanRekap.jsx):
    1. **Tab 1: Rekap Kehadiran Bulanan**: Menyajikan ringkasan KPI kepatuhan organisasi, grafik performa antar-divisi, peringatan dini SP/pembinaan, filter pencarian terpadu, dan matriks kedisiplinan seluruh karyawan.
    2. **Tab 2: Rapor Kehadiran**: Terhubung langsung dengan partial scorecard [`RaporIndividu.jsx`](resources/js/Pages/Admin/Laporan/Partials/RaporIndividu.jsx) untuk melihat profil lengkap personal, evaluasi persentase kehadiran 30 hari kalender, catatan coaching log, dan tren disiplin 6 bulan.
  - Tombol **Buka Rapor** pada matriks tabel secara instan beralih ke tab Rapor Kehadiran dengan data personil yang bersangkutan.
  - Menyembunyikan kontrol toolbar dan aksi tabel (`print:hidden`) saat dokumen dicetak agar hasil bersih dan profesional.
- **Pemisahan Kolom Divisi & Lokasi pada Matriks Evaluasi**:
  - Memisahkan kolom gabungan `DIVISI & LOKASI` menjadi dua kolom independen berbobot proporsional:
    1. **Kolom `DIVISI`**: Menampilkan nama unit kerja personil (`text-slate-800 font-medium`).
    2. **Kolom `LOKASI`**: Menampilkan site penugasan aktif dengan ikon pendukung (`<MapPin /> text-slate-400` + nama site operasional).
  - Menyesuaikan `colSpan` pada `<TableEmpty>` menjadi 11 kolom sehingga tata letak tetap seimbang saat data kosong.

### V. Standarisasi Komponen Atomik Dokumen & Cetak Laporan Terisolasi (`components/ui/print.jsx`)
- **Penyempurnaan Arsitektur Cetak Laporan (Bukan Cetak Halaman Web)**:
  - Mengubah paradigma dari cetak halaman web mentah (`window.print()`) menjadi **Pencetakan Dokumen Laporan Resmi Terisolasi (*Isolated Report Printing*)** melalui [`resources/js/components/ui/print.jsx`](resources/js/components/ui/print.jsx):
    1. `printReportElement(elementId, title)`: Utilitas cetak terisolasi yang menginjeksi dokumen laporan ke dalam *hidden iframe* bersama stylesheet dan aturan `@page A4`, mencetak dokumen murni tanpa menyertakan shell dashboard, navbar, sidebar, atau elemen interaktif web.
    2. `<PrintPreviewModal>`: Dialog pratinjau dokumen laporan interaktif yang menyimulasikan lembar fisik A4 dengan bayangan dan border kertas realistis, dilengkapi tombol aksi *Tutup* dan *Cetak Dokumen Sekarang*.
    3. `<PrintButton>`: Tombol pemicu pratinjau dan cetak laporan atomik dengan ikon `<Printer />`.
    4. `<ReportHeader>`: Kop surat formal HCGA (`PT RIAR KENCANA OPERASIONAL - DIVISI HUMAN CAPITAL & GENERAL AFFAIR`) lengkap dengan logo, nomor/judul laporan, tanggal cetak, dan site operasional.
    5. `<ReportMetaGrid>`: Kartu parameter metadata laporan terstruktur (periode, hari kerja, jumlah personil).
    6. `<ReportSignature>`: Lembar pengesahan resmi multi-pihak dengan tanda tangan, jabatan, dan NIP (mendukung 2, 3, atau 4 penandatangan).
- **Integrasi pada Modul Laporan & Rapor**:
  - Tombol **Cetak Laporan Rekap** dan **Cetak Rapor** pada [`LaporanRekap.jsx`](resources/js/Pages/Admin/Laporan/LaporanRekap.jsx) serta [`RaporIndividu.jsx`](resources/js/Pages/Admin/Laporan/Partials/RaporIndividu.jsx) kini membuka modal pratinjau dokumen resmi A4, lalu mencetak dokumen laporan bersih berformat standar korporat.
  - Membersihkan elemen cetak inline sisa dari halaman utama yang sempat memicu `ReferenceError` pada runtime browser, memastikan perenderan halaman kembali normal 100%.

### W. Implementasi Rekap Kehadiran Harian & Rekonfigurasi Urutan 3 Tab Laporan Rekap
- **Rekonfigurasi Urutan Tab Menjadi 3 Tingkat Operasional**:
  - Menyusun ulang struktur tab pada [`resources/js/Pages/Admin/Laporan/LaporanRekap.jsx`](resources/js/Pages/Admin/Laporan/LaporanRekap.jsx) sesuai kebutuhan hierarki pengawasan presensi:
    1. **Tab 1: Rekap Kehadiran Bulanan (`organisasi`)**: Ringkasan performa kepatuhan agregat bulanan, grafik perbandingan divisi, matriks evaluasi 12 karyawan, filter divisi/status, serta ekspor XLSX dan cetak laporan bulanan resmi.
    2. **Tab 2: Rekap Kehadiran Harian (`harian`)**: Lembar presensi shift harian operasional real-time per tanggal terpilih, pemantauan status masuk/pulang, deviasi keterlambatan personil, filter shift & status presensi, ekspor XLSX harian, serta tombol cetak dokumen lembar presensi operasional A4.
    3. **Tab 3: Rapor Kehadiran (`individu`)**: Kartu penilaian kedisiplinan personal karyawan terpilih, kalender kehadiran 30 hari, tren 6 bulan, riwayat coaching, dan cetak lembar rapor individu.
- **Fitur Lembar Presensi Operasional Harian (Tab 2)**:
  - **Banner Operasional Kontekstual**: Menampilkan indikator tanggal berjalan (format bahasa Indonesia lengkap, misalnya `Kamis, 05 November 2026`) dan unit operasional aktif (`SITE A CIMALAKA` / `SITE B PASEH`).
  - **4 Kartu KPI Ringkasan Harian**:
    1. *Total Personil Hadir*: Menampilkan rasio kehadiran kerja personil terhadap jadwal aktif.
    2. *Hadir Tepat Waktu*: Menampilkan jumlah personil dengan disiplin prima (0 menit keterlambatan).
    3. *Keterlambatan Shift*: Menampilkan frekuensi insiden dan akumulasi menit keterlambatan hari berjalan.
    4. *Tidak Hadir (Cuti / Alpa)*: Menampilkan personil berhalangan dinas dengan rincian cuti vs alpa.
  - **Tabel Log Presensi & Shift Lengkap**:
    - Kolom tabel standar atomik: `NO`, `KARYAWAN` (Nama, NIP & Jabatan), `DIVISI`, `LOKASI`, `SHIFT KERJA` (Shift 1, Shift 2, Reguler), `MASUK`, `PULANG`, `DEVIASI`, `STATUS`, `KETERANGAN OPERASIONAL`, dan `AKSI`.
    - Tombol aksi `Buka Rapor` dengan ikon `<Eye />` yang secara mulus mengalihkan tampilan ke Tab 3 (Rapor Kehadiran) untuk personil bersangkutan.
    - Toolbar atomik dengan pencarian multi-parameter dan filter shift (`Shift 1`, `Shift 2`, `Reguler`) serta status (`Hadir`, `Terlambat`, `Cuti`, `Alpa`).
- **Dokumen Cetak Laporan Presensi Harian Resmi (`PrintPreviewModal`)**:
  - Terintegrasi penuh dengan mesin cetak atomik [`resources/js/components/ui/print.jsx`](resources/js/components/ui/print.jsx):
    1. *Kop Surat Formal HCGA*: Logo HC, identitas unit operasional, tanggal operasional, dan judul `LAPORAN REKAPITULASI PRESENSI HARIAN OPERASIONAL`.
    2. *Grid Metadata Parameter*: Tanggal dinas, unit operasional, filter shift aktif, dan total personil terjadwal.
    3. *Mini KPI Executive Summary*: Kotak ringkasan 4 metrik presensi harian pada lembar kerja A4.
    4. *Tabel Rekapitulasi Presensi Cetak*: Tabel data rapi dan presisi tanpa tombol interaktif web.
    5. *Pengesahan 3 Pihak*: Tanda tangan resmi berbobot 3 kolom yang melibatkan **Danru Keamanan & K3 Lapangan** (pembuat), **HCGA Specialist** (verifikator), dan **Head of Operations** (mengetahui).
- **Verifikasi Kualitas Kode**:
  - Pengujian SSR multi-tab lulus 100% tanpa error runtime.
  - Build Vite produksi (`npm run build`) sukses tanpa warning (`0 errors`, waktu kompilasi 7.1 detik).

### X. Sinkronisasi Matematis 100% Matriks Presensi 30 Hari pada Rapor Individu
- **Penyelesaian Masalah Asinkronitas Grid Kalender 30 Hari**:
  - Sebelumnya, fungsi `generateCalendarDays()` hanya menandai hari Minggu (5 hari) sebagai libur dan tidak memperhitungkan hari Sabtu, sehingga menghasilkan 25 hari kerja aktif (tidak selaras dengan metrik `workDays: 22` pada data induk karyawan).
  - Selain itu, pengecekan hari libur dilakukan sebelum pengecekan insiden, menyebabkan insiden dinas/keterlambatan di hari Minggu (seperti pada Budi Santoso, Hendra Wijaya, dan Wahyu Hidayat) tertimpa menjadi `Libur`.
  - Diperbaiki dengan algoritma sinkronisasi presisi:
    1. *Prioritas Insiden*: Seluruh data insiden eksplisit (`Terlambat`, `Cuti`, `Sakit`, `Izin`, `Alpha`, `Tepat Waktu`) diutamakan terlebih dahulu pada tanggal yang bersangkutan.
    2. *Alokasi Libur Eksak*: Menentukan tepat 8 hari Libur (OFF) pada akhir pekan (Sabtu & Minggu) yang bebas dari insiden dinas (`30 hari kalender - 22 hari kerja = 8 hari libur`).
    3. *Penetapan Hadir Tepat Waktu*: Hari kerja yang tersisa secara otomatis berstatus `Hadir (Tepat Waktu)` sesuai jam kerja divisinya.
- **Hasil Verifikasi Sinkronisasi 12 Karyawan**:
  - Seluruh 12 personil HCGA kini memiliki sinkronisasi 100% antara 8 kartu KPI di bagian atas dengan jumlah kotak warna pada grid kalender 30 hari:
    - `Total Hadir (Hadir + Telat)` pada kalender $\equiv$ `presentDays` pada kartu KPI.
    - `Kotak Terlambat` pada kalender $\equiv$ `lateCount` pada kartu KPI.
    - `Kotak Cuti / Sakit / Izin / Alpha` pada kalender $\equiv$ `cutiDays / sakitDays / izinDays / alpaDays` pada kartu KPI.
    - `Kotak Libur (Abu-abu)` $\equiv$ Tepat 8 hari.
    - Total kotak kalender $\equiv$ Tepat 30 hari.
- **Penyelarasan Data Insiden Eko Prasetyo**:
  - Melengkapi 4 riwayat keterlambatan pada Eko Prasetyo (HC-0107) agar selaras dengan `lateCount: 4` dan akumulasi 75 menit keterlambatan (02 Nov: 20m, 05 Nov: 25m, 12 Nov: 15m, 17 Nov: 15m).

### Y. Sinkronisasi Penuh Roster Operasional Shift 7 Hari Non-Stop pada Laporan Rekapitulasi & Matriks Presensi 30 Hari
- **Latar Belakang & Aturan Domain Operasional (`JadwalShift.jsx`)**:
  - Berdasarkan aturan ketenagakerjaan dan sistem jadwal di pabrik/lapangan yang didefinisikan pada [`resources/js/Pages/Admin/Jadwal/JadwalShift.jsx`](resources/js/Pages/Admin/Jadwal/JadwalShift.jsx) dan [`PanelRotasiGrup.jsx`](resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx):
    1. **Shift Operasional (Grup A & Grup B)** beroperasi **7 hari penuh tanpa henti (Senin s/d Minggu)** dengan sistem rotasi **1 Hari Dinas, 1 Hari Libur Roster (Siklus Bergulir 14 Hari)**. Personil shift **TIDAK memiliki libur Sabtu dan Minggu tetap**; hari libur mereka adalah `Libur Roster Bergulir (OFF)` yang bergeser setiap minggu:
       - **Minggu Ganjil (Minggu 1 & 3)**: Grup A masuk (Sen, Rab, Jum, Min), Grup B masuk (Sel, Kam, Sab).
       - **Minggu Genap (Minggu 2 & 4)**: Grup A masuk (Sel, Kam, Sab), Grup B masuk (Sen, Rab, Jum, Min).
       - Dalam bulan November 2026 (30 hari): Personil Grup A dan Grup B masing-masing memiliki tepat **15 hari dinas aktif** dan **15 hari libur roster (OFF)**.
    2. **Staf Non-Shift (Kantor Reguler - HCGA/Administrasi)** beroperasi 5 hari kerja (Senin s/d Jumat, 08:00 - 17:00 WIB) dengan **Libur Akhir Pekan Tetap (Sabtu & Minggu)**. Dalam November 2026, staf non-shift memiliki tepat **21 hari kerja efektif** dan **9 hari libur akhir pekan**.
- **Sinkronisasi Matriks Presensi 30 Hari (`RaporIndividu.jsx`)**:
  - Mengganti fungsi `generateCalendarDays()` statis menjadi fungsi berbasis logika rotasi dinamis sesuai `employee.group`:
    - Memeriksa index hari berkesinambungan `(d - 1) % 2 === 1` untuk giliran Grup A (Shift 1 Pagi, 07:00 - 15:00 WIB) dan `(d - 1) % 2 === 0` untuk giliran Grup B (Shift 2 Malam, 15:00 - 23:00 WIB).
    - Memetakan staf Non-Shift ke libur akhir pekan Sabtu-Minggu (`dayOfWeek === 0 || dayOfWeek === 6`).
    - Menempelkan data insiden riil karyawan (`Terlambat`, `Cuti`, `Sakit`, `Izin`, `Alpha`, `Tepat Waktu`) di atas hari kerja terjadwal personil bersangkutan.
  - Memperbarui deskripsi visual kalender secara kontekstual:
    - Karyawan Non-Shift: *"Jadwal Kantor Reguler (Senin s/d Jumat) • Libur Akhir Pekan Sabtu & Minggu"*.
    - Karyawan Shift: *"Pola Roster Operasional 7 Hari Non-Stop • 1 Hari Dinas 1 Hari Libur Bergulir (Grup A / Grup B)"*.
  - Menampilkan badge info `Grup Kerja` dan `Base Shift` pada header rapor individu karyawan.
- **Penyelarasan Data Induk Evaluasi Kehadiran (`EVALUATION_DATASET` di `LaporanRekap.jsx`)**:
  - Menambahkan atribut `group` (`Grup A`, `Grup B`, `Non-Shift`), `shiftCode` (`S1`, `S2`, `NON`), dan `baseShift` ke 12 personil HCGA.
  - Menyesuaikan `workDays` dan `presentDays` secara matematis:
    - Karyawan Shift: `workDays: 15` (15 hari jadwal dinas aktif).
    - Karyawan Kantor: `workDays: 21` (21 hari kerja efektif).
  - Menyelaraskan tanggal insiden agar jatuh pada hari dinas aktif masing-masing grup (misal: insiden keterlambatan Wahyu Hidayat pada Minggu 08 Nov membuktikan operasional shift hari Minggu tetap masuk kerja; dan sakit Eko Prasetyo pada Sabtu 07 Nov membuktikan jadwal dinas Sabtu tetap aktif).
- **Penyelarasan Presensi Operasional Harian (`DAILY_ATTENDANCE_DATASET` di `LaporanRekap.jsx`)**:
  - Pada tanggal terpilih `2026-11-05` (Kamis):
    - Grup B (Ahmad Fauzi, Eko Prasetyo, Joko Susilo) dan Non-Shift (Siti Rahmawati, Rina Marlina [Cuti], Maya Indah Lestari, Dian Kusuma) berada dalam jadwal dinas aktif.
    - Grup A (Budi Santoso, Dewi Anggraini, Hendra Wijaya, Wahyu Hidayat, Nurul Aini) berstatus `Libur` dengan keterangan *"Jadwal Libur Roster Bergulir (OFF)"*.
  - Menambahkan penanganan status `Libur` / `OFF` pada badge status harian (`renderDailyStatusBadge`) dan filter status tabel harian.
  - Memperbarui perhitungan ringkasan KPI harian (`dailySummaryStats`):
    - `totalPersonnel`: 12 personil.
    - `scheduledPersonnel`: personil yang terjadwal aktif hari ini (total dikurangi personil yang libur roster).
    - `attendanceRate`: rasio kehadiran terhadap personil yang terjadwal dinas.
- **Hasil Verifikasi**:
  - Seluruh 12 personil terverifikasi sinkron 100% antara kartu KPI bulanan, kalender presensi 30 hari, log insiden, dan lembar harian.
  - Kompilasi Vite produksi (`npm run build`) sukses tanpa error (8.09 detik).

---

## 11. Rencana Aksi untuk Sesi Selanjutnya (Next Steps)

1. **Modul Lembur & Surat Perintah Lembur (`Admin/Lembur/LemburOvertime.jsx`)**:
   - Formulir pengajuan dan persetujuan lembur terintegrasi dengan kehadiran dan site aktif.
2. **Modul Pengajuan Cuti & Izin (`Admin/Cuti/PengajuanCutiIzin.jsx`)**:
   - Alur permohonan dan persetujuan cuti karyawan.
3. **Persistensi Database (Backend Migrations)**:
   - Menghubungkan data dummy React ke tabel database riil (`employees`, `attendances`, `shifts`, `leaves`).
