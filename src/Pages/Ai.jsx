// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import Gamepage from '../Components/Gamepage';

const Ai = () => {
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    if (storedName) setPlayerName(storedName);
  }, []);

  const handleStartGame = () => {
    if (playerName.trim() === '') {
      alert('Please enter your name');
      return;
    }
    setGameStarted(true);
  };

  if (gameStarted) {
    return <Gamepage player1={playerName} player2={`AI (${difficulty})`} isAI={true} aiDifficulty={difficulty} />;
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#302E2B]">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-amber-500 mb-6 text-center">Play Against AI</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white text-lg mb-2">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-amber-500"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-white text-lg mb-2">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-amber-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard (Unbeatable)</option>
            </select>
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

export default Ai;
