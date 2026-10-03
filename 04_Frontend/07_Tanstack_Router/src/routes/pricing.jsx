import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

const Pricing = () => {
  return (
    <div>pricing</div>
  )
}

export const Route = createFileRoute('/pricing')({
  component: Pricing
})