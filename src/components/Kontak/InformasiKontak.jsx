import { infoKontak } from '../../data/Kontak'

export default function InformasiKontak() {

  return (
    <aside className="flex flex-col gap-6">

      {/* Kartu Detail Alamat & Email */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_0_#7A5C47] border border-latar-alt flex flex-col gap-5">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="font-judul text-lg font-bold text-primer">Alamat Bengkel Kerja</h3>
          </div>
          <p className="text-sm font-semibold text-teks">{infoKontak.workshop.namaTempat}</p>
          <p className="text-sm text-teks/80 leading-relaxed mt-0.5">{infoKontak.workshop.alamatLengkap}</p>
          <p className="text-sm text-teks/80">{infoKontak.workshop.kota}</p>
        </div>

        <hr className="border-latar-alt" />

        <div>
          <h3 className="font-judul text-lg font-bold text-primer mb-1.5">Jam Operasional</h3>
          <p className="text-sm font-semibold text-teks">{infoKontak.jamOperasional.hariKerja}: {infoKontak.jamOperasional.jam}</p>
          <p className="text-xs text-teks/70 mt-1 leading-relaxed">
            {infoKontak.jamOperasional.catatan}
          </p>
        </div>
      </div>
    </aside>
  )
}
