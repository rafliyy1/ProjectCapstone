import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchProducts,
  createProduct,
  deleteProduct,
  fetchMessages,
  deleteMessage,
  loginAdmin,
  fetchAdmins,
  createAdmin,
  deleteAdmin,
  markMessageAsRead,
} from '../services/api'
import { categories } from '../data/products'

// ─── Tab ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'products', label: 'Kelola Produk' },
  { id: 'messages', label: 'Pesan Masuk' },
  { id: 'admins', label: 'User Admin' },
]

const emptyProductForm = {
  nama: '',
  kategori: 'Tas & Dompet',
  harga: '',
  bahan: '',
  deskripsi: '',
  gambar: '/products/tas-totebag-perca.jpg',
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

function formatDate(isoStr) {
  if (!isoStr) return '-'
  return new Date(isoStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Modal Konfirmasi Hapus ───────────────────────────────────────────────────
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-slideUp">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="font-judul text-xl font-bold text-primer">{title}</h3>
          <p className="text-sm text-teks/75 mt-2">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 min-h-[44px] rounded-lg border-2 border-latar-alt text-teks font-bold hover:bg-latar-alt transition-colors text-sm cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 min-h-[44px] rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors text-sm cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Halaman Admin ────────────────────────────────────────────────────────────
export default function Admin() {
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('reka_limbah_admin')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Login form state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Tab aktif: 'products' | 'messages' | 'admins'
  const [activeTab, setActiveTab] = useState('products')

  // Notifikasi
  const [alert, setAlert] = useState({ type: '', text: '' })

  // Data
  const [productsList, setProductsList] = useState([])
  const [messagesList, setMessagesList] = useState([])
  const [adminsList, setAdminsList] = useState([])
  const [loadingData, setLoadingData] = useState(false)

  // Form produk
  const [productForm, setProductForm] = useState(emptyProductForm)
  const [imagePreview, setImagePreview] = useState('')
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false)
  const [searchProduk, setSearchProduk] = useState('')

  // Form admin
  const [adminForm, setAdminForm] = useState({ username: '', password: '', nama: '' })
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false)

  // Pesan terpilih & target konfirmasi hapus
  const [selectedMessageId, setSelectedMessageId] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null) // { type, id, nama }

  function showAlert(type, text) {
    setAlert({ type, text })
    setTimeout(() => setAlert({ type: '', text: '' }), 4500)
  }

  const unreadMessagesCount = messagesList.filter((m) => !m.is_read).length
  const selectedMessage = messagesList.find((m) => m.id === selectedMessageId) || null

  const filteredProducts = productsList.filter(
    (p) =>
      p.nama.toLowerCase().includes(searchProduk.toLowerCase()) ||
      p.kategori.toLowerCase().includes(searchProduk.toLowerCase())
  )

  // Muat data saat login / pindah tab
  useEffect(() => {
    if (!currentUser) return

    let isMounted = true

    async function loadAllData() {
      setLoadingData(true)
      try {
        const [prodRes, msgData, admData] = await Promise.all([
          fetchProducts().catch(() => ({ data: [] })),
          fetchMessages().catch(() => []),
          fetchAdmins().catch(() => []),
        ])

        if (isMounted) {
          if (prodRes && prodRes.data) setProductsList(prodRes.data)
          if (Array.isArray(msgData)) setMessagesList(msgData)
          if (Array.isArray(admData)) setAdminsList(admData)
        }
      } catch (err) {
        if (isMounted) showAlert('error', err.message)
      } finally {
        if (isMounted) setLoadingData(false)
      }
    }

    loadAllData()

    return () => {
      isMounted = false
    }
  }, [currentUser, activeTab])

  // ── Auth ────────────────────────────────────────────────────────────────────
  async function handleLoginSubmit(e) {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    try {
      const admin = await loginAdmin(loginForm.username, loginForm.password)
      setCurrentUser(admin)
      localStorage.setItem('reka_limbah_admin', JSON.stringify(admin))
      window.dispatchEvent(new Event('authChange'))
      showAlert('success', `Selamat datang, ${admin.nama}`)
    } catch (err) {
      setLoginError(err.message || 'Login gagal. Periksa kembali username dan password.')
    } finally {
      setLoginLoading(false)
    }
  }

  function handleLogout() {
    setCurrentUser(null)
    localStorage.removeItem('reka_limbah_admin')
    window.dispatchEvent(new Event('authChange'))
  }

  // ── Pesan ───────────────────────────────────────────────────────────────────
  async function markRead(id, silent = false) {
    try {
      await markMessageAsRead(id)
      setMessagesList((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: 1 } : m)))
      if (!silent) showAlert('success', 'Pesan telah ditandai sudah dibaca.')
    } catch (err) {
      showAlert('error', `Gagal menandai pesan: ${err.message}`)
    }
  }

  function handleOpenMessage(msg) {
    setSelectedMessageId(msg.id)
    if (!msg.is_read) markRead(msg.id, true)
  }

  // ── Produk ──────────────────────────────────────────────────────────────────
  function handleImageFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      showAlert('error', 'Format file harus berupa PNG atau JPG.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      setImagePreview(result)
      setProductForm((prev) => ({ ...prev, gambar: result }))
    }
    reader.readAsDataURL(file)
  }

  async function handleAddProduct(e) {
    e.preventDefault()
    if (
      !productForm.nama ||
      !productForm.kategori ||
      !productForm.harga ||
      !productForm.bahan ||
      !productForm.deskripsi
    ) {
      showAlert('error', 'Semua kolom produk wajib diisi.')
      return
    }

    setIsSubmittingProduct(true)
    try {
      const created = await createProduct({
        ...productForm,
        harga: Number(productForm.harga),
      })
      setProductsList((prev) => [created, ...prev])
      showAlert('success', `Produk "${created.nama}" berhasil disimpan.`)
      setProductForm(emptyProductForm)
      setImagePreview('')
    } catch (err) {
      showAlert('error', `Gagal menyimpan produk: ${err.message}`)
    } finally {
      setIsSubmittingProduct(false)
    }
  }

  // ── Admin ───────────────────────────────────────────────────────────────────
  async function handleAddAdmin(e) {
    e.preventDefault()
    if (!adminForm.username || !adminForm.password || !adminForm.nama) {
      showAlert('error', 'Username, password, dan nama lengkap wajib diisi.')
      return
    }

    setIsSubmittingAdmin(true)
    try {
      const created = await createAdmin(adminForm)
      setAdminsList((prev) => [...prev, created])
      showAlert('success', `Admin "${created.username}" berhasil ditambahkan.`)
      setAdminForm({ username: '', password: '', nama: '' })
    } catch (err) {
      showAlert('error', `Gagal mendaftarkan admin: ${err.message}`)
    } finally {
      setIsSubmittingAdmin(false)
    }
  }

  // ── Hapus (produk / pesan / admin) lewat satu modal konfirmasi ──────────────
  async function handleConfirmDelete() {
    if (!confirmTarget) return
    const { type, id, nama } = confirmTarget
    setConfirmTarget(null)

    try {
      if (type === 'product') {
        await deleteProduct(id)
        setProductsList((prev) => prev.filter((p) => p.id !== id))
        showAlert('success', `Produk "${nama}" telah dihapus.`)
      } else if (type === 'message') {
        await deleteMessage(id)
        setMessagesList((prev) => prev.filter((m) => m.id !== id))
        if (selectedMessageId === id) setSelectedMessageId(null)
        showAlert('success', 'Pesan telah dihapus.')
      } else if (type === 'admin') {
        await deleteAdmin(id)
        setAdminsList((prev) => prev.filter((a) => a.id !== id))
        showAlert('success', `Admin "${nama}" telah dihapus.`)
        // Jika menghapus akun yang sedang dipakai login, otomatis keluar
        if (nama === currentUser.username) handleLogout()
      }
    } catch (err) {
      showAlert('error', `Gagal menghapus: ${err.message}`)
    }
  }

  const confirmCopy = {
    product: {
      title: 'Hapus Produk?',
      message: `Produk "${confirmTarget?.nama}" akan dihapus permanen dan tidak dapat dikembalikan.`,
    },
    message: {
      title: 'Hapus Pesan?',
      message: `Pesan dari "${confirmTarget?.nama}" akan dihapus permanen.`,
    },
    admin: {
      title: 'Hapus User Admin?',
      message: `User admin "${confirmTarget?.nama}" akan dihapus permanen.`,
    },
  }

  // ────────────────────────────────────────────────────────────────────────────
  // TAMPILAN JIKA BELUM LOGIN
  // ────────────────────────────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-latar flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-latar-alt shadow-[0_4px_20px_rgba(44,30,22,0.08)]">
          <div className="text-center mb-6">
            <h1 className="font-judul text-2xl sm:text-3xl font-bold text-primer">Masuk Admin</h1>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-primer uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Masukkan username"
                className="w-full min-h-[44px] px-4 rounded-lg bg-latar/30 border border-latar-alt text-teks text-sm focus:border-primer focus:outline-none focus:ring-2 focus:ring-primer/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primer uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Masukkan password"
                className="w-full min-h-[44px] px-4 rounded-lg bg-latar/30 border border-latar-alt text-teks text-sm focus:border-primer focus:outline-none focus:ring-2 focus:ring-primer/20"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full min-h-[46px] rounded-lg bg-primer text-latar font-bold text-sm hover:bg-sekunder transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {loginLoading ? 'Memeriksa...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link to="/" className="text-xs font-semibold text-teks/70 hover:text-sekunder transition-colors">
              ← Kembali ke website
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ────────────────────────────────────────────────────────────────────────────
  // TAMPILAN SETELAH LOGIN (DASHBOARD)
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-latar">
      {/* Header Admin */}
      <div className="bg-espresso text-krim">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-krim/70 text-xs font-semibold uppercase tracking-wider">Dashboard Admin</p>
            <h1 className="font-judul text-lg sm:text-xl font-bold truncate">Reka Limbah</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{currentUser.nama}</p>
              <p className="text-xs text-krim/70">@{currentUser.username}</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-krim/20 flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0">
              {(currentUser.nama || currentUser.username || '?').charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-krim/80 hover:text-krim transition-colors ml-1 sm:ml-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-latar-alt">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex gap-4 sm:gap-6 flex-wrap items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-espresso/10 text-espresso flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-primer font-judul">{productsList.length}</p>
              <p className="text-xs text-teks/60">Total Produk</p>
            </div>
          </div>

          <div className="w-px h-10 bg-latar-alt hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pendukung/20 text-pendukung flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-primer font-judul">{messagesList.length}</p>
              <p className="text-xs text-teks/60">Total Pesan</p>
            </div>
          </div>

          {unreadMessagesCount > 0 && (
            <>
              <div className="w-px h-10 bg-latar-alt hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600 font-judul">{unreadMessagesCount}</p>
                  <p className="text-xs text-teks/60">Belum Dibaca</p>
                </div>
              </div>
            </>
          )}

          <div className="ml-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 min-h-[38px] px-4 rounded-lg border-2 border-espresso/30 text-espresso font-bold text-sm hover:bg-espresso/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Lihat Website
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-latar-alt bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-espresso border-b-2 border-espresso'
                    : 'text-teks/60 hover:text-teks'
                }`}
              >
                {tab.label}
                {tab.id === 'messages' && unreadMessagesCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Konten */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Notifikasi */}
        {alert.text && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-sm ${
              alert.type === 'error'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-green-50 text-green-800 border border-green-200'
            }`}
          >
            <span>{alert.text}</span>
            <button
              onClick={() => setAlert({ type: '', text: '' })}
              className="text-xs opacity-60 hover:opacity-100 ml-4 font-bold cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* ── TAB: PRODUK ─────────────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Tambah Produk */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-latar-alt shadow-[0_2px_0_#7A5C47] h-fit">
              <h2 className="font-judul text-xl font-bold text-primer mb-5">Tambah Produk Baru</h2>

              <form onSubmit={handleAddProduct} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-primer mb-1">Nama Produk *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lampu Meja Bambu"
                    value={productForm.nama}
                    onChange={(e) => setProductForm({ ...productForm, nama: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-latar/30 border border-latar-alt focus:border-primer focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-primer mb-1">Kategori *</label>
                  <select
                    value={productForm.kategori}
                    onChange={(e) => setProductForm({ ...productForm, kategori: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-latar/30 border border-latar-alt focus:border-primer focus:outline-none"
                  >
                    {categories
                      .filter((c) => c !== 'Semua')
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-primer mb-1">Harga (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="Contoh: 75000"
                    value={productForm.harga}
                    onChange={(e) => setProductForm({ ...productForm, harga: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-latar/30 border border-latar-alt focus:border-primer focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-primer mb-1">Bahan Utama *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: bambu bekas & kain perca"
                    value={productForm.bahan}
                    onChange={(e) => setProductForm({ ...productForm, bahan: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-latar/30 border border-latar-alt focus:border-primer focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-primer mb-1">Gambar Produk (.png / .jpg)</label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageFileChange}
                    className="w-full px-3 py-1.5 rounded-lg bg-latar/30 border border-latar-alt focus:border-primer focus:outline-none text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primer file:text-latar hover:file:bg-sekunder cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="mt-2.5 flex items-center gap-2.5 p-2 bg-latar/20 rounded-lg border border-latar-alt">
                      <img
                        src={imagePreview}
                        alt="Pratinjau"
                        className="w-12 h-12 object-cover rounded border border-latar-alt flex-shrink-0"
                      />
                      <span className="text-[11px] text-teks/80">Gambar siap digunakan</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-primer mb-1">Deskripsi Produk *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Ceritakan keunikan produk ini..."
                    value={productForm.deskripsi}
                    onChange={(e) => setProductForm({ ...productForm, deskripsi: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-latar/30 border border-latar-alt focus:border-primer focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="w-full py-2.5 rounded-lg bg-primer text-latar font-bold text-xs uppercase tracking-wider hover:bg-sekunder transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingProduct ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </form>
            </div>

            {/* Daftar Produk */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <input
                  value={searchProduk}
                  onChange={(e) => setSearchProduk(e.target.value)}
                  placeholder="Cari produk berdasarkan nama atau kategori..."
                  className="w-full max-w-md min-h-[44px] px-4 rounded-xl border border-latar-alt bg-white text-teks text-sm focus:outline-none focus:ring-2 focus:ring-espresso/30 focus:border-espresso transition-colors"
                />
              </div>

              <div className="bg-white rounded-2xl border border-latar-alt shadow-[0_2px_0_#7A5C47] overflow-hidden">
                <div className="p-5 border-b border-latar-alt">
                  <h2 className="font-judul text-lg font-bold text-primer">Daftar Produk</h2>
                  <p className="text-xs text-teks/70">Total {productsList.length} produk</p>
                </div>

                {loadingData ? (
                  <div className="p-8 text-center text-sm text-teks/70">Memuat data produk...</div>
                ) : filteredProducts.length === 0 ? (
                  <div className="p-8 text-center text-sm text-teks/70">
                    {productsList.length === 0 ? 'Belum ada produk.' : 'Tidak ada produk yang cocok.'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-latar/60 text-primer font-bold border-b border-latar-alt">
                        <tr>
                          <th className="py-3 px-4">Produk</th>
                          <th className="py-3 px-4 hidden md:table-cell">Kategori</th>
                          <th className="py-3 px-4">Harga</th>
                          <th className="py-3 px-4 hidden sm:table-cell">Bahan</th>
                          <th className="py-3 px-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-latar-alt/60">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-latar/20 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.gambar}
                                  alt={p.nama}
                                  className="w-10 h-10 object-cover rounded-lg border border-latar-alt flex-shrink-0"
                                  onError={(e) => {
                                    e.target.src = '/products/tas-totebag-perca.jpg'
                                  }}
                                />
                                <div>
                                  <span className="font-bold text-primer block">{p.nama}</span>
                                  <span className="text-[11px] text-teks/70 line-clamp-1 max-w-xs">
                                    {p.deskripsi}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap hidden md:table-cell">
                              <span className="px-2 py-0.5 rounded bg-pendukung/15 text-primer font-semibold text-[11px]">
                                {p.kategori}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-espresso whitespace-nowrap">
                              {formatRupiah(p.harga)}
                            </td>
                            <td className="py-3 px-4 text-teks/80 text-xs hidden sm:table-cell">
                              {p.bahan}
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <button
                                onClick={() => setConfirmTarget({ type: 'product', id: p.id, nama: p.nama })}
                                className="px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer font-bold"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: PESAN ──────────────────────────────────────────────────── */}
        {activeTab === 'messages' && (
          <div>
            <div className="mb-6">
              <h2 className="font-judul text-2xl font-bold text-primer">Pesan Masuk</h2>
              <p className="text-sm text-teks/70 mt-0.5">
                {messagesList.length} pesan total · {unreadMessagesCount} belum dibaca
              </p>
            </div>

            {loadingData && messagesList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-latar-alt p-10 text-center text-sm text-teks/70">
                Memuat pesan...
              </div>
            ) : messagesList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-latar-alt p-16 text-center text-teks/50">
                <p className="font-semibold text-lg">Belum ada pesan masuk.</p>
                <p className="text-sm mt-1">Pesan dari formulir kontak akan muncul di sini.</p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Daftar pesan */}
                <div className="lg:col-span-4 flex flex-col gap-2">
                  {messagesList.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => handleOpenMessage(msg)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedMessageId === msg.id
                          ? 'border-espresso bg-espresso/5 shadow-sm'
                          : 'border-latar-alt bg-white hover:border-espresso/30 hover:bg-latar/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span
                          className={`font-bold text-sm truncate ${
                            !msg.is_read ? 'text-primer' : 'text-teks/80'
                          }`}
                        >
                          {!msg.is_read && (
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1.5 mb-0.5" />
                          )}
                          {msg.nama}
                        </span>
                        <span className="text-[10px] text-teks/50 whitespace-nowrap flex-shrink-0">
                          {msg.created_at
                            ? new Date(msg.created_at).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                              })
                            : ''}
                        </span>
                      </div>
                      <p className="text-xs text-teks/60 truncate">{msg.email}</p>
                      <p className="text-xs text-teks/70 mt-1 truncate">{msg.subjek}</p>
                    </button>
                  ))}
                </div>

                {/* Detail pesan */}
                <div className="lg:col-span-8">
                  {selectedMessage ? (
                    <div className="bg-white rounded-2xl border border-latar-alt p-6 sm:p-8">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                          <h3 className="font-judul text-xl font-bold text-primer">{selectedMessage.nama}</h3>
                          <p className="text-sm text-teks/70">{selectedMessage.email}</p>
                        </div>
                        <button
                          onClick={() =>
                            setConfirmTarget({
                              type: 'message',
                              id: selectedMessage.id,
                              nama: selectedMessage.nama,
                            })
                          }
                          className="flex-shrink-0 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-3 mb-5">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-espresso/10 text-espresso text-xs font-semibold">
                          Subjek: {selectedMessage.subjek}
                        </span>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-latar-alt text-teks/70 text-xs">
                          {formatDate(selectedMessage.created_at)}
                        </span>
                        {selectedMessage.is_read ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-pendukung/15 text-pendukung text-xs font-semibold">
                            ✓ Sudah dibaca
                          </span>
                        ) : null}
                      </div>

                      <div className="bg-latar/60 rounded-xl p-5 border border-latar-alt">
                        <p className="text-sm text-teks leading-relaxed whitespace-pre-wrap">
                          {selectedMessage.pesan}
                        </p>
                      </div>

                      <a
                        href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                          'Re: ' + selectedMessage.subjek
                        )}`}
                        className="inline-flex items-center gap-2 mt-5 min-h-[44px] px-6 rounded-xl bg-espresso text-krim font-bold text-sm hover:bg-mocha transition-colors"
                      >
                        Balas via Email
                      </a>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-latar-alt p-12 flex flex-col items-center justify-center text-center text-teks/50">
                      <p className="font-semibold">Pilih pesan untuk melihat detailnya</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: USER ADMIN ─────────────────────────────────────────────── */}
        {activeTab === 'admins' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Tambah Admin */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-latar-alt shadow-[0_2px_0_#7A5C47] h-fit">
              <h2 className="font-judul text-xl font-bold text-primer mb-5">Tambah Admin Baru</h2>

              <form onSubmit={handleAddAdmin} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-primer mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Siti Rahma"
                    value={adminForm.nama}
                    onChange={(e) => setAdminForm({ ...adminForm, nama: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-latar/30 border border-latar-alt focus:border-primer focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-primer mb-1">Username Baru *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: admin_siti"
                    value={adminForm.username}
                    onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-latar/30 border border-latar-alt focus:border-primer focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-primer mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Minimal 6 karakter"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-latar/30 border border-latar-alt focus:border-primer focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAdmin}
                  className="w-full py-2.5 rounded-lg bg-primer text-latar font-bold text-xs uppercase tracking-wider hover:bg-sekunder transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAdmin ? 'Mendaftarkan...' : 'Daftarkan Admin Baru'}
                </button>
              </form>
            </div>

            {/* Daftar Admin */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-latar-alt shadow-[0_2px_0_#7A5C47] overflow-hidden">
                <div className="p-5 border-b border-latar-alt">
                  <h2 className="font-judul text-lg font-bold text-primer">Daftar Admin Terdaftar</h2>
                </div>

                {loadingData ? (
                  <div className="p-8 text-center text-sm text-teks/70">Memuat data admin...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-latar/60 text-primer font-bold border-b border-latar-alt">
                        <tr>
                          <th className="py-3 px-4">Nama Admin</th>
                          <th className="py-3 px-4">Username</th>
                          <th className="py-3 px-4">Terdaftar Pada</th>
                          <th className="py-3 px-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-latar-alt/60">
                        {adminsList.map((a) => (
                          <tr key={a.id} className="hover:bg-latar/20 transition-colors">
                            <td className="py-3 px-4 font-bold text-primer">
                              {a.nama}
                              {a.username === currentUser.username && (
                                <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded">
                                  Akun Anda
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-teks font-mono">{a.username}</td>
                            <td className="py-3 px-4 text-xs text-teks/70">
                              {a.created_at
                                ? new Date(a.created_at).toLocaleDateString('id-ID', {
                                    dateStyle: 'medium',
                                  })
                                : '-'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() =>
                                  setConfirmTarget({ type: 'admin', id: a.id, nama: a.username })
                                }
                                className="px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer font-bold"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={!!confirmTarget}
        title={confirmTarget ? confirmCopy[confirmTarget.type].title : ''}
        message={confirmTarget ? confirmCopy[confirmTarget.type].message : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  )
}