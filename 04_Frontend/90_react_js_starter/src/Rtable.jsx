import React, { useEffect, useState } from 'react'
import { BiSort } from 'react-icons/bi'
import { BsArrowLeftCircleFill, BsArrowRightCircleFill, BsFilter, BsSortDown, BsSortUp } from 'react-icons/bs'

const Rtable = ({ dataset, sortable, pagination, pagesize, filterable, tablename }) => {
    const [data, setData] = useState([])
    const [pageData, setPageData] = useState([])
    const [rows, setRows] = useState(3)
    const [currPage, setCurrPage] = useState(1)

    const [currSort, setCurrSort] = useState()
    const [order, setOrder] = useState(false)

    const [filterVal, setFilterVal] = useState([])

    const totalPages = Math.ceil([...data].length / rows);

    useEffect(() => {
        const populate = () => {
            setData(dataset)
            setRows(pagesize)
        }
        populate()
    }, [dataset, pagesize])

    useEffect(() => {
        const populate = () => {
            let pageindex = (currPage - 1) * rows;
            let currpage = [...data].slice(pageindex, pageindex + rows)
            // console.log(pageindex, currpage, data);
            setPageData(currpage)
        }
        pagination ? populate() : setPageData([...data])
    }, [data, currPage, rows])

    const handlePageChange = (side) => {
        console.log(side);

        if (side === 'left' && currPage > 1) {
            setCurrPage(prev => prev - 1)
        }
        if (side === 'right' && currPage < totalPages) {
            setCurrPage(prev => prev + 1)
        }
    }

    const cellItem = (val) => {
        if (typeof val !== 'object') {
            return String(val)
        }
        else {
            if (Array.isArray(val)) return String(val.join(' , '))
            val = Object.entries(val)
            if (Array.isArray(val)) return val.map((item) => item.join(' : ')).join(' , ')
            return JSON.stringify(val)
        }
    }

    const handleSort = (item) => {
        let sorted = [...data].sort((a, b) => {
            let va = a[item]
            let vb = b[item]

            if (typeof va === 'string' && typeof vb === 'string') {
                return order ? va.localeCompare(vb) : vb.localeCompare(va)
            }
            return order ? a[item] - b[item] : b[item] - a[item]
        })
        setData(sorted)
        setCurrSort(item)
        setOrder(prev => !prev)
    }

    const handleFilter = (word, colname) => {
        if (word.length === 0) {
            setData(dataset)
        }
        else {
            let newdata = [...data].filter((item) => String(item[colname]).toLowerCase().includes(String(word).toLowerCase()))
            newdata.length === 0 ? setData([...data]) : setData(newdata)
        }
    }

    return (
        <div className='flex flex-col w-full h-full gap-2 justify-center items-center px-2'>
            <div className='flex flex-row w-full px-2 justify-between items-center'>
                <span className=''></span>
                <span className='text-5xl font-bold text-amber-600'>{String(tablename).charAt(0).toUpperCase() + String(tablename).slice(1)}</span>
                <span className=''>
                    {
                        pagination &&
                        <div className='flex flex-row justify-center items-center gap-4'>
                            <span className='font-extrabold text-blue-600' onClick={() => handlePageChange('left')}><BsArrowLeftCircleFill size={28} /></span>
                            <span className='text-xl font-bold'>{currPage} out of {totalPages}</span>
                            <span className='text-xl font-bold'>
                                <select value={rows} onChange={(e) => setRows(e.target.value)}>
                                    <option value={3}>3</option>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                </select>
                            </span>
                            <span className='font-extrabold text-blue-600' onClick={() => handlePageChange('right')}><BsArrowRightCircleFill size={28} /></span>
                        </div>
                    }
                </span>
            </div>

            <div className='w-full h-full overflow-scroll'>
                <table className='w-full border-separate border-spacing-x-2 border-spacing-y-1 border-2'>
                    <thead>
                        <tr>
                            {
                                pageData[0] && Object.keys(pageData[0]).map((item) => (
                                    <th key={item} className='border p-1 w-fit'>
                                        <div className='flex flex-row justify-center items-center gap-6 px-2'>
                                            {item.charAt(0).toUpperCase() + item.slice(1)}
                                            <div className='flex flex-row justify-center items-center gap-3'>
                                                {filterable && <span onClick={() => setFilterVal(prev => [...prev, item])}>
                                                    {
                                                        filterVal.includes(item) ? <input type='text' placeholder='type filters' onChange={(e) => handleFilter(e.target.value, item)} className='w-32 px-1 ring-2 ring-violet-400' /> : <BsFilter size={20} />
                                                    }
                                                </span>}

                                                {sortable &&
                                                    <span onClick={() => handleSort(item)}>
                                                        {currSort === item ?
                                                            order ? <BsSortDown size={20} /> : < BsSortUp size={20} /> :
                                                            <BiSort size={20} />}
                                                    </span>}
                                            </div>
                                        </div>
                                    </th>
                                ))
                            }
                        </tr>

                    </thead>
                    <tbody>
                        {
                            pageData && pageData?.map((element) => (
                                <tr key={element.id}>
                                    {element && Object.entries(element).map((item) => (
                                        <td key={item[0]} className='border p-1 '>{cellItem(item[1])}</td>
                                    ))
                                    }
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default Rtable