import { useState } from 'react'
import { opsiSubjekFormulir } from '../../data/Kontak'
import { sendContactMessage } from '../../services/api'
import { useApp } from '../../context/AppContext'

const initialState = {
  nama: '',
  email: '',
  subjek: '',
  pesan: '',
}

export default function FormulirKontak() {
  const { addMessage } = useApp()
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success'

  const [serverError, setServerError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Bersihkan error saat pengguna mulai mengetik
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (serverError) setServerError('')
  }

  function validate() {
    const newErrors = {}
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama wajib diisi.'
    } else if (formData.nama.trim().length < 2) {
      newErrors.nama = 'Nama minimal 2 karakter.'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Format alamat email tidak valid.'
    }

    if (!formData.subjek) {
      newErrors.subjek = 'Silakan pilih subjek keperluan.'
    }

    if (!formData.pesan.trim()) {
      newErrors.pesan = 'Pesan tidak boleh kosong.'
    } else if (formData.pesan.trim().length < 10) {
      newErrors.pesan = 'Pesan terlalu singkat (minimal 10 karakter).'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')
    setServerError('')

    const payload = {
      nama: formData.nama.trim(),
      email: formData.email.trim(),
      subjek: formData.subjek,
      pesan: formData.pesan.trim(),
    }

    // Simpan pesan ke context agar admin bisa melihatnya
    addMessage(payload)

    try {
      // Kirim juga ke database lewat server
      await sendContactMessage(payload)
      setStatus('success')
    } catch (err) {
      console.warn('Gagal menyimpan ke database server:', err.message)
      // Jika server offline, tetap berikan fallback sukses namun tampilkan catatan
      setServerError(
        'Catatan: Server database belum aktif atau terjadi kendala koneksi, namun data formulir Anda tetap kami tampung.'
      )
      setStatus('success')
    }
  }

  function handleReset() {
    setFormData(initialState)
    setErrors({})
    setServerError('')
    setStatus('idle')
  }

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-[0_2px_0_#7A5C47] border border-latar-alt">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-pendukung">
          Kirim Pesan
        </span>
        <h2 className="font-judul text-2xl sm:text-3xl font-bold text-primer mt-1">
          Tulis Pesan untuk Kami
        </h2>
        <p className="text-sm text-teks/80 mt-1.5">
          Punya ide kreasi, pertanyaan pesanan kustom, atau tawaran bahan daur ulang? Silakan isi formulir di bawah.
        </p>
      </div>

      {status === 'success' ? (
        <div className="bg-latar rounded-xl p-6 sm:p-8 border-2 border-pendukung/50 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-pendukung/20 text-primer flex items-center justify-center mb-4 text-2xl font-bold">
            ✓
          </div>
          <h3 className="font-judul text-2xl font-bold text-primer mb-2">
            Pesan Berhasil Terkirim!
          </h3>
          <p className="text-sm text-teks/85 max-w-md leading-relaxed mb-6">
            Terima kasih, <strong className="text-primer">{formData.nama}</strong>. Kami telah menerima pesanmu dan akan membalas ke <strong className="text-primer">{formData.email}</strong> dalam waktu maksimal 1 hari kerja.
          </p>
          {serverError && (
            <p className="text-xs text-teks/70 max-w-md leading-relaxed mb-6">
              {serverError}
            </p>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-lg bg-primer text-latar font-bold hover:bg-sekunder transition-colors text-sm"
          >
            Kirim Pesan Lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Input Nama */}
          <div>
            <label htmlFor="nama" className="block text-sm font-bold text-primer mb-1.5">
              Nama Lengkap <span className="text-sekunder">*</span>
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Contoh: Rian Anggoro"
              className={`w-full min-h-[44px] px-4 rounded-lg bg-latar/30 border text-teks text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primer/30 ${
                errors.nama ? 'border-red-600 bg-red-50/40' : 'border-latar-alt focus:border-primer'
              }`}
            />
            {errors.nama && (
              <p className="text-xs text-red-600 font-semibold mt-1">{errors.nama}</p>
            )}
          </div>

          {/* Input Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-primer mb-1.5">
              Alamat Email <span className="text-sekunder">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Contoh: rian@email.com"
              className={`w-full min-h-[44px] px-4 rounded-lg bg-latar/30 border text-teks text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primer/30 ${
                errors.email ? 'border-red-600 bg-red-50/40' : 'border-latar-alt focus:border-primer'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-600 font-semibold mt-1">{errors.email}</p>
            )}
          </div>

          {/* Pilihan Subjek */}
          <div>
            <label htmlFor="subjek" className="block text-sm font-bold text-primer mb-1.5">
              Subjek Keperluan <span className="text-sekunder">*</span>
            </label>
            <select
              id="subjek"
              name="subjek"
              value={formData.subjek}
              onChange={handleChange}
              className={`w-full min-h-[44px] px-4 rounded-lg bg-latar/30 border text-teks text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primer/30 ${
                errors.subjek ? 'border-red-600 bg-red-50/40' : 'border-latar-alt focus:border-primer'
              }`}
            >
              {opsiSubjekFormulir.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.subjek && (
              <p className="text-xs text-red-600 font-semibold mt-1">{errors.subjek}</p>
            )}
          </div>

          {/* Input Pesan */}
          <div>
            <label htmlFor="pesan" className="block text-sm font-bold text-primer mb-1.5">
              Rincian Pesan <span className="text-sekunder">*</span>
            </label>
            <textarea
              id="pesan"
              name="pesan"
              rows={5}
              value={formData.pesan}
              onChange={handleChange}
              placeholder="Ceritakan detail produk kustom yang diinginkan, bahan yang ingin disetor, atau pertanyaanmu..."
              className={`w-full p-4 rounded-lg bg-latar/30 border text-teks text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primer/30 resize-y ${
                errors.pesan ? 'border-red-600 bg-red-50/40' : 'border-latar-alt focus:border-primer'
              }`}
            />
            {errors.pesan && (
              <p className="text-xs text-red-600 font-semibold mt-1">{errors.pesan}</p>
            )}
          </div>

          {/* Tombol Kirim */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-8 rounded-lg bg-primer text-latar font-bold hover:bg-sekunder transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-latar border-t-transparent rounded-full animate-spin" />
                  Mengirim Pesan...
                </span>
              ) : (
                'Kirim Pesan Sekarang'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}