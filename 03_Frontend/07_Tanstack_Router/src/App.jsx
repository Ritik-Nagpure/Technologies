// App.jsx

import { createRouter, RouterProvider, } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

const router = createRouter({
  routeTree,
})

export default function App() {

  return (
    <div className="w-full h-screen m-0 p-0 overflow-hiddena">
      <RouterProvider router={router} />
    </div>
  )
}