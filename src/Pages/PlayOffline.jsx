import React, { useState, useEffect } from 'react';
import Gamepage from '../Components/Gamepage';

const PlayOffline = () => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // Try to get player name from localStorage
    const storedName = localStorage.getItem('playerName');
    if (storedName) setPlayer1Name(storedName);
  }, []);

  const handleStartGame = () => {
    if (player1Name.trim() === '' || player2Name.trim() === '') {
      alert('Please enter names for both players');
      return;
    }
    setGameStarted(true);
  };

  if (gameStarted) {
    return <Gamepage player1={player1Name} player2={player2Name} />;
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#302E2B]">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-amber-500 mb-6 text-center">Offline Game</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white text-lg mb-2">Player 1 (Black)</label>
            <input
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-amber-500"
              placeholder="Enter name"
            />
          </div>
          
          <div>
            <label className="block text-white text-lg mb-2">Player 2 (Red)</label>
            <input
              type="text"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-amber-500"
              placeholder="Enter name"
            />
          </div>
          
          <button
            onClick={handleStartGame}
            className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold transition-colors duration-300"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayOffline; 