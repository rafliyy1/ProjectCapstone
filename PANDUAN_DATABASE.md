# 📘 Panduan Lengkap Integrasi Database MySQL ke Web Reka Limbah

Panduan ini menjelaskan langkah demi langkah dari awal sekali bagaimana menghubungkan database MySQL dengan web **Reka Limbah**, memindahkan data produk yang sudah ada, mengelola pesan formulir kontak, dan mengelola akun admin baru.

---

## 🧠 Konsep: Bagaimana Database Terhubung ke Web?

Di browser (sisi Frontend seperti React), aplikasi berjalan di komputer pengunjung. Browser **tidak dapat dan tidak boleh** terhubung langsung ke database MySQL karena:
1. **Keamanan (Security)**: Menyimpan password database di kode React akan terbaca oleh siapa saja yang membuka website.
2. **Protokol Jaringan**: Browser berbicara menggunakan protokol HTTP/HTTPS, sedangkan MySQL menggunakan protokol TCP soket database internal.

### Arsitektur yang Kita Gunakan (Standar Industri):
```
[ Browser / React Frontend ] 
         ↕ (HTTP REST API: GET, POST, DELETE)
[ Server Backend (Node.js & Express) ] 
         ↕ (Koneksi SQL mysql2 via port 3306)
[ Database MySQL (reka_limbah_db) ]
```

Saat Anda menambah produk di web:
1. React mengirim data ke Backend (`POST http://localhost:5000/api/products`).
2. Server Backend mengeksekusi query `INSERT INTO products ...` ke MySQL.
3. Database MySQL menyimpan data secara permanen.
4. Halaman produk web langsung memperbarui tampilannya dari data database tersebut.

---

## 🗄️ Tiga Tabel Database yang Dibuat

1. **`products`**: Menyimpan semua produk (nama, kategori, deskripsi, harga, bahan, gambar).
2. **`messages`**: Menyimpan seluruh pesan yang dikirim pengunjung melalui Formulir Kontak.
3. **`admins`**: Menyimpan username, nama, dan password terenkripsi (bcrypt) untuk admin.

---

## 🚀 Langkah-Langkah Menggunakan Database dari Awal

### Langkah 1: Pastikan Layanan MySQL Sudah Berjalan
- **Jika memakai XAMPP**: Buka XAMPP Control Panel, lalu klik tombol **Start** pada modul **MySQL**.
- **Jika memakai MySQL Server / Workbench**: Pastikan service MySQL di Windows sudah aktif (berjalan di port 3306).

---

### Langkah 2: Sesuaikan Password MySQL di File `.env`
Buka file [`.env`](file:///e:/Bootcamp%20front%20end/ProjectCapstone/.env) yang ada di folder proyek:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=masukkan_password_mysql_anda
DB_NAME=reka_limbah_db
DB_PORT=3306

PORT=5000
```
> **Catatan Penting:**
> - Jika Anda menggunakan **XAMPP default**, biasanya password kosong: `DB_PASSWORD=`.
> - Jika Anda menginstal **MySQL Community Server / Workbench**, isikan password `root` yang Anda buat saat instalasi MySQL.

---

### Langkah 3: Inisialisasi Database & Pindahkan Data Lama (Otomatis)
Kami telah membuat script otomatis yang akan:
- Membuat database `reka_limbah_db`.
- Membuat tabel `products`, `messages`, dan `admins`.
- **Memindahkan otomatis 15 data produk lama** dari kode ke tabel `products`.
- **Membuat akun admin default** di tabel `admins`.

Cukup buka terminal di folder project dan jalankan:
```bash
npm run db:init
```

Jika sukses, terminal akan menampilkan:
```
✅ Terhubung ke MySQL Server!
✅ Database "reka_limbah_db" siap digunakan.
📋 Membuat tabel "products"...
📋 Membuat tabel "messages"...
📋 Membuat tabel "admins"...
🚚 Memindahkan 15 data produk awal ke database...
✅ Berhasil memindahkan 15 produk ke tabel "products"!
✅ User admin default dibuat:
   👉 Username: admin
   👉 Password: admin123
🎉 Inisialisasi Database Selesai dengan SUKSES!
```

*(Opsional: Anda juga bisa mengimpor manual file [`database/schema.sql`](file:///e:/Bootcamp%20front%20end/ProjectCapstone/database/schema.sql) melalui phpMyAdmin atau MySQL Workbench).*

---

### Langkah 4: Menjalankan Server Backend API
Buka terminal dan jalankan:
```bash
npm run server
```
Server backend akan aktif di `http://localhost:5000`.
Biarkan terminal ini tetap menyala.

---

### Langkah 5: Menjalankan Web Frontend
Buka terminal kedua (baru) dan jalankan:
```bash
npm run dev
```
Buka browser di alamat `http://localhost:5173`.

---

## 🎯 Cara Menguji & Menggunakan Fitur-Fitur Database di Web

### 1. Data Produk (Tersimpan & Sinkron ke MySQL)
1. Buka menu **Admin** (di navbar kanan atas atau footer).
2. Masuk dengan:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Pada tab **Kelola Produk**:
   - Masukkan Nama Produk baru (misal: *Lampu Meja Bambu*).
   - Pilih Kategori & Bahan.
   - Masukkan Harga & Deskripsi.
   - Klik **+ Simpan ke Database**.
4. Buka halaman **Produk** (`/produk`):
   - Produk baru langsung muncul!
   - Terdapat indikator hijau **MySQL Live** yang menandakan website sedang mengambil data langsung dari MySQL.
   - Jika produk dihapus dari halaman Admin, produk tersebut akan otomatis terhapus dari MySQL dan dari halaman website.

---

### 2. Pesan Masuk (Bukan WhatsApp, Simpan ke MySQL)
1. Buka halaman **Kontak** (`/kontak`).
2. Isi formulir kontak:
   - Nama: *Budi Santoso*
   - Email: *budi@example.com*
   - Subjek: *Pesanan Kustom*
   - Rincian Pesan: *Halo Reka Limbah, saya ingin memesan tas perca kustom 50 pcs.*
3. Klik **Kirim Pesan Sekarang**.
4. Buka halaman **Admin** -> tab **Pesan Masuk**:
   - Pesan Budi Santoso akan langsung terlihat lengkap dengan rincian subjek, waktu kirim, dan tombol hapus!

---

### 3. Username & Password Admin (Fitur Menambah Admin Baru)
1. Di halaman **Admin**, klik tab **User Admin**.
2. Anda akan melihat daftar admin yang terdaftar di MySQL (awalnya akun `admin`).
3. Pada form **Tambah Admin Baru**:
   - Masukkan Nama: *Admin Dua*
   - Masukkan Username Baru: *admindua*
   - Masukkan Password Baru: *rahasia123* (minimal 6 karakter)
   - Klik **+ Daftarkan Admin Baru**.
4. Password admin secara otomatis di-hash (terenkripsi kuat) dengan algoritma **bcrypt** sebelum disimpan ke database MySQL demi keamanan.
5. Coba klik **Keluar (Logout)** di kanan atas.
6. Masuk kembali menggunakan akun baru:
   - Username: `admindua`
   - Password: `rahasia123`
7. Anda berhasil masuk dengan hak akses admin baru!

---

## 🛠️ Ringkasan Perintah Penting

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run db:init` | Membuat database, membuat tabel, dan migrasi produk + admin awal ke MySQL |
| `npm run server` | Menjalankan server backend Express API (Port 5000) |
| `npm run dev` | Menjalankan web frontend React (Port 5173) |
| `npm run build` | Melakukan build produksi aplikasi |

Semua file server terletak di folder [`server/`](file:///e:/Bootcamp%20front%20end/ProjectCapstone/server/) dan skema database ada di [`database/schema.sql`](file:///e:/Bootcamp%20front%20end/ProjectCapstone/database/schema.sql).
