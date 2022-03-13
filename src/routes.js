import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/home/home'
import Successful from './pages/successful/successful'
import AlreadyAccepted from './pages/alreadyAccepted/alreadyAccepted'
const routes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/successful" element={<Successful />} />
            <Route path="/alreadyAccepted" element={<AlreadyAccepted />} />
        </Routes>
    )
}

export default routes
