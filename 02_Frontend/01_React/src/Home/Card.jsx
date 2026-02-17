
const Card = ({ lesson_detail, navto }) => {
  return (
    <>
      <div className="flex text-lg font-bold flex-col justify-center items-center border-2 rounded-2xl lesson-card1 transition ease-in-out hover:text-2xl hover:bg-indigo-600 p-10 text-center  h-full" onClick={() => { navto(lesson_detail.title) }}>
        <p className="">{`${lesson_detail.title} `}</p>
        <p className="">{lesson_detail.desc}</p>
      </div>
    </>
  )
}

export default Card