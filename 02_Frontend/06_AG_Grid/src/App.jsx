import React from 'react'
import Table from './table'
import { AgGridProvider } from 'ag-grid-react'
import { AllCommunityModule } from 'ag-grid-community'

const module = [AllCommunityModule];

const App = () => {
  return (
    <div className='bg-gray-200 w-full justify-items-center px-4 py-2 grid h-screen grid-cols-1 grid-rows-[auto_1fr] gap-4 '>
      <div className='h-fit'>
        <h1 className='my-1 mx-2 px-2 text-orange-600 font-bold text-5xl font-sans '>
          AG Grid Example
        </h1>
      </div>

      <div className='m-1 px-2 w-full h-full'>
        <AgGridProvider modules={module}>
          <Table />
        </AgGridProvider>
      </div>
    </div>
  )
}

export default App