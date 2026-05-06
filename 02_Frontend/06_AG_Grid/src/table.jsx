import React, { useState } from 'react'
import { students, columns, subjects } from './assets/students'
import { AgGridReact } from 'ag-grid-react'

console.log(columns);

const table = () => {
    const [rowdef] = useState(students);
    const [coldef] = useState(columns);

    return (
        <div className='w-full h-full'>
            <AgGridReact
                rowData={rowdef}
                columnDefs={coldef}
            />
        </div>
    )
}



//  {[1101, 1102, 1103, 1104].map((item) => <p key={item} >{subjects[item]}</p>)}
export default table