import FormulirKontak from '../components/Kontak/FormulirKontak'
import InformasiKontak from '../components/Kontak/InformasiKontak'
import { faqKontakSingkat } from '../data/Kontak'

export default function Kontak() {
  {/* Dikerjakan oleh: Anggota Capstone Reka Limbah - Fitur Halaman Kontak */}
  return (
    <div className="py-12 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Bagian Pengenalan Halaman (Header / Hero Kontak) */}
        <header className="max-w-2xl mb-12 md:mb-16">
          <span className="inline-block px-3 py-0.5 rounded-full bg-latar-alt text-primer text-sm font-bold mb-4">
            Terhubung Dengan Kami
          </span>
          <h1 className="font-judul font-bold text-primer text-4xl lg:text-5xl leading-tight mb-4">
            Mulai Percakapan, Ciptakan Karya Berkelanjutan.
          </h1>
          <p className="text-lg leading-relaxed text-teks/90">
            Punya botol atau kain yang ingin diolah, butuh cenderamata ramah lingkungan untuk acara,
            atau ingin memesan kerajinan kustom? Pengrajin kami siap mendengarkan.
          </p>
          {/* Aksen Caveat sesuai Style Guide Reka Limbah (Maksimal 1 per halaman) */}
          <p className="font-aksen text-2xl text-sekunder mt-3 -rotate-1">
            "Setiap barang bekas berhak punya kesempatan kedua ~"
          </p>
        </header>

        {/* Konten Utama: Formulir & Informasi Kontak (Responsif Desktop & Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Kolom Formulir Pesan */}
          <div className="lg:col-span-7">
            <FormulirKontak />
          </div>

          {/* Kolom Informasi Kontak & WhatsApp */}
          <div className="lg:col-span-5">
            <InformasiKontak />
          </div>
        </div>

        {/* Bagian Bantuan Tambahan / FAQ Singkat Pemesanan */}
        <section className="mt-16 md:mt-24 pt-12 border-t border-latar-alt">
          <div className="max-w-2xl mb-8">
            <h2 className="font-judul font-bold text-primer text-2xl sm:text-3xl">
              Pertanyaan Seputar Pemesanan & Kontak
            </h2>
            <p className="text-sm text-teks/75 mt-1">
              Beberapa hal yang paling sering ditanyakan pelanggan sebelum menghubungi kami.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {faqKontakSingkat.map((faq) => (
              <div
                key={faq.tanya}
                className="bg-latar-alt/60 p-6 rounded-xl border-l-4 border-pendukung"
              >
                <h3 className="font-judul font-bold text-primer text-lg mb-2">
                  {faq.tanya}
                </h3>
                <p className="text-sm text-teks/85 leading-relaxed">{faq.jawab}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}