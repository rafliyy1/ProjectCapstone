import { useEffect, useState } from 'react'
import { statistik } from '../../data/Beranda'
import { useScrollReveal } from '../../hooks/useScrollReveal'

function useCounter(angkaStr, suffix, active, duration = 1600) {
  const numeric = parseFloat(angkaStr.replace(/\./g, '').replace(',', '.'))
  const [display, setDisplay] = useState('0' + suffix)

  useEffect(() => {
    if (!active || isNaN(numeric)) return

    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - (1 - progress) * (1 - progress)
      const current = Math.round(eased * numeric)
      const formatted = current.toLocaleString('id-ID')
      setDisplay(formatted + suffix)

      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active])

  return display
}

function StatItem({ angka, teks, active }) {
  const match = angka.match(/^([\d.,]+)(.*)$/)
  const numPart = match ? match[1] : angka
  const suffix = match ? match[2] : ''
  const displayed = useCounter(numPart, suffix, active)

  return (
    <li className="bg-latar l-4 border-pendukung rounded-lg px-5 py-4">
      <strong className="block font-judul text-3xl text-primer">{displayed}</strong>
      <span className="text-sm">{teks}</span>
    </li>
  )
}

export default function TentangSingkat() {
  const [sectionRef, isVisible] = useScrollReveal()

  return (
    <section ref={sectionRef} className="bg-latar-alt py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-[1.2fr_1fr] gap-10 items-start">
        <div className="max-w-[34em]">
          <h2 className="font-judul font-bold text-primer text-3xl mb-4">
            Berawal dari tumpukan barang bekas di belakang rumah
          </h2>
          <p>
            Reka Limbah dimulai dari satu hal sederhana, berawal dari sayang membuang botol dan kain yang
            masih bagus. Kini kami bekerja bersama para pengrajin untuk
            mengolahnya menjadi barang yang dipakai setiap hari.
          </p>
        </div>
        <ul className="grid gap-4">
          {statistik.map((item) => (
            <StatItem key={item.teks} angka={item.angka} teks={item.teks} active={isVisible} />
          ))}
        </ul>
      </div>
    </section>
  )
}