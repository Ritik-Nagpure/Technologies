import React, { useEffect, useState } from 'react'

const Tableuse = ({ dataset, sortable, pagination, pagesize, filterable, tablename }) => {
    const [data, setdata] = useState([])
    const [pagedata, setpageData] = useState([])
    const [currSort, setCurrSort] = useState()
    const [filterVal, setFilterVal] = useState()
    const [currPage, setCurrPage] = useState()
    const [rows, setRows] = useState()

    const totalpages = Math.ceil(dataset.length / rows)

    useEffect(() => {
        const populateData = () => {
            setdata(dataset)
            setRows(pagesize)
        }
        populateData()
    }, [dataset, pagesize])

    useEffect(() => {
        const populateData = () => {
            let pindex = (currPage - 1) * rows
            let paged = [...data].slice(pindex, pindex + rows)
            console.log(paged);

            setpageData(paged)
        }
        pagination ? populateData() : setPageData([...data])
    }, [data, currPage, rows])

    const handleSort = () => { }
    const handleFilter = () => { }
    const changePage = () => { }


    return (
        <div className='w-full h-full'>
            <div>
                <h1> {tablename}</h1>
            </div>

            <div className='w-full h-full overflow-scroll'>
                <table cellSpacing={20} cellPadding={4} border={2} >
                    <thead>
                        <tr>
                            {
                                pagedata[0] && Object.keys(pagedata[0]).map((item) => (
                                    <th key={item}>{item}</th>
                                ))
                            }
                        </tr>
                    </thead>

                    <tbody>
                        {
                            pagedata && pagedata.map((element) => (
                                <tr key={element.id}>
                                    {
                                        element && Object.entries(element).map((item) => (
                                            <td key={item[0]}>
                                                {JSON.stringify(item[1])}
                                            </td>
                                        ))
                                    }
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Tableuse