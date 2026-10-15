import HeroTentang from './HeroTentang'
import CeritaTentang from './CeritaTentang'
import VisiMisiTentang from './VisiMisiTentang'
import NilaiTentang from './NilaiTentang'
import ProsesTentang from './ProsesTentang'
import StatistikTentang from './StatistikTentang'
import AjakanTentang from './AjakanTentang'

export default function Tentang() {
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
