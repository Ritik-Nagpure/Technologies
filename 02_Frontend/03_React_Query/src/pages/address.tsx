import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { data_type } from "../assets/utils";
import { useState } from "react";

const address = () => {

    const [isvisible, setIsvisible] = useState(false);
    const [uid, setUid] = useState<number | null>(null);

    const initialSample = { "id": 123, "first_name": "Loading" }
    const queryclient = useQueryClient();

    const queryobj = useQuery<data_type[]>({
        queryKey: ['address'],
        queryFn: () => axios.get('http://localhost:8000/api/demos/react_query').then(res => res.data),
        staleTime: 1000 * 15,
        refetchInterval: 1000 * 30
    })
    // console.log(queryobj)

    const { isLoading, data: user, refetch } = queryobj;

    const { isLoading: loadingUnique, data: udata, refetch: uniqueRefetch } = useQuery<data_type>({
        queryKey: ['unique_data', uid],
        queryFn: async () => {
            const result = await axios.get(`http://localhost:8000/api/demos/react_query/${uid}`).then(res => res.data)
            return result
        },

        //Use this when you have complete, valid data already available (e.g., from a local storage item or another query's cache)
        // initialData: initialSample as data_type,

        // Use this for partial or fake data meant only to keep the UI from jumping while real data loads.
        placeholderData: initialSample as data_type,

        // here if staletime is 0 then it refetches using state value which is null so object is null so refetch with some id always not will null or empyt id
        staleTime: 1000 * 60
    })

    console.log(udata);


    const handleFocus = (id: number) => {
        // queryclient.invalidateQueries({ queryKey: ['unique_data', null], exact: true });
        queryclient.removeQueries({ queryKey: ['unique_data', null], exact: true });
        // console.log(queryclient.getQueryCache())
        // console.log(queryclient.getQueriesData({ queryKey: ['unique_data', null], exact: true }))
        // console.log(queryclient.getQueriesData({ queryKey: ['unique_data', 1], exact: true }))
        setUid(id);
        uniqueRefetch();
        setIsvisible(true);
    }

    if (isLoading) return <p>Loading ...</p>
    return (
        <div className="grid grid-cols-1 ">
            <button className="bg-amber-400 text-xl rounded-lg text-white p-2 m-1 ring-1 ring-amber-600" onClick={() => refetch()}>
                Refresh
            </button>

            <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center gap-10 m-auto p-2' >
                {user?.map((item: data_type) => (
                    <div key={item.id} className='border-2 w-full h-full p-4 rounded-lg shadow-md shadow-black break-all' onClick={() => handleFocus(item.id)}>
                        <p>Name : {item.first_name + ' '}{item.last_name}</p>
                        <p>Email: {item.email}</p>
                        <p>Job Title: {item.job_title}</p>
                        <p>Address : {`${item.address?.main}, ${item.address?.street} ,${item.address?.city} ${item.address?.state ? `, ${item.address?.state}` : ''}`}</p>
                    </div>
                ))}
            </div>


            <div className={`${isvisible ? 'fixed' : 'hidden'} inset-0 z-40 bg-blue-900/30 backdrop-blur-sm`}>
                <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-xl shadow-2xl bg-gray-300 text-black grid grid-cols-1 justify-items-center">

                    {loadingUnique && <p>Loading ...</p>}
                    {/* 
                    {<div className='border-2 w-full h-full p-4 rounded-lg shadow-md shadow-black break-all'>
                        <p>ID: {udata?.id}</p>
                        <p>Name : {udata?.first_name + ' '}{udata?.last_name}</p>
                        <p>Email: {udata?.email}</p>
                        <p>Job Title: {udata?.job_title}</p>
                        <p>Address : {`${udata?.address?.main}, ${udata?.address?.street} ,${udata?.address?.city} ${udata?.address?.state ? `, ${udata?.address?.state}` : ''}`}</p>
                        <button onClick={() => setIsvisible(false)} className="p-1 bg-blue-400">Close</button>
                    </div>} */}

                    <div className='border-2 w-full h-full p-4 rounded-lg shadow-md shadow-black break-all'>
                        <div className="flex flex-row justify-end">
                            <button onClick={() => setIsvisible(false)} className=" p-2 text-xl font-bold rounded-2xl ring-2 ring-red-500 bg-red-400 text-white">Close</button>
                        </div>

                        {udata && Object.entries(udata).map(([key, value]) => (
                            <div key={key} className="border-b py-2 flex gap-2">
                                <span className="font-bold capitalize">{key.replace('_', ' ')}:</span>

                                {/* Check if the value is the address object */}
                                {typeof value === 'object' && value !== null ? (
                                    <span className="text-gray-600">
                                        {/* Display address sub-fields */}
                                        {`${value?.main}, ${value?.street}, ${value?.city}`}
                                    </span>
                                ) : (
                                    <span>{String(value)}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default address