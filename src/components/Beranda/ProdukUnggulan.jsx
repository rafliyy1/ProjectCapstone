import { produkUnggulan } from '../../data/Beranda'
import KartuProduk from './KartuProduk'

export default function ProdukUnggulan() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="font-judul font-bold text-primer text-3xl mb-2">Produk unggulan</h2>
        <p className="mb-10">Pilih yang kamu suka, lalu hubungi kami untuk memesan.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {produkUnggulan.map((p) => (
            <KartuProduk key={p.id} nama={p.nama} bahan={p.bahan} harga={p.harga} label={p.label} />
          ))}
        </div>
      </div>
    </section>
  )
}