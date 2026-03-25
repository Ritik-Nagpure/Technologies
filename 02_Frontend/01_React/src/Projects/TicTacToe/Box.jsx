
const Box = ({ value, onClick, didWon }) => {
  return (
    <div className={"border-2 rounded-lg m-2 flex items-center justify-center " + (didWon ? ' bg-green-300 ' : '')} onClick={onClick}>
      <p className={`text-9xl font-extrabold ` + (value === 'X' ? 'text-red-400' : 'text-green-400')}>
        {value}
      </p>
    </div>
  )
}

export default Box