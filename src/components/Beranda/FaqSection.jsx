import { useState } from 'react'
import { faq } from '../../data/Beranda'

export default function FaqSection() {
  const [terbuka, setTerbuka] = useState(null)

  function toggle(index) {
    setTerbuka(terbuka === index ? null : index)
  }

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[800px] mx-auto px-6">
        <h2 className="font-judul font-bold text-primer text-3xl mb-8">Pertanyaan yang sering diajukan</h2>
        <div className="grid gap-3">
          {faq.map((item, index) => (
            <div key={item.tanya} className="bg-white rounded-lg border border-latar-alt">
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={terbuka === index}
                className="w-full flex items-center justify-between gap-4 text-left px-5 min-h-[52px] font-semibold text-primer"
              >
                {item.tanya}
                <span className="text-xl">{terbuka === index ? '−' : '+'}</span>
              </button>
              {terbuka === index && <p className="px-5 pb-4">{item.jawab}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}