
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { data_type } from '../assets/utils';

type page_data = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  data: data_type[];
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/demos/react_query' }),
  endpoints: (builder) => ({
    getAll: builder.query<data_type[], void>({
      query: () => '',
    }),
    getById: builder.query({
      query: (id) => `/${id}`,
      keepUnusedDataFor: 2
    }),
    getPaginated: builder.query<page_data[], { page: number; limit: number }>({
      query: ({ page, limit }) => `/pages?page=${page}&limit=${limit}`,
    }),
    getByIds: builder.query<data_type[], number[] | string[]>({
      query: (ids) => `/idlist?ids=${ids.join(',')}`,
    }),
    updateById: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    deleteById: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
    createEntry: builder.mutation({
      query: (entryobj) => ({
        url: '',
        method: 'POST',
        body: entryobj
      }),
    }),
    getInfyPage: builder.infiniteQuery({
      infiniteQueryOptions: {
        initialPageParam: 1, // Must provide a default initial page param value  
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          if (!lastPage?.data?.length) return undefined; // stop when no data
          return lastPageParam + 1;
        }
        // maxPages: 3, Optionally limit the number of cached pages 
      },

      query({ pageParam }) {  // The `query` function receives `{queryArg, pageParam}` as its argument
        console.log(pageParam)
        return `/pages?page=${pageParam}&limit=500`
      },
    }),
  })
});

export const {
  useGetAllQuery,
  useGetByIdQuery,
  useUpdateByIdMutation,
  useDeleteByIdMutation,
  useGetPaginatedQuery,
  useGetByIdsQuery,
  useCreateEntryMutation,
  useGetInfyPageInfiniteQuery,
} = apiSlice;
