-- ========================================================
-- DATABASE SCHEMA: REKA LIMBAH
-- ========================================================
-- Jalankan file ini di MySQL Workbench, phpMyAdmin, atau MySQL CLI:
-- mysql -u root -p < database/schema.sql
-- ========================================================

CREATE DATABASE IF NOT EXISTS reka_limbah_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE reka_limbah_db;

-- 1. Tabel Produk
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  kategori VARCHAR(100) NOT NULL,
  deskripsi TEXT NOT NULL,
  harga INT NOT NULL,
  bahan VARCHAR(255) NOT NULL,
  gambar LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Pesan Masuk (dari Formulir Kontak)
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subjek VARCHAR(150) NOT NULL,
  pesan TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Admin (Username, Password Hashed, Nama)
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nama VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================================
-- DATA AWAL (SEED DATA)
-- ========================================================

-- Akun admin default: username "admin", password "admin123"
-- Password di-hash menggunakan bcrypt ($2a$10$w... / hash standar)
INSERT INTO admins (username, password, nama)
VALUES ('admin', '$2b$10$0Txb1AgHQIP7QR6JDHDTAOrD3a9RRgqtBWWcC0glSh.zKVKgPFFa2', 'Administrator Utama')
ON DUPLICATE KEY UPDATE username=username;

-- 15 Produk Awal dari Reka Limbah
INSERT INTO products (id, nama, kategori, deskripsi, harga, bahan, gambar) VALUES
(1, 'Tas Totebag Perca', 'Tas & Dompet', 'Kombinasi corak kain perca konveksi yang dijahit rapat, menemani hari-harimu dengan pesona daur ulang yang berharga.', 85000, 'kain perca konveksi', '/products/tas-totebag-perca.jpg'),
(2, 'Dompet Plastik Kemasan', 'Tas & Dompet', 'Plastik kemasan berlapis disulap menjadi dompet tahan air yang awet, mengubah sampah konsumsi jadi karya fungsional bernilai.', 45000, 'plastik kemasan bekas', '/products/dompet-plastik-kemasan.jpg'),
(3, 'Tas Selempang Goni', 'Tas & Dompet', 'Serat karung goni bekas yang kuat dan berkarakter, dipadukan tali kokoh untuk petualangan harian yang bersahaja.', 95000, 'karung goni bekas', '/products/tas-selempang-goni.jpg'),
(4, 'Vas Botol Kaca', 'Dekorasi Rumah', 'Botol kaca minuman yang diselamatkan dan dipercantik aksen lilitan rami, menghadirkan kesegaran alami di meja sudut.', 55000, 'botol kaca bekas', '/products/vas-botol-kaca.jpg'),
(5, 'Lampu Gantung Kaleng', 'Dekorasi Rumah', 'Kaleng biskuit bekas dipahat presisi menghasilkan pancaran cahaya temaram yang hangat dan memikat di ruang santai.', 100000, 'kaleng bekas', '/products/lampu-gantung-kaleng.jpg'),
(6, 'Pot Tanaman Ban Bekas', 'Dekorasi Rumah', 'Karet ban kendaraan bekas dibentuk elegan menjadi pot kokoh tahan cuaca, tempat bertumbuhnya tunas-tunas baru.', 70000, 'ban bekas', '/products/pot-tanaman-ban-bekas.jpg'),
(7, 'Rak Dinding Palet', 'Furnitur Kayu Bekas', 'Kayu palet peti kemas diamplas halus berlapis pelindung natural, siap memajang pernak-pernik kenangan terindahmu.', 180000, 'kayu palet', '/products/rak-dinding-kayu.jpg'),
(8, 'Meja Kecil Drum Kabel', 'Furnitur Kayu Bekas', 'Drum gulungan kabel proyek yang diolah kembali menjadi meja samping artistik dengan guratan serat kayu otentik.', 350000, 'drum kabel kayu bekas', '/products/meja-kecil-drum-kabel.jpg'),
(9, 'Bangku Kayu Daur Ulang', 'Furnitur Kayu Bekas', 'Potongan kayu sisa bangunan dirangkai kokoh dan nyaman, membawa cerita lama menjadi tempat duduk penuh kehangatan.', 150000, 'kayu bekas bangunan dan tebangan pohon', '/products/bangku-kayu-daur-ulang.jpg'),
(10, 'Topi Tutup Botol', 'Aksesoris', 'Topi santai berhias ornamen tutup botol kaca artistik, memberi sentuhan berani bagi kamu yang peduli bumi.', 25000, 'tutup botol kaca', '/products/topi-tutup-botol.jpg'),
(11, 'Gelang Ban Dalam', 'Aksesoris', 'Karet ban dalam bekas diukir lentur menjadi gelang monokrom modis, kuat dan tahan air untuk pemakaian sehari-hari.', 30000, 'ban dalam bekas', '/products/gelang-ban-dalam.jpg'),
(12, 'Gantungan Kunci', 'Aksesoris', 'Cacahan tutup botol plastik yang dilelehkan kembali jadi keping warna-warni unik, menjaga kuncimu tetap aman.', 35000, 'tutup botol plastik', '/products/ganci-tutup-botol.jpg'),
(13, 'Tempat Pensil Kaleng', 'Alat Tulis & Organizer', 'Kaleng silinder bekas dihias anyaman serat ramah lingkungan, siap merapikan meja kerja dengan sentuhan estetika alami.', 40000, 'kaleng bekas', '/products/tempat-pensil-kaleng.jpg'),
(14, 'Buku Catatan Daur Ulang', 'Alat Tulis & Organizer', 'Kertas daur ulang bertekstur lembut dengan sampul kardus tebal, ruang berharga untuk mencatat mimpi dan inspirasimu.', 35000, 'kertas bekas', '/products/buku-daur-ulang.jpg'),
(15, 'Organizer Meja Karton', 'Alat Tulis & Organizer', 'Karton tebal padat dirakit dengan kompartemen bersekat, menjaga meja belajarmu tetap rapi tanpa menghasilkan limbah baru.', 60000, 'karton bekas', '/products/organizer-meja-karton.jpg')
ON DUPLICATE KEY UPDATE nama=VALUES(nama);