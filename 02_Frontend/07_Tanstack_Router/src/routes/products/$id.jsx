// routes/products/$id.jsx

import { createFileRoute } from "@tanstack/react-router"

function ProductDetails() {
  const { id } = Route.useParams()

  return <h1>Product ID: {id}</h1>
}

export const Route = createFileRoute("/products/$id")({
  component: ProductDetails,
})