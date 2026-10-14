export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <span
          className="absolute left-4.5 pointer-events-none text-sekunder/70 flex items-center justify-center"
          aria-hidden="true"
        >
          <svg
            className="w-5 h-5 text-[#7A5C47]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>

        {/* Input */}
        <input
          id="product-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari produk berdasarkan nama atau bahan utama (contoh: perca, kaca, palet)..."
          aria-label="Cari produk berdasarkan nama atau bahan utama"
          className="w-full h-12 sm:h-13 pl-12 pr-11 bg-white text-teks placeholder:text-teks/45 rounded-xl border-2 border-sekunder/30 focus:border-primer focus:outline-none focus:ring-3 focus:ring-sekunder/15 transition-all text-[15px] sm:text-[16px] shadow-xs"
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Hapus kata kunci pencarian"
            className="absolute right-3.5 p-1 rounded-full text-teks/50 hover:text-primer hover:bg-latar-alt/60 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
