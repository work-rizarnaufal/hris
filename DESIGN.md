---
name: HCGA HRIS Enterprise Design System
description: Official locked design system specification for HCGA Attendance, Roster 24/7, and Workforce Monitoring
colors:
  primary: "#10273f"
  primary-hover: "#193750"
  primary-dark: "#0a1929"
  accent-gold: "#c4a266"
  accent-gold-light: "#f7f2e8"
  accent-gold-dark: "#ab874b"
  surface-bg: "#f6f8fb"
  surface-card: "#ffffff"
  surface-border: "#e8ecf1"
  surface-border-dark: "#31455b"
  text-ink: "#1d3046"
  text-ink-light: "#2d4156"
  text-muted: "#8290a2"
  status-hadir: "#398872"
  status-hadir-bg: "#eef7f1"
  status-terlambat: "#ac8848"
  status-terlambat-bg: "#fcf6e9"
  status-izin: "#698eb0"
  status-izin-bg: "#eff5fa"
  status-sakit: "#ab7b9b"
  status-sakit-bg: "#f7f0f7"
  status-cuti: "#489490"
  status-cuti-bg: "#edf6f6"
  status-alpha: "#b36a74"
  status-alpha-bg: "#fbf0f2"
  status-libur: "#7f8b9a"
  status-libur-bg: "#eef2f6"
  location-mariuk: "#d97706"
  location-mariuk-bg: "#fef3c7"
  location-cimalaka: "#4f46e5"
  location-cimalaka-bg: "#e0e7ff"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontWeight: 700
  body:
    fontFamily: "DM Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "12px"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "#f1f5f9"
    textColor: "{colors.text-ink}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
    height: "36px"
  card:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.xl}"
    border: "1px solid {colors.surface-border}"
---

# HCGA HRIS Enterprise Design System (DESIGN.md)

Dokumen ini adalah **pedoman desain tunggal dan mengikat** (*single source of truth*) untuk seluruh antarmuka aplikasi HCGA Human Resource Information System (HRIS). Setiap perubahan, penambahan modul, komponen baru, atau refaktor kode **WAJIB** merujuk dan mematuhi spesifikasi di bawah ini untuk menjaga konsistensi visual, higienitas kode (*anti-slop*), efisiensi maksimal (*ponytail*), dan integritas operasional.

---

## 1. Overview

### A. Filosofi Desain & Mode Antarmuka
Aplikasi ini beroperasi dalam mode **Operate** (Enterprise Workforce & Attendance Management) dengan sentuhan **Executive Presentation**.
- **Tujuan Utama**: Memfasilitasi pengambilan keputusan cepat oleh manajer HCGA, monitoring kehadiran presisi tinggi, dan pengelolaan shift non-stop pabrik.
- **Densitas Informasi Tinggi**: Ruang layar dimanfaatkan optimal tanpa elemen dekoratif semu, tanpa kartu pastel generik, dan tanpa spasi terbuang.
- **Konteks Operasional Khusus**:
  1. **Multi-Lokasi Nyata**: Membedakan personil dan data operasional antara **Lokasi Mariuk** (badge *amber*) dan **Lokasi Cimalaka** (badge *indigo*).
  2. **Operasional 24/7 Non-Stop**: Pola 2 shift 12 jam (Shift Pagi `07:00–19:00` & Shift Malam `19:00–07:00`) dengan rotasi 2 regu (Grup A & Grup B) tanpa libur akhir pekan operasional.
  3. **Toleransi & Kedisiplinan**: Standardisasi toleransi masuk 15 menit, lembur, dan sanksi bertingkat (Teguran Lisan, Bimbingan Supervisor, SP-1).

### B. Prinsip Inti Rekayasa UI (Engineering Principles)
1. **Mandatory Atomic UI Reuse**: Seluruh halaman wajib memanfaatkan komponen atomik yang tersedia di [`resources/js/components/ui/`](resources/js/components/ui/). Dilarang keras membuat elemen kartu, dialog modal, atau tabel kustom terpisah di dalam file halaman.
2. **Anti-Slop (No Decorative Bloat)**: Tidak ada banner komentar basa-basi (`// ====`), tidak ada tooltip berlebihan, dan tidak ada elemen visual tanpa fungsi bisnis yang jelas.
3. **Ponytail (Minimal Patch & Maximum Efficiency)**: Solusi desain dibuat dengan kode paling ringkas, memanfaatkan utilitas CSS yang ada, dan tidak menambah dependensi eksternal tanpa izin.

---

## 2. Colors

Identitas warna resmi HCGA dikunci pada [`resources/js/config/theme.js`](resources/js/config/theme.js), [`tailwind.config.js`](tailwind.config.js), dan [`resources/css/app.css`](resources/css/app.css).

### A. Palet Brand Utama & Aksentuasi
| Token | Nilai Hex | Peran & Penggunaan UI |
| :--- | :--- | :--- |
| **Corporate Navy (Primary)** | `#10273f` | Warna dasar korporat, sidebar aktif, header tabel, tombol primer, judul utama |
| **Navy Hover / Light** | `#193750` | Interaksi hover tombol primer, varian gelap sekunder |
| **Navy Dark Canvas** | `#0a1929` | Background kontras gelap, status terkunci NIP |
| **Signature Gold (Accent)** | `#c4a266` | Aksen kehormatan HCGA, ring fokus, border highlight aktif, badge VIP/spesial |
| **Soft Gold (Light)** | `#f7f2e8` | Latar belakang badge emas lembut, highlight baris terpilih |
| **Dark Gold** | `#ab874b` | Teks status terlambat berbobot tinggi |

### B. Permukaan, Kanvas, dan Border
| Token | Nilai Hex | Peran & Penggunaan UI |
| :--- | :--- | :--- |
| **Surface Background** | `#f6f8fb` | Latar belakang kanvas aplikasi utama (`PageContainer`, `html`, `body`) |
| **Card Surface** | `#ffffff` | Kontainer kartu atomik (`<Card>`), modal (`<Modal>`), dropdown |
| **Crisp Border** | `#e8ecf1` | Garis batas kartu, tabel, dan pembatas kolom (`border-slate-200`) |
| **Toolbar Well** | `#f8fafc` | Latar belakang toolbar tabel, filter bar, dan panel kontrol sekunder |

### C. Tipografi & Kontras Teks
| Token | Nilai Hex | Peran & Penggunaan UI |
| :--- | :--- | :--- |
| **Text Ink (Primary)** | `#1d3046` | Judul, label penting, nama karyawan, angka KPI |
| **Text Ink Light** | `#2d4156` | Teks paragraf, deskripsi kartu, isi tabel |
| **Text Muted** | `#8290a2` | Teks keterangan, placeholder, label non-aktif, icon sekunder |

### D. Token Status Kehadiran Legal HCGA
Status presensi wajib menggunakan pasangan token resmi berikut (teks + latar belakang):
| Status | Warna Teks | Warna Latar | Deskripsi Legalitas |
| :--- | :--- | :--- | :--- |
| **Hadir (Tepat Waktu)** | `#398872` | `#eef7f1` | Check-in sebelum batas toleransi toleran (07:15 / 19:15) |
| **Terlambat** | `#ac8848` | `#fcf6e9` | Check-in melewati batas toleransi resmi |
| **Izin Resmi** | `#698eb0` | `#eff5fa` | Izin operasional disetujui atasan & HCGA |
| **Sakit (Surat Dokter)** | `#ab7b9b` | `#f7f0f7` | Ketidakhadiran sakit dengan legalitas medis |
| **Cuti Tahunan** | `#489490` | `#edf6f6` | Pengambilan kuota cuti tahunan resmi |
| **Alpha (Mangkir)** | `#b36a74` | `#fbf0f2` | Tidak hadir tanpa kabar / dinonaktifkan |
| **Libur / Pasca-Dinas** | `#7f8b9a` | `#eef2f6` | Hari libur nasional atau status OFF siklus 24/7 |

### E. Token Multi-Lokasi & Regu Operasional
| Elemen | Token Teks & Border | Token Latar | Penggunaan |
| :--- | :--- | :--- | :--- |
| **Lokasi Mariuk** | `text-amber-800 border-amber-200` | `bg-amber-50` | Badge personil & filter pabrik Mariuk |
| **Lokasi Cimalaka** | `text-indigo-800 border-indigo-200` | `bg-indigo-50` | Badge personil & filter pabrik Cimalaka |
| **Grup Operasional A** | `text-emerald-800 border-emerald-200` | `bg-emerald-50` | Regu kerja A (Senin, Rabu, Jumat, Minggu*) |
| **Grup Operasional B** | `text-amber-800 border-amber-200` | `bg-amber-50` | Regu kerja B (Selasa, Kamis, Sabtu, Minggu*) |
| **Shift Pagi (12 Jam)** | `text-emerald-800 border-emerald-200` | `bg-emerald-50` | Dinas Pagi: 07:00 – 19:00 WIB |
| **Shift Malam (12 Jam)** | `text-indigo-800 border-indigo-200` | `bg-indigo-50` | Dinas Malam: 19:00 – 07:00 WIB |

---

## 3. Typography

### A. Font Stack
Aplikasi menggunakan 3 jenis keluarga huruf (*font family*) terpadu:
1. **Body & Controls (`font-sans`)**: `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`  
   Digunakan untuk teks antarmuka, input form, tombol, sel tabel, dan komunikasi operasional.
2. **Display & Metrics (`font-display`)**: `'Manrope', sans-serif`  
   Digunakan untuk judul halaman, angka KPI scorecard, metrik persentase, dan heading modul.
3. **Monospace (`font-mono`)**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`  
   Digunakan untuk Nomor Induk Pegawai (NIP), format waktu digital (`JJ:MM:DD`), kalkulasi jam kerja, dan kode shift.

### B. Skala Tipografi Standar
| Tingkat | Kelas Tailwind | Ukuran / Line-Height | Weight | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Display KPI** | `text-2xl` / `text-3xl` | 24px–30px / 1.2 | `font-bold font-display` | Angka metrik utama pada scorecard |
| **Page Title** | `text-lg` / `text-xl` | 18px–20px / 1.3 | `font-bold font-display` | Judul utama halaman di `PageHeader` |
| **Card Heading** | `text-sm` / `text-base` | 14px–16px / 1.4 | `font-bold` | Header kartu, judul modal dialog |
| **Eyebrow / Sub** | `text-[11px]` | 11px / 1.4 | `font-bold tracking-wider uppercase` | Label kategori di atas judul halaman |
| **Body Standard** | `text-xs` / `text-sm` | 12px–13px / 1.5 | `font-normal` | Isi paragraf, sel tabel data |
| **Table Head** | `text-[11px]` | 11px / 1.3 | `font-bold tracking-wider uppercase` | Header kolom tabel data |
| **Micro Badge** | `text-[10px]` | 10px / 1.2 | `font-semibold` | Badge status sel kecil, counter pill |

---

## 4. Layout

### A. Persistent Layout (Anti-Flicker Architecture)
- **Implementasi**: Pada [`resources/js/app.jsx`](resources/js/app.jsx), seluruh rute halaman dibungkus menggunakan referensi fungsi stabil di tingkat modul:
  ```jsx
  const renderAdminLayout = (page) => <LayoutUtama>{page}</LayoutUtama>;
  ```
- **Karakteristik**:
  - `<Sidebar>` (lebar tetap `260px` di desktop, slide-over di mobile) dan `<Topbar>` (sticky di bagian atas `z-30`) tidak pernah mereload atau berkedip saat navigasi antar-halaman.
  - Posisi scroll sidebar selalu terjaga (*scroll position preserved*).
  - Indikator loading bar Inertia dikunci pada warna emas `#c4a266`.

### B. Desain Kanvas Layar Lebar (Executive Layout)
- **Kontainer Induk**: Menggunakan `<PageContainer>` dengan lebar maksimum `max-w-[1600px]`, dipusatkan horizontal (`mx-auto`), dan padding responsif:
  - Mobile: `px-4 py-4`
  - Tablet: `sm:px-6 py-6`
  - Desktop: `lg:px-8 py-6`
  - Widescreen: `xl:px-10`

### C. Anatomi Standar Halaman HRIS
Setiap halaman baru wajib mengikuti hierarki vertikal berikut:
```
1. <PageContainer>
     ├── <Toast /> (Feedback aksi sistem)
     ├── <PageHeader /> (Eyebrow, Judul, Deskripsi, Tombol Aksi Kanan)
     ├── <Grid KPI Cards> (3 sampai 4 kartu ringkasan metrik)
     ├── <Segmented Controls> (Jika ada filter primer, misal: Lokasi Mariuk vs Cimalaka)
     └── <Card>
           ├── <TableToolbar>
           │     ├── <TableSearch />
           │     └── <TableFilterGroup> (Dropdown Filter & Tombol Reset)
           ├── <CardContent className="p-0">
           │     └── <Table> (Matriks data utama)
           └── <TableFooter / Pagination> (Informasi baris & navigasi halaman)
```

### D. Universal Hidden Scrollbar
Sesuai aturan arsitektur, seluruh scrollbar pada kanvas, sidebar, modal, dan tabel horizontal disembunyikan tanpa merusak fungsi scroll:
- Kelas utilitas bawaan: `.no-scrollbar` dan `.scrollbar-none`.
- CSS global: `*::-webkit-scrollbar { display: none !important; }`.

---

## 5. Elevation & Depth

Desain sistem HCGA mengutamakan **tonal depth dan batas garis presisi** dibandingkan efek bayangan mengambang berlebih (*low-elevation clean look*).

| Tingkat | Nilai Bayangan & Border | Penggunaan |
| :--- | :--- | :--- |
| **Flat / Ground** | `border-0 shadow-none bg-[#f6f8fb]` | Kanvas latar belakang utama halaman |
| **Card Surface** | `border border-slate-200/90 shadow-2xs` | Kartu konten (`<Card>`), panel informasi |
| **Interactive Card** | `hover:border-slate-300 hover:shadow-xs transition-all` | Kartu yang dapat diklik / dipilih |
| **Elevated Control** | `border border-slate-200 shadow-xs bg-white` | Tombol toolbar, segmented pill aktif |
| **Floating Dialog** | `border border-slate-200/80 shadow-2xl bg-white` | Modal dialog (`<Modal>`), floating popup |
| **Backdrop Blur** | `bg-slate-950/60 backdrop-blur-xs` | Latar belakang pengunci fokus saat modal terbuka |

---

## 6. Shapes & Form Controls

### A. Skala Sudut Lengkung (Border Radius)
- **`rounded-md` (6px)**: Badge status kecil, indikator mikro, ikon kontainer mini.
- **`rounded-lg` (8px)**: Tombol (`<Button>`), field input (`<Input>`), select (`<TableSelect>`), dan baris tabel interaktif.
- **`rounded-xl` (12px)**: Kartu konten (`<Card>`), toolbar container, tab switcher tersegmentasi.
- **`rounded-2xl` (16px)**: Dialog modal (`<Modal>`), ID Card preview karyawan.
- **`rounded-full`**: Avatar personil, bullet status presensi, counter badge lingkaran.

### B. Standarisasi Elemen Form & Input
Setiap field input form wajib memenuhi spesifikasi:
- **Tinggi Elemen**: Standar `h-9` (36px) atau ringkas `h-8` (32px).
- **Tipografi**: `text-xs` font sans dengan kontras teks slate-700.
- **Warna Border**: `border-slate-300` (atau `border-slate-200` pada toolbar).
- **Fokus Ring**: `focus:ring-2 focus:ring-[#c4a266]/20 focus:border-[#c4a266] outline-none`.
- **Nilai Kosong / Waktu**: Dilarang me-render string `'-'` pada `<input type="time">` atau `<input type="date">` karena merusak validasi native HTML5. Gunakan fallback `''` (string kosong).

---

## 7. Atomic UI Component Catalog

Seluruh komponen berikut bertempat di [`resources/js/components/ui/`](resources/js/components/ui/) dan dapat diimpor langsung via `@/components/ui`:

### A. `<PageHeader />`
```jsx
<PageHeader
  eyebrow="MANAJEMEN KARYAWAN (CORE HR)"
  title="Data Master Karyawan"
  subtitle="Kelola profil personil, penempatan lokasi kerja, dan kelompok roster."
  actions={
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">Ekspor</Button>
      <Button size="sm">Tambah Karyawan</Button>
    </div>
  }
/>
```

### B. `<Card />` dan Subkomponennya
```jsx
<Card className="border-slate-200 shadow-2xs">
  <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
    <div>
      <CardTitle className="text-sm font-bold text-navy">Judul Kartu</CardTitle>
      <CardDescription className="text-xs">Keterangan singkat fungsi kartu.</CardDescription>
    </div>
  </CardHeader>
  <CardContent className="p-4 sm:p-5">
    {/* Isi Konten */}
  </CardContent>
</Card>
```

### C. `<Button />` (Variasi & Ukuran)
- **`variant="default"`**: Latar belakang `#10273f` Deep Navy, teks putih, hover `#1a3a5c`. Digunakan untuk aksi simpan, tambah, atau eksekusi utama.
- **`variant="outline"`**: Border slate-200, latar putih, hover slate-50. Digunakan untuk aksi filter, ekspor, atau batal.
- **`variant="secondary"`**: Latar slate-100, teks slate-900. Digunakan untuk aksi sekunder di samping tombol primer.
- **`variant="destructive"`**: Latar rose-600, teks putih. Khusus untuk aksi berbahaya (hapus data permanen).
- **`variant="ghost"`**: Tanpa border, transparan, hover slate-100. Cocok untuk tombol aksi baris tabel (ikon pensil/tempat sampah).
- **`size="default"`** (`h-9`), **`size="sm"`** (`h-8`), **`size="icon"`** (`size-9` atau `h-7 w-7`).

### D. `<Badge />`
- **`variant="default"`**: Navy korporat.
- **`variant="success"`**: Emerald untuk status Hadir / Aktif / Disetujui.
- **`variant="warning"`**: Amber untuk status Terlambat / Menunggu / Review.
- **`variant="destructive"`**: Rose untuk status Alpha / Ditolak / Berbahaya.
- **`variant="secondary"`**: Slate netral untuk informasi pendukung.

### E. `<Modal />` (Dialog Atomik Terpadu)
Mendukung `size="sm"`, `md`, `lg`, `xl`, `2xl`. Dilengkapi penutup ESC, kunci scroll body otomatis, dan `ModalHeader` dengan renderer ikon polimorfik (menerima baik komponen JSX maupun referensi fungsi).
```jsx
<Modal isOpen={isOpen} onClose={handleClose} size="lg">
  <ModalHeader
    icon={<User className="w-5 h-5 text-white" />}
    title="Ubah Profil Karyawan"
    subtitle="Perbarui data identitas dan pengaturan shift operasional."
    onClose={handleClose}
  />
  <ModalBody className="p-5 space-y-4">
    {/* Form Field */}
  </ModalBody>
  <ModalFooter className="flex items-center justify-end gap-2 border-t p-4">
    <Button variant="outline" onClick={handleClose}>Batal</Button>
    <Button onClick={handleSave}>Simpan Perubahan</Button>
  </ModalFooter>
</Modal>
```

### F. `<Toast />`
Komponen notifikasi responsif dengan auto-dismiss. Menerima prop objek `toast`: `{ type: 'success' | 'warning' | 'error', message: 'Teks Pesan' }`.
```jsx
<Toast toast={alertInfo} onClose={() => setAlertInfo(null)} />
```

### G. Komponen Pola Khusus Domain (Domain Patterns)
1. **Avatar Initials Personil**:
   ```jsx
   <div className="w-8 h-8 rounded-full bg-[#10273f]/10 text-[#10273f] font-bold flex items-center justify-center text-xs flex-shrink-0">
     {emp.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
   </div>
   ```
2. **Pill Badge Lokasi Kerja**:
   - **Mariuk**: `bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium px-1.5 py-0.5 rounded`
   - **Cimalaka**: `bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] font-medium px-1.5 py-0.5 rounded`
3. **Pill Badge Shift 12 Jam**:
   - **Pagi**: `bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold`
   - **Malam**: `bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] font-bold`

---

## 8. Do's and Don'ts

### DO (Wajib Dilakukan)
- ✅ **Gunakan Komponen Atomik**: Selalu gunakan komponen dari `@/components/ui`.
- ✅ **Sertakan Konteks Lokasi**: Tampilkan penanda lokasi (Mariuk vs Cimalaka) pada setiap data karyawan atau kehadiran.
- ✅ **Gunakan Format Waktu 24 Jam**: Selalu gunakan format waktu JJ:MM (`07:00` dan `19:00`) untuk konsistensi operasional 12 jam.
- ✅ **Gunakan Monospace untuk Data Teknis**: Gunakan `font-mono` untuk NIP, jam digital, kalkulasi angka, dan persentase kehadiran.
- ✅ **Terapkan Interaktivitas Baris**: Jadikan nama karyawan pada tabel dapat diklik untuk langsung membuka modal ubah (*inline edit affordance*).
- ✅ **Update Dokumentasi & Graphify**: Jalankan `graphify update .` dan catat perubahan arsitektur pada `LAPORAN_PROYEK_HRIS.md` setiap selesai memodifikasi kode.

### DON'T (Dilarang Keras)
- ❌ **DILARANG Auto Git Push**: Jangan pernah menjalankan perintah `git push` otomatis ke remote repository tanpa instruksi manual eksplisit dari pengguna.
- ❌ **Dilarang Dialog Modal Manual**: Jangan membuat div modal floating terpisah dengan styling manual di file halaman. Wajib gunakan `<Modal>`.
- ❌ **Dilarang Alert Floating Inline**: Jangan membuat alert box melayang sendiri. Wajib gunakan `<Toast />`.
- ❌ **Dilarang Warna Sembarangan**: Jangan menambahkan warna pastel acak (misal: ungu/cyan acak). Seluruh warna wajib berasal dari `theme.js`.
- ❌ **Dilarang Mengasumsikan Shift 8 Jam**: Hindari penulisan hardcoded jam kerja 8 jam atau asumsi libur hari Minggu pada regu shift operasional.
- ❌ **Dilarang Me-render `'-'` pada Input Time/Date**: Nilai `'-'` membuat browser melempar warning dan merusak picker HTML5 native.
- ❌ **Dilarang Komentar Basa-Basi AI**: Jangan menulis komentar dekoratif (`// =======`, `// set state to true`). Tulis hanya satu baris alasan bisnis jika ada logika rumit (*anti-slop*).
