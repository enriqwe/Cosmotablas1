import { useGameStore } from '@/store/gameStore'
import { Planet } from './Planet'

export function SolarMap() {
  const planets = useGameStore((state) => state.planets)

  const handlePlanetClick = (planetId: number) => {
    // Navigation to game screen will be implemented in Epic 2
    console.log(`Planet ${planetId} clicked`)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="grid grid-cols-2 gap-4 max-w-xs">
        {planets.map((planet) => (
          <div key={planet.id} className="flex items-center justify-center">
            <Planet
              planet={planet}
              onClick={() => handlePlanetClick(planet.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
