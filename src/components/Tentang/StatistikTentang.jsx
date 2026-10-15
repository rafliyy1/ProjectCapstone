import { statistikTentang } from '../../data/Tentang'

export default function StatistikTentang() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <h2 className="font-judul font-bold text-primer text-2xl sm:text-3xl mb-3">
            {statistikTentang.judul}
          </h2>
          <p className="text-teks/80 text-base sm:text-lg">
            {statistikTentang.subjudul}
          </p>
        </div>

        <ul className="grid sm:grid-cols-3 gap-6">
          {statistikTentang.data.map((item) => (
            <li
              key={item.teks}
              className="bg-latar-alt/60 border-l-4 border-pendukung rounded-xl p-6 sm:p-7 shadow-xs flex flex-col justify-between"
            >
              <strong className="block font-judul text-4xl sm:text-5xl text-primer mb-3">
                {item.angka}
              </strong>
              <span className="text-base text-teks/90 font-medium leading-snug">
                {item.teks}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
