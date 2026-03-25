const GameStatus = ({ winner, isDraw, onReplay }) => {
  if (!winner && !isDraw) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center w-72">
        {winner && (
          <h2 className="text-2xl font-bold text-green-600">
            🎉 Player {winner} Won!
          </h2>
        )}

        {isDraw && (
          <h2 className="text-2xl font-bold text-yellow-600">
            🤝 It's a Draw!
          </h2>
        )}

        <p className="mt-3">Do you want to replay?</p>

        <button
          onClick={onReplay}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Replay
        </button>
      </div>
    </div>
  );
};

export default GameStatus;