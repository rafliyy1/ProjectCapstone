import { Link } from 'react-router-dom'
import fotoBotol from '../../assets/Gambar_BotolKaca_Beranda.png'
import fotoVas from '../../assets/Gambar_VasMeja_Beranda.png'

export default function Hero() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block px-3 py-0.5 rounded-full bg-latar-alt text-primer text-sm font-bold mb-4">
            100% bahan daur ulang
          </span>
          <h1 className="font-judul font-bold text-primer text-4xl lg:text-5xl leading-tight mb-4">
            Dari yang terbuang, jadi yang dikenang.
          </h1>
          <p className="text-lg max-w-[34em]">
            Kami mengubah botol, kain perca, dan kayu bekas menjadi hiasan, wadah, dan
            perlengkapan rumah yang dibuat tangan oleh pengrajin lokal.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link
              to="/produk"
              className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-lg bg-primer text-latar font-bold hover:bg-sekunder transition-colors"
            >
              Lihat produk
            </Link>
            <Link
              to="/tentang"
              className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-lg border-2 border-primer text-primer font-bold hover:bg-primer hover:text-latar transition-colors"
            >
              Kenali kami
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <figure className="bg-white p-3 pb-2 rounded-xl shadow-[0_2px_0_#7A5C47] -rotate-2">
            <div className="aspect-[3/4] rounded-md bg-linear-to-br from-latar-alt to-pendukung overflow-hidden">
              <img
                src={fotoBotol}
                alt="Botol kaca bekas"
                className="w-full h-full object-contain"
              />
            </div>
            <figcaption className="pt-2 text-center text-sm font-semibold text-primer">
              Botol kaca bekas
            </figcaption>
          </figure>

          <figure className="bg-white p-3 pb-2 rounded-xl shadow-[0_2px_0_#7A5C47] rotate-2">
            <div className="aspect-[3/4] rounded-md bg-linear-to-br from-latar-alt to-sekunder overflow-hidden">
              <img
                src={fotoVas}
                alt="Vas bunga anyaman"
                className="w-full h-full object-contain"
              />
            </div>
            <figcaption className="pt-2 text-center text-sm font-semibold text-primer">
              Vas bunga anyaman
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}