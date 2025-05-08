import React from 'react';

const Rules = () => {
  return (
    <div className="bg-[#302E2B] min-h-screen pb-16 w-full  ">
      <div className="container w-full mx-auto max-w-5xl px-4 absolute top-20 left-90 mt-[80px]"> {/* Add a custom margin for navbar height */}
        <div className="rounded-xl shadow-2xl overflow-hidden bg-[#252422] border-2 border-amber-500/30 top-45 justify-center">
          <div className="relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="grid grid-cols-8 h-full w-full">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`${i % 2 === 0 ? 'bg-black' : 'bg-white'}`}></div>
                ))}
              </div>
            </div>

            <div className="relative p-8 text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-amber-500 mb-2">Checkers Rules</h1>
              <div className="h-1 w-48 bg-amber-500 mx-auto"></div>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-8 text-white">
            <section className="bg-[#1a1916]/60 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300">
              <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-3 flex items-center">
                <span className="w-4 h-4 rounded-full bg-amber-500 mr-3"></span>
                Game Objective
              </h2>
              <p className="text-lg md:text-xl">
                The objective of checkers is to capture all of your opponent&apos;s pieces or block them so they cannot make a move.
              </p>
            </section>

            <section className="bg-[#1a1916]/60 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300">
              <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-3 flex items-center">
                <span className="w-4 h-4 rounded-full bg-amber-500 mr-3"></span>
                Game Setup
              </h2>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <p className="text-lg md:text-xl flex-1">
                  Checkers is played on an 8×8 board with alternating dark and light squares. Each player starts with 12 pieces placed on the dark squares of the three rows closest to their side.
                </p>
                <div className="relative w-40 h-40 flex-shrink-0">
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                    {[...Array(64)].map((_, i) => {
                      const row = Math.floor(i / 8);
                      const col = i % 8;
                      const isBlack = (row + col) % 2 === 1;
                      const hasRedPiece = isBlack && row < 3;
                      const hasBlackPiece = isBlack && row > 4;

                      return (
                        <div key={i} className={`${isBlack ? 'bg-amber-900/80' : 'bg-amber-100/30'} relative`}>
                          {hasRedPiece && <div className="absolute inset-1 rounded-full bg-red-700"></div>}
                          {hasBlackPiece && <div className="absolute inset-1 rounded-full bg-black border border-gray-700"></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-[#1a1916]/60 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300">
                <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-3 flex items-center">
                  <span className="w-4 h-4 rounded-full bg-amber-500 mr-3"></span>
                  Basic Movement
                </h2>
                <ul className="space-y-3 text-lg md:text-xl">
                  {[
                    'Regular pieces move diagonally forward one square at a time.',
                    'Regular pieces can only move to empty dark squares.',
                    'Regular pieces cannot move backward.'
                  ].map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-[#1a1916]/60 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300">
                <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-3 flex items-center">
                  <span className="w-4 h-4 rounded-full bg-amber-500 mr-3"></span>
                  Capturing
                </h2>
                <ul className="space-y-3 text-lg md:text-xl">
                  {[
                    "To capture an opponent's piece, you jump over it diagonally to an empty square beyond.",
                    'Multiple captures in a single turn are allowed and mandatory if available.',
                    'If you have a capture available, you must take it.'
                  ].map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="bg-[#1a1916]/60 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300">
              <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-3 flex items-center">
                <span className="w-4 h-4 rounded-full bg-amber-500 mr-3"></span>
                Kings
              </h2>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <ul className="space-y-3 text-lg md:text-xl flex-1">
                  {[
                    'When a piece reaches the opposite end of the board, it becomes a king.',
                    'Kings can move diagonally forward or backward.',
                    'Kings can capture in any diagonal direction.',
                    'Kings are marked with a crown or double-stacked piece.'
                  ].map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex-shrink-0 flex gap-6">
                  <div className="w-20 h-20 relative">
                    <div className="absolute inset-0 rounded-full bg-black"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-amber-500 text-2xl font-bold">K</div>
                  </div>
                  <div className="w-20 h-20 relative">
                    <div className="absolute inset-0 rounded-full bg-red-700"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-amber-500 text-2xl font-bold">K</div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-[#1a1916]/60 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300">
                <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-3 flex items-center">
                  <span className="w-4 h-4 rounded-full bg-amber-500 mr-3"></span>
                  Winning the Game
                </h2>
                <p className="text-lg md:text-xl">
                  You win by capturing all of your opponent&apos;s pieces or by blocking them so they cannot make a legal move.
                </p>
              </section>

              <section className="bg-[#1a1916]/60 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300">
                <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-3 flex items-center">
                  <span className="w-4 h-4 rounded-full bg-amber-500 mr-3"></span>
                  Tips for Beginners
                </h2>
                <ul className="space-y-3 text-lg md:text-xl">
                  {[
                    'Try to control the center of the board.',
                    'Keep your pieces together for protection.',
                    'Try to get kings as quickly as possible.',
                    'Sometimes sacrificing a piece can lead to a better position.'
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
