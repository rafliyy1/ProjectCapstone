import { useState } from 'react'
import { faq } from '../../data/Beranda'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function FaqSection() {
  const [terbuka, setTerbuka] = useState(null)
  const [ref, isVisible] = useScrollReveal()

  function toggle(index) {
    setTerbuka(terbuka === index ? null : index)
  }

  return (
    <section className="py-16 md:py-20">
      <div
        ref={ref}
        className="max-w-[800px] mx-auto px-6"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        <h2 className="font-judul font-bold text-primer text-3xl mb-8">Pertanyaan yang sering diajukan</h2>
        <div className="grid gap-3">
          {faq.map((item, index) => (
            <div
              key={item.tanya}
              className="bg-white rounded-lg border border-latar-alt"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.5s ease ${0.1 + index * 0.1}s, transform 0.5s ease ${0.1 + index * 0.1}s`,
              }}
            >
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