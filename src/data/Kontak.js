/**
 * Data Kontak Reka Limbah
 * Catatan: Data dengan tanda [DATA SEMENTARA] dapat diubah sewaktu-waktu sesuai informasi resmi UMKM.
 */

export const infoKontak = {
  whatsapp: {
    nomorTampilan: '0812-1000-1010', // Sesuai data pada Footer
    nomorLink: '6281210001010',
    pesanDefault: 'Halo Reka Limbah, saya tertarik untuk bertanya mengenai produk kerajinan daur ulang.',
    isSementara: true,
  },
  email: {
    alamat: 'kontak@rekalimbah.id',
    catatan: '[DATA SEMENTARA - Belum dikonfigurasi domain resmi]',
    isSementara: true,
  },
  workshop: {
    namaTempat: 'Bengkel Kreatif Reka Limbah',
    alamatLengkap: 'Jl. Daur Mandiri No. 24, Lingkungan Pengrajin Daur Ulang',
    kota: 'Jawa Barat, Indonesia',
    catatan: '[DATA SEMENTARA - Lokasi workshop fisik belum ditetapkan]',
    isSementara: true,
  },
  jamOperasional: {
    hariKerja: 'Senin - Sabtu',
    jam: '08.00 - 17.00 WIB',
    catatan: 'Hari Minggu & Libur Nasional tutup (pesan dibalas pada hari kerja berikutnya)',
  },
}

export const opsiSubjekFormulir = [
  { value: '', label: 'Pilih jenis keperluan...' },
  { value: 'custom_order', label: 'Pemesanan Produk Kustom' },
  { value: 'pertanyaan_produk', label: 'Pertanyaan Seputar Produk' },
  { value: 'kerjasama_limbah', label: 'Kerja Sama / Setor Bahan Bekas' },
  { value: 'kunjungan_workshop', label: 'Kunjungan & Edukasi Pengrajin' },
  { value: 'lainnya', label: 'Pertanyaan Lainnya' },
]

export const faqKontakSingkat = [
  {
    tanya: 'Berapa lama respon pesan melalui formulir?',
    jawab: 'Tim kami merespons dalam kurun waktu 1x24 jam di hari kerja.',
  },
  {
    tanya: 'Apakah bisa memesan suvenir daur ulang dalam jumlah besar?',
    jawab: 'Bisa! Silakan cantumkan jumlah perkiraan dan tenggat waktu pada pesan atau hubungi WhatsApp langsung.',
  },
]
