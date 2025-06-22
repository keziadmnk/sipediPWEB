# SIPEDI Database Seeders

Dokumentasi lengkap untuk sistem seeding database SIPEDI (Sistem Informasi Perpustakaan Digital).

## Daftar Isi

- [Overview](#overview)
- [Struktur Seeders](#struktur-seeders)
- [Data yang Di-seed](#data-yang-di-seed)
- [Cara Menjalankan](#cara-menjalankan)
- [Troubleshooting](#troubleshooting)

## Overview

Sistem seeding ini menyediakan data master untuk aplikasi SIPEDI, termasuk:
- **3 Role**: Admin, Petugas, Mahasiswa
- **15 Kategori**: Karya Ilmiah, Ilmu Komputer, Ekonomi dan Bisnis, dll.
- **2 Jenis Buku**: E-Book, Buku Fisik
- **5 Pengguna**: 1 Admin, 1 Petugas, 3 Mahasiswa
- **15 Buku**: Berbagai judul dengan kategori dan jenis yang bervariasi
- **9 Peminjaman**: Data peminjaman dengan berbagai status
- **8 Ulasan**: Review buku dari mahasiswa

## Struktur Seeders

```
seeders/
├── index.js              # File utama untuk menjalankan semua seeders
├── roleSeeder.js         # Data role (Admin, Petugas, Mahasiswa)
├── kategoriSeeder.js     # Data kategori buku (15 kategori)
├── jenisSeeder.js        # Data jenis buku (E-Book, Buku Fisik)
├── penggunaSeeder.js     # Data pengguna (5 akun)
├── bukuSeeder.js         # Data buku (15 judul)
├── peminjamanSeeder.js   # Data peminjaman (9 transaksi)
└── ulasanSeeder.js       # Data ulasan (8 review)
```

## Data yang Di-seed

### 1. Role (3 data)
- **Admin** (ID: 1)
- **Petugas** (ID: 2) 
- **Mahasiswa** (ID: 3)

### 2. Kategori (15 data)
1. **Karya Ilmiah**
2. **Ilmu Komputer**
3. **Ekonomi dan Bisnis**
4. **Teknik**
5. **Pendidikan**
6. **Sains dan Matematika**
7. **Hukum**
8. **Kesehatan dan Kedokteran**
9. **Ilmu Sosial dan Politik**
10. **Bahasa dan Sastra**
11. **Agama dan Filsafat**
12. **Arsitektur dan Desain**
13. **Pertanian dan Peternakan**
14. **Referensi Umum**
15. **Majalah dan Jurnal**

### 3. Jenis Buku (2 data)
- **E-Book** (ID: 1)
- **Buku Fisik** (ID: 2)

### 4. Pengguna (5 data)

#### Admin
- **ID**: 001
- **Username**: admin
- **Password**: admin123
- **Nama**: Budi Baik
- **Email**: admin@gmail.com

#### Petugas
- **ID**: 1371118001234
- **Username**: petugas
- **Password**: petugas123
- **Nama**: Dodo Baik
- **Email**: petugas@gmail.com

#### Mahasiswa
- **ID**: 2311521001
- **Username**: mahasiswa1
- **Password**: mahasiswa123
- **Nama**: Susi Baik
- **Email**: mahasiswa1@student.unand.ac.id

- **ID**: 2311521002
- **Username**: mahasiswa2
- **Password**: mahasiswa123
- **Nama**: Dodo Baik
- **Email**: mahasiswa2@student.unand.ac.id

- **ID**: 2311521003
- **Username**: mahasiswa3
- **Password**: mahasiswa123
- **Nama**: Gogo Baik
- **Email**: mahasiswa3@student.unand.ac.id

### 5. Buku (15 data)

| ISBN | Judul | Pengarang | Kategori | Stok |
|------|-------|-----------|----------|------|
| 978-623-500-418-1 | Komunikasi Pertanian | Ramainim Saragih | Pertanian dan Peternakan | 5 |
| 6020651622 | Negara dan Politik Kesejahteraan | A. Muhaimin Iskandar | Ilmu Sosial dan Politik | 3 |
| 978-623-218-529-6 | Filsafat Keadilan: Biological Justice | Dr. Drs. H. Amran Suadi, S.H., M.Hum., M.M. | Agama dan Filsafat | 4 |
| 978-623-329-861-2 | Advokasi Pelayanan Kesehatan | Desri Suryani, Yandrizal | Kesehatan dan Kedokteran | 6 |
| 978-623-8483-60-0 | Buku Ajar Jaringan Komputer | Alfry Aristo Jansen Sinlae dkk. | Ilmu Komputer | 8 |
| 978-623-220-036-4 | Agama untuk Peradaban | Komaruddin Hidayat | Agama dan Filsafat | 4 |
| 978-623-02-0145-5 | Apa Itu Sastra: Jenis-Jenis Karya Sastra... | Juni Ahyar | Bahasa dan Sastra | 5 |
| 979-420-531-1 | Arsitektur Klasik Eropa | Yulianto Sumalyo | Arsitektur dan Desain | 3 |
| 978-623-012-677-2 | Dasar Pemrograman Julia | Abdul Kadir | Ilmu Komputer | 7 |
| 979-7691-004 | Filsafat Agama | Amsal Bakhtiar | Agama dan Filsafat | 4 |
| 978-602-723-826-7 | Sosiologi Hukum | Prof. Suriansyah Murhaini | Hukum | 5 |
| 978-623-231-325-5 | Filsafat Nilai & Aplikasinya | Asmoro Achmadi | Agama dan Filsafat | 6 |
| 978-602-445-850-8 | Informatika Kelas 3 SD/MI | Subroto Rahardjo | Pendidikan | 10 |
| 978-623-218-976-8 | Sosiologi Hukum | Aris Prio Agus Santoso | Hukum | 4 |
| 978-979-769-479-1 | Filsafat Umum: Pendekatan Tematik | Tim Penulis | Agama dan Filsafat | 3 |

**Catatan**: Semua buku memiliki kedua jenis (E-Book dan Buku Fisik)

### 6. Peminjaman (9 data)

#### Dikembalikan Tepat Waktu (2 data)
- Mahasiswa 1 meminjam "Buku Ajar Jaringan Komputer" (dikembalikan 1 hari sebelum deadline)
- Mahasiswa 2 meminjam "Apa Itu Sastra" (dikembalikan 1 hari sebelum deadline)

#### Masih Dipinjam (2 data)
- Mahasiswa 2 meminjam "Dasar Pemrograman Julia" (status: Dipinjam)
- Mahasiswa 1 meminjam "Agama untuk Peradaban" (status: Dipinjam)

#### Terlambat dengan Denda (5 data)
- Mahasiswa 3 meminjam "Filsafat Keadilan" (terlambat 3 hari, denda: Rp 15.000)
- Mahasiswa 3 meminjam "Arsitektur Klasik Eropa" (terlambat 4 hari, denda: Rp 20.000)
- Mahasiswa 1 meminjam "Filsafat Nilai & Aplikasinya" (terlambat 3 hari, denda: Rp 15.000)
- Mahasiswa 3 meminjam "Advokasi Pelayanan Kesehatan" (terlambat 2 hari, denda: Rp 10.000)
- Mahasiswa 1 meminjam "Sosiologi Hukum" (terlambat 2 hari, denda: Rp 10.000)

**Aturan Denda**: Rp 5.000 per hari keterlambatan
**Durasi Peminjaman**: 3 hari

### 7. Ulasan (8 data)
- 8 ulasan dari 3 mahasiswa untuk berbagai buku
- Rating berkisar 4-5 bintang
- Ulasan mencakup buku dari berbagai kategori

## Cara Menjalankan

### 1. Menjalankan Semua Seeders
```bash
npm run seeds
```

### 2. Menjalankan Seeder Individual
```bash
# Menjalankan seeder tertentu
node seeders/roleSeeder.js
node seeders/kategoriSeeder.js
node seeders/jenisSeeder.js
node seeders/penggunaSeeder.js
node seeders/bukuSeeder.js
node seeders/peminjamanSeeder.js
node seeders/ulasanSeeder.js
```

### 3. Urutan Eksekusi
Seeders dijalankan dalam urutan berikut:
1. **Kategori** (harus pertama karena direferensikan oleh buku)
2. **Jenis** (harus kedua karena direferensikan oleh buku)
3. **Role** (harus ketiga karena direferensikan oleh pengguna)
4. **Pengguna** (harus keempat karena direferensikan oleh peminjaman & ulasan)
5. **Buku** (harus kelima karena direferensikan oleh peminjaman & ulasan)
6. **Peminjaman** (harus keenam karena direferensikan oleh ulasan)
7. **Ulasan** (terakhir karena bergantung pada buku dan pengguna)

## Troubleshooting

### Error: Foreign Key Constraint
**Penyebab**: Data yang direferensikan belum ada
**Solusi**: Pastikan urutan seeding sudah benar atau drop database dan jalankan ulang

### Error: Cannot find module
**Penyebab**: File seeder tidak ditemukan
**Solusi**: Pastikan semua file seeder ada di folder `seeders/`

### Data Tidak Muncul
**Penyebab**: Database belum di-sync atau ada error saat seeding
**Solusi**: 
1. Drop database: `DROP DATABASE sipedi;`
2. Jalankan: `npm run seeds`

### Error: Duplicate Entry
**Penyebab**: Data sudah ada di database
**Solusi**: Seeders otomatis menghapus data lama sebelum insert data baru

## Informasi Login

Setelah seeding berhasil, Anda dapat login dengan:

### Admin
- **Email**: admin@gmail.com
- **Password**: admin123

### Petugas
- **Email**: petugas@gmail.com
- **Password**: petugas123

### Mahasiswa
- **Email**: mahasiswa1@student.unand.ac.id, mahasiswa2@student.unand.ac.id, mahasiswa3@student.unand.ac.id
- **Password**: mahasiswa123

## Catatan Penting

1. **Password di-hash** menggunakan bcrypt dengan salt rounds 10
2. **Auto-increment** tidak di-reset manual untuk menghindari konflik
3. **Foreign key** diatur sesuai dengan urutan seeding
4. **Data peminjaman** sudah logis dengan tanggal yang konsisten
5. **Denda** dihitung berdasarkan aturan Rp 5.000 per hari keterlambatan

## Drop Database

Jika perlu menghapus database sepenuhnya:
```sql
DROP DATABASE sipedi;
```

Kemudian jalankan `npm run seeds` untuk membuat database baru dengan data lengkap. 