import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';


const Header = ({ isDark, toggle }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row justify-between">
      <p>
        <button onClick={() => { toggle(); }} className="p-4 m-1 text-4xl" >
          {isDark ? (<FontAwesomeIcon icon={faSun} />) : (<FontAwesomeIcon icon={faMoon} />)}
        </button>
      </p>
      <p className="m-1 p-2 text-5xl font-bold text">React JavaScript</p>
      <p>

        <button onClick={() => { navigate(`/Core`); }} className="rounded-3xl p-4 m-1 text-2xl transition ease-in-out hover:bg-indigo-700 text-center">
          Core
        </button>
        <button onClick={() => { navigate(`/Library`); }} className="rounded-3xl p-4 m-1 text-2xl transition ease-in-out hover:bg-indigo-700 text-center">
          Libraries
        </button>
      </p>
    </div>
  );
};

export default Header;
