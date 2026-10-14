import ProductCard from './ProductCard'

export default function ProductGrid({ products, onReset }) {
  if (!products || products.length === 0) {
    return (
      <div className="w-full bg-white/70 border-2 border-dashed border-sekunder/30 rounded-2xl p-8 sm:p-12 text-center my-6 flex flex-col items-center justify-center">
        {/* Recycle / Leaf Empty State Illustration */}
        <div className="w-16 h-16 rounded-full bg-latar-alt flex items-center justify-center text-primer mb-4 shadow-inner">
          <svg
            className="w-8 h-8 text-sekunder"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <h3 className="font-judul text-2xl font-bold text-primer mb-2">
          Produk tidak ditemukan
        </h3>
        <p className="text-teks/75 text-[15px] max-w-md mx-auto mb-6 leading-relaxed">
          Maaf, tidak ada produk yang cocok dengan pencarian atau filter kategori saat ini. Coba gunakan kata kunci lain atau setel ulang filter.
        </p>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="h-11 px-[22px] rounded-lg bg-primer text-latar font-bold text-[15px] hover:bg-sekunder transition-colors duration-200 cursor-pointer shadow-xs inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset Pencarian & Filter
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
      {products.map((item) => (
        <ProductCard key={item.id} produk={item} />
      ))}
    </div>
  )
}
