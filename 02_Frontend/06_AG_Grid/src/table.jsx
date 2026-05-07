import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { students, columns, subjects } from './assets/students'
import { AgGridReact } from 'ag-grid-react'

// console.log(columns);
const toprow = {
    "student_id": 0,
    "student_name": "First Last",
    "age": 15,
    "gender": "M/F/A/Bi",
    "class": 0,
    "address": "main",
    "section": "A",
    [subjects['1101']]: 35.00,
    [subjects['1102']]: 35.00,
    [subjects['1103']]: 35.00,
    [subjects['1104']]: 35.00,
    [subjects['1105']]: 35.00,
    [subjects['1106']]: 35.00,
    "total": 35.00
}

const columnData = [
    {
        headerName: 'Student Data',
        children: [
            { field: "student_id", },
            { field: "student_name", sortable: true, filter: true },
            { field: "age", sortable: true, filter: true },
            { field: "address", sortable: true, filter: true },
            { field: "gender", sortable: true, filter: true },
        ],
        rowGroup: true,
    },
    { field: "class", sortable: true, filter: true },
    { field: "section", sortable: true, filter: true },
    {
        headerName: ' Subjects',
        children: [
            { field: subjects['1101'], sortable: true, filter: true, },
            { field: subjects['1102'], sortable: true, filter: true, },
            { field: subjects['1103'], sortable: true, filter: true, },
            { field: subjects['1104'], sortable: true, filter: true, },
            { field: subjects['1105'], sortable: true, filter: true, },
            { field: subjects['1106'], sortable: true, filter: true, },
        ]
    },
    { field: "total", headerName: 'Result', sortable: true, filter: true },
]

columnData.forEach(col => {
    const fname = Array.from(Object.values(subjects))
    fname.push('total')
    if (fname.includes(String(col.field))) {
        col.cellRenderer = (params) => (
            <span className={`${params.value > 50 ? 'text-emerald-500' : 'text-red-400'}`} >
                {params.value}
            </span >
        )
    }
})



const table = forwardRef((props, ref) => {
    const [rowdef] = useState(students);
    const [coldef] = useState(columnData);

    let api;

    const onGridReady = (params) => {
        api = params.api;
    };

    useImperativeHandle(ref, () => ({
        exportCsv: () => api?.exportDataAsCsv(),
        exportExcel: () => api?.exportDataAsExcel()
    }));

    return (
        <div className='w-full h-full items-center'>
            <AgGridReact
                className="ag-theme-quartz"
                onGridReady={onGridReady}
                rowData={rowdef}
                columnDefs={coldef}
                pagination={true}

                groupDisplayType='groupRows'

                autoGroupColumnDef={{
                    headerName: 'Students',
                    cellRendererParams: {
                        innerRenderer: (params) => {
                            if (params.node.group) {
                                return params.value; // group key
                            }
                            return `${params.data.student_name} (${params.data.student_id}), Age: ${params.data.age}`;
                        }
                    }
                }}


            // ref={gridRef}
            // defaultCsvExportParams={{ fileName: 'students.csv' }}
            // defaultExcelExportParams={{ fileName: 'students.csv' }}

            // pinnedTopRowData={[toprow]}
            // pinnedBottomRowData={[{ student_name: 'Total', student_id: 20 }]}
            />
        </div>
    )
})

export default table