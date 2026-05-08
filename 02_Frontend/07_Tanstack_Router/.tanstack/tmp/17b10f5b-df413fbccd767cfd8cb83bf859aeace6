// routes/products/index.jsx

import { createFileRoute, Link } from "@tanstack/react-router"

function Products() {
  return (
    <div>
      <h1>Products</h1>

      <Link to="/products/$id" params={{ id: "1" }}>
        Product 1
      </Link>

      <br />

      <Link to="/products/$id" params={{ id: "2" }}>
        Product 2
      </Link>
    </div>
  )
}

export const Route = createFileRoute("/products/")({
  component: Products,
})