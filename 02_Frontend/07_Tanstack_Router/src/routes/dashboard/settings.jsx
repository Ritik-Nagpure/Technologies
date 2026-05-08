import { createFileRoute } from "@tanstack/react-router"

function Settings() {
  return <h1>Settings Page</h1>
}

export const Route = createFileRoute(
  "/dashboard/settings"
)({
  component: Settings,
})