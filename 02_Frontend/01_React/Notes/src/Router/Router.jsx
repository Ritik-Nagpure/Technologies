import React from 'react'
import Header from '../Header/Header'
import { Route, Routes, BrowserRouter } from 'react-router-dom'

import Demo from '../Demo'
import Formik from '../Formik/Formik'
import Virtualised from '../Virtualised/Virtualised'
import Hooks from '../Hooks/Hooks'
import Spring from '../Spring/Spring'
import Query from '../Query/Query'

function Router() {
    return (
        <div>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Demo />} />
                    <Route path="/Query" element={<Query />} />
                    <Route path="/Virtualised" element={<Virtualised />} />
                    <Route path="/Spring" element={<Spring />} />
                    <Route path="/Hooks" element={<Hooks />} />
                    <Route path="/Formik" element={<Formik />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Router