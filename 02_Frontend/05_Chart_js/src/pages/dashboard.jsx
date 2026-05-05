import React from 'react'
import { pData } from '../assets/data'
import { students } from '../assets/students'
import StudentChart from './chart'

const dashboard = () => {
    return (
        <div className='mt-4 p-4 bg-amber-400 h-500 grid grid-cols-2 sm:grid-cols-1'>
            <div>
                <StudentChart students={students} />
            </div>
            <div>

            </div>
        </div>
    )
}

export default dashboard