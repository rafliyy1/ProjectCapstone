export default function KartuProduk({ nama, bahan, harga, label, gambar }) {
  return (
    <article className="flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_2px_0_#7A5C47] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(74,55,40,0.18)]">
      <div
        className="aspect-[4/3] bg-linear-to-br from-latar-alt to-sekunder overflow-hidden"
        role="img"
        aria-label={nama ? `Foto ${nama}` : 'Foto produk'}
      >
        {gambar ? (
          <img
            src={gambar}
            alt={nama ?? 'Foto produk'}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-2 p-5 flex-1">
        {label ? (
          <span className="self-start px-3 py-0.5 rounded-full bg-latar-alt text-primer text-sm font-bold">
            {label}
          </span>
        ) : null}
        {nama ? <h3 className="font-judul font-bold text-primer text-xl">{nama}</h3> : null}
        {bahan ? <p className="text-sm text-teks/70">Bahan: {bahan}</p> : null}
        {harga ? <p className="font-bold mb-2">Rp {harga.toLocaleString('id-ID')}</p> : null}
        <button
          type="button"
          className="mt-auto inline-flex items-center justify-center min-h-[44px] rounded-lg border-2 border-primer text-primer font-bold hover:bg-primer hover:text-latar transition-colors"
        >
          Pesan sekarang
        </button>
      </div>
    </article>
  )
}