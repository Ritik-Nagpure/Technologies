import React, { useCallback, useEffect, useState } from 'react'
import { BsArrowLeftCircleFill, BsArrowRightCircleFill, BsFilter, BsSortDown, BsSortUp } from 'react-icons/bs'
import { FaSort } from 'react-icons/fa'

const Rtable = ({ dataset, sortable, filterable, pagination, pagesize, tablename }) => {
    const [data, setData] = useState([])
    const [pageData, setPageData] = useState([])
    const [currPage, setCurrPage] = useState(1)
    const [order, setOrder] = useState(false)
    const [rows, setRows] = useState()
    const [filterVal, setFilterVal] = useState([])

    const [currSortedCol, setcurrSortedCol] = useState('')

    let totalpages = Math.ceil(dataset.length / rows)

    useEffect(() => {
        const populatedata = () => {
            setData(dataset)
            setRows(pagesize)
        }
        populatedata()
    }, [dataset, pagesize])

    useEffect(() => {
        const populatedata = () => {
            let pageindex = currPage === 1 ? 0 : (currPage - 1) * rows
            let thisPage = data.slice(pageindex, pageindex + rows)
            console.log(data, thisPage)
            setPageData(thisPage)
        }
        pagination ? populatedata() : setPageData(data)
    }, [data, currPage, rows])

    const celldata = (val) => {
        if (typeof val !== 'object') {
            return String(val)
        }
        else {
            if (Array.isArray(val)) return String(val.join(' , '))
            val = Object.entries(val)
            if (Array.isArray(val[0])) return val.map((item) => item.join(' : ')).join(' , ')
            return JSON.stringify(val)
        }
    }

    const handleSort = (ev, item) => {
        const sortedData = [...data].sort((a, b) => {
            const valA = a[item];
            const valB = b[item];

            if (typeof valA === 'string' && typeof valB === 'string') {
                return order ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }

            return order ? valA - valB : valB - valA;
        });
        setOrder(prev => !prev)
        setData(sortedData)
        setcurrSortedCol(item);
    }

    const handlePageChange = (side) => {
        if (side === 'left' && currPage > 1) {
            setCurrPage(prev => prev - 1)
        }
        if (side === 'right' && currPage < totalpages) {
            setCurrPage(prev => prev + 1)
        }
    }
    const handleFilter = (words, colname) => {
        if (words.length === 0) {
            setData(dataset)
        }
        else {
            let newdata = [...data].filter((item) => String(item[colname]).toLowerCase().includes(words.toLowerCase()))
            newdata.length === 0 ? setData([...data]) : setData(newdata)
        }
    }

    return (
        <div className='h-full w-full flex flex-col items-center justify-center px-2'>
            <div className='w-full px-4 flex flex-row justify-between gap-4'>
                <span></span>
                <h1 className='text-5xl font-bold text-amber-600 '>{String(tablename)?.charAt(0).toUpperCase() + String(tablename)?.slice(1)}</h1>
                <span className='flex justify-center'>
                    {pagination && <div className='flex flex-row gap-4 items-center justify-between'>
                        <span className='font-extrabold text-blue-600' onClick={() => handlePageChange('left')}><BsArrowLeftCircleFill size={24} /></span>
                        <span className='font-bold text-lg  '>{currPage} out of {totalpages}</span>
                        <span className='font-bold text-lg  ' >
                            <select value={rows} onChange={(e) => setRows(e.target.value)}>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </select>
                        </span>
                        <span className='font-extrabold text-blue-600 ' onClick={() => handlePageChange('right')}><BsArrowRightCircleFill size={24} /></span>
                    </div>}
                </span>
            </div>

            <div className='h-full w-full overflow-scroll p-2'>
                <table className=' border-2 border-separate border-spacing-y-1 border-spacing-x-2'>
                    <thead>
                        <tr>
                            {pageData[0] && Object.keys(pageData[0]).map((item) => (
                                <th key={item}>
                                    <div className='flex flex-row gap-4 p-1 justify-between items-center border'>
                                        <span>{item.charAt(0).toUpperCase() + item.slice(1)} </span>
                                        <div className='flex flex-row gap-4 p-1 justify-between items-center'>
                                            {filterable && <span onClick={() => setFilterVal(prev => [...prev, item])}>
                                                {filterVal.includes(item) ? <input type='text' placeholder='type value' className='rounded ring-amber-600 ring-2 px-1' onChange={(e) => handleFilter(e.target.value, item)} /> : <BsFilter />}
                                            </span>}
                                            {sortable && <span onClick={(e) => { handleSort(e, item) }}>
                                                {currSortedCol === item ? order ? <BsSortUp /> : <BsSortDown /> : <FaSort />}
                                            </span>}
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>

                    </thead>
                    <tbody>
                        {pageData ? pageData.map((el) => (
                            <tr key={el.id} className='gap-1'>
                                {el && Object.entries(el).map((item) => (
                                    <td key={item[0]} className='border p-1'>
                                        <span className='p-1'>{celldata(item[1])}</span>
                                    </td>
                                ))
                                }</tr>
                        )) : <span> Loading ....</span>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Rtable