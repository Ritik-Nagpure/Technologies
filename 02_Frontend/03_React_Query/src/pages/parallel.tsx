import { useQueries } from '@tanstack/react-query';
import axios from 'axios';

type data_type = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    job_title: string;
    address?: {
        main: string;
        street: string;
        city: string;
        state?: string;
    };
};

type page_data = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    data: data_type[];
};


const fetchPage = async (page: number): Promise<page_data> => {
    const res = await axios.get<page_data>(
        `http://localhost:8000/api/demos/react_query/pages?page=${page}&limit=10`
    );
    return res.data;
};

// useQueries lets you run multiple queries in parallel.
// React Query will keep each query cached separately (['page', n]), so you can reuse them later without refetching.

function ParallelExample() {

    // For fixed parallel queries, you hardcode the array.
    const results = useQueries({
        queries: [
            {
                queryKey: ['page', 1],
                queryFn: () => fetchPage(1),
            },
            {
                queryKey: ['page', 2],
                queryFn: () => fetchPage(2),
            },
        ],
    });
    console.log('Parallel Queries', results);
    return (
        <div className='w-full flex flex-col gap-4 p-4'>
            {results.map((result, idx) => (
                <div className='ring-2 ring-amber-100 shadow-amber-800 shadow-xl bg-amber-100 rounded-2xl m-2 p-2' key={idx}>
                    <h2>Page {idx + 1}</h2>
                    {result.data?.data.map(item => (
                        <p key={item.id}>{item.first_name} {item.last_name}</p>
                    ))}
                </div>
            ))}
        </div>
    );
}

function DynamicParallelExample({ pages }: { pages: number[] }) {
    // For dynamic parallel queries, you map over an input array (like [1,2,3]) to generate queries dynamically.
    const results = useQueries({
        queries: pages.map(page => ({
            queryKey: ['page', page],
            queryFn: () => fetchPage(page),
        })),
    });
    console.log('Dynamic queries : ', results);

    const allItems = results.flatMap(r => r.data?.data ?? []);
console.log(allItems)
    return (
        <div className='w-full grid grid-cols-1 gap-6 p-4 m-2'>
            {allItems.map(item => (
                <div className='w-full grid grid-rows-2 gap-1 ring-2 ring-amber-100 shadow-amber-800 shadow-xl bg-amber-100 p-2 rounded-2xl' key={item.id}>
                    <p>Name : {item.first_name} {item.last_name}</p>
                    <p>Email: {item.email}</p>
                </div>
            ))}
        </div>
    );
}

const parallel = () => {
    return (
        <div className='grid grid-cols-2 w-full bg-red-5100'>
            <DynamicParallelExample pages={[1, 2, 3]} />
            <ParallelExample />
        </div>
    )
}

export default parallel

