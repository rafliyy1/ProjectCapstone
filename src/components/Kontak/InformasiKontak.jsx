import iconWhatsapp from '../../assets/icon_whatsapp.png'
import { infoKontak } from '../../data/Kontak'

export default function InformasiKontak() {
  const urlWhatsapp = `https://wa.me/${infoKontak.whatsapp.nomorLink}?text=${encodeURIComponent(
    infoKontak.whatsapp.pesanDefault
  )}`

  return (
    <aside className="flex flex-col gap-6">
      {/* Kartu Cepat WhatsApp */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_0_#7A5C47] border border-latar-alt">
        <div className="flex items-center gap-3 mb-4">

          <div>
            <h2 className="font-judul text-xl font-bold text-primer">Chat WhatsApp</h2>
            <p className="text-sm text-teks/75">Respon cepat di jam kerja</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-5">
          Ingin konsultasi pesanan khusus, suvenir acara, atau tanya bahan secara langsung? Tim pengrajin siap membantumu.
        </p>

        <a
          href={urlWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full min-h-[44px] px-5 rounded-lg bg-primer text-latar font-bold hover:bg-sekunder transition-colors gap-2"
        >
          <img src={iconWhatsapp} alt="" className="w-5 h-5 brightness-200" />
          <span>Hubungi via WhatsApp</span>
        </a>

      </div>

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
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="font-judul text-lg font-bold text-primer">Surat Elektronik (Email)</h3>
          </div>
          <a
            href={`mailto:${infoKontak.email.alamat}`}
            className="text-sm font-semibold text-sekunder hover:underline break-all"
          >
            {infoKontak.email.alamat}
          </a>
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
