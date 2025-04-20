import React from 'react';

const Rules = () => {
  return (
    <div className="min-h-screen bg-[#302E2B] pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-amber-500 mb-6 text-center">Checkers Rules</h1>
        
        <div className="space-y-6 text-white">
          <section>
            <h2 className="text-2xl font-semibold text-amber-400 mb-3">Game Objective</h2>
            <p className="text-lg">
              The objective of checkers is to capture all of your opponent's pieces or block them so they cannot make a move.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-amber-400 mb-3">Game Setup</h2>
            <p className="text-lg">
              Checkers is played on an 8×8 board with alternating dark and light squares. Each player starts with 12 pieces placed on the dark squares of the three rows closest to their side.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-amber-400 mb-3">Basic Movement</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Regular pieces move diagonally forward one square at a time.</li>
              <li>Regular pieces can only move to empty dark squares.</li>
              <li>Regular pieces cannot move backward.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-amber-400 mb-3">Capturing</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>To capture an opponent's piece, you jump over it diagonally to an empty square beyond.</li>
              <li>Multiple captures in a single turn are allowed and mandatory if available.</li>
              <li>If you have a capture available, you must take it.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-amber-400 mb-3">Kings</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>When a piece reaches the opposite end of the board, it becomes a king.</li>
              <li>Kings can move diagonally forward or backward.</li>
              <li>Kings can capture in any diagonal direction.</li>
              <li>Kings are marked with a crown or double-stacked piece.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-amber-400 mb-3">Winning the Game</h2>
            <p className="text-lg">
              You win by capturing all of your opponent's pieces or by blocking them so they cannot make a legal move.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-amber-400 mb-3">Tips for Beginners</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Try to control the center of the board.</li>
              <li>Keep your pieces together for protection.</li>
              <li>Try to get kings as quickly as possible.</li>
              <li>Sometimes sacrificing a piece can lead to a better position.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Rules; 