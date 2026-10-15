import { prosesTentang } from '../../data/Tentang'

export default function ProsesTentang() {
  return (
    <section className="bg-latar-alt py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <h2 className="font-judul font-bold text-primer text-2xl sm:text-3xl mb-3">
            {prosesTentang.judul}
          </h2>
          <p className="text-teks/80 text-base sm:text-lg">
            {prosesTentang.subjudul}
          </p>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {prosesTentang.langkah.map((item) => (
            <li
              key={item.judul}
              className="bg-latar rounded-2xl p-6 border border-latar-alt shadow-[0_2px_0_#7A5C47] flex flex-col"
            >
              <span className="flex items-center justify-center w-11 h-11 mb-4 rounded-full bg-primer text-latar font-judul font-bold text-lg">
                {item.nomor}
              </span>
              <h3 className="font-judul font-bold text-primer text-xl mb-2">
                {item.judul}
              </h3>
              <p className="text-sm text-teks/85 leading-relaxed">
                {item.isi}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
