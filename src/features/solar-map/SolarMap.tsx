import { useGameStore } from '@/store/gameStore'
import { Planet } from './Planet'

interface SolarMapProps {
  onPlanetClick: (planetId: number) => void
  newlyUnlockedPlanetId?: number | null
}

export function SolarMap({ onPlanetClick, newlyUnlockedPlanetId }: SolarMapProps) {
  const planets = useGameStore((state) => state.planets)

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="grid grid-cols-2 gap-4 max-w-xs">
        {planets.map((planet) => (
          <div key={planet.id} className="flex items-center justify-center">
            <Planet
              planet={planet}
              onClick={() => onPlanetClick(planet.id)}
              showUnlockAnimation={planet.id === newlyUnlockedPlanetId}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
