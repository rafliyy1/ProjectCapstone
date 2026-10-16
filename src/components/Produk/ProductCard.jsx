import { useState } from 'react'

export default function ProductCard({ produk }) {
  const [imageError, setImageError] = useState(false)

  const formattedPrice = `Rp ${Number(produk.harga).toLocaleString('id-ID')}`

  return (
    <article className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-latar-alt/70 shadow-[0_4px_16px_rgba(74,55,40,0.06)] hover:shadow-[0_10px_26px_rgba(74,55,40,0.12)] hover:-translate-y-1 transition-all duration-300 group">
      {/* 1. Foto Produk / Fallback */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-latar-alt/40">
        {!imageError && produk.gambar ? (
          <img
            src={produk.gambar}
            alt={`Foto ${produk.nama} - kerajinan daur ulang dari ${produk.bahan}`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-linear-to-br from-[#E8DCC8] to-[#7A5C47]"
            role="img"
            aria-label={`Ilustrasi placeholder untuk ${produk.nama}`}
          >
            <svg
              className="w-10 h-10 text-primer/70 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs font-semibold text-latar tracking-wide">
              {produk.kategori}
            </span>
          </div>
        )}
      </div>

      {/* Konten Card */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 gap-3">
        {/* 2. Badge pill "Handmade" */}
        <div className="flex items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E8DCC8] text-primer text-xs font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-primer"></span>
            Handmade
          </span>
        </div>

        {/* 3. Nama Produk (font heading Fraunces) */}
        <h3 className="font-judul font-bold text-primer text-xl sm:text-[22px] leading-snug">
          {produk.nama}
        </h3>

        {/* 4. Deskripsi Singkat */}
        <p className="text-[14px] text-teks/85 leading-relaxed line-clamp-3">
          {produk.deskripsi}
        </p>

        {/* 5. Bahan Utama */}
        <div className="pt-1 text-[13.5px] text-teks/75 flex items-center gap-1.5">
          <span className="font-semibold text-primer">Bahan:</span>
          <span className="capitalize">{produk.bahan}</span>
        </div>

        {/* 6. Harga */}
        <div className="pt-1 mt-auto">
          <span className="font-judul font-bold text-[20px] sm:text-[22px] text-primer">
            {formattedPrice}
          </span>
        </div>

        {/* 7. Tombol outline "Pesan via WhatsApp" */}
        <div className="pt-2">
          <button
            type="button"
            className="w-full h-11 px-[22px] rounded-lg border-2 border-primer bg-transparent text-primer font-bold text-[15px] sm:text-[16px] hover:bg-primer hover:text-latar transition-colors duration-200 cursor-pointer inline-flex items-center justify-center shadow-xs"
          >
            Pesan via WhatsApp
          </button>
        </div>
      </div>
    </article>
  )
}
