console.log(process.env.NODE_ENV);

function home() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-blue-600">Redux Toolkit Query</h1>
                <p className="text-gray-600 mt-2">Landing Page with Notes</p>
            </header>

            <main className="grid gap-6 max-w-3xl">
                <section className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">⚡ What is RTK Query?</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Built into Redux Toolkit for data fetching and caching.</li>
                        <li>Eliminates the need for manual loading/error states.</li>
                        <li>Provides auto-generated hooks for queries and mutations.</li>
                    </ul>
                </section>

                <section className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">🚀 Key Features</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Automatic caching & deduplication.</li>
                        <li>Refetching and invalidation built-in.</li>
                        <li>Supports queries (GET) and mutations (POST/PUT/DELETE).</li>
                    </ul>
                </section>

                <section className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">📦 Basic Setup</h2>
                    <pre className="bg-gray-900 text-green-300 p-4 rounded-md text-sm overflow-x-auto">
                        {`import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',
    }),
  }),
});

export const { useGetPostsQuery } = api;`}
                    </pre>
                </section>
            </main>

            <footer className="mt-10 text-gray-500">
                Made with ❤️ using React + Tailwind + TS
            </footer>
        </div>
    );
}

export default home;
