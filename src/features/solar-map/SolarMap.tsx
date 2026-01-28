import { useGameStore } from '@/store/gameStore'
import { Planet } from './Planet'

interface SolarMapProps {
  onPlanetClick: (planetId: number) => void
}

export function SolarMap({ onPlanetClick }: SolarMapProps) {
  const planets = useGameStore((state) => state.planets)

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="grid grid-cols-2 gap-4 max-w-xs">
        {planets.map((planet) => (
          <div key={planet.id} className="flex items-center justify-center">
            <Planet
              planet={planet}
              onClick={() => onPlanetClick(planet.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
