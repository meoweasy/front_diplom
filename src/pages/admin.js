import React, {  } from 'react';
import '../styles/adminHome.scss';
import NavbarAdmin from '../components/navbarAdmin';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
    Navigate,
    useNavigate
} from "react-router-dom";
import Schema from './schema';
import { useEffect } from 'react';
import LoginAdmin from './loginAdmin';
import Data from './dataPage';
import ShemaTable from './schemaTable';
import PalleteTable from './palleteTable';
import ProductTable from './productTable';


const AdminHome = () => {
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated && location.pathname !== '/admin/login') {
            navigate('/admin/login');
        } else if (isAuthenticated && location.pathname === '/admin/login') {
            navigate('/admin/home/schema');
        }
    }, [location.pathname, navigate, isAuthenticated]);

    const hideNavbar = location.pathname === '/admin/login';

    return (
        <div>
            {!hideNavbar && <NavbarAdmin />}
            <Routes>
                <Route exact path="/login" element={<LoginAdmin />} />
                {isAuthenticated ? (
                    <>
                    <Route path="/home/schema" element={<Schema />} />
                    <Route path="/home/data" element={<Data />} />
                    <Route path="/home/schemasData" element={<ShemaTable />} />
                    <Route path="/home/palleteData" element={<PalleteTable />} />
                    <Route path="/home/productsData" element={<ProductTable />} />
                    </>
                ) : (
                    <Route path="*" element={<Navigate to="/admin/login" />} />
                )}
            </Routes>
        </div>
    );
}

export default AdminHome;