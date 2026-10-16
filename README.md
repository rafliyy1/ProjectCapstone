# Reka Limbah - Web Company Profile & Manajemen Produk Daur Ulang

Website Company Profile untuk **Reka Limbah**, sebuah usaha kreatif yang berfokus pada pemanfaatan kembali bahan bekas/limbah menjadi produk kerajinan fungsional dan estetis. Proyek ini dibangun menggunakan **React + Vite** pada sisi frontend, **Express.js** pada sisi backend API, dan terintegrasi penuh dengan database **MySQL**.

---

## Fitur Utama

- **Katalog Produk Dinamis**: Menampilkan koleksi kerajinan daur ulang yang tersinkronisasi langsung dengan database MySQL, lengkap dengan fitur pencarian dan filter kategori.
- **Formulir Kontak**: Pesan dari pengunjung yang dikirim melalui formulir kontak tersimpan langsung ke database MySQL.
- **Panel Dashboard Admin**:
  - **Kelola Produk**: Menambahkan produk baru (lengkap dengan upload file foto PNG/JPG), melihat daftar produk, serta menghapus produk langsung dari MySQL.
  - **Pesan Masuk**: Membaca pesan yang dikirimkan pengunjung melalui formulir kontak, melihat tanggal masuk, serta menandai pesan yang sudah dibaca.
  - **User Admin**: Menambahkan akun admin baru (password dienkripsi menggunakan bcrypt) dan mengelola akun admin terdaftar.
- **Autentikasi & Navigasi Dinamis**: Tombol login di navigasi akan otomatis menampilkan nama akun admin yang sedang aktif ketika login berhasil.

---

## Teknologi yang Digunakan

- **Frontend**: React 19, Vite, Tailwind CSS, React Router DOM
- **Backend**: Node.js, Express.js, CORS, Dotenv, Bcrypt.js
- **Database**: MySQL

---

## Panduan Menjalankan Proyek (Setup & Run)

Bagi siapa pun yang meng-clone proyek ini ke perangkat baru, ikuti tahapan berikut dari awal hingga selesai:

### 1. Prasyarat Sistem

Pastikan perangkat Anda sudah terinstal:

- [Node.js](https://nodejs.org/) (versi 18 ke atas)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) atau software bundle seperti [Laragon](https://laragon.org/) / [XAMPP](https://www.apachefriends.org/)

---

### 2. Clone Repositori

Buka Terminal / Command Prompt di komputer Anda, lalu jalankan:

```bash
git clone https://github.com/rafliyy1/ProjectCapstone.git
cd ProjectCapstone
```

---

### 3. Instal Dependensi Proyek

Instal seluruh package frontend dan backend yang diperlukan:

```bash
npm install
```

---

### 4. Konfigurasi Database (.env)

1. Di dalam folder proyek, buat file bernama `.env` (atau salin dari `.env.example`):
   - Di Windows PowerShell: `copy .env.example .env`
   - Di Linux/Mac: `cp .env.example .env`
2. Buka file `.env` tersebut dan sesuaikan konfigurasinya dengan setelan MySQL Anda:

```env
# Konfigurasi Database MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=masukkan_password_mysql_anda
DB_NAME=reka_limbah_db
DB_PORT=3306

# Port Server Backend
PORT=5000
```

> **Catatan:**
>
> - Jika menggunakan **Laragon / XAMPP default**, password biasanya dikosongkan: `DB_PASSWORD=`
> - Jika menggunakan **MySQL Workbench / Installer**, isikan password `root` Anda.

---

### 5. Inisialisasi Database (Otomatis)

Pastikan service MySQL Anda sudah berjalan, lalu jalankan perintah berikut di terminal:

```bash
npm run db:init
```

Perintah ini akan secara otomatis:

1. Membuat database `reka_limbah_db`
2. Membuat tabel `products`, `messages`, dan `admins`
3. Memindahkan data 15 produk awal ke tabel `products`
4. Membuat akun admin default:
   - **Username**: `admin`
   - **Password**: `admin123`

---

### 6. Menjalankan Aplikasi

Aplikasi membutuhkan **dua terminal** yang berjalan bersamaan:

#### Terminal 1: Menjalankan Backend API

```bash
npm run server
```

Server API akan aktif di `http://localhost:5000`.

#### Terminal 2: Menjalankan Web Frontend

Buka tab terminal baru, lalu jalankan:

```bash
npm run dev
```

Aplikasi web siap diakses melalui browser di alamat:
👉 **`http://localhost:5173`**

---

## Ringkasan Perintah Terminal

| Perintah          | Fungsi                                             |
| :---------------- | :------------------------------------------------- |
| `npm install`     | Mengunduh seluruh dependensi proyek                |
| `npm run db:init` | Membuat database dan mengisi data awal ke MySQL    |
| `npm run server`  | Menjalankan server backend Express API (Port 5000) |
| `npm run dev`     | Menjalankan server web frontend React (Port 5173)  |
| `npm run build`   | Membuat bundle file produksi (Production Build)    |
