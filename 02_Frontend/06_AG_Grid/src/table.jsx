import React from 'react'
import { students, columns, subjects } from './assets/students'
import { AgGridReact } from 'ag-grid-react'


const table = () => {
    return (
        <div className='w-full h-full'>
            <AgGridReact
                rowData={students}
                columnDefs={columns}
            />
        </div>
    )
}

//  {[1101, 1102, 1103, 1104].map((item) => <p key={item} >{subjects[item]}</p>)}
export default table