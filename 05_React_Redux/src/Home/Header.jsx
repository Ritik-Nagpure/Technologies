import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Header = ({ isDark, toggle }) => {
  return (
    <div className="flex flex-row justify-between">
      <p></p>
      <p className="m-1 p-2 text-5xl font-bold text">
        Lessons
      </p>
      <p>
        <button onClick={() => { toggle() }} className="p-4 m-1 text-4xl" >
          {isDark ?
            <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
        </button>
      </p>
    </div>
  )
}

export default Header