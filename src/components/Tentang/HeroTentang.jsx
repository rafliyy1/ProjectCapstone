import { heroTentang } from '../../data/Tentang'

export default function HeroTentang() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-3xl">
          <h1 className="font-judul text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-primer leading-tight mb-4">
            {heroTentang.judul}
          </h1>
          {/* Aksen Caveat: maksimal satu kali per halaman sesuai style guide */}
          <p className="font-aksen text-2xl sm:text-3xl text-sekunder mb-4 -rotate-1">
            {heroTentang.motto}
          </p>
          <p className="text-lg text-teks/90 leading-relaxed">
            {heroTentang.deskripsi}
          </p>
        </div>
      </div>
    </section>
  )
}
