import { produkUnggulan } from '../../data/Beranda'
import KartuProduk from './KartuProduk'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function ProdukUnggulan() {
  const [headerRef, headerVisible] = useScrollReveal()
  const [gridRef, gridVisible] = useScrollReveal()

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div
          ref={headerRef}
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <h2 className="font-judul font-bold text-primer text-3xl mb-2">Produk unggulan</h2>
          <p className="mb-10">Pilih yang kamu suka, lalu hubungi kami untuk memesan.</p>
        </div>

        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7"
          style={{
            opacity: gridVisible ? 1 : 0,
            transform: gridVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
          }}
        >
          {produkUnggulan.map((p) => (
            <KartuProduk key={p.id} nama={p.nama} bahan={p.bahan} harga={p.harga} label={p.label} gambar={p.gambar} />
          ))}
        </div>
      </div>
    </section>
  )
}