import Home from './pages/home';
import Dashboard from './pages/dashboard';

const App = () => {
  return (
    <div className="m-2 p-2">
      <div className='flex flex-row justify-between px-20 h-10 w-full '>
        <p className='font-bold text-amber-600 text-5xl'>Chart JS Demo</p>
        <div className='flex flex-row gap-6'>
          <button className='px-4 rounded-xl text-3xl text-white bg-blue-600 ring-2 ring-blue-400 font-bold'>Home</button>
          <button className='px-4 rounded-xl text-3xl text-white bg-blue-600 ring-2 ring-blue-400 font-bold'>Dashboard</button>
        </div>
      </div>

      <div>
        <Dashboard />
      </div>
    </div>
  )
}

export default App
