import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/navbar';
import HomePage from './homePage';

const Home = () => {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<HomePage />} />
            </Routes>
        </div>
    );
}

export default Home;
