import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import type { data_type } from "../assets/utils";
import React, { useEffect, useRef } from "react";

type page_data = {
    page: number,
    limit: number,
    totalItems: number,
    totalPages: number,
    data: data_type[]
}


const ItemList = React.memo(({ items }: { items: data_type[] }) => (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 justify-items-center gap-10 m-auto p-2">
        {items.map(item => (
            <div key={item.id} className="border-2 w-full h-full p-4 rounded-lg shadow-md shadow-black break-all">
                <p>Name: {item.first_name} {item.last_name}</p>
                <p>Email: {item.email}</p>
                <p>Job Title: {item.job_title}</p>
                <p>
                    Address: {`${item.address?.main}, ${item.address?.street}, ${item.address?.city}${item.address?.state ? `, ${item.address?.state}` : ''}`}
                </p>
            </div>
        ))}
    </div>
));

const infyscroll = () => {
    const fetchPages = async ({ pageParam = 1 }: { pageParam?: number }): Promise<page_data> => {
        try {
            const url = `http://localhost:8000/api/demos/react_query/pages?page=${pageParam}&limit=10`
            const result = await axios.get<page_data>(url) //.then(res => res.data).then(res => res.json())
            return result.data
        }
        catch {
            console.log('Error Occured..')
            return {} as page_data
        }
    }

    const infyq = useInfiniteQuery(
        {
            queryKey: ['pages'],
            queryFn: fetchPages,
            initialPageParam: 1,
            getNextPageParam: (lastPage) => {
                return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
            }
        }

    )

    const { data: user, fetchNextPage, hasNextPage, isFetchingNextPage } = infyq;

    const loadmoreref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!loadmoreref.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(loadmoreref.current);
        return () => observer.disconnect();

    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    // if (isFetchingNextPage) return <p>Loading ...</p>

    const allitems = user?.pages.flatMap(page => page.data) ?? []

    return (
        <div className="grid grid-cols-1 justify-items-center">
            <ItemList items={allitems} />
            <div ref={loadmoreref} className="h-10"></div>
            {isFetchingNextPage && <p className="p-4 text-2xl font-bold">Loading....</p>}
        </div>
    )
}

export default infyscroll