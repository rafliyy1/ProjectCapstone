import { visiMisiTentang } from '../../data/Tentang'

export default function VisiMisiTentang() {
  return (
    <section className="bg-latar-alt py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <h2 className="font-judul font-bold text-primer text-2xl sm:text-3xl mb-3">
            {visiMisiTentang.judul}
          </h2>
          <p className="text-teks/80 text-base sm:text-lg">
            {visiMisiTentang.subjudul}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Kartu Visi */}
          <div className="bg-latar rounded-2xl p-6 sm:p-8 border border-latar-alt shadow-[0_2px_0_#7A5C47] flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full bg-pendukung/25 text-primer text-xs font-bold uppercase tracking-wider mb-4">
                {visiMisiTentang.visi.label}
              </span>
              <h3 className="font-judul font-bold text-primer text-2xl mb-4">
                {visiMisiTentang.visi.judul}
              </h3>
              <p className="text-teks/90 leading-relaxed text-base sm:text-lg">
                {visiMisiTentang.visi.konten}
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-latar-alt text-xs text-teks/70 italic">
              {visiMisiTentang.visi.catatan}
            </div>
          </div>

          {/* Kartu Misi */}
          <div className="bg-latar rounded-2xl p-6 sm:p-8 border border-latar-alt shadow-[0_2px_0_#7A5C47] flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full bg-pendukung/25 text-primer text-xs font-bold uppercase tracking-wider mb-4">
                {visiMisiTentang.misi.label}
              </span>
              <h3 className="font-judul font-bold text-primer text-2xl mb-4">
                {visiMisiTentang.misi.judul}
              </h3>
              <ul className="space-y-3.5 text-teks/90">
                {visiMisiTentang.misi.poin.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pendukung/30 text-primer font-bold text-xs shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm sm:text-base leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 pt-5 border-t border-latar-alt text-xs text-teks/70 italic">
              {visiMisiTentang.misi.catatan}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
