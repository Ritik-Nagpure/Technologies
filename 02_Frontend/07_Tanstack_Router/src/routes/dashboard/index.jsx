import { createFileRoute } from "@tanstack/react-router"

function DashboardHome() {
  return <h1>Dashboard Home</h1>
}

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
})