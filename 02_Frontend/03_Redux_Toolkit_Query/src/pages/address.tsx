import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { data_type } from "../assets/utils";


const address = () => {
    const { isLoading, data } = useQuery({
        queryKey: ['address'],
        queryFn: () => axios.get('http://localhost:8000/api/demos/react_query'),

    })

    if (isLoading) return <p>Loading ...</p>
    return (
        <div>
            <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center gap-10 w-full m-auto p-2 break-all' >

                {data?.data.map((item: data_type) => (
                    <div key={item.id} className='border-2 w-full h-full p-4 rounded-lg shadow-md shadow-black'>
                        <p>Name : {item.first_name + ' '}{item.last_name}</p>
                        <p>Email: {item.email}</p>
                        <p>Job Title: {item.job_title}</p>
                        <p>Address : {`${item.address?.main}, ${item.address?.street} ,${item.address?.city} ${item.address.state ? `, ${item.address.state}` : ''}`}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default address