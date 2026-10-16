import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/logo_rekalimbah.png'

const menu = [
  { to: '/produk', label: 'Produk' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/kontak', label: 'Kontak' },
]

export default function Navbar() {
  const location = useLocation()
  const [adminUser, setAdminUser] = useState(null)

  useEffect(() => {
    function checkUser() {
      const saved = localStorage.getItem('reka_limbah_admin')
      setAdminUser(saved ? JSON.parse(saved) : null)
    }

    checkUser()
    window.addEventListener('storage', checkUser)
    window.addEventListener('authChange', checkUser)

    return () => {
      window.removeEventListener('storage', checkUser)
      window.removeEventListener('authChange', checkUser)
    }
  }, [location])

  return (
    <header className="sticky top-0 z-10 bg-latar border-b-2 border-sekunder">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-6 min-h-[68px]">
        <NavLink to="/" className="flex items-center gap-3 mr-auto">
          <img src={logo} alt="Logo Reka Limbah" className="h-10 w-auto" />
          <span className="font-judul font-bold text-2xl text-primer">Reka Limbah</span>
        </NavLink>
        <div className="flex items-center gap-6">
          <ul className="flex gap-6 font-semibold text-sm sm:text-base">
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
          </ul>
          <NavLink
            to="/admin"
            className="px-4 py-1.5 rounded-lg bg-espresso text-latar text-sm font-bold hover:bg-sekunder transition-colors shadow-sm"
          >
            {adminUser ? adminUser.nama || adminUser.username : 'Login'}
          </NavLink>
        </div>
      </div>
    </header>
  )
}