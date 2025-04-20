import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Gamepage = ({ player1 = 'Player 1', player2 = 'Player 2', isAI = false, aiDifficulty = 'easy' }) => {
  const boardSize = 8;
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('black');
  const [validMoves, setValidMoves] = useState([]);
  const [kings, setKings] = useState(new Set());
  const [gameStatus, setGameStatus] = useState('playing'); 
  const [capturedPieces, setCapturedPieces] = useState({ black: 0, red: 0 });
  const [isThinking, setIsThinking] = useState(false);
  const [boardAnimationStarted, setBoardAnimationStarted] = useState(false);
  const [lastMove, setLastMove] = useState(null);

  useEffect(() => {
    // Trigger board animation after a short delay
    const timer = setTimeout(() => {
      setBoardAnimationStarted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  function initializeBoard() {
    let newBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if ((row + col) % 2 === 1) {
          if (row < 3) newBoard[row][col] = 'red';
          else if (row > 4) newBoard[row][col] = 'black';
        }
      }
    }
    return newBoard;
  }

  useEffect(() => {
    if (isAI && currentPlayer === 'red' && gameStatus === 'playing') {
      setIsThinking(true);
      const timer = setTimeout(() => {
        makeAIMove();
        setIsThinking(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameStatus]);

  const getValidMoves = (row, col, boardState = board, currentKings = kings, player = currentPlayer) => {
    const piece = boardState[row][col];
    if (!piece || piece !== player) return [];

    const isKing = currentKings.has(`${row}-${col}`);
    const moves = [];
    const captures = [];
    const directions = [];

    if (piece === 'black' || isKing) directions.push([-1, -1], [-1, 1]);
    if (piece === 'red' || isKing) directions.push([1, -1], [1, 1]);

    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (isValidPosition(newRow, newCol) && !boardState[newRow][newCol]) {
        moves.push({ row: newRow, col: newCol, isCapture: false });
      }
    });

    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      const jumpRow = row + 2 * dr;
      const jumpCol = col + 2 * dc;
      
      if (
        isValidPosition(newRow, newCol) && 
        isValidPosition(jumpRow, jumpCol) && 
        boardState[newRow][newCol] && 
        boardState[newRow][newCol] !== piece && 
        !boardState[jumpRow][jumpCol]
      ) {
        captures.push({ 
          row: jumpRow, 
          col: jumpCol, 
          isCapture: true,
          captureRow: newRow,
          captureCol: newCol
        });
      }
    });

    return captures.length > 0 ? captures : moves;
  };

  const getAllValidMoves = (player, boardState = board, currentKings = kings) => {
    const allMoves = [];
    const captureMoves = [];
    
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (boardState[row][col] === player) {
          const moves = getValidMoves(row, col, boardState, currentKings, player);
          
          moves.forEach(move => {
            const moveWithPiece = {
              ...move,
              pieceRow: row,
              pieceCol: col
            };
            
            if (move.isCapture) {
              captureMoves.push(moveWithPiece);
            } else {
              allMoves.push(moveWithPiece);
            }
          });
        }
      }
    }
    
    return captureMoves.length > 0 ? captureMoves : allMoves;
  };

  const isValidPosition = (row, col) => {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
  };

  const handlePieceClick = (row, col) => {
    if (gameStatus !== 'playing' || (isAI && currentPlayer === 'red') || isThinking) return;
    
    const piece = board[row][col];
    
    if (selectedPiece) {
      const moveIndex = validMoves.findIndex(
        move => move.row === row && move.col === col
      );
      
      if (moveIndex >= 0) {
        movePiece(row, col, validMoves[moveIndex]);
        return;
      }
      
      if (selectedPiece.row === row && selectedPiece.col === col) {
        setSelectedPiece(null);
        setValidMoves([]);
        return;
      }
    }
    
    if (piece === currentPlayer) {
      const moves = getValidMoves(row, col);
      if (moves.length > 0) {
        setSelectedPiece({ row, col });
        setValidMoves(moves);
      }
    }
  };

  const movePiece = (row, col, moveInfo, boardState = board, currentKings = kings, updateState = true) => {
    const newBoard = boardState.map(r => [...r]);
    const pieceRow = moveInfo.pieceRow !== undefined ? moveInfo.pieceRow : selectedPiece.row;
    const pieceCol = moveInfo.pieceCol !== undefined ? moveInfo.pieceCol : selectedPiece.col;
    const piece = newBoard[pieceRow][pieceCol];
    
    newBoard[pieceRow][pieceCol] = null;
    newBoard[row][col] = piece;
    
    if (moveInfo.isCapture) {
      newBoard[moveInfo.captureRow][moveInfo.captureCol] = null;
      
      if (updateState) {
        const capturedColor = piece === 'black' ? 'red' : 'black';
        const newCapturedPieces = {
          ...capturedPieces,
          [capturedColor]: capturedPieces[capturedColor] + 1
        };
        setCapturedPieces(newCapturedPieces);
        
        if (newCapturedPieces[capturedColor] >= 12) {
          setGameStatus(piece === 'black' ? 'blackWin' : 'redWin');
        }
      }
    }
    
    const newKings = new Set(currentKings);
    if ((piece === 'black' && row === 0) || (piece === 'red' && row === 7)) {
      newKings.add(`${row}-${col}`);
      if (updateState) setKings(newKings);
    } else if (currentKings.has(`${pieceRow}-${pieceCol}`)) {
      newKings.delete(`${pieceRow}-${pieceCol}`);
      newKings.add(`${row}-${col}`);
      if (updateState) setKings(newKings);
    }
    
    if (updateState) {
      setBoard(newBoard);
      setSelectedPiece(null);
      setValidMoves([]);
      
      setLastMove({
        fromRow: pieceRow,
        fromCol: pieceCol,
        toRow: row,
        toCol: col,
        isCapture: moveInfo.isCapture
      });
    }
    
    let additionalCaptures = [];
    if (moveInfo.isCapture) {
      additionalCaptures = getValidMoves(row, col, newBoard, newKings, piece)
        .filter(move => move.isCapture);
      
      if (additionalCaptures.length > 0 && updateState) {
        setSelectedPiece({ row, col });
        setValidMoves(additionalCaptures);
        return { newBoard, newKings, switchTurn: false, additionalCaptures };
      }
    }
    
    if (updateState) {
      setCurrentPlayer(currentPlayer === 'black' ? 'red' : 'black');
    }
    
    return { newBoard, newKings, switchTurn: true, additionalCaptures };
  };

  const makeAIMove = () => {
    if (gameStatus !== 'playing') return;
    
    let aiMove;
    const openingMove = aiDifficulty === 'hard' ? getOpeningBookMove() : null;
    
    switch (aiDifficulty) {
      case 'hard':
        if (openingMove) {
          aiMove = openingMove;
        } else {
          aiMove = findBestMove();
        }
        break;
      case 'medium':
        aiMove = Math.random() < 0.7 ? findBestMove() : makeRandomMove();
        break;
      case 'easy':
      default:
        aiMove = makeRandomMove();
        break;
    }
    
    if (aiMove) {
      const { pieceRow, pieceCol, row, col, ...moveInfo } = aiMove;
      
      setSelectedPiece({ row: pieceRow, col: pieceCol });
      
      setTimeout(() => {
        const result = movePiece(row, col, { ...moveInfo, pieceRow, pieceCol });
        
        if (!result.switchTurn && result.additionalCaptures.length > 0) {
          handleMultiCapture(row, col, result);
        }
      }, 300);
    }
  };
  
  const getOpeningBookMove = () => {
    const totalPieces = countPieces(board);
    if (totalPieces < 20) return null;
    
    const movesMade = 24 - totalPieces;
    
    if (movesMade === 1) {
      const preferredOpenings = [
        { pieceRow: 2, pieceCol: 1, row: 3, col: 2, isCapture: false },
        { pieceRow: 2, pieceCol: 3, row: 3, col: 2, isCapture: false },
        { pieceRow: 2, pieceCol: 5, row: 3, col: 4, isCapture: false },
        { pieceRow: 2, pieceCol: 7, row: 3, col: 6, isCapture: false }
      ];
      
      for (const move of preferredOpenings) {
        const validMoves = getValidMoves(move.pieceRow, move.pieceCol, board, kings, 'red');
        const isValid = validMoves.some(validMove => 
          validMove.row === move.row && validMove.col === move.col
        );
        
        if (isValid) return move;
      }
    }
    
    if (movesMade === 2) {
      if (board[2][3] === 'black') {
        const counterMove = { pieceRow: 2, pieceCol: 5, row: 3, col: 4, isCapture: false };
        const validMoves = getValidMoves(counterMove.pieceRow, counterMove.pieceCol, board, kings, 'red');
        
        if (validMoves.some(move => move.row === counterMove.row && move.col === counterMove.col)) {
          return counterMove;
        }
      }
    }
    
    return null;
  };
  
  const countPieces = (boardState) => {
    let count = 0;
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (boardState[row][col]) count++;
      }
    }
    return count;
  };

  const handleMultiCapture = (row, col, result, depth = 0) => {
    if (depth > 10 || result.additionalCaptures.length === 0) return;
    
    setTimeout(() => {
      let nextCapture;
      
      if (aiDifficulty === 'hard') {
        let bestScore = -Infinity;
        
        result.additionalCaptures.forEach(capture => {
          const { newBoard, newKings } = movePiece(
            capture.row, 
            capture.col, 
            { ...capture, pieceRow: row, pieceCol: col },
            result.newBoard,
            result.newKings,
            false
          );
          
          const score = evaluateBoard(newBoard, newKings, 'red');
          
          if (score > bestScore) {
            bestScore = score;
            nextCapture = capture;
          }
        });
      } else {
        nextCapture = result.additionalCaptures[0];
      }
      
      const newResult = movePiece(
        nextCapture.row, 
        nextCapture.col, 
        { ...nextCapture, pieceRow: row, pieceCol: col }
      );
      
      if (!newResult.switchTurn && newResult.additionalCaptures.length > 0) {
        handleMultiCapture(nextCapture.row, nextCapture.col, newResult, depth + 1);
      }
    }, 300);
  };
  
  const makeRandomMove = () => {
    const allMoves = getAllValidMoves('red');
    if (allMoves.length === 0) return null;
    
    return allMoves[Math.floor(Math.random() * allMoves.length)];
  };
  
  const findBestMove = () => {
    const allMoves = getAllValidMoves('red');
    if (allMoves.length === 0) return null;
    
    let bestScore = -Infinity;
    let bestMove = null;
    
    const searchDepth = aiDifficulty === 'hard' ? 7 : 5;
    
    if (aiDifficulty === 'hard') {
      for (let currentDepth = 3; currentDepth <= searchDepth; currentDepth++) {
        let tempBestScore = -Infinity;
        let tempBestMove = null;
        
        for (const move of allMoves) {
          const { pieceRow, pieceCol, row, col, ...moveInfo } = move;
          const { newBoard, newKings } = movePiece(
            row, 
            col, 
            { ...moveInfo, pieceRow, pieceCol },
            board,
            kings,
            false
          );
          
          const score = minimax(newBoard, newKings, currentDepth, -Infinity, Infinity, false);
          
          if (score > tempBestScore) {
            tempBestScore = score;
            tempBestMove = move;
          }
        }
        
        bestScore = tempBestScore;
        bestMove = tempBestMove;
        
        if (bestScore >= 900) break;
      }
    } else {
      for (const move of allMoves) {
        const { pieceRow, pieceCol, row, col, ...moveInfo } = move;
        const { newBoard, newKings } = movePiece(
          row, 
          col, 
          { ...moveInfo, pieceRow, pieceCol },
          board,
          kings,
          false
        );
        
        const score = minimax(newBoard, newKings, searchDepth, -Infinity, Infinity, false);
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
    }
    
    return bestMove;
  };
  
  const minimax = (boardState, kingsState, depth, alpha, beta, isMaximizing) => {
    if (depth === 0) {
      return evaluateBoard(boardState, kingsState, 'red');
    }
    
    const player = isMaximizing ? 'red' : 'black';
    const allMoves = getAllValidMoves(player, boardState, kingsState);
    
    if (allMoves.length === 0) {
      return isMaximizing ? -1000 : 1000;
    }
    
    if (aiDifficulty === 'hard') {
      allMoves.sort((a, b) => {
        if (a.isCapture && !b.isCapture) return -1;
        if (!a.isCapture && b.isCapture) return 1;
        
        if (player === 'red' && !a.isCapture && !b.isCapture) {
          return b.row - a.row;
        }
        
        if (player === 'black' && !a.isCapture && !b.isCapture) {
          return a.row - b.row;
        }
        
        return 0;
      });
    }
    
    if (isMaximizing) {
      let maxEval = -Infinity;
      
      for (const move of allMoves) {
        const { pieceRow, pieceCol, row, col, ...moveInfo } = move;
        const { newBoard, newKings } = movePiece(
          row, 
          col, 
          { ...moveInfo, pieceRow, pieceCol },
          boardState,
          kingsState,
          false
        );
        
        const evalScore = minimax(newBoard, newKings, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        
        if (beta <= alpha) break;
      }
      
      return maxEval;
    } else {
      let minEval = Infinity;
      
      for (const move of allMoves) {
        const { pieceRow, pieceCol, row, col, ...moveInfo } = move;
        const { newBoard, newKings } = movePiece(
          row, 
          col, 
          { ...moveInfo, pieceRow, pieceCol },
          boardState,
          kingsState,
          false
        );
        
        const evalScore = minimax(newBoard, newKings, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        
        if (beta <= alpha) break;
      }
      
      return minEval;
    }
  };
  
  const evaluateBoard = (boardState, kingsState, player) => {
    const opponent = player === 'red' ? 'black' : 'red';
    
    let score = 0;
    let playerPieces = 0;
    let opponentPieces = 0;
    let playerKingsCount = 0;
    let opponentKingsCount = 0;
    
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (boardState[row][col] === player) {
          playerPieces++;
          
          if (kingsState.has(`${row}-${col}`)) {
            playerKingsCount++;
            score += 3;
            
            if ((row >= 2 && row <= 5) && (col >= 2 && col <= 5)) {
              score += 0.5;
            }
            
            if (row === 0 || row === 7 || col === 0 || col === 7) {
              score -= 0.3;
            }
          } else {
            score += 1;
            
            if (player === 'red') {
              score += 0.1 * row;
              
              if (row >= 5) {
                score += 0.5;
              }
              
              if ((row === 3 || row === 4) && (col === 2 || col === 3 || col === 4 || col === 5)) {
                score += 0.5;
              }
              
              if (row === 0 && boardState[row][col] === player) {
                score += 0.3;
              }
            } else {
              score += 0.1 * (7 - row);
              
              if (row <= 2) {
                score += 0.5;
              }
              
              if ((row === 3 || row === 4) && (col === 2 || col === 3 || col === 4 || col === 5)) {
                score += 0.5;
              }
              
              if (row === 7 && boardState[row][col] === player) {
                score += 0.3;
              }
            }
          }
        } else if (boardState[row][col] === opponent) {
          opponentPieces++;
          
          if (kingsState.has(`${row}-${col}`)) {
            opponentKingsCount++;
            score -= 3;
          } else {
            score -= 1;
          }
        }
      }
    }
    
    const playerMoves = getAllValidMoves(player, boardState, kingsState).length;
    const opponentMoves = getAllValidMoves(opponent, boardState, kingsState).length;
    
    score += 0.2 * playerMoves;
    score -= 0.2 * opponentMoves;
    
    const totalPieces = playerPieces + opponentPieces;
    if (totalPieces <= 8) {
      score += (playerPieces - opponentPieces) * 1.5;
      
      score += playerKingsCount * 1.5;
      score -= opponentKingsCount * 1.5;
      
      score += evaluateSpaceControl(boardState, kingsState, player);
    }
    
    if (opponentPieces === 0 || opponentMoves === 0) {
      score = 1000;
    } else if (playerPieces === 0 || playerMoves === 0) {
      score = -1000;
    }
    
    return score;
  };
  
  const evaluateSpaceControl = (boardState, kingsState, player) => {
    let spaceScore = 0;
    
    if (player === 'red') {
      const hasKingInCorner1 = boardState[0][1] === player && kingsState.has('0-1');
      const hasKingInCorner2 = boardState[0][7] === player && kingsState.has('0-7');
      
      if (hasKingInCorner1 && hasKingInCorner2) {
        spaceScore += 2.0;
      }
    } else {
      const hasKingInCorner1 = boardState[7][0] === player && kingsState.has('7-0');
      const hasKingInCorner2 = boardState[7][6] === player && kingsState.has('7-6');
      
      if (hasKingInCorner1 && hasKingInCorner2) {
        spaceScore += 2.0;
      }
    }
    
    const playerMoves = getAllValidMoves(player, boardState, kingsState);
    const uniqueSquares = new Set();
    
    playerMoves.forEach(move => {
      uniqueSquares.add(`${move.row}-${move.col}`);
    });
    
    spaceScore += uniqueSquares.size * 0.1;
    
    return spaceScore;
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setCurrentPlayer('black');
    setValidMoves([]);
    setKings(new Set());
    setGameStatus('playing');
    setCapturedPieces({ black: 0, red: 0 });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#302E2B]">
      <div className={`mb-4 flex justify-between w-full max-w-md px-4 transition-all duration-700 ${
        boardAnimationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
      }`}>
        <div className="text-white text-xl">
          {gameStatus === 'playing' 
            ? `Current Turn: ${currentPlayer === 'black' ? player1 : player2}${isThinking ? ' (Thinking...)' : ''}`
            : gameStatus === 'blackWin' 
              ? `${player1} Wins!` 
              : `${player2} Wins!`}
        </div>
        <button 
          onClick={resetGame}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1 rounded hover:scale-105 transition-all duration-300"
        >
          Reset Game
        </button>
      </div>
      
      <div className={`mb-2 text-xl font-bold text-red-500 transition-all duration-700 ${
        boardAnimationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
      }`} style={{ transitionDelay: '200ms' }}>
        {player2} (Red)
      </div>
      
      <div 
        className={`grid grid-cols-8 border-4 border-amber-500 transition-all duration-1000 ${
          boardAnimationStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`} 
        style={{ 
          transitionDelay: '400ms',
          boxShadow: '0 0 30px rgba(217, 119, 6, 0.3)'
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex;
            const isValidMove = validMoves.some(move => move.row === rowIndex && move.col === colIndex);
            const isLastMoveFrom = lastMove && lastMove.fromRow === rowIndex && lastMove.fromCol === colIndex;
            const isLastMoveTo = lastMove && lastMove.toRow === rowIndex && lastMove.toCol === colIndex;
            
            // Calculate delay for staggered animation
            const cellDelay = 30 * (rowIndex + colIndex);
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-16 h-16 flex items-center justify-center 
                  ${((rowIndex + colIndex) % 2 === 0) ? 'bg-gray-300' : 'bg-gray-700'}
                  ${isValidMove ? 'bg-green-600 animate-pulse' : ''}
                  ${isLastMoveFrom ? 'bg-amber-900/30' : ''}
                  ${isLastMoveTo ? 'bg-amber-600/30' : ''}
                  transition-all duration-300`}
                onClick={() => handlePieceClick(rowIndex, colIndex)}
                style={{
                  transition: `all 0.3s ease-in-out`,
                  animation: boardAnimationStarted ? `fadeIn 0.5s ease-in-out forwards ${cellDelay}ms` : 'none'
                }}
              >
                {cell && (
                  <div 
                    className={`rounded-full w-12 h-12
                      ${cell === 'black' ? 'bg-gray-900' : 'bg-red-600'}
                      ${isSelected ? 'ring-4 ring-yellow-400' : ''}
                      ${isLastMoveTo ? 'animate-bounce' : ''}
                      shadow-md hover:shadow-lg transition-all duration-300`}
                    style={{
                      boxShadow: kings.has(`${rowIndex}-${colIndex}`) 
                        ? '0 0 0 3px gold inset, 0 4px 6px rgba(0, 0, 0, 0.1)' 
                        : '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
      
      <div className={`mb-2 mt-2 text-xl font-bold text-gray-900 transition-all duration-700 ${
        boardAnimationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`} style={{ transitionDelay: '200ms' }}>
        {player1} (Black)
      </div>
      
      <div className={`mt-4 flex justify-around w-full max-w-md px-4 transition-all duration-700 ${
        boardAnimationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`} style={{ transitionDelay: '300ms' }}>
        <div className="text-white text-lg">
          <span className="text-red-500 font-bold">Captured: </span> 
          {capturedPieces.red}
        </div>
        <div className="text-white text-lg">
          <span className="text-gray-900 font-bold">Captured: </span> 
          {capturedPieces.black}
        </div>
      </div>
    </div>
  );
};

Gamepage.propTypes = {
  player1: PropTypes.string,
  player2: PropTypes.string,
  isAI: PropTypes.bool,
  aiDifficulty: PropTypes.string
};

export default Gamepage;