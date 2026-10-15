import HeroTentang from '../components/Tentang/HeroTentang'
import CeritaTentang from '../components/Tentang/CeritaTentang'
import VisiMisiTentang from '../components/Tentang/VisiMisiTentang'
import NilaiTentang from '../components/Tentang/NilaiTentang'
import ProsesTentang from '../components/Tentang/ProsesTentang'
import StatistikTentang from '../components/Tentang/StatistikTentang'
import AjakanTentang from '../components/Tentang/AjakanTentang'

export default function Tentang() {
  {/* Fitur Halaman Tentang - Reka Limbah */}
  return (
    <div className="flex flex-col">
      <HeroTentang />
      <CeritaTentang />
      <VisiMisiTentang />
      <NilaiTentang />
      <ProsesTentang />
      <StatistikTentang />
      <AjakanTentang />
    </div>
  )
}