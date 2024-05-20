import React from 'react';
import Navbar from '../components/navbar';
import HomePage from './homePage';
import Catalog from './catalog';
import ProductDetails from '../components/productDetails';
import LoginUser from './loginUser';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
    Navigate,
    useNavigate
} from "react-router-dom";
import { useEffect } from 'react';
import Profile from './profile';

const Home = () => {
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem('tokenUser');
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && location.pathname === '/login') {
            navigate('/profile');
        }
    }, [location.pathname, navigate, isAuthenticated]);


    return (
        <div>
            <Navbar />
            <Routes>
                <Route exact path="/login" element={<LoginUser />} />
                {isAuthenticated ? (
                    <>
                        <Route path="/profile" element={<Profile />} />
                        <Route exact path="/" element={<HomePage />} />
                        <Route path="/catalog/" element={<Catalog />} />
                        <Route path="/catalog/:productId" element={<ProductDetails />} />
                    </>
                ) : (
                    <>
                        <Route exact path="/" element={<HomePage />} />
                        <Route path="/catalog/" element={<Catalog />} />
                        <Route path="/catalog/:productId" element={<ProductDetails />} />
                    </>
                )}
            </Routes>
        </div>
    );
}

export default Home;
