import { useState } from 'react'
import { categories, products } from '../data/products'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import ProductGrid from '../components/ProductGrid'

export default function Produk() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')

  // Search dan filter kategori bekerja bersamaan (real-time & case-insensitive)
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Semua' || item.kategori === selectedCategory

    const query = searchTerm.toLowerCase().trim()
    const matchesSearch =
      query === '' ||
      item.nama.toLowerCase().includes(query) ||
      item.bahan.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('Semua')
  }

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-10 sm:py-14 lg:py-20">
      {/* 1. Judul halaman dan deskripsi singkat */}
      <div className="max-w-2xl mb-10 sm:mb-12">
        {/* Aksen Caveat: maksimal satu kali per halaman sesuai style guide */}
        <p className="font-aksen text-2xl sm:text-3xl text-sekunder mb-2">
          Dari yang terbuang, jadi yang dikenang
        </p>
        <h1 className="font-judul text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-primer leading-tight mb-4">
          Koleksi Produk Reka Limbah
        </h1>
        <p className="text-[16px] sm:text-[17px] text-teks leading-[1.6]">
          Jelajahi kerajinan ramah lingkungan yang diolah dengan teliti dari limbah pilihan.
          Setiap produk dibuat manual oleh pengrajin lokal untuk menghadirkan fungsi dan estetika baru di kehidupanmu.
        </p>
      </div>

      {/* Kontrol Pencarian & Filter */}
      <div className="flex flex-col gap-6 mb-8 sm:mb-10">
        {/* 2. Search bar untuk mencari produk berdasarkan nama atau bahan utama */}
        <div className="max-w-xl">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        {/* 3. Filter kategori: "Semua" + 5 kategori */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-teks/70 uppercase">
              Kategori Produk
            </span>
            <span className="text-xs sm:text-sm text-sekunder font-medium">
              Menampilkan {filteredProducts.length} dari {products.length} produk
            </span>
          </div>
          <CategoryFilter
            categories={categories}
            activeCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>

      {/* 4 & 5. Grid card produk dengan responsivitas 1 kolom mobile, 2 tablet, 3 desktop */}
      <ProductGrid
        products={filteredProducts}
        onReset={
          searchTerm !== '' || selectedCategory !== 'Semua'
            ? handleResetFilters
            : undefined
        }
      />
    </section>
  )
}