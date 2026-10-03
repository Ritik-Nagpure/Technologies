// routes/__root.jsx

import { Outlet, Link, createRootRoute } from "@tanstack/react-router"

function RootComponent() {
  return (
    <div className="h-full grid grid-cols-1 grid-rows-[auto_1fr] gap-2 pb-4">

      <div className="w-full bg-blue-300 text-3xl px-4 py-2 text-white flex flex-row justify-center items-center">
        <nav className=" flex flex-row gap-6 font-bold  font-sans">

          <Link className="px-4 py-2 rounded-lg hover:ring-2 ring-violet-500 hover:bg-violet-400 hover:underline " to="/">Home</Link>

          <Link className="px-4 py-2 rounded-lg hover:ring-2 ring-violet-500 hover:bg-violet-400 hover:underline " to="/about">About</Link>

          <Link className="px-4 py-2 rounded-lg hover:ring-2 ring-violet-500 hover:bg-violet-400 hover:underline " to="/pricing">Pricing</Link>

          <Link className="px-4 py-2 rounded-lg hover:ring-2 ring-violet-500 hover:bg-violet-400 hover:underline " to="/product">Product</Link>

          <Link className="px-4 py-2 rounded-lg hover:ring-2 ring-violet-500 hover:bg-violet-400 hover:underline " to="/products">Products</Link>

          <Link className="px-4 py-2 rounded-lg hover:ring-2 ring-violet-500 hover:bg-violet-400 hover:underline " to='/dashboard'>Dashboard</Link>
        </nav>
      </div>

      <div className="h-full ring-2 ring-gray-400 bg-gray-200 mx-2 p-2">
        <Outlet />
      </div>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})