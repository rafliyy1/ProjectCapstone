import { Link } from 'react-router-dom'

export default function AjakanKontak() {
  return (
    <section className="bg-sekunder text-latar py-16 text-center">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center">
        <h2 className="font-judul font-bold text-3xl mb-3">Punya pesanan atau ide produk?</h2>
        <p className="max-w-[30em] mb-7">Ceritakan kebutuhanmu. Kami balas dalam 1 hari kerja.</p>
        <Link
          to="/kontak"
          className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-lg bg-latar text-primer font-bold hover:bg-latar-alt transition-colors"
        >
          Hubungi kami
        </Link>
      </div>
    </section>
  )
}