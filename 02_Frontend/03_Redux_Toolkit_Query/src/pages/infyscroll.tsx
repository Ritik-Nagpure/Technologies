
import type { data_type } from "../assets/utils";
import React, { useEffect, useRef } from "react";
import { useGetInfyPageInfiniteQuery } from "../store/all_items";

// type page_data = {
//     page: number,
//     limit: number,
//     totalItems: number,
//     totalPages: number,
//     data: data_type[]
// }


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
    const { data: user, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetInfyPageInfiniteQuery({
        initialPageParam: 1
    });
    console.log(user, hasNextPage, isFetchingNextPage);

    const loadmoreref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const el = loadmoreref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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