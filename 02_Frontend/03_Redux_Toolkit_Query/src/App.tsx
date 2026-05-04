import { useState } from 'react'

import Home from './pages/home'
import People from './pages/people';
import Mutations from './pages/mutations'
import Pagination from './pages/pagination'
import InfyScroll from './pages/infyscroll'
import Parallel from './pages/parallel'


function App() {
  const [page, setPage] = useState<string>('Home');

  const handleSwitch = (val: string) => {
    setPage(val)
  }

  return (
    <div className='flex flex-col m-0 items-center break-normal'>
      <div className='flex sm:flex-row flex-col justify-between w-full px-10 my-5'>

        <div className='text-5xl font-bold font-serif text-amber-600 ' onClick={() => { handleSwitch('Home') }}>Redux Toolkit Query</div>

        <div className='grid grid-cols-5 gap-2 justify-items-center'>
          <div className='m-auto bg-blue-600 hover:ring-2 rounded-lg ring-amber-600 p-2 items-center text-white' onClick={() => { handleSwitch('People') }}>People</div>
          <div className='m-auto bg-blue-600 hover:ring-2 rounded-lg ring-amber-600 p-2 items-center text-white' onClick={() => { handleSwitch('InfyScroll') }}>InfyScroll</div>
          <div className='m-auto bg-blue-600 hover:ring-2 rounded-lg ring-amber-600 p-2 items-center text-white' onClick={() => { handleSwitch('Pagination') }}>Pagination</div>
          <div className='m-auto bg-blue-600 hover:ring-2 rounded-lg ring-amber-600 p-2 items-center text-white' onClick={() => { handleSwitch('Parallel') }}>Parallel</div>
          <div className='m-auto bg-blue-600 hover:ring-2 rounded-lg ring-amber-600 p-2 items-center text-white' onClick={() => { handleSwitch('Mutations') }}>Mutations</div>
        </div>
      </div>

      <div className='w-full'>
        {(() => {
          switch (page) {
            case 'People':
              return <People />

            case 'Pagination':
              return <Pagination />

            case 'InfyScroll':
              return <InfyScroll />

            case 'Parallel':
              return <Parallel />

            case 'Mutations':
              return <Mutations />

            default:
              return <Home />
          }
        })()}
      </div>

    </div>
  )
}

export default App
