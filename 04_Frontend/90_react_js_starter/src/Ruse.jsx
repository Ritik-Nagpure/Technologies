import React, { useEffect, useState } from 'react'
import Rtable from './Rtable'
import Tableuse from './Tableuse'

const Ruse = () => {
    const [data, setData] = useState([])
    const [tableName, setTableName] = useState()

    const url = 'https://dummyjson.com/posts';
    // const url = 'https://dummyjson.com/products';
    // const url = 'https://dummyjson.com/recipes';
    // const url = 'https://dummyjson.com/quotes';
    // const url = 'https://dummyjson.com/comments';


    useEffect(() => {
        const populateData = async () => {
            const res = await fetch(url).then(res => res.json());
            let key = Object.keys(res)[0]
            let data = res[key];
            // console.log(key, res);
            // console.log(data);
            setTableName(key)
            setData(data)
        }
        populateData();
    }, [])

    return (
        <div className='h-full flex flex-col items-center gap-2'>
            <Rtable dataset={data} sortable={true} pagination={true} pagesize={5} filterable={true} tablename={tableName} />
            {/* <Tableuse dataset={data} sortable={false} pagination={true} pagesize={5} filterable={true} tablename={tableName} /> */}
        </div>
    )
}

export default Ruse