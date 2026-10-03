import React, { useEffect, useState } from 'react'

const MOCK_HOTELS = [
    {
        id: 1,
        name: "Grand Plaza Hotel",
        location: "New York",
        pricepernight: 250,
    },
    {
        id: 2,
        name: "Oceanview Resort",
        location: "Miami",
        pricepernight: 180,
    },
    {
        id: 3,
        name: "Mountain Retreat",
        location: "Denver",
        pricepernight: 150,
    },
    {
        id: 4,
        name: "City Center Inn",
        location: "Chicago",
        pricepernight: 120,
    },
    {
        id: 5,
        name: "The Riverside Boutique",
        location: "London",
        pricepernight: 300,
    },
    {
        id: 6,
        name: "Desert Mirage Spa",
        location: "Dubai",
        pricepernight: 450,
    },
    {
        id: 7,
        name: "Historic Heritage Hotel",
        location: "Rome",
        pricepernight: 220,
    },
    {
        id: 8,
        name: "Sakura Blossom Inn",
        location: "Tokyo",
        pricepernight: 190,
    },
    {
        id: 9,
        name: "Tropical Paradise Villas",
        location: "Bali",
        pricepernight: 110,
    },
    {
        id: 10,
        name: "Northern Lights Lodge",
        location: "Reykjavik",
        pricepernight: 350,
    },
];

const codequestion = () => {
    const [filteredHotels, setFilteredHotels] = useState(MOCK_HOTELS)
    const [selected, setSelected] = useState(MOCK_HOTELS)
    const [loc, setLoc] = useState('')
    const [price, setPrice] = useState()


    const addHotel = (hid) => {
        let newlist = []
        let hotel = MOCK_HOTELS.filter(item => item.id === hid);
        let isPresent = selected.some(item => item.id === hotel[0].id);
        newlist = isPresent ? [...selected] : [...selected, ...hotel]
        setSelected(newlist)
        console.log(hid, newlist, hotel, isPresent);
    }


    const removeHotel = (hid) => {
        let isPresent = selected.some(item => item.id === hid)
        let newlist = selected.filter(item => item.id !== hid)
        setSelected(newlist)
    }

    const applyfilter = () => {
        let newlist = MOCK_HOTELS;
        if (loc.length > 0) {
            newlist = newlist?.filter(item => item.location.toLowerCase().includes(loc.toLowerCase()))
        }

        if (price > 0) {
            newlist = newlist.filter(item => item.pricepernight > price)
        }
        setFilteredHotels(newlist)
    }
    useEffect(applyfilter, [loc, price])


    const clearFilters = () => {
        setLoc('');
        setPrice();
        setFilteredHotels(MOCK_HOTELS)
    }

    const total = selected?.reduce((acc, item) => (acc + item.pricepernight || 0), 0)
    return (
        <div className='h-full flex flex-col w-full gap-4 items-center justify-center'>
            <h1 className='font-sans text-6xl font-extrabold text-violet-600'>Hotels Booking</h1>

            <div className='h-full w-full flex flex-row gap-4 grow px-8'>

                <div className='min-h-full w-full flex flex-col grow gap-6 rounded-xl m-1 p-4 shadow-2xl shadow-gray-500 bg-gray-200 border-2 border-gray-600'>
                    <h2 className='text-2xl text-violet-700 font-bold'>Our Best Sellers </h2>
                    <div className=' w-full px-4 mx-2 flex flex-row gap-2'>
                        <input onChange={(e) => setLoc(e.target.value)} value={loc} className='px-2 py1 w-full focus:border-amber-600 border-violet-500 border-2 rounded-lg bg-gray-100' type='text' placeholder='Enter City....' />
                        <input onChange={(e) => setPrice(e.target.value)} value={price} className='px-2 py1 w-full focus:border-amber-600 border-violet-500 border-2 rounded-lg bg-gray-100' type='number' placeholder='Enter Price....' />
                        <button className='px-2 py-1 bg-blue-400 rounded-lg font-bold text-lg text-white' onClick={clearFilters}>Clear</button>
                    </div>
                    <div className='w-full px-4 mx-2 grid grid-cols-2 md:grid-cols-4 gap-2'>
                        {
                            filteredHotels?.map((item) => (
                                <div key={item.id} className='bg-amber-100 p-2 shadow-2xl shadow-gray-400 rounded-2xl border-2 border-amber-400'>
                                    <h2 className='text-xl font-bold'>{item.name}</h2>
                                    <span>{item.location}</span>
                                    <p className='text-lg font-bold'>$ {item.pricepernight}</p>
                                    <button onClick={() => addHotel(item.id)} className='px-2 py-1 bg-amber-500 rounded-xl'> Add </button>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 w-2/6 max-h-[80vh] overflow-hidden rounded-xl m-1 p-4 shadow-2xl shadow-gray-500 bg-gray-200 border-2 border-gray-600">

                    {/* Replaced <pre> with a flex container for proper, predictable spacing */}
                    <div className="flex justify-between w-full text-2xl font-bold px-2">
                        <span>Check out</span>
                        <span>$ {total}</span>
                    </div>

                    {/* Changed overflow-y-scroll to overflow-y-auto so the scrollbar only shows when needed */}
                    <div className="w-full flex flex-col gap-2 overflow-y-auto pr-2">
                        {selected?.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-row justify-between items-center p-3 rounded-xl bg-gray-100 border-2 border-gray-600"
                            >
                                <div className="flex flex-col">
                                    <p className="text-xl font-bold">{item.name}</p>
                                    <p className="text-gray-700">
                                        {item.location} • ${item.pricepernight}
                                    </p>
                                </div>

                                {/* Removed the unsemantic <p> tag wrapper and added an 'X' to the button so it is visible */}
                                <div className="flex flex-col justify-center">
                                    <button
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                                        onClick={() => removeHotel(item.id)}
                                        aria-label="Remove hotel"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default codequestion