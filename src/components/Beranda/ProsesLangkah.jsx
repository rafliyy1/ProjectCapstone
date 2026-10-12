import { langkahProses } from '../../data/Beranda'

export default function ProsesLangkah() {
  return (
    <section className="bg-latar-alt py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="font-judul font-bold text-primer text-3xl mb-10">
          Bagaimana barang bekas jadi karya
        </h2>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {langkahProses.map((langkah, i) => (
            <li key={langkah.judul}>
              <span className="flex items-center justify-center w-11 h-11 mb-4 rounded-full bg-primer text-latar font-judul font-bold">
                {i + 1}
              </span>
              <h3 className="font-judul font-bold text-primer text-xl mb-1">{langkah.judul}</h3>
              <p>{langkah.isi}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}