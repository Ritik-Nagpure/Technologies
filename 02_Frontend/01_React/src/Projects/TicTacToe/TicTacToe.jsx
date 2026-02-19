import Board from "./Board"


const TicTacToe = () => {
  return (
    <div className="flex flex-row flex-grow m-1 p-4 justify-center h-full">
      <div className="text-6xl w-3/12 flex flex-col items-center justify-center bg-red-200 "> TIC TAC TOE</div>
      <div className="w-9/12 bg-green-200">
        <Board/>
      </div>
    </div>
  )
}

export default TicTacToe