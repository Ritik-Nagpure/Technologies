# Basics of React Query
- **Level 1** Q. What is React Query?
React Query is a library for managing server state in React applications. It simplifies data fetching, caching, synchronization, and updating.

- **Level 1** Q. Why is server state different from client state?
Server state is remote, shared, and requires synchronization with a backend. Client state is local and controlled entirely by the UI.

- **Level 2** Q. Why do we need React Query instead of useEffect and useState?
React Query reduces boilerplate, provides caching, background refetching, and better error/loading state management compared to manual useEffect logic.

- **Level 3** Q. What problems does React Query solve?
It solves issues like duplicated requests, stale data, manual state handling, and complex synchronization between UI and server.

# Query Management
- **Level 1** Q. What is a query key?
A query key uniquely identifies a query in the cache. It can be a string or an array of values.

- **Level 1** Q. What is useQuery?
useQuery is a hook to fetch and cache data with automatic state management.

- **Level 2** Q. How does React Query deduplicate requests?
If multiple components request the same query key, React Query only fetches once and shares the result.

- **Level 2** Q. How do you prefetch queries?
Use queryClient.prefetchQuery to load data into the cache before a component mounts.

- **Level 3** Q. Explain staleTime vs cacheTime.
staleTime defines how long data is considered fresh before refetching. cacheTime defines how long inactive data stays in memory before being garbage collected.

- **Level 3** Q. How do you cancel queries?
React Query provides query cancellation through AbortController in fetch functions.

# Mutations
- **Level 1** Q. What is a mutation?
A mutation is used to create, update, or delete data on the server.

- **Level 1** Q. What is useMutation?
useMutation is a hook for executing server-side changes like POST, PUT, DELETE.

- **Level 2** Q. How do you handle optimistic updates?
Use onMutate to update the cache optimistically, onError to rollback, and onSettled to refetch queries.

- **Level 2** Q. How do you invalidate queries after a mutation?
Call queryClient.invalidateQueries with the relevant query key to refetch and update cached data.

- **Level 3** Q. How do you batch mutations?
You can chain multiple mutations or use mutation hooks with dependent logic.

# Advanced Features
- **Level 1** Q. What is queryClient?
queryClient is the central manager for queries and mutations, providing methods like fetchQuery, invalidateQueries, and setQueryData.

- **Level 1** Q. What are query observers?
Observers track query states and notify components when data changes.

- **Level 2** Q. How does React Query handle background refetching?
It refetches automatically when the window regains focus, the network reconnects, or based on polling intervals.

- **Level 2** Q. How do you implement infinite scrolling with React Query?
Use useInfiniteQuery, which provides functions like fetchNextPage and hasNextPage for paginated data.

- **Level 3** Q. How do you hydrate queries for SSR?
Use dehydrate and Hydrate components to persist and restore query cache between server and client.

- **Level 3** Q. How do you share query cache across tabs?
React Query supports broadcast channel to sync cache across browser tabs.

# Error and Loading States
- **Level 1** Q. How does React Query handle loading states?
It provides flags like isLoading, isFetching, and isRefetching.

- **Level 1** Q. How do you show skeleton loaders?
Use isLoading or isFetching flags to conditionally render skeletons.

- **Level 2** Q. How are errors handled?
Errors are available in the error property. You can use error boundaries or custom UI to display them.

- **Level 2** Q. How do you retry failed queries?
Configure retry and retryDelay options in useQuery.

- **Level 3** Q. How do you handle global error boundaries?
Use queryClient.setDefaultOptions with global onError handlers.

# Performance Optimization
- **Level 1** Q. How does React Query improve performance?
By caching results, deduplicating requests, and serving cached data instantly.

- **Level 1** Q. How do you reduce unnecessary refetches?
Configure staleTime, disable refetchOnWindowFocus, or use manual refetching.

- **Level 2** Q. How do you update cached data without refetching?
Use queryClient.setQueryData to directly update cached values.

- **Level 2** Q. How do you batch query updates?
Use queryClient.batch to group multiple cache updates.

- **Level 3** Q. How do you handle large datasets efficiently?
Use pagination, infinite queries, and selective cache updates.

# Real-World Scenarios
- **Level 1** Q. How do you fetch dependent queries?
Use enabled flag to conditionally run queries only when dependencies are met.

- **Level 1** Q. How do you poll data periodically?
Set refetchInterval in useQuery.

- **Level 2** Q. How do you handle authentication with React Query?
Include tokens in fetch functions and invalidate queries on login/logout.

- **Level 2** Q. How do you integrate React Query with Redux or Context?
React Query manages server state, while Redux/Context can handle client state. They complement each other.

- **Level 3** Q. How do you handle file uploads with React Query?
Use useMutation with multipart/form-data requests.

- **Level 3** Q. How do you handle WebSocket or real-time updates?
Combine React Query with subscriptions or manually update cache with setQueryData.

# Ecosystem and Alternatives
- **Level 1** Q. What are alternatives to React Query?
Alternatives include SWR, Apollo Client, Relay, and Redux Toolkit Query.

- **Level 2** Q. How does React Query compare to SWR?
Both provide caching and revalidation, but React Query has richer features like mutations, DevTools, and cache management.

- **Level 2** Q. How do you use React Query with REST APIs?
Define fetch functions using fetch or axios, and pass them to useQuery or useMutation.

- **Level 2** Q. How do you use React Query with GraphQL?
Wrap GraphQL queries in fetch functions and use them with useQuery. Mutations can also be wrapped similarly.

- **Level 3** Q. Do we still need GraphQL clients like Apollo if we use React Query?
Apollo Client provides GraphQL-specific features like schema awareness and normalized caching. React Query can work with GraphQL but doesn’t replace Apollo’s schema-driven approach.

- **Level 3** Q. How does React Query integrate with microservices?
Each microservice endpoint can be managed with separate query keys, ensuring modular caching.

# Debugging and DevTools
- **Level 1** Q. What are React Query DevTools?
A debugging panel that shows query states, cache, and mutation details.

- **Level 2** Q. How do you debug stale queries?
Use DevTools to inspect query states and check staleTime/cacheTime configurations.

- **Level 2** Q. How do you log query lifecycle events?
Use callbacks like onSuccess, onError, and onSettled to log or trigger side effects.

- **Level 3** Q. How do you monitor query performance?
Integrate with logging tools or custom metrics using query callbacks.

# Best Practices
- **Level 1** Q. When should you use React Query?
Use it for server state management, especially when data needs caching, synchronization, and background updates.

- **Level 1** Q. How do you structure query keys?
Use descriptive arrays like ['todos', userId] to ensure uniqueness and clarity.

- **Level 2** Q. How do you scale React Query in large applications?
Organize queries by feature, use custom hooks, configure global defaults, and leverage queryClient for centralized control.

- **Level 2** Q. How do you handle query invalidation best?
Invalidate queries after mutations or when dependent data changes.

- **Level 3** Q. How do you combine React Query with TypeScript?
Use typed fetch functions and generics in useQuery/useMutation for type safety.

- **Level 3** Q. How do you handle offline support?
React Query can cache data and retry mutations when the network reconnects.

---

# Testing and DevOps
- **Level 1** Q. How do you test components using React Query?
You can mock queryClient and useQuery hooks with testing libraries like Jest and React Testing Library.

- **Level 2** Q. How do you mock server responses in React Query tests?
Use MSW (Mock Service Worker) to intercept network requests and provide mock responses.

- **Level 3** Q. How do you test mutations with optimistic updates?
Simulate mutation calls, assert cache updates via setQueryData, and rollback logic on error.

# Server-Side Rendering (SSR) and Next.js
- **Level 1** Q. How do you use React Query with Next.js?
Use Hydrate and dehydrate to persist query cache between server and client.

- **Level 2** Q. How do you prefetch queries in getServerSideProps?
Call queryClient.prefetchQuery inside getServerSideProps and pass dehydrated state to the client.

- **Level 3** Q. How do you handle SEO with React Query in SSR?
Ensure queries are prefetched server-side so HTML contains data for crawlers.

# Integration with REST APIs
- **Level 1** Q. How do you fetch REST endpoints with React Query?
Wrap fetch or axios calls in a function and pass it to useQuery.

- **Level 2** Q. How do you handle REST pagination?
Use useInfiniteQuery with REST endpoints that accept page parameters.

- **Level 3** Q. How do you handle REST error codes globally?
Configure queryClient with default error handling logic for 4xx/5xx responses.

# Integration with GraphQL
- **Level 1** Q. How do you fetch GraphQL queries with React Query?
Wrap GraphQL queries in a fetch function and use useQuery.

- **Level 2** Q. How do you handle GraphQL mutations with React Query?
Wrap mutation queries in a fetch function and use useMutation.

- **Level 3** Q. Do we need Apollo Client if we use React Query with GraphQL?
Apollo provides schema awareness, normalized caching, and subscriptions. React Query can fetch GraphQL but doesn’t replace Apollo’s schema-driven features.

# Ecosystem Comparisons
- **Level 1** Q. How does React Query compare to Redux Toolkit Query?
RTK Query integrates tightly with Redux, while React Query is standalone and more flexible for server state.

- **Level 2** Q. How does React Query compare to Relay?
Relay is GraphQL-specific with normalized caching, while React Query is protocol-agnostic.

- **Level 3** Q. When should you choose SWR over React Query?
SWR is lightweight and simple for basic caching, React Query is better for complex apps with mutations and advanced caching.

# Architecture and Scaling
- **Level 1** Q. How do you organize queries in a large app?
Create custom hooks per feature, e.g., useTodosQuery, useUserQuery.

- **Level 2** Q. How do you configure global defaults?
Use queryClient.setDefaultOptions to set retry, staleTime, and refetch behaviors globally.

- **Level 3** Q. How do you scale React Query with micro-frontends?
Each micro-frontend can have its own queryClient, or share a global one via context.

# Offline and Real-Time
- **Level 1** Q. How does React Query handle offline mode?
It caches data and retries mutations when the network reconnects.

- **Level 2** Q. How do you integrate React Query with WebSockets?
Use WebSocket events to update cache via queryClient.setQueryData.

- **Level 3** Q. How do you sync data across tabs?
React Query uses BroadcastChannel to synchronize cache between browser tabs.

# Practical Scenarios
- **Level 1** Q. How do you implement optimistic UI for a todo list?
Update cache immediately on mutation start, rollback if mutation fails.

- **Level 2** Q. How do you implement infinite scrolling for a feed?
Use useInfiniteQuery with fetchNextPage and hasNextPage.

- **Level 3** Q. How do you hydrate queries in a static site?
Prefetch queries at build time and hydrate them on client load.
