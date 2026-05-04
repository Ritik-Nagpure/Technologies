import { useGetPaginatedQuery } from "../store/all_items";


function ParallelExample() {

    const page1 = useGetPaginatedQuery({ page: 1, limit: 10 });
    const page2 = useGetPaginatedQuery({ page: 2, limit: 10 });
    const page3 = useGetPaginatedQuery({ page: 3, limit: 10 });
    const results = [page1, page2, page3]

    console.log('Parallel Queries', results);

    return (
        <div className='w-full flex flex-col gap-4 p-4'>
            {results.map((result, idx) => (
                <div className='ring-2 ring-amber-100 shadow-amber-800 shadow-xl bg-amber-100 rounded-2xl m-2 p-2' key={idx}>
                    <h2>Page {idx +1}</h2>
                    {result.data?.data.map(item => (
                        <p key={item.id}>{item.first_name} {item.last_name}</p>
                    ))}
                </div>
            ))}
        </div>
    );
}

function DynamicParallelExample({ pages }: { pages: number[] }) {

    const results = pages.map(page => useGetPaginatedQuery({ page, limit: 10 }));

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

