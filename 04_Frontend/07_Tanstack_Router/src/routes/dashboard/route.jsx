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
      <aside style={{ width: "220px", borderRight: "1px solid gray", padding: "20px", }}      >
        <h2 className="px-4 py-2 text-2xl font-bold text-violet-500 rounded-lg ring-2 ring-violet-300 bg-violet-200">Menu</h2>
        
        <br /><hr /><br />
        
        <div className="flex flex-col gap-4 ">
          <Link className="px-4 py-2 font-semibold text-xl rounded-lg hover:ring-2 ring-violet-500 hover:bg-violet-400 " to="/dashboard">            Home          </Link>
          <Link className="px-4 py-2 font-semibold text-xl rounded-lg hover:ring-2 ring-violet-500 hover:bg-violet-400 " to="/dashboard/analytics">            Analytics          </Link>
          <Link className="px-4 py-2 font-semibold text-xl rounded-lg hover:ring-2 ring-violet-500 hover:bg-violet-400 " to="/dashboard/settings">            Settings          </Link>
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