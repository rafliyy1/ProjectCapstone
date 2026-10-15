import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { categories } from '../data/products'

// ─── Tab IDs ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'produk', label: 'Kelola Produk' },
  { id: 'pesan', label: 'Pesan Masuk' },
]

// ─── Form kosong produk ───────────────────────────────────────────────────────
const emptyProduct = {
  nama: '',
  kategori: '',
  deskripsi: '',
  harga: '',
  bahan: '',
  gambar: '',
}

// ─── Helper: format rupiah ─────────────────────────────────────────────────────
function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)
}

// ─── Helper: format tanggal ────────────────────────────────────────────────────
function formatDate(isoStr) {
  return new Date(isoStr).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ─── Komponen Modal Konfirmasi Hapus ──────────────────────────────────────────
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-slideUp">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h3 className="font-judul text-xl font-bold text-primer">{title}</h3>
          <p className="text-sm text-teks/75 mt-2">{message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 min-h-[44px] rounded-lg border-2 border-latar-alt text-teks font-bold hover:bg-latar-alt transition-colors text-sm">
            Batal
          </button>
          <button onClick={onConfirm} className="flex-1 min-h-[44px] rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors text-sm">
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Komponen Modal Form Produk (Tambah / Edit) ───────────────────────────────
function ProductFormModal({ isOpen, onClose, onSave, initialData, title }) {
  const [form, setForm] = useState(emptyProduct)
  const [errors, setErrors] = useState({})

  // Sync form dengan data awal (untuk edit)
  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? { ...initialData, harga: String(initialData.harga) } : emptyProduct)
      setErrors({})
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.nama.trim()) e.nama = 'Nama produk wajib diisi.'
    if (!form.kategori) e.kategori = 'Pilih kategori.'
    if (!form.deskripsi.trim()) e.deskripsi = 'Deskripsi wajib diisi.'
    if (!form.harga || isNaN(Number(form.harga)) || Number(form.harga) <= 0) e.harga = 'Harga harus angka positif.'
    if (!form.bahan.trim()) e.bahan = 'Bahan wajib diisi.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSave(form)
  }

  const categoriesWithout = categories.filter((c) => c !== 'Semua')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-slideUp my-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-latar-alt transition-colors text-teks/60 text-lg"
        >✕</button>

        <h2 className="font-judul text-2xl font-bold text-primer mb-6">{title}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-bold text-primer mb-1">Nama Produk *</label>
            <input name="nama" value={form.nama} onChange={handleChange} placeholder="Cth: Tas Totebag Perca"
              className={`w-full min-h-[44px] px-4 rounded-lg border text-teks text-sm focus:outline-none focus:ring-2 focus:ring-espresso/30 transition-colors ${errors.nama ? 'border-red-500 bg-red-50/40' : 'border-latar-alt'}`} />
            {errors.nama && <p className="text-xs text-red-600 mt-1">{errors.nama}</p>}
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-bold text-primer mb-1">Kategori *</label>
            <select name="kategori" value={form.kategori} onChange={handleChange}
              className={`w-full min-h-[44px] px-4 rounded-lg border text-teks text-sm focus:outline-none focus:ring-2 focus:ring-espresso/30 transition-colors ${errors.kategori ? 'border-red-500 bg-red-50/40' : 'border-latar-alt'}`}>
              <option value="">-- Pilih Kategori --</option>
              {categoriesWithout.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.kategori && <p className="text-xs text-red-600 mt-1">{errors.kategori}</p>}
          </div>

          {/* Harga */}
          <div>
            <label className="block text-sm font-bold text-primer mb-1">Harga (Rp) *</label>
            <input name="harga" type="number" min="0" value={form.harga} onChange={handleChange} placeholder="Cth: 85000"
              className={`w-full min-h-[44px] px-4 rounded-lg border text-teks text-sm focus:outline-none focus:ring-2 focus:ring-espresso/30 transition-colors ${errors.harga ? 'border-red-500 bg-red-50/40' : 'border-latar-alt'}`} />
            {errors.harga && <p className="text-xs text-red-600 mt-1">{errors.harga}</p>}
          </div>

          {/* Bahan */}
          <div>
            <label className="block text-sm font-bold text-primer mb-1">Bahan Utama *</label>
            <input name="bahan" value={form.bahan} onChange={handleChange} placeholder="Cth: kain perca konveksi"
              className={`w-full min-h-[44px] px-4 rounded-lg border text-teks text-sm focus:outline-none focus:ring-2 focus:ring-espresso/30 transition-colors ${errors.bahan ? 'border-red-500 bg-red-50/40' : 'border-latar-alt'}`} />
            {errors.bahan && <p className="text-xs text-red-600 mt-1">{errors.bahan}</p>}
          </div>

          {/* URL Gambar */}
          <div>
            <label className="block text-sm font-bold text-primer mb-1">URL Gambar <span className="font-normal text-teks/60">(opsional)</span></label>
            <input name="gambar" value={form.gambar} onChange={handleChange} placeholder="Cth: /products/nama-produk.jpg"
              className="w-full min-h-[44px] px-4 rounded-lg border border-latar-alt text-teks text-sm focus:outline-none focus:ring-2 focus:ring-espresso/30 transition-colors" />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-bold text-primer mb-1">Deskripsi *</label>
            <textarea name="deskripsi" rows={3} value={form.deskripsi} onChange={handleChange}
              placeholder="Ceritakan keunikan produk ini..."
              className={`w-full p-4 rounded-lg border text-teks text-sm focus:outline-none focus:ring-2 focus:ring-espresso/30 resize-y transition-colors ${errors.deskripsi ? 'border-red-500 bg-red-50/40' : 'border-latar-alt'}`} />
            {errors.deskripsi && <p className="text-xs text-red-600 mt-1">{errors.deskripsi}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 min-h-[44px] rounded-lg border-2 border-latar-alt text-teks font-bold hover:bg-latar-alt transition-colors text-sm">
              Batal
            </button>
            <button type="submit" className="flex-1 min-h-[44px] rounded-lg bg-espresso text-krim font-bold hover:bg-mocha transition-colors text-sm">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Halaman Admin Utama ──────────────────────────────────────────────────────
export default function Admin() {
  const navigate = useNavigate()
  const { currentUser, isAdmin, logout, products, addProduct, updateProduct, deleteProduct, messages, markMessageRead, deleteMessage } = useApp()

  const [activeTab, setActiveTab] = useState('produk')
  const [searchProduk, setSearchProduk] = useState('')

  // Modal state produk
  const [showAddModal, setShowAddModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null) // data produk yg diedit
  const [deleteTarget, setDeleteTarget] = useState(null) // {id, nama}

  // Modal state pesan
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [deleteMsgTarget, setDeleteMsgTarget] = useState(null)

  // Guard: hanya admin yang boleh masuk
  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
    }
  }, [isAdmin, navigate])

  if (!isAdmin) return null

  // ── Filter produk sesuai pencarian ──────────────────────────────────────────
  const filteredProducts = products.filter((p) =>
    p.nama.toLowerCase().includes(searchProduk.toLowerCase()) ||
    p.kategori.toLowerCase().includes(searchProduk.toLowerCase())
  )

  const unreadCount = messages.filter((m) => !m.isRead).length

  // ── Handler produk ──────────────────────────────────────────────────────────
  function handleAddProduct(form) {
    addProduct(form)
    setShowAddModal(false)
  }

  function handleEditProduct(form) {
    updateProduct(editProduct.id, form)
    setEditProduct(null)
  }

  function handleDeleteConfirm() {
    deleteProduct(deleteTarget.id)
    setDeleteTarget(null)
  }

  // ── Handler pesan ────────────────────────────────────────────────────────────
  function handleOpenMessage(msg) {
    setSelectedMessage(msg)
    if (!msg.isRead) markMessageRead(msg.id)
  }

  function handleDeleteMsg() {
    deleteMessage(deleteMsgTarget.id)
    setDeleteMsgTarget(null)
    if (selectedMessage?.id === deleteMsgTarget?.id) setSelectedMessage(null)
  }

  // ── Render ──────────────────────────────────────────────────────────────────
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
              <p className="text-xs text-krim/70">Administrator</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-krim/20 flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0">
              {currentUser.nama.charAt(0)}
            </div>
            <button
              onClick={() => { logout(); navigate('/') }}
              className="flex items-center gap-1.5 text-sm text-krim/80 hover:text-krim transition-colors ml-1 sm:ml-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>


      {/* Stats Bar */}
      <div className="bg-white border-b border-latar-alt">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex gap-4 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-espresso/10 text-espresso flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-primer font-judul">{products.length}</p>
              <p className="text-xs text-teks/60">Total Produk</p>
            </div>
          </div>
          <div className="w-px bg-latar-alt hidden sm:block" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pendukung/20 text-pendukung flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-primer font-judul">{messages.length}</p>
              <p className="text-xs text-teks/60">Total Pesan</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <>
              <div className="w-px bg-latar-alt hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600 font-judul">{unreadCount}</p>
                  <p className="text-xs text-teks/60">Belum Dibaca</p>
                </div>
              </div>
            </>
          )}
          <div className="ml-auto">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 min-h-[38px] px-4 rounded-lg border-2 border-espresso/30 text-espresso font-bold text-sm hover:bg-espresso/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              Lihat Website
            </button>
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
                className={`relative px-6 py-4 font-bold text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'text-espresso border-b-2 border-espresso'
                    : 'text-teks/60 hover:text-teks'
                }`}
              >
                {tab.label}
                {tab.id === 'pesan' && unreadCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Konten Tab */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── TAB: PRODUK ─────────────────────────────────────────────────────── */}
        {activeTab === 'produk' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <div>
                <h2 className="font-judul text-2xl font-bold text-primer">Kelola Produk</h2>
                <p className="text-sm text-teks/70 mt-0.5">{products.length} produk terdaftar</p>
              </div>
              <button
                id="btn-tambah-produk"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 min-h-[44px] px-6 rounded-xl bg-espresso text-krim font-bold text-sm hover:bg-mocha transition-colors"
              >
                + Tambah Produk
              </button>
            </div>

            {/* Search produk */}
            <div className="mb-6">
              <input
                value={searchProduk}
                onChange={(e) => setSearchProduk(e.target.value)}
                placeholder="Cari produk berdasarkan nama atau kategori..."
                className="w-full max-w-md min-h-[44px] px-4 rounded-xl border border-latar-alt bg-white text-teks text-sm focus:outline-none focus:ring-2 focus:ring-espresso/30 focus:border-espresso transition-colors"
              />
            </div>

            {/* Tabel produk */}
            <div className="bg-white rounded-2xl border border-latar-alt overflow-hidden shadow-sm">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 text-teks/50">
                  <div className="flex justify-center mb-3"><svg className="w-12 h-12 text-teks/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>
                  <p className="font-semibold">Tidak ada produk ditemukan.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-latar-alt/60 border-b border-latar-alt">
                      <tr>
                        <th className="text-left px-5 py-3 font-bold text-primer text-xs uppercase tracking-wider">Produk</th>
                        <th className="text-left px-4 py-3 font-bold text-primer text-xs uppercase tracking-wider hidden md:table-cell">Kategori</th>
                        <th className="text-left px-4 py-3 font-bold text-primer text-xs uppercase tracking-wider">Harga</th>
                        <th className="text-left px-4 py-3 font-bold text-primer text-xs uppercase tracking-wider hidden sm:table-cell">Bahan</th>
                        <th className="text-center px-4 py-3 font-bold text-primer text-xs uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-latar-alt/60">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-latar/40 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {p.gambar ? (
                                <img src={p.gambar} alt={p.nama}
                                  className="w-10 h-10 rounded-lg object-cover bg-latar-alt flex-shrink-0"
                                  onError={(e) => { e.target.style.display = 'none' }} />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-latar-alt flex items-center justify-center flex-shrink-0 text-teks/40">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                </div>
                              )}
                              <span className="font-semibold text-primer leading-tight">{p.nama}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-pendukung/15 text-pendukung text-xs font-semibold">
                              {p.kategori}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-bold text-espresso">{formatRupiah(p.harga)}</td>
                          <td className="px-4 py-4 text-teks/70 hidden sm:table-cell max-w-[160px] truncate">{p.bahan}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setEditProduct(p)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-espresso/10 text-espresso text-xs font-bold hover:bg-espresso/20 transition-colors"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ id: p.id, nama: p.nama })}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: PESAN ──────────────────────────────────────────────────────── */}
        {activeTab === 'pesan' && (
          <div>
            <div className="mb-6">
              <h2 className="font-judul text-2xl font-bold text-primer">Pesan Masuk</h2>
              <p className="text-sm text-teks/70 mt-0.5">
                {messages.length} pesan total · {unreadCount} belum dibaca
              </p>
            </div>

            {messages.length === 0 ? (
              <div className="bg-white rounded-2xl border border-latar-alt p-16 text-center text-teks/50">
                <div className="flex justify-center mb-4"><svg className="w-14 h-14 text-teks/25" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                <p className="font-semibold text-lg">Belum ada pesan masuk.</p>
                <p className="text-sm mt-1">Pesan dari formulir kontak akan muncul di sini.</p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Daftar pesan */}
                <div className="lg:col-span-4 flex flex-col gap-2">
                  {messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => handleOpenMessage(msg)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedMessage?.id === msg.id
                          ? 'border-espresso bg-espresso/5 shadow-sm'
                          : 'border-latar-alt bg-white hover:border-espresso/30 hover:bg-latar/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className={`font-bold text-sm truncate ${!msg.isRead ? 'text-primer' : 'text-teks/80'}`}>
                          {!msg.isRead && <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1.5 mb-0.5" />}
                          {msg.nama}
                        </span>
                        <span className="text-[10px] text-teks/50 whitespace-nowrap flex-shrink-0">
                          {new Date(msg.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
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
                          onClick={() => setDeleteMsgTarget(selectedMessage)}
                          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Hapus
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-3 mb-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-espresso/10 text-espresso text-xs font-semibold">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                          {selectedMessage.subjek}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-latar-alt text-teks/70 text-xs">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {formatDate(selectedMessage.createdAt)}
                        </span>
                        {selectedMessage.isRead && (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-pendukung/15 text-pendukung text-xs font-semibold">
                            ✓ Sudah dibaca
                          </span>
                        )}
                      </div>

                      <div className="bg-latar/60 rounded-xl p-5 border border-latar-alt">
                        <p className="text-sm text-teks leading-relaxed whitespace-pre-wrap">{selectedMessage.pesan}</p>
                      </div>

                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subjek)}`}
                        className="inline-flex items-center gap-2 mt-5 min-h-[44px] px-6 rounded-xl bg-espresso text-krim font-bold text-sm hover:bg-mocha transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                        Balas via Email
                      </a>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-latar-alt p-12 flex flex-col items-center justify-center text-center text-teks/50">
                      <div className="mb-3"><svg className="w-12 h-12 text-teks/25" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                      <p className="font-semibold">Pilih pesan untuk melihat detailnya</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddProduct}
        initialData={null}
        title="Tambah Produk Baru"
      />
      <ProductFormModal
        isOpen={!!editProduct}
        onClose={() => setEditProduct(null)}
        onSave={handleEditProduct}
        initialData={editProduct}
        title="Edit Produk"
      />
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Hapus Produk?"
        message={`Produk "${deleteTarget?.nama}" akan dihapus permanen dan tidak dapat dikembalikan.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmModal
        isOpen={!!deleteMsgTarget}
        title="Hapus Pesan?"
        message={`Pesan dari "${deleteMsgTarget?.nama}" akan dihapus permanen.`}
        onConfirm={handleDeleteMsg}
        onCancel={() => setDeleteMsgTarget(null)}
      />
    </div>
  )
}
