import React from "react";
import { Link } from "react-router-dom";
import '../styles/navbarAdmin.scss';
import axios2 from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom';

const navbarAdmin = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios2.get('/admin/logoutAdmin')
        .then(response => {
            if (response.status === 200) {
                localStorage.removeItem('token');
                navigate('/admin/login');
            }
        });
    };

    return (
        <div>
            <div className="headerAdmin">
                <div className="header_admin_cont">
                    <div className='nav_admin'>
                        <button onClick={handleLogout}>Выход</button>
                        <Link to="/admin/home/schema" className="no-style-link-admin">
                            Создание схемы
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default navbarAdmin;