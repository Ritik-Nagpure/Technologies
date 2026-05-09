// routes/products/index.jsx

import { createFileRoute, Link } from "@tanstack/react-router"

function Products() {
  return (
    <div className="w-full grid grid-cols-1 justify-items-center gap-10">
      <h1 className="w-fit px-4 py-2 font-semibold text-xl rounded-lg ring-2 ring-violet-500 bg-violet-400">Products</h1>
      
      <div className="flex flex-col">
        <Link className="px-4 py-2 font-semibold text-xl rounded-lg hover:ring-2 ring-violet-500 hover:bg-violet-400" to="/products/$id" params={{ id: "1" }}>
          Product 1
        </Link>

        <br />

        <Link className='px-4 py-2 font-semibold text-xl rounded-lg hover:ring-2 ring-violet-500 hover:bg-violet-400' to="/products/$id" params={{ id: "2" }}>
          Product 2
        </Link>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/products/")({
  component: Products,
})