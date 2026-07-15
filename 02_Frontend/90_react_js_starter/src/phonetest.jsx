import React, { useEffect, useState } from 'react'

const getdata = async () => {
    const data = await fetch('https://dummyjson.com/products/search?q=phone').then(res => res.json()).then(res => res.products)
    return data
}

const data = await getdata()

const phonetest = () => {
    const [price, setprice] = useState(true)
    const [rating, setRating] = useState(true)
    const [list, setList] = useState()
    const [showsku, setShowsku] = useState(true)

    useEffect(() => setList(data), [])

    const handleSort = (str) => {
        let newlist = list

        if (str === 'price') {
            newlist = newlist.sort((a, b) => price ? a.price - b.price : b.price - a.price)
            setprice(prev => !prev)
        }
        if (str === 'rating') {
            newlist = newlist.sort((a, b) => rating ? a.rating - b.rating : b.rating - a.rating)
            setRating(prev => !prev)
        }
        setList(newlist)
    }

    const handleChange = (str) => {
        let newlist = data;
        newlist = newlist.filter(item => item.sku.toLowerCase().includes(str.toLowerCase()))
        setList(newlist)
    }

    return (
        <div className='w-full flex flex-col items-center'>
            <h1 className='text-6xl font-bold text-amber-600'>Phones</h1>
            <div className='w-full'>
                <table className='w-full'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th onClick={() => setShowsku(false)}>{showsku ? 'Sku' : <input type='text' onChange={(e) => handleChange(e.target.value)} />}</th>
                            <th onClick={() => handleSort('price')}>Price</th>
                            <th onClick={() => handleSort('rating')}>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td>{item.sku}</td>
                                    <td>{item.price}</td>
                                    <td>{item.rating}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default phonetest