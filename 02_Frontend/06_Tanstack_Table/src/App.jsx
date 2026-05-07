import React, { useState } from 'react';

import Home from './home'
import SimpleTable from './tables/simpletable';
import SortedTable from './tables/sortedtable';
import FilterTable from './tables/filtered';
import PaginatedTable from './tables/pagination';
import Combined from './tables/combined';

const App = () => {
  const [currTable, setCurrTable] = useState('all');

  const handleTable = (tablename) => {
    setCurrTable(tablename);
  }
  console.log(currTable);


  return (
    <div className='bg-gray-200 w-full h-screen grid grid-cols-1 grid-rows-[auto_1fr] gap-4 p-2'>
      <div className=' h-fit flex flex-row justify-between'>
        <div className='text-6xl font-bold font-sans text-emerald-500' >TanStack Table</div>
        <div className='flex flex-row gap-2' >
          <button className='px-4 py-2 rounded-lg ring-2 ring-blue-400 text-2xl bg-blue-500 text-white' onClick={() => handleTable('simple')}> Simple </button>
          <button className='px-4 py-2 rounded-lg ring-2 ring-blue-400 text-2xl bg-blue-500 text-white' onClick={() => handleTable('sorted')}> Sorted </button>
          <button className='px-4 py-2 rounded-lg ring-2 ring-blue-400 text-2xl bg-blue-500 text-white' onClick={() => handleTable('filter')}> Filtered </button>
          <button className='px-4 py-2 rounded-lg ring-2 ring-blue-400 text-2xl bg-blue-500 text-white' onClick={() => handleTable('paginated')}> Paginated </button>
          <button className='px-4 py-2 rounded-lg ring-2 ring-blue-400 text-2xl bg-blue-500 text-white' onClick={() => handleTable('all')}> Combined </button>
        </div>
      </div>

      <div className='w-full px-4 py-2 overflow-hidden'>
        {
          (() => {
            switch (currTable) {
              case 'simple':
                return <SimpleTable />

              case 'sorted':
                return <SortedTable />

              case 'filter':
                return <FilterTable />

              case 'paginated':
                return <PaginatedTable />

              case 'all':
                return <Combined />

              default:
                <Home />
            }
          })()
        }
      </div>
    </div>
  )
}

export default App
