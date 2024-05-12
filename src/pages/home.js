import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/navbar';
import HomePage from './homePage';
import Catalog from './catalog';
import ProductDetails from '../components/productDetails';

const Home = () => {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route path="/catalog/" element={<Catalog />} />
                <Route path="/catalog/:productId" element={<ProductDetails />} />
            </Routes>
        </div>
    );
}

export default Home;
