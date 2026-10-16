import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Beranda from './pages/Beranda'
import Produk from './pages/Produk'
import Tentang from './pages/Tentang'
import Kontak from './pages/Kontak'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      {/* Halaman Admin – tanpa Layout (navbar/footer pengguna) */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/login" element={<Admin />} />

      {/* Halaman Pengguna – dengan Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/produk" element={<Produk />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/kontak" element={<Kontak />} />
      </Route>
    </Routes>
  )
}