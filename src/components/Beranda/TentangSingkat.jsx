import { statistik } from '../../data/Beranda'

export default function TentangSingkat() {
  return (
    <section className="bg-latar-alt py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-[1.2fr_1fr] gap-10 items-start">
        <div className="max-w-[34em]">
          <h2 className="font-judul font-bold text-primer text-3xl mb-4">
            Berawal dari tumpukan di belakang rumah
          </h2>
          <p>
            Reka Limbah dimulai dari satu hal sederhana: sayang membuang botol dan kain yang
            masih bagus. Kini kami bekerja bersama pengrajin di lingkungan sekitar untuk
            mengolahnya menjadi barang yang dipakai setiap hari.
          </p>
        </div>
        <ul className="grid gap-4">
          {statistik.map((item) => (
            <li key={item.teks} className="bg-latar border-l-4 border-pendukung rounded-lg px-5 py-4">
              <strong className="block font-judul text-3xl text-primer">{item.angka}</strong>
              <span className="text-sm">{item.teks}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}