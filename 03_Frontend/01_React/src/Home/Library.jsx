import Card from './Card'
import { libraries } from './lesson_data'
import { useNavigate } from 'react-router-dom'

const Library = () => {
  const navigate = useNavigate();

  const goto = (lesson_number) => {
    navigate(`/${lesson_number}`);
  };

  return (
    <div className="align-middle grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 m-6">
      {
        libraries.map((val) => (
          <div key={val.title} className='h-50'>
            <Card lesson_detail={val} navto={goto} />
          </div>
        ))
      }
    </div>
  )
}

export default Library