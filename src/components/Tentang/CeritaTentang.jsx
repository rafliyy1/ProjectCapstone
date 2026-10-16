import { ceritaTentang } from '../../data/Tentang'

export default function CeritaTentang() {
  return (
    <section className="pb-16 md:pb-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="md:col-span-7">
            <h2 className="font-judul font-bold text-primer text-2xl sm:text-3xl mb-4">
              {ceritaTentang.judul}
            </h2>
            <div className="space-y-4 text-teks/90 leading-relaxed text-base sm:text-lg">
              {ceritaTentang.paragraf.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="bg-latar-alt/70 p-6 sm:p-8 rounded-2xl border-l-4 border-pendukung shadow-xs">
              <h3 className="font-judul font-bold text-primer text-xl mb-3">
                Fokus Bahan yang Diolah
              </h3>
              <p className="text-sm text-teks/85 mb-4 leading-relaxed">
                Material utama produk kami tidak hanya bersumber dari lingkungan sekitar, tetapi juga dari kepedulian warga sekitar yang mengantar dan berkolaborasi bersama kami
              </p>
              <ul className="space-y-2.5 text-sm font-medium text-teks">
                {ceritaTentang.fokusBahan.map((item) => (
                  <li key={item.nama} className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-pendukung"></span>
                    <span>
                      <strong>{item.nama}</strong> — {item.keterangan}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
