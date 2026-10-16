import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { products as initialProducts } from '../src/data/products.js'

dotenv.config()

const host = process.env.DB_HOST || 'localhost'
const user = process.env.DB_USER || 'root'
const password = process.env.DB_PASSWORD || ''
const database = process.env.DB_NAME || 'reka_limbah_db'
const port = Number(process.env.DB_PORT) || 3306

async function initDatabase() {
  console.log('----------------------------------------------------')
  console.log('🔄 Memulai Inisialisasi Database MySQL Reka Limbah...')
  console.log(`📡 Menghubungkan ke MySQL di ${host}:${port} sebagai user "${user}"...`)

  let connection
  try {
    // 1. Koneksi awal ke server MySQL tanpa memilih database
    connection = await mysql.createConnection({ host, user, password, port })
    console.log('✅ Terhubung ke MySQL Server!')

    // 2. Buat database jika belum ada
    console.log(`📦 Memeriksa / Membuat database "${database}"...`)
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    )
    console.log(`✅ Database "${database}" siap digunakan.`)

    // Ganti database aktif
    await connection.changeUser({ database })

    // 3. Buat Tabel Produk
    console.log('📋 Membuat tabel "products"...')
    await connection.query(`
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
    `)
    // Pastikan kolom gambar bertipe LONGTEXT agar dapat menyimpan file PNG/JPG
    await connection.query('ALTER TABLE products MODIFY gambar LONGTEXT NOT NULL;')


    // 4. Buat Tabel Pesan Kontak
    console.log('📋 Membuat tabel "messages"...')
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        subjek VARCHAR(150) NOT NULL,
        pesan TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)

    // 5. Buat Tabel Admin
    console.log('📋 Membuat tabel "admins"...')
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nama VARCHAR(150) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)

    // 6. Migrasi data produk awal jika tabel masih kosong
    const [existingProducts] = await connection.query('SELECT COUNT(*) as count FROM products')
    if (existingProducts[0].count === 0) {
      console.log(`🚚 Memindahkan ${initialProducts.length} data produk awal ke database...`)
      for (const prod of initialProducts) {
        await connection.query(
          `INSERT INTO products (id, nama, kategori, deskripsi, harga, bahan, gambar)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [prod.id, prod.nama, prod.kategori, prod.deskripsi, prod.harga, prod.bahan, prod.gambar]
        )
      }
      console.log(`✅ Berhasil memindahkan ${initialProducts.length} produk ke tabel "products"!`)
    } else {
      console.log(`ℹ️ Tabel "products" sudah berisi ${existingProducts[0].count} item (tidak diduplikasi).`)
    }

    // 7. Buat user admin default jika belum ada
    const [existingAdmins] = await connection.query('SELECT COUNT(*) as count FROM admins')
    if (existingAdmins[0].count === 0) {
      console.log('👤 Membuat user admin default...')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await connection.query(
        `INSERT INTO admins (username, password, nama) VALUES (?, ?, ?)`,
        ['admin', hashedPassword, 'Administrator Utama']
      )
      console.log('✅ User admin default dibuat:')
      console.log('   👉 Username: admin')
      console.log('   👉 Password: admin123')
    } else {
      console.log(`ℹ️ Tabel "admins" sudah memiliki ${existingAdmins[0].count} admin terdaftar.`)
    }

    console.log('----------------------------------------------------')
    console.log('🎉 Inisialisasi Database Selesai dengan SUKSES!')
    console.log('----------------------------------------------------')
  } catch (error) {
    console.error('❌ Gagal menginisialisasi database:')
    console.error(error.message)
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n⚠️ TIPS: Periksa username & password di file .env')
      console.error('Buka file .env lalu sesuaikan DB_PASSWORD dengan password MySQL Anda.')
    }
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

initDatabase()
