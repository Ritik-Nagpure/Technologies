import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { data_type } from "../assets/utils";
import { useState } from "react";

type page_data = {
    page: number,
    limit: number,
    totalItems: number,
    totalPages: number,
    data: data_type[]
}

const pagina = () => {
    const [pid, setPid] = useState(1);

    const handlepage = (ptype: string) => {

        if (ptype === '+') {
            setPid(prev => prev + 1)
        }

        if (ptype === '-') {
            setPid(prev => prev - 1)
        }
    }

    const fetchPages = async (): Promise<page_data> => {
        try {
            const url = `http://localhost:8000/api/demos/react_query/pages?page=${pid}&limit=50`
            const result = await axios.get(url).then(res => res.data) //.then(res => res.json())
            return result
        }
        catch {
            console.log('Error Occured..')
            return {} as page_data
        }
    }

    const queryobj = useQuery<page_data>({
        queryKey: ['address', pid],
        queryFn: fetchPages,
        staleTime: 1000 * 15,
        refetchInterval: 1000 * 30
    })

    const { isLoading, data: user } = queryobj;

    if (isLoading) return <p>Loading ...</p>
    return (
        <div className="grid grid-cols-1 justify-items-center">
            <div className="flex flex-row justify-between w-48 m-1 p-2">
                <button className={`bg-blue-500 px-4 py-1 m-1 text-white rounded-lg font-bold  disabled:bg-gray-600`} onClick={() => handlepage('-')} disabled={!!(user?.page === 1)}>Prev</button>

                <p className={`bg-gray-200 px-4 py-1 m-1 text-black rounded-lg font-bold ring-1 ring-black`}>{pid}</p>

                <button className={`bg-blue-500 px-4 py-1 m-1 text-white rounded-lg font-bold  disabled:bg-gray-600`} onClick={() => handlepage('+')} disabled={!!(user?.totalPages === pid)}>Next</button>

            </div>

            {user &&
                <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center gap-10 m-auto p-2' >
                    {user?.data.map((item: data_type) => (
                        <div key={item.id} className='border-2 w-full h-full p-4 rounded-lg shadow-md shadow-black break-all' onClick={() => { }}>
                            <p>Name : {item.first_name + ' '}{item.last_name}</p>
                            <p>Email: {item.email}</p>
                            <p>Job Title: {item.job_title}</p>
                            <p>Address : {`${item.address?.main}, ${item.address?.street} ,${item.address?.city} ${item.address?.state ? `, ${item.address?.state}` : ''}`}</p>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default pagina