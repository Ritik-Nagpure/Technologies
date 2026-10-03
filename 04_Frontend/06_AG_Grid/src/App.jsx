import React, { useRef } from 'react'
import Table from './table'
import { AgGridProvider } from 'ag-grid-react'
import { AllCommunityModule } from 'ag-grid-community'

const module = [AllCommunityModule];

const App = () => {
  const tableRef = useRef();

  return (
    <div className='bg-gray-200 w-full px-4 py-2 grid h-screen grid-cols-1 grid-rows-[auto_1fr] gap-4 '>

      <AgGridProvider modules={module}>

        <div className='h-fit flex flex-row justify-between mx-4'>

          <div></div>

          <h1 className='my-1 mx-2 px-2 text-orange-600 font-bold text-5xl font-sans w-fit' >
            AG Grid Example
          </h1>

          <div className='flex flex-row justify-end gap-4 my-1'>
            <button className='px-4 py-1 bg-blue-400 ring-2 ring-blue-500 text-xl text-white font-bold rounded-lg m-1' onClick={() => tableRef.current.exportCsv()}>CSV</button>
            <button className='px-4 py-1 bg-gray-400 ring-2 ring-gray-500 text-xl text-white font-bold rounded-lg m-1' onClick={() => tableRef.current.exportExcel()} disabled={true}>Excel</button>
          </div>

        </div>

        <div className='m-1 px-2 w-full h-full'>
          <Table ref={tableRef} />
        </div>

      </AgGridProvider>

    </div>
  )
}

export default App