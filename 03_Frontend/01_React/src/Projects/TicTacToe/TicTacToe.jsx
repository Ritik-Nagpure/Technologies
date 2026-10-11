import Board from "./Board"


const TicTacToe = () => {
  return (
    <div className="flex flex-row flex-grow mx-6 my-1 p-4 justify-center h-150 rounded-xl bg-blue-950">
      <div className="text-6xl w-3/12 flex flex-col  items-center justify-center">
        <p className="font-extrabold flex justify-center ">
          TIC TAC TOE
        </p>
      </div>
      <div className="w-9/12 bg-gray-400 rounded-2xl shadow-lg-10px shadow-gray-200 p-4 ">
        <Board />
      </div>
    </div>
  )
}

export default TicTacToe