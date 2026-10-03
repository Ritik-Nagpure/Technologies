import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

const Product = () => {
    return (
        <div>product Page in Root</div>
    )
}

export const Route = createFileRoute('/product')({
    component: Product
})