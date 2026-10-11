// routes/products/$id.jsx

import { createFileRoute } from "@tanstack/react-router"

function ProductDetails() {
  const { id } = Route.useParams()

  return (
    <div className="grid grid-cols-1 justify-items-center">
      <h1 className="text-5xl font-semibold">Product ID: {id}</h1>
    </div>

  )
}

export const Route = createFileRoute("/products/$id")({
  component: ProductDetails,
})