import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import pool from './db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ limit: '15mb', extended: true }))

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1 + 1 AS solution')
    res.json({
      status: 'ok',
      message: 'Server dan database MySQL terhubung normal!',
      db: 'connected',
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Server berjalan namun database MySQL belum terhubung.',
      error: err.message,
    })
  }
})

// ========================================================
// 1. ENDPOINT PRODUK (PRODUCTS)
// ========================================================

// GET /api/products - Ambil semua produk
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products ORDER BY id ASC'
    )
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('Error GET /api/products:', error)
    res.status(500).json({ success: false, message: 'Gagal mengambil data produk', error: error.message })
  }
})

// POST /api/products - Tambah produk baru
app.post('/api/products', async (req, res) => {
  try {
    const { nama, kategori, deskripsi, harga, bahan, gambar } = req.body

    if (!nama || !kategori || !deskripsi || !harga || !bahan) {
      return res.status(400).json({
        success: false,
        message: 'Field nama, kategori, deskripsi, harga, dan bahan wajib diisi.',
      })
    }

    const imgUrl = gambar && gambar.trim() !== '' ? gambar.trim() : '/products/tas-totebag-perca.jpg'

    const [result] = await pool.query(
      `INSERT INTO products (nama, kategori, deskripsi, harga, bahan, gambar)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nama.trim(), kategori.trim(), deskripsi.trim(), Number(harga), bahan.trim(), imgUrl]
    )

    const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId])

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan ke database!',
      data: newProduct[0],
    })
  } catch (error) {
    console.error('Error POST /api/products:', error)
    res.status(500).json({ success: false, message: 'Gagal menambahkan produk ke database', error: error.message })
  }
})

// PUT /api/products/:id - Ubah data produk
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nama, kategori, deskripsi, harga, bahan, gambar } = req.body

    const [result] = await pool.query(
      `UPDATE products
       SET nama = ?, kategori = ?, deskripsi = ?, harga = ?, bahan = ?, gambar = ?
       WHERE id = ?`,
      [nama, kategori, deskripsi, Number(harga), bahan, gambar, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' })
    }

    const [updated] = await pool.query('SELECT * FROM products WHERE id = ?', [id])
    res.json({ success: true, message: 'Produk berhasil diperbarui.', data: updated[0] })
  } catch (error) {
    console.error('Error PUT /api/products/:id:', error)
    res.status(500).json({ success: false, message: 'Gagal memperbarui produk', error: error.message })
  }
})

// DELETE /api/products/:id - Hapus produk
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' })
    }

    res.json({ success: true, message: 'Produk berhasil dihapus dari database.' })
  } catch (error) {
    console.error('Error DELETE /api/products/:id:', error)
    res.status(500).json({ success: false, message: 'Gagal menghapus produk', error: error.message })
  }
})

// ========================================================
// 2. ENDPOINT PESAN (MESSAGES DARI FORMULIR KONTAK)
// ========================================================

// POST /api/messages - Simpan pesan dari pengunjung web
app.post('/api/messages', async (req, res) => {
  try {
    const { nama, email, subjek, pesan } = req.body

    if (!nama || !email || !subjek || !pesan) {
      return res.status(400).json({
        success: false,
        message: 'Semua kolom formulir (nama, email, subjek, pesan) wajib diisi.',
      })
    }

    const [result] = await pool.query(
      `INSERT INTO messages (nama, email, subjek, pesan) VALUES (?, ?, ?, ?)`,
      [nama.trim(), email.trim(), subjek.trim(), pesan.trim()]
    )

    res.status(201).json({
      success: true,
      message: 'Pesan berhasil dikirim dan tersimpan di database!',
      data: { id: result.insertId, nama, email, subjek, pesan },
    })
  } catch (error) {
    console.error('Error POST /api/messages:', error)
    res.status(500).json({ success: false, message: 'Gagal menyimpan pesan ke database', error: error.message })
  }
})

// GET /api/messages - Ambil seluruh pesan yang masuk (untuk admin)
app.get('/api/messages', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM messages ORDER BY created_at DESC'
    )
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('Error GET /api/messages:', error)
    res.status(500).json({ success: false, message: 'Gagal mengambil pesan', error: error.message })
  }
})

// Handler tandai pesan sudah dibaca (mendukung PATCH, PUT, POST)
async function markMessageReadHandler(req, res) {
  try {
    const { id } = req.params
    const [result] = await pool.query('UPDATE messages SET is_read = 1 WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan.' })
    }
    res.json({ success: true, message: 'Pesan berhasil ditandai sudah dibaca.' })
  } catch (error) {
    console.error('Error mark message as read:', error)
    res.status(500).json({ success: false, message: 'Gagal menandai pesan', error: error.message })
  }
}

app.patch('/api/messages/:id/read', markMessageReadHandler)
app.put('/api/messages/:id/read', markMessageReadHandler)
app.post('/api/messages/:id/read', markMessageReadHandler)


// DELETE /api/messages/:id - Hapus pesan
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params
    const [result] = await pool.query('DELETE FROM messages WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan.' })
    }

    res.json({ success: true, message: 'Pesan berhasil dihapus.' })
  } catch (error) {
    console.error('Error DELETE /api/messages/:id:', error)
    res.status(500).json({ success: false, message: 'Gagal menghapus pesan', error: error.message })
  }
})

// ========================================================
// 3. ENDPOINT ADMIN & AUTHENTICATION
// ========================================================

// POST /api/auth/login - Autentikasi Login Admin
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' })
    }

    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username.trim()])
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' })
    }

    const admin = rows[0]
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' })
    }

    // Login sukses: kirim data admin tanpa hash password
    res.json({
      success: true,
      message: 'Login berhasil!',
      admin: {
        id: admin.id,
        username: admin.username,
        nama: admin.nama,
        created_at: admin.created_at,
      },
    })
  } catch (error) {
    console.error('Error POST /api/auth/login:', error)
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat login', error: error.message })
  }
})

// GET /api/admins - Ambil semua user admin
app.get('/api/admins', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, nama, created_at FROM admins ORDER BY id ASC'
    )
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('Error GET /api/admins:', error)
    res.status(500).json({ success: false, message: 'Gagal mengambil data admin', error: error.message })
  }
})

// POST /api/admins - Tambah user admin baru
app.post('/api/admins', async (req, res) => {
  try {
    const { username, password, nama } = req.body

    if (!username || !password || !nama) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, dan nama wajib diisi.',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password admin minimal 6 karakter.',
      })
    }

    // Periksa apakah username sudah ada
    const [existing] = await pool.query('SELECT id FROM admins WHERE username = ?', [username.trim()])
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Username "${username}" sudah digunakan. Silakan gunakan username lain.`,
      })
    }

    // Hash password sebelum disimpan ke MySQL
    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await pool.query(
      `INSERT INTO admins (username, password, nama) VALUES (?, ?, ?)`,
      [username.trim(), hashedPassword, nama.trim()]
    )

    res.status(201).json({
      success: true,
      message: `User admin "${username}" berhasil ditambahkan ke database!`,
      data: {
        id: result.insertId,
        username: username.trim(),
        nama: nama.trim(),
      },
    })
  } catch (error) {
    console.error('Error POST /api/admins:', error)
    res.status(500).json({ success: false, message: 'Gagal menambahkan admin', error: error.message })
  }
})

// DELETE /api/admins/:id - Hapus admin
app.delete('/api/admins/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Pastikan tidak menghapus semua admin sehingga minimal tersisa 1 admin
    const [countRows] = await pool.query('SELECT COUNT(*) as total FROM admins')
    if (countRows[0].total <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus admin terakhir. Minimal harus ada 1 akun admin.',
      })
    }

    const [result] = await pool.query('DELETE FROM admins WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Admin tidak ditemukan.' })
    }

    res.json({ success: true, message: 'Admin berhasil dihapus dari database.' })
  } catch (error) {
    console.error('Error DELETE /api/admins/:id:', error)
    res.status(500).json({ success: false, message: 'Gagal menghapus admin', error: error.message })
  }
})

// Jalankan Server
app.listen(PORT, () => {
  console.log(`🚀 Server Backend API Reka Limbah berjalan di: http://localhost:${PORT}`)
  console.log(`🔗 Endpoint Products : http://localhost:${PORT}/api/products`)
  console.log(`🔗 Endpoint Messages : http://localhost:${PORT}/api/messages`)
  console.log(`🔗 Endpoint Admins   : http://localhost:${PORT}/api/admins`)
})