import { Link } from 'react-router-dom'
import { ctaTentang } from '../../data/Tentang'

export default function AjakanTentang() {
  return (
    <section className="bg-sekunder text-latar py-16 md:py-20 text-center">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center">
        <h2 className="font-judul font-bold text-3xl sm:text-4xl mb-4 text-latar">
          {ctaTentang.judul}
        </h2>
        <p className="max-w-2xl text-latar/90 text-base sm:text-lg mb-8 leading-relaxed">
          {ctaTentang.deskripsi}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to={ctaTentang.tombolProduk.link}
            className="inline-flex items-center justify-center min-h-[44px] px-7 rounded-lg bg-latar text-primer font-bold hover:bg-latar-alt transition-colors"
          >
            {ctaTentang.tombolProduk.teks}
          </Link>
          <Link
            to={ctaTentang.tombolKontak.link}
            className="inline-flex items-center justify-center min-h-[44px] px-7 rounded-lg border-2 border-latar text-latar font-bold hover:bg-latar hover:text-primer transition-colors"
          >
            {ctaTentang.tombolKontak.teks}
          </Link>
        </div>
      </div>
    </section>
  )
}
