export default function CategoryFilter({ categories, activeCategory, onSelect }) {
  return (
    <div
      role="group"
      aria-label="Filter Kategori Produk"
      className="flex flex-wrap items-center gap-2.5 sm:gap-3"
    >
      {categories.map((kategori) => {
        const isActive = kategori === activeCategory

        return (
          <button
            key={kategori}
            type="button"
            onClick={() => onSelect(kategori)}
            aria-pressed={isActive}
            className={`h-11 px-[22px] rounded-lg font-bold text-[15px] sm:text-[16px] transition-all duration-200 cursor-pointer inline-flex items-center justify-center whitespace-nowrap ${
              isActive
                ? 'bg-primer text-latar border-2 border-primer hover:bg-sekunder hover:border-sekunder shadow-xs'
                : 'bg-transparent text-primer border-2 border-primer hover:bg-primer hover:text-latar'
            }`}
          >
            {kategori}
          </button>
        )
      })}
    </div>
  )
}
