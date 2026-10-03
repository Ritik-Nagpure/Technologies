import { useState } from 'react'
import Box from './Box';
import GameStatus from './GameStatus';


const Board = () => {
  const [isPlayerX, setisPlayerX] = useState(true);
  const [boardState, setBoardState] = useState(Array(9).fill(null));
  const [winbox, setwinbox] = useState(Array(9).fill(false));
  const [replayDisplay, setReplayDisplay] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const winnerList = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8]
  ]

  const checkWinner = (currentBoardState) => {
    for (const logic of winnerList) {
      let [a, b, c] = logic;
      if (currentBoardState[a] !== null && currentBoardState[a] === currentBoardState[b] && currentBoardState[a] === currentBoardState[c]) {
        let wb = [...winbox];
        wb[a] = wb[b] = wb[c] = true;
        setwinbox(wb);
        setReplayDisplay(true);
        setWinner(currentBoardState[a]);
        return false;
      }
    }
    if (!currentBoardState.includes(null)) {
      setIsDraw(true);
      return false;
    }
    return true;
  }

  const handleReplay = () => {
    setBoardState(Array(9).fill(null));
    setwinbox(Array(9).fill(false));
    setWinner(null);
    setIsDraw(false);
    setisPlayerX(true);
  };

  const handleClick = (index) => {
    if (boardState[index] === null) {
      const board = [...boardState]
      board[index] = isPlayerX ? 'X' : 'O';
      setBoardState(board);
      setisPlayerX(!isPlayerX);
      checkWinner(board);
    }
  }

  return (
    <div className=" relative w-full h-full">
      {replayDisplay || isDraw ? <GameStatus winner={winner} isDraw={isDraw} onReplay={handleReplay} /> : ''}

      <div className="grid grid-cols-3 grid-rows-3 w-full h-full border-2 rounded-lg p-2">
        <Box value={boardState[0]} onClick={() => handleClick(0)} didWon={winbox[0]} />
        <Box value={boardState[1]} onClick={() => handleClick(1)} didWon={winbox[1]} />
        <Box value={boardState[2]} onClick={() => handleClick(2)} didWon={winbox[2]} />
        <Box value={boardState[3]} onClick={() => handleClick(3)} didWon={winbox[3]} />
        <Box value={boardState[4]} onClick={() => handleClick(4)} didWon={winbox[4]} />
        <Box value={boardState[5]} onClick={() => handleClick(5)} didWon={winbox[5]} />
        <Box value={boardState[6]} onClick={() => handleClick(6)} didWon={winbox[6]} />
        <Box value={boardState[7]} onClick={() => handleClick(7)} didWon={winbox[7]} />
        <Box value={boardState[8]} onClick={() => handleClick(8)} didWon={winbox[8]} />
      </div>
    </div>
  )
}

export default Board