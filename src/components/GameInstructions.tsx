import React from 'react'

export const GameInstructions: React.FC = () => {
  return (
    <div className="space-y-6 text-white relative font-joti">
      <section className="relative p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-md">
        <div className="absolute top-0 left-0 w-2 h-2 bg-primary rounded-full -translate-x-1 -translate-y-1"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full translate-x-1 -translate-y-1"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary rounded-full -translate-x-1 translate-y-1"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full translate-x-1 translate-y-1"></div>

        <h3 className="text-lg font-bold border-b border-gray-600 pb-2 mb-2 text-primary">
          Game Overview
        </h3>
        <p className="mb-2">
          Fog of Noir is a strategic territory control game where players compete to conquer the
          entire map by managing armies, attacking enemy territories, and securing continent
          bonuses.
        </p>
      </section>

      <section className="relative p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-md">
        <div className="absolute top-0 left-0 w-2 h-2 bg-primary rounded-full -translate-x-1 -translate-y-1"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full translate-x-1 -translate-y-1"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary rounded-full -translate-x-1 translate-y-1"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full translate-x-1 translate-y-1"></div>

        <h3 className="text-lg font-bold border-b border-gray-600 pb-2 mb-2 text-primary">
          Game Phases
        </h3>

        <div className="mb-4 p-3 bg-gray-900 rounded-md border-l-4 border-gray-700">
          <h4 className="font-semibold text-primary">Initial Placement</h4>
          <p>
            At the start of the game, territories are randomly assigned to all players. Each player
            takes turns placing one army on their territories until all initial armies are deployed.
          </p>
        </div>

        <div className="mb-4 p-3 bg-gray-900 rounded-md border-l-4 border-gray-700">
          <h4 className="font-semibold text-primary">Placement Phase</h4>
          <p>At the beginning of each turn, you receive new armies based on:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Number of territories you control (1 army per 3 territories, minimum of 3)</li>
            <li>Continent bonuses if you control all territories in a continent</li>
          </ul>
          <p className="mt-2">Place your reinforcement armies on any territories you control.</p>
        </div>

        <div className="mb-4 p-3 bg-gray-900 rounded-md border-l-4 border-gray-700">
          <h4 className="font-semibold text-primary">Attack Phase</h4>
          <p>You can attack any adjacent enemy territory from your own territories.</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Select one of your territories with at least 2 armies</li>
            <li>Select an adjacent enemy territory to attack</li>
            <li>
              Both players roll dice to determine the outcome (max 3 dice for attacker, 2 for
              defender)
            </li>
            <li>The highest dice are compared, and the lower roll loses an army</li>
            <li>
              If you defeat all enemy armies, you capture the territory and must move armies in
            </li>
          </ul>
          <p className="mt-2">You can attack as many times as you want during this phase.</p>
        </div>

        <div className="mb-4 p-3 bg-gray-900 rounded-md border-l-4 border-gray-700">
          <h4 className="font-semibold text-primary">Fortify Phase</h4>
          <p>
            At the end of your turn, you can move armies from one of your territories to another.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Select a source territory that has at least 2 armies</li>
            <li>Select any other territory you control as the destination</li>
            <li>Choose how many armies to move (leaving at least 1 behind)</li>
          </ul>
          <p className="mt-2">You can only fortify once per turn.</p>
        </div>
      </section>

      <section className="relative p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-md">
        <div className="absolute top-0 left-0 w-2 h-2 bg-primary rounded-full -translate-x-1 -translate-y-1"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full translate-x-1 -translate-y-1"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary rounded-full -translate-x-1 translate-y-1"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full translate-x-1 translate-y-1"></div>

        <h3 className="text-lg font-bold border-b border-gray-600 pb-2 mb-2 text-primary">
          Continent Bonuses
        </h3>
        <p>Control all territories in a continent to receive bonus armies each turn:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
          <div className="bg-gray-900 p-2 rounded-md border-l-4 border-red-700">
            <span className="font-semibold">North America:</span> +5 armies
          </div>
          <div className="bg-gray-900 p-2 rounded-md border-l-4 border-green-700">
            <span className="font-semibold">Europe:</span> +5 armies
          </div>
          <div className="bg-gray-900 p-2 rounded-md border-l-4 border-blue-700">
            <span className="font-semibold">Africa:</span> +3 armies
          </div>
          <div className="bg-gray-900 p-2 rounded-md border-l-4 border-yellow-700">
            <span className="font-semibold">South America:</span> +2 armies
          </div>
          <div className="bg-gray-900 p-2 rounded-md border-l-4 border-purple-700">
            <span className="font-semibold">Australia:</span> +2 armies
          </div>
        </div>
      </section>

      <section className="relative p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-md">
        <div className="absolute top-0 left-0 w-2 h-2 bg-primary rounded-full -translate-x-1 -translate-y-1"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full translate-x-1 -translate-y-1"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary rounded-full -translate-x-1 translate-y-1"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full translate-x-1 translate-y-1"></div>

        <h3 className="text-lg font-bold border-b border-gray-600 pb-2 mb-2 text-primary">
          Winning the Game
        </h3>
        <div className="p-3 bg-gray-900 rounded-md border-l-4 border-yellow-600">
          <p>
            The game ends when a player controls all territories on the map or when all other
            players have been eliminated. The last player standing is the winner!
          </p>
        </div>
      </section>
    </div>
  )
}
