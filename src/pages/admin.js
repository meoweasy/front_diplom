import React, {  } from 'react';
import '../styles/adminHome.scss';
import NavbarAdmin from '../components/navbarAdmin';
import { BrowserRouter as Navigate, Routes, Route } from 'react-router-dom';
import Schema from './schema';


const AdminHome = () => {
    return (
        <div>
            <NavbarAdmin />
            <Routes>
                <Route path="/schema" element={<Schema />} />
            </Routes>
        </div>
    );
}

export default AdminHome;