// routes/__root.jsx

import { Outlet, Link, createRootRoute } from "@tanstack/react-router"

function RootComponent() {
  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <Link to="/">Home</Link>

        <Link to="/about">About</Link>

        <Link to="/pricing">Pricing</Link>

        <Link to="/product">Product</Link>

        <Link to="/products">Products</Link>

        <Link to='/dashboard'>Dashboard</Link>
      </nav>

      <Outlet />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})