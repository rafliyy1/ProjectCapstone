import { NavLink } from 'react-router-dom'
import logo from '../assets/logo_rekalimbah.png'

const menu = [
  { to: '/produk', label: 'Produk' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/kontak', label: 'Kontak' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-latar border-b-2 border-sekunder">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-6 min-h-[68px]">
        <NavLink to="/" className="flex items-center gap-3 mr-auto">
          <img src={logo} alt="Logo Reka Limbah" className="h-10 w-auto" />
          <span className="font-judul font-bold text-2xl text-primer">Reka Limbah</span>
        </NavLink>
        <ul className="flex gap-6 font-semibold">
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
      </div>
    </header>
  )
}