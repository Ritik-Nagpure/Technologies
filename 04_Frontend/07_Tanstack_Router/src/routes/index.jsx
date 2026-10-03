import React from 'react'
import { createFileRoute } from "@tanstack/react-router"

function Home() {
  return (
    <h1>Home Page</h1>
  )
}

export const Route = createFileRoute("/")({
  component: Home
})