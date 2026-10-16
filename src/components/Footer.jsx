import iconInstagram from '../assets/icon_instagram.png'
import iconFacebook from '../assets/icon_facebook.png'
import iconWhatsapp from '../assets/icon_whatsapp.png'
import iconGmail from '../assets/icon_gmail.png'

const sosmed = [
  { nama: 'Instagram', icon: iconInstagram, teks: '@rekalimbah' },
  { nama: 'Facebook', icon: iconFacebook, teks: 'Reka Limbah' },
  { nama: 'WhatsApp', icon: iconWhatsapp, teks: '0812-1000-1010' },
  { nama: 'Gmail', icon: iconGmail, teks: 'rekalimbah@gmail.com' },
]

export default function Footer() {
  return (
    <footer className="bg-primer text-latar-alt py-9 text-sm">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-5">
        <p>© 2026 Reka Limbah</p>
        <ul className="flex flex-wrap justify-center gap-6">
          {sosmed.map((item) => (
            <li key={item.nama} className="flex items-center gap-2">
              <img src={item.icon} alt={item.nama} className="h-5 w-5" />
              <span>{item.teks}</span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}