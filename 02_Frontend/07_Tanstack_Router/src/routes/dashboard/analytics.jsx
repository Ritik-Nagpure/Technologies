import { createFileRoute } from "@tanstack/react-router"

function Analytics() {
  return <h1>Analytics Page</h1>
}

export const Route = createFileRoute(
  "/dashboard/analytics"
)({
  component: Analytics,
})