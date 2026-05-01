import { useState } from 'react'

import Address from './pages/address'
import Females from './pages/females'
import Finances from './pages/finances'
import Home from './pages/home'

import './App.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  const [page, setPage] = useState<string>('Home');

  const handleSwitch = (val: string) => {
    setPage(val)
  }

  return (
    <div className='flex flex-col m-0 items-center break-normal'>
      <div className='flex sm:flex-row flex-col justify-between px-10'>

        <div className='text-5xl font-bold font-serif text-amber-600 ' onClick={() => { handleSwitch('Home') }}>React Query Example</div>

        <div className='grid grid-cols-3 gap-2 justify-items-center'>
          <div className='m-auto bg-blue-600 hover:ring-2 rounded-lg ring-amber-600 p-2 items-center text-white' onClick={() => { handleSwitch('Address') }}>Address</div>
          <div className='m-auto bg-blue-600 hover:ring-2 rounded-lg ring-amber-600 p-2 items-center text-white' onClick={() => { handleSwitch('Finances') }}>Finance</div>
          <div className='m-auto bg-blue-600 hover:ring-2 rounded-lg ring-amber-600 p-2 items-center text-white' onClick={() => { handleSwitch('Females') }}>Females</div>
        </div>
      </div>

      <div className=''>
        {(() => {
          switch (page) {
            case 'Address':
              return <Address />

            case 'Females':
              return <Females />

            case 'Finances':
              return <Finances />

            default:
              return <Home />
          }
        })()}
        <ReactQueryDevtools />
      </div>

    </div>
  )
}

export default App
