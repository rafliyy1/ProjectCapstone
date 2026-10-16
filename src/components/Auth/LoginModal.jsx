import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function LoginModal({ isOpen, onClose }) {
  const { login, isLoggedIn, currentUser, logout } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const modalRef = useRef(null)
  const firstInputRef = useRef(null)

  // Fokus ke input saat modal terbuka
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Tutup modal saat klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // Tutup modal dengan Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username dan password wajib diisi.')
      return
    }

    setLoading(true)
    // Simulasi delay network
    setTimeout(() => {
      const result = login(form.username.trim(), form.password)
      if (result.success) {
        setForm({ username: '', password: '' })
        setError('')
        setLoading(false)
        onClose()
        if (result.user.role === 'admin') {
          navigate('/admin')
        }
      } else {
        setError(result.error)
        setLoading(false)
      }
    }, 600)
  }

  function handleLogout() {
    logout()
    onClose()
    navigate('/')
  }

  // ── Tampilan saat sudah login ────────────────────────────────────────────
  if (isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative animate-slideUp"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-latar-alt transition-colors text-teks/60 hover:text-primer text-lg"
            aria-label="Tutup"
          >
            ✕
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-espresso text-krim flex items-center justify-center text-2xl font-bold mx-auto mb-3">
              {currentUser.nama.charAt(0)}
            </div>
            <h2 className="font-judul text-xl font-bold text-primer">
              {currentUser.nama}
            </h2>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-espresso/10 text-espresso">
              Admin
            </span>
          </div>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => { onClose(); navigate('/admin') }}
              className="w-full mb-3 min-h-[44px] rounded-lg bg-espresso text-krim font-bold hover:bg-mocha transition-colors text-sm"
            >
              Dashboard Admin
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full min-h-[44px] rounded-lg border-2 border-espresso text-espresso font-bold hover:bg-espresso hover:text-krim transition-colors text-sm"
          >
            Keluar
          </button>
        </div>
      </div>
    )
  }

  // ── Tampilan form login ──────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative animate-slideUp"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-latar-alt transition-colors text-teks/60 hover:text-primer text-lg"
          aria-label="Tutup"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-espresso/10 text-espresso flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="font-judul text-2xl font-bold text-primer">Masuk Admin</h2>
          <p className="text-sm text-teks/70 mt-1">Halaman ini hanya untuk administrator</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="login-username" className="block text-sm font-bold text-primer mb-1.5">
              Username
            </label>
            <input
              ref={firstInputRef}
              id="login-username"
              name="username"
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              className="w-full min-h-[44px] px-4 rounded-lg border border-latar-alt bg-latar/30 text-teks text-sm focus:outline-none focus:ring-2 focus:ring-espresso/30 focus:border-espresso transition-colors"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-bold text-primer mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className="w-full min-h-[44px] px-4 pr-12 rounded-lg border border-latar-alt bg-latar/30 text-teks text-sm focus:outline-none focus:ring-2 focus:ring-espresso/30 focus:border-espresso transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-teks/50 hover:text-primer transition-colors"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 font-semibold bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            id="btn-login-submit"
            className="w-full min-h-[44px] rounded-lg bg-espresso text-krim font-bold hover:bg-mocha transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-1"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-krim border-t-transparent rounded-full animate-spin" />
                Memverifikasi...
              </span>
            ) : (
              'Masuk'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
