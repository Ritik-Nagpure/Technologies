import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
const About = () => {
    return (
        <div>about</div>
    )
}

export const Route = createFileRoute('/about')({
    component: About
})