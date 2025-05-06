// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame, joinGame, getPublicGames, getMyGames, deleteGame, checkAuthToken } from '../utils/api';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [gameCode, setGameCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [publicGames, setPublicGames] = useState([]);
  const [myGames, setMyGames] = useState([]);
  const [createdGameInfo, setCreatedGameInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const { token, user: storedUser } = checkAuthToken();
    
    if (token && storedUser) {
      console.log('User is authenticated:', storedUser);
      setIsLoggedIn(true);
      setUser(storedUser);
      loadPublicGames();
      loadMyGames();
    } else {
      console.log('User is not authenticated');
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);
  
  const loadPublicGames = async () => {
    try {
      setIsLoading(true);
      const response = await getPublicGames();
      setPublicGames(response.data || []);
    } catch (error) {
      console.error('Failed to load public games:', error);
      // Don't show error for this as it's not critical
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyGames = async () => {
    try {
      setIsLoading(true);
      const response = await getMyGames();
      setMyGames(response.data || []);
    } catch (error) {
      console.error('Failed to load my games:', error);
      // Don't show error for this as it's not critical
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalPlay = () => {
    navigate('/play-offline');
  };

  const handleAIPlay = () => {
    navigate('/play-ai');
  };
  
  const handleCreateGame = async (isPublic) => {
    if (!isLoggedIn) {
      setErrorMessage('You must be logged in to create an online game');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      const response = await createGame(isPublic);
      
      if (response.success) {
        // For private games, show the game code to share
        if (!isPublic) {
          setCreatedGameInfo({
            id: response.data._id,
            gameCode: response.data.gameCode,
            isPublic: false
          });
        } else {
          // For public games, navigate directly
          navigate(`/game?id=${response.data._id}&code=${response.data.gameCode}`);
        }
        // Refresh my games list
        loadMyGames();
      } else {
        setErrorMessage('Failed to create game. Server did not return success status.');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      
      // Handle session expiration
      if (error.message.includes('session has expired') || error.message.includes('authentication')) {
        setIsLoggedIn(false);
        setUser(null);
        setErrorMessage('Your session has expired. Please log in again.');
        // Clear any existing tokens
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      } else {
        setErrorMessage(error.message || 'Failed to create game');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (!isLoggedIn) {
      setErrorMessage('You must be logged in to delete a game');
      return;
    }
    
    try {
      setIsLoading(true);
      await deleteGame(gameId);
      
      // Refresh games lists
      loadMyGames();
      loadPublicGames();
      
      // Clear created game info if it's the same game
      if (createdGameInfo && createdGameInfo.id === gameId) {
        setCreatedGameInfo(null);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete game');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleJoinGame = async () => {
    if (!isLoggedIn) {
      setErrorMessage('You must be logged in to join an online game');
      return;
    }
    
    if (!gameCode.trim()) {
      setErrorMessage('Please enter a game code');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await joinGame(gameCode);
      
      if (response.success) {
        // Navigate to game page with the game id
        navigate(`/game?id=${response.data._id}`);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to join game');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleJoinPublicGame = async (gameId, gameCode) => {
    if (!isLoggedIn) {
      setErrorMessage('You must be logged in to join an online game');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await joinGame(gameCode);
      
      if (response.success) {
        // Navigate to game page with the game id
        navigate(`/game?id=${response.data._id}`);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to join game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCreatedGame = () => {
    if (createdGameInfo) {
      navigate(`/game?id=${createdGameInfo.id}&code=${createdGameInfo.gameCode}`);
    }
  };

  return (
    <div className="flex gap-5 flex-col md:flex-row items-center justify-center h-screen bg-[#302E2B] p-6">
      {/* Left Side - Image */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="h-80 md:h-[450px] w-auto rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 bg-amber-700 flex items-center justify-center">
          <h2 className="text-3xl text-white font-bold">
            {user ? `${user.username}'s Games` : 'CheckGate'}
          </h2>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="w-full gap-10 md:w-1/2 text-white flex flex-col justify-center items-center md:items-start px-6 md:px-12 text-center md:text-left space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-500">Welcome to CheckGate</h1>
        <p className="text-xl md:text-2xl text-gray-300">
          Choose your game mode and start playing!
        </p>

        {errorMessage && (
          <div className="bg-red-800/40 border border-red-600 text-red-200 px-4 py-3 rounded w-full text-center">
            {errorMessage}
            <button 
              className="float-right font-bold text-red-200 hover:text-white"
              onClick={() => setErrorMessage('')}
            >
              &times;
            </button>
          </div>
        )}

        {/* Newly created game information */}
        {createdGameInfo && (
          <div className="bg-yellow-800/30 border border-amber-500 p-4 rounded w-full">
            <div className="flex justify-between mb-2">
              <h3 className="text-amber-400 font-semibold">Private Game Created!</h3>
              <button 
                onClick={() => setCreatedGameInfo(null)}
                className="text-amber-300 hover:text-amber-100"
              >
                &times;
              </button>
            </div>
            <p className="mb-2">Share this code with your friend:</p>
            <div className="bg-black/30 p-2 rounded flex justify-between items-center mb-3">
              <span className="font-mono text-lg tracking-wider text-amber-300">{createdGameInfo.gameCode}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(createdGameInfo.gameCode)}
                className="text-xs bg-amber-700 hover:bg-amber-600 px-2 py-1 rounded"
              >
                Copy
              </button>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleStartCreatedGame}
                className="bg-amber-600 hover:bg-amber-500 px-3 py-1 rounded text-white"
              >
                Go to Game
              </button>
              <button
                onClick={() => handleDeleteGame(createdGameInfo.id)}
                className="bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-white"
              >
                Delete Game
              </button>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-6">
          <button
            onClick={handleLocalPlay}
            className="px-6 py-3 w-80 h-15 text-lg font-semibold rounded-2xl border-2 border-amber-500 text-amber-500 bg-transparent hover:bg-amber-600 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
          >
            Play Local Multiplayer
          </button>
          <button
            onClick={handleAIPlay}
            className="px-6 py-3 w-80 h-15 text-lg font-semibold rounded-2xl border-2 border-amber-500 text-amber-500 bg-transparent hover:bg-amber-600 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
          >
            Play vs AI
          </button>
        </div>

        {/* Online Games Section */}
        <div className="flex flex-col gap-6 w-full">
          <h2 className="text-2xl font-bold text-amber-400 text-center">Online Games</h2>
          
          {!isLoggedIn ? (
            <div className="text-center py-4">
              <p className="mb-4">Please log in to play online</p>
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-transparent border-2 border-amber-500 rounded-lg hover:bg-amber-600 transition-all duration-300 font-semibold hover:scale-105 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)]"
              >
                Login
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 w-full flex gap-4 h-28">
                <button 
                  onClick={() => handleCreateGame(false)}
                  disabled={isLoading}
                  className="w-full py-3 bg-transparent border-2 h-15 gap-4 border-amber-500 rounded-lg hover:bg-amber-600 transition-all duration-300 font-semibold hover:scale-105 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Private Game
                </button>
                
                <button 
                  onClick={() => handleCreateGame(true)}
                  disabled={isLoading}
                  className="w-full py-3 bg-transparent border-2 h-15  border-amber-500 rounded-lg hover:bg-amber-600 transition-all duration-300 font-semibold hover:scale-105 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Public Game
                </button>
              </div>
              
              <div className="flex flex-col space-y-2 pt-4">
                <label htmlFor="gameCode" className="text-lg font-medium">Join with Game Code:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="gameCode"
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value)}
                    placeholder="Enter game code"
                    className="flex-1 px-3 py-2 h-18 bg-white/10 border border-amber-500 rounded text-white"
                  />
                  <button 
                    onClick={handleJoinGame}
                    disabled={isLoading || !gameCode.trim()}
                    className="px-4 py-2 w-28 bg-transparent border-2 border-amber-500 rounded-lg hover:bg-amber-600 transition-all duration-300 font-semibold hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Join
                  </button>
                </div>
              </div>
              
              {/* My Games Section */}
              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-2">My Created Games:</h3>
                <div className="max-h-40 overflow-y-auto bg-black/20 rounded border border-amber-500/50 mb-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center p-4">
                      <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  ) : myGames.filter(game => game.player1._id === user._id && game.status === 'waiting').length === 0 ? (
                    <p className="text-center py-4 text-gray-400">No games waiting for players</p>
                  ) : (
                    <ul className="divide-y divide-amber-500/30">
                      {myGames
                        .filter(game => game.player1._id === user._id && game.status === 'waiting')
                        .map(game => (
                          <li key={game._id} className="p-2 hover:bg-amber-800/20 flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="text-sm">{game.isPublic ? 'Public Game' : 'Private Game'}</span>
                              <span className="text-xs text-gray-400">Code: {game.gameCode}</span>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => navigate(`/game?id=${game._id}&code=${game.gameCode}`)}
                                className="px-2 py-1 text-xs bg-amber-700 hover:bg-amber-600 rounded"
                              >
                                Open
                              </button>
                              <button 
                                onClick={() => handleDeleteGame(game._id)}
                                className="px-2 py-1 text-xs bg-red-800 hover:bg-red-700 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2">Public Games:</h3>
                <div className="max-h-40 overflow-y-auto bg-black/20 rounded border border-amber-500/50">
                  {isLoading ? (
                    <div className="flex justify-center items-center p-4">
                      <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  ) : publicGames.length === 0 ? (
                    <p className="text-center py-4 text-gray-400">No public games available</p>
                  ) : (
                    <ul className="divide-y divide-amber-500/30">
                      {publicGames.map(game => (
                        <li key={game._id} className="p-2 hover:bg-amber-800/20 flex justify-between items-center">
                          <span>Game by {game.player1.username}</span>
                          <button 
                            onClick={() => handleJoinPublicGame(game._id, game.gameCode)}
                            className="px-3 py-1 text-sm bg-transparent border border-amber-500 rounded hover:bg-amber-600 transition-all duration-300"
                          >
                            Join
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button 
                  onClick={() => {
                    loadPublicGames();
                    loadMyGames();
                  }}
                  className="mt-2 w-full text-sm text-amber-400 hover:text-amber-300"
                >
                  Refresh Lists
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
