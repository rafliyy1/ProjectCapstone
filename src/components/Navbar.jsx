import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/logo_rekalimbah.png'
import LoginModal from './Auth/LoginModal'
import { useApp } from '../context/AppContext'

const menu = [
  { to: '/produk', label: 'Produk' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/kontak', label: 'Kontak' },
]

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isLoggedIn, currentUser, isAdmin } = useApp()
  const location = useLocation()

  // Tutup menu mobile saat berpindah halaman
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <header className="sticky top-0 z-10 bg-latar border-b-2 border-sekunder">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center gap-4 min-h-[68px]">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 sm:gap-3 mr-auto">
            <img src={logo} alt="Logo Reka Limbah" className="h-8 sm:h-10 w-auto" />
            <span className="font-judul font-bold text-xl sm:text-2xl text-primer">Reka Limbah</span>
          </NavLink>

          {/* Menu Desktop */}
          <ul className="hidden md:flex items-center gap-6 font-semibold">
            {menu.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? 'text-sekunder' : 'hover:text-sekunder'
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                id="btn-navbar-login"
                onClick={() => setShowLogin(true)}
                className="inline-flex items-center gap-2 min-h-[38px] px-4 sm:px-5 rounded-lg bg-espresso text-krim font-bold text-sm hover:bg-mocha transition-colors"
              >
                {isLoggedIn ? (
                  <>
                    <span className="w-5 h-5 rounded-full bg-krim/20 flex items-center justify-center text-xs font-bold">
                      {currentUser.nama.charAt(0)}
                    </span>
                    {isAdmin ? 'Admin' : currentUser.nama.split(' ')[0]}
                  </>
                ) : (
                  'Login Admin'
                )}
              </button>
            </li>
          </ul>

          {/* Tombol Hamburger Mobile */}
          <button
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-latar-alt transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
          >
            <span className={`block w-5 h-0.5 bg-primer transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-primer transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-primer transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-80' : 'max-h-0'}`}
        >
          <nav className="bg-latar border-t border-latar-alt px-4 py-3 flex flex-col gap-1">
            {menu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg font-semibold transition-colors ${
                    isActive
                      ? 'bg-espresso/10 text-sekunder'
                      : 'hover:bg-latar-alt text-teks'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              id="btn-navbar-login-mobile"
              onClick={() => { setShowLogin(true); setMenuOpen(false) }}
              className="mt-2 w-full min-h-[44px] rounded-lg bg-espresso text-krim font-bold text-sm hover:bg-mocha transition-colors"
            >
              {isLoggedIn ? (isAdmin ? 'Admin' : currentUser.nama.split(' ')[0]) : 'Login Admin'}
            </button>
          </nav>
        </div>
      </header>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}