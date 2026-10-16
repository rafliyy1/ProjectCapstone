import { useState, useEffect } from 'react'
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

export default function Admin() {
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('reka_limbah_admin')
    return saved ? JSON.parse(saved) : null
  })

  // Login form state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Active tab: 'products' | 'messages' | 'admins'
  const [activeTab, setActiveTab] = useState('products')

  // Notification / Alert message
  const [alert, setAlert] = useState({ type: '', text: '' })

  // Data states
  const [productsList, setProductsList] = useState([])
  const [messagesList, setMessagesList] = useState([])
  const [adminsList, setAdminsList] = useState([])
  const [loadingData, setLoadingData] = useState(false)

  // Product form state
  const [productForm, setProductForm] = useState({
    nama: '',
    kategori: 'Tas & Dompet',
    harga: '',
    bahan: '',
    deskripsi: '',
    gambar: '/products/tas-totebag-perca.jpg',
  })
  const [imagePreview, setImagePreview] = useState('')
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false)

  // Admin form state
  const [adminForm, setAdminForm] = useState({
    username: '',
    password: '',
    nama: '',
  })
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false)

  function showAlert(type, text) {
    setAlert({ type, text })
    setTimeout(() => {
      setAlert({ type: '', text: '' })
    }, 4500)
  }

  const unreadMessagesCount = messagesList.filter((m) => !m.is_read).length

  // Load data segera saat login/mount agar jumlah pesan belum dibaca langsung diketahui
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

  // Handle Login
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

  // Handle Logout
  function handleLogout() {
    setCurrentUser(null)
    localStorage.removeItem('reka_limbah_admin')
    window.dispatchEvent(new Event('authChange'))
  }

  // Handle Mark Message As Read
  async function handleMarkAsRead(id) {
    try {
      await markMessageAsRead(id)
      setMessagesList((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: 1 } : m))
      )
      showAlert('success', 'Pesan telah ditandai sudah dibaca.')
    } catch (err) {
      showAlert('error', `Gagal menandai pesan: ${err.message}`)
    }
  }

  // Handle Image File Upload (PNG or JPG)
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

  // Handle Add Product
  async function handleAddProduct(e) {
    e.preventDefault()
    if (!productForm.nama || !productForm.kategori || !productForm.harga || !productForm.bahan || !productForm.deskripsi) {
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
      setProductForm({
        nama: '',
        kategori: 'Tas & Dompet',
        harga: '',
        bahan: '',
        deskripsi: '',
        gambar: '/products/tas-totebag-perca.jpg',
      })
      setImagePreview('')
    } catch (err) {
      showAlert('error', `Gagal menyimpan produk: ${err.message}`)
    } finally {
      setIsSubmittingProduct(false)
    }
  }

  // Handle Delete Product
  async function handleDeleteProduct(id, nama) {
    if (!window.confirm(`Hapus produk "${nama}"?`)) return

    try {
      await deleteProduct(id)
      setProductsList((prev) => prev.filter((p) => p.id !== id))
      showAlert('success', `Produk "${nama}" telah dihapus.`)
    } catch (err) {
      showAlert('error', `Gagal menghapus produk: ${err.message}`)
    }
  }

  // Handle Delete Message
  async function handleDeleteMessage(id, nama) {
    if (!window.confirm(`Hapus pesan dari "${nama}"?`)) return

    try {
      await deleteMessage(id)
      setMessagesList((prev) => prev.filter((m) => m.id !== id))
      showAlert('success', 'Pesan telah dihapus.')
    } catch (err) {
      showAlert('error', `Gagal menghapus pesan: ${err.message}`)
    }
  }

  // Handle Add Admin
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

  // Handle Delete Admin
  async function handleDeleteAdmin(id, username) {
    if (!window.confirm(`Hapus user admin "${username}"?`)) return

    try {
      await deleteAdmin(id)
      setAdminsList((prev) => prev.filter((a) => a.id !== id))
      showAlert('success', `Admin "${username}" telah dihapus.`)

      // Jika menghapus akun yang sedang dipakai login, otomatis keluar
      if (username === currentUser.username) {
        handleLogout()
      }
    } catch (err) {
      showAlert('error', `Gagal menghapus admin: ${err.message}`)
    }
  }

  // ----------------------------------------------------
  // TAMPILAN JIKA BELUM LOGIN
  // ----------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-latar-alt shadow-[0_4px_20px_rgba(44,30,22,0.08)]">
          <div className="text-center mb-6">
            <h1 className="font-judul text-2xl sm:text-3xl font-bold text-primer">
              Masuk Admin
            </h1>
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
        </div>
      </div>
    )
  }

  // ----------------------------------------------------
  // TAMPILAN SETELAH LOGIN (DASHBOARD)
  // ----------------------------------------------------
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 sm:py-12">
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-latar-alt mb-8">
        <div>
          <h1 className="font-judul text-2xl sm:text-3xl font-bold text-primer">
            Dashboard Admin
          </h1>
          <p className="text-xs sm:text-sm text-teks/80 mt-0.5">
            Login sebagai: <strong className="text-primer">{currentUser.nama}</strong> ({currentUser.username})
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="self-start sm:self-auto px-4 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
        >
          Keluar
        </button>
      </div>

      {/* Global Alert Notification */}
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
            className="text-xs opacity-60 hover:opacity-100 ml-4 font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 border-b border-latar-alt/60 pb-3">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-primer text-latar shadow-sm'
              : 'bg-white hover:bg-latar text-teks border border-latar-alt'
          }`}
        >
          Kelola Produk
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'messages'
              ? 'bg-primer text-latar shadow-sm'
              : 'bg-white hover:bg-latar text-teks border border-latar-alt'
          }`}
        >
          <span>Pesan Masuk</span>
          {unreadMessagesCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sekunder text-latar">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('admins')}
          className={`px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'admins'
              ? 'bg-primer text-latar shadow-sm'
              : 'bg-white hover:bg-latar text-teks border border-latar-alt'
          }`}
        >
          User Admin
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: KELOLA PRODUK                                     */}
      {/* ======================================================== */}
      {activeTab === 'products' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Tambah Produk */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-latar-alt shadow-[0_2px_0_#7A5C47] h-fit">
            <h2 className="font-judul text-xl font-bold text-primer mb-5">
              Tambah Produk Baru
            </h2>

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
                  {categories.filter((c) => c !== 'Semua').map((cat) => (
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
            <div className="bg-white rounded-2xl border border-latar-alt shadow-[0_2px_0_#7A5C47] overflow-hidden">
              <div className="p-5 border-b border-latar-alt flex items-center justify-between">
                <div>
                  <h2 className="font-judul text-lg font-bold text-primer">
                    Daftar Produk
                  </h2>
                  <p className="text-xs text-teks/70">
                    Total {productsList.length} produk
                  </p>
                </div>
              </div>

              {loadingData ? (
                <div className="p-8 text-center text-sm text-teks/70">Memuat data produk...</div>
              ) : productsList.length === 0 ? (
                <div className="p-8 text-center text-sm text-teks/70">Belum ada produk.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-latar/60 text-primer font-bold border-b border-latar-alt">
                      <tr>
                        <th className="py-3 px-4">Produk</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Harga</th>
                        <th className="py-3 px-4">Bahan</th>
                        <th className="py-3 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-latar-alt/60">
                      {productsList.map((p) => (
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
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-pendukung/15 text-primer font-semibold text-[11px]">
                              {p.kategori}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-primer whitespace-nowrap">
                            Rp {Number(p.harga).toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4 text-teks/80 text-xs">
                            {p.bahan}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.nama)}
                              className="px-2.5 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors cursor-pointer font-semibold"
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

      {/* ======================================================== */}
      {/* TAB 2: PESAN MASUK                                       */}
      {/* ======================================================== */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-latar-alt shadow-[0_2px_0_#7A5C47] overflow-hidden">
          <div className="p-5 border-b border-latar-alt">
            <h2 className="font-judul text-lg font-bold text-primer">
              Pesan Masuk
            </h2>
          </div>

          {loadingData ? (
            <div className="p-8 text-center text-sm text-teks/70">Memuat pesan...</div>
          ) : messagesList.length === 0 ? (
            <div className="p-12 text-center text-sm text-teks/70">
              Belum ada pesan yang masuk.
            </div>
          ) : (
            <div className="divide-y divide-latar-alt/60">
              {messagesList.map((msg) => (
                <div key={msg.id} className="p-5 hover:bg-latar/10 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primer text-sm sm:text-base">
                        {msg.nama}
                      </span>
                      <span className="text-xs text-teks/60">
                        &lt;{msg.email}&gt;
                      </span>
                      {!msg.is_read ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sekunder text-latar">
                          Baru
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-latar-alt/60 text-teks/60">
                          Sudah dibaca
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-teks/60">
                        {new Date(msg.created_at).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>

                      {!msg.is_read && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(msg.id)}
                          className="text-xs font-semibold px-2.5 py-1 rounded bg-primer text-latar hover:bg-sekunder transition-colors cursor-pointer"
                        >
                          Tandai sudah dibaca
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteMessage(msg.id, msg.nama)}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-0.5 rounded hover:bg-red-50 cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pendukung/20 text-primer">
                      Subjek: {msg.subjek}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-teks/90 leading-relaxed bg-latar/30 p-3.5 rounded-xl border border-latar-alt/40 whitespace-pre-wrap">
                    {msg.pesan}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: USER ADMIN                                        */}
      {/* ======================================================== */}
      {activeTab === 'admins' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Tambah User Admin Baru */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-latar-alt shadow-[0_2px_0_#7A5C47] h-fit">
            <h2 className="font-judul text-xl font-bold text-primer mb-5">
              Tambah Admin Baru
            </h2>

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
                <h2 className="font-judul text-lg font-bold text-primer">
                  Daftar Admin Terdaftar
                </h2>
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
                          <td className="py-3 px-4 text-teks font-mono">
                            {a.username}
                          </td>
                          <td className="py-3 px-4 text-xs text-teks/70">
                            {a.created_at
                              ? new Date(a.created_at).toLocaleDateString('id-ID', {
                                  dateStyle: 'medium',
                                })
                              : '-'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleDeleteAdmin(a.id, a.username)}
                              className="px-2.5 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors cursor-pointer font-semibold"
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
  )
}
