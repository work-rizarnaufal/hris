# HCGA — Sistem Monitoring Kehadiran Karyawan

Aplikasi full-stack berbahasa Indonesia dengan React/Vinext, Cloudflare Workers, dan database D1. Versi saat ini menyediakan ringkasan publik dan panel admin yang dilindungi identitas akun ChatGPT. Tidak ada kata sandi dalam kode.

## Penggunaan

1. Tambahkan karyawan, atau gunakan **Muat Data Contoh** untuk 11 karyawan simulasi (bulan sebelumnya hingga hari ini).
   Untuk mengunggah satu file, buka **Data Karyawan → Impor Excel/CSV → Unduh Template Excel**. Isi sheet Data Karyawan, unggah, periksa pratinjau, lalu simpan. Maksimal 500 karyawan dan 5 MB per file. Kolom wajib: Nama Karyawan, Jabatan, Divisi, Lokasi Kerja. Status kosong menjadi Aktif; tanggal mulai kosong mengikuti pilihan tanggal di dialog. Nonaktif wajib tanggal akhir aktif. Nama berulang atau terdaftar dilewati. Impor menambahkan data baru tanpa menimpa data lama. Tanggal menerima YYYY-MM-DD, DD/MM/YYYY, serta serial tanggal Excel 1900/1904.

2. Atur hari kerja dan tanggal libur khusus di **Pengaturan**. Default Senin–Sabtu, jam masuk 08.00 WIB.
3. Masukkan catatan individual atau massal. Hadir/Terlambat ditentukan server dari jam masuk. Jam pulang tidak menggantikan jam masuk.
4. Gunakan pemilih periode harian, mingguan, bulanan, atau rentang tanggal (maksimal 366 hari).
5. Ekspor laporan PDF/Excel, cetak, atau unduh backup JSON. Restore mengganti data operasional dan mempertahankan log perubahan.
6. Hapus simulasi melalui **Pengaturan → Hapus Data Contoh**. Karyawan contoh yang telah memiliki absensi nyata dipertahankan.

## Perhitungan

- Masuk ≤ 08.00: tepat waktu. Masuk > 08.00: terlambat, menit = masuk − 480 menit.
- Kehadiran = Hadir + Terlambat. Ketidakhadiran = Izin + Sakit + Cuti + Alpha.
- Persentase = kehadiran / hari kerja terjadwal × 100%.
- Hari terjadwal mengikuti masa aktif karyawan, kalender mingguan, dan libur khusus. Catatan nonlibur di luar jadwal menambah hari kerja. Status Libur selalu dikecualikan.
- Hari tanpa catatan = belum diinput, bukan Alpha dan bukan tepat waktu. Hari mendatang tidak dihitung dan tidak dapat diinput.
- Rotasi Grup: Shift 1 08.00–16.00 dan Shift 2 20.00–04.00 (+1 hari). Keduanya memakai tanggal mulai kerja. Jadwal Tetap: Shift 1 08.00–16.00 setiap hari. Arsip jadwal lama tetap dipertahankan.
- Ranking perhatian: Alpha ≥1, keterlambatan ≥3, atau kehadiran <90%; urutan menggunakan Alpha ×3 + keterlambatan. Ini penanda tindak lanjut administrasi, bukan keputusan kepegawaian otomatis.

## Data dan integritas

Database mempunyai unique index `(employee_id, date, shift)`, foreign key cascade, validasi server, versi untuk mencegah penimpaan perubahan bersamaan, dan transaksi batch untuk input massal/restore. Audit mencatat pelaku, waktu, tindakan, data sebelum dan sesudah. 200 log terakhir ditampilkan; seluruh log masuk backup. Log dari backup diberi label `[Backup]`.

Backup JSON versi 1: maksimal 6 MB, 2.000 karyawan, 12.000 absensi, 50.000 log saat restore. Data medis detail tidak diperlukan; kolom catatan bersifat opsional. Data asli pengguna tidak disertakan dalam repositori.

## Pengembangan

Ikuti skill Sites untuk instalasi, preview, build, dan publikasi. Konfigurasi ada di `.openai/hosting.json`; migrasi schema di `drizzle/`. Seed berada di API dan dijalankan eksplisit, bukan migrasi. `pnpm test` menguji perhitungan; `pnpm exec tsc --noEmit` memeriksa TypeScript. Pengujian API di `tests/api.test.ts` memakai adapter SQLite dalam memori dan identitas uji, tidak mengubah database produksi.

## Rotasi dua grup dan dua shift
Menu Jadwal & Grup menetapkan anggota tunggal A/B (kapasitas 25 per grup), tanggal Hari 1, dan grup pertama. Target 50 tidak membuat identitas fiktif; daftar aktual tetap dipertahankan. Setiap grup bekerja bergantian tiap hari kalender dan wajib mencatat Shift 1 serta Shift 2 secara terpisah. Shift malam menggunakan tanggal mulai kerja. Jadwal manual dapat mengubah grup kerja dan jam shift untuk tanggal tertentu; perubahan yang menyalahi catatan shift tersimpan ditolak. Rencana baru dapat berlaku mulai tanggal baru, mempertahankan rencana historis.
Migrasi menambah kolom pada absensi tanpa menghapus baris: shift=0 untuk arsip lama, 1/2 untuk rotasi. Arsip lama setelah tanggal aktivasi tetap terlihat di riwayat tetapi tidak menggantikan dua absensi shift. Sebelum aktivasi, perhitungan lama tetap berlaku. Absensi kosong ditampilkan belum diinput, bukan otomatis Alpha; hari grup libur tidak menjadi denominator. Persentase rotasi dihitung per slot karyawan/shift.

## Jadwal Tetap per karyawan
Data Karyawan → Atur jadwal menyediakan kategori Rotasi Grup atau Jadwal Tetap, grup A/B atau Tidak mengikuti grup, jam masuk/pulang, serta tanggal mulai berlaku. Pilihan ini eksplisit oleh admin dan tidak diturunkan dari jabatan. Jadwal Tetap bekerja setiap hari (termasuk Minggu dan tanggal libur) 08.00–16.00, hanya Shift 1. Pengaturan libur/jam grup tidak mengubah jadwal tetap. Penyimpanan kategori menggunakan rencana historis di database pengaturan; karyawan dan absensi tidak dihapus atau dikonversi. Pergantian kategori bertanggal mempertahankan paritas rotasi dan rencana sebelumnya; konflik dengan absensi tersimpan ditolak.
Dashboard dan laporan memakai filter grup/kategori, jabatan, shift dan periode yang sama untuk pembilang serta penyebut, termasuk ekspor PDF/Excel. Filter shift malam untuk Jadwal Tetap menghasilkan nol kewajiban, bukan Alpha. Backup/restore mempertahankan kategori dan riwayat rencana.

## Ringkasan publik dan admin
Halaman utama menampilkan ringkasan agregat tanpa nama, ID, jabatan, lokasi, catatan, data individu, atau log. API publik hanya tersedia lewat GET `/api/hcga?public=1&month=YYYY-MM`. Respons menggunakan daftar kolom agregat yang diizinkan; permintaan backup selalu memerlukan admin.

Identitas admin diverifikasi di server melalui email akun ChatGPT yang cocok dengan runtime secret `HCGA_ADMIN_EMAILS` (daftar dipisahkan koma). Konfigurasi kosong menolak akses admin. Semua GET data lengkap/backup dan semua POST memakai pemeriksaan ini; login akun lain tidak memberi hak admin. Tombol Masuk Admin memakai alur masuk ChatGPT yang disediakan platform. Rahasia tidak disimpan di repositori. Mode publik hosting baru dibuka sesudah versi dengan otorisasi ini berhasil dipasang.
