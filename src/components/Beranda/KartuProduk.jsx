import { Link } from 'react-router-dom'

export default function KartuProduk({ nama, bahan, harga, label }) {
  return (
    <article className="flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_2px_0_#7A5C47]">
      <div
        className="aspect-[4/3] bg-linear-to-br from-latar-alt to-sekunder"
        role="img"
        aria-label={nama ? `Foto ${nama}` : 'Foto produk'}
      />
      <div className="flex flex-col gap-2 p-5 flex-1">
        {label ? (
          <span className="self-start px-3 py-0.5 rounded-full bg-latar-alt text-primer text-sm font-bold">
            {label}
          </span>
        ) : null}
        {nama ? <h3 className="font-judul font-bold text-primer text-xl">{nama}</h3> : null}
        {bahan ? <p className="text-sm text-teks/70">Bahan: {bahan}</p> : null}
        {harga ? <p className="font-bold mb-2">Rp {harga.toLocaleString('id-ID')}</p> : null}
        <Link
          to="/kontak"
          className="mt-auto inline-flex items-center justify-center min-h-[44px] rounded-lg border-2 border-primer text-primer font-bold hover:bg-primer hover:text-latar transition-colors"
        >
          Pesan sekarang
        </Link>
      </div>
    </article>
  )
}