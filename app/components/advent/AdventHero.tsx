import CompactHero from '@/app/components/advent/hero/CompactHero'
import FullHero from '@/app/components/advent/hero/FullHero'
import Wallpaper from '@/app/components/advent/hero/Wallpaper'

export default function AdventHero() {
  return (
    <header className="relative isolate overflow-hidden border-b-4 border-gray-950 bg-white">
      <Wallpaper />
      <FullHero />
      <CompactHero />
    </header>
  )
}
