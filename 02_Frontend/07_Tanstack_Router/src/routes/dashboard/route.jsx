import {
  Outlet,
  Link,
  createFileRoute,
} from "@tanstack/react-router"

function DashboardLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          borderRight: "1px solid gray",
          padding: "20px",
        }}
      >
        <h2>Dashboard</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Link to="/dashboard">
            Home
          </Link>

          <Link to="/dashboard/analytics">
            Analytics
          </Link>

          <Link to="/dashboard/settings">
            Settings
          </Link>
        </div>
      </aside>

      {/* Page Content */}
      <main
        style={{
          padding: "20px",
          flex: 1,
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
})