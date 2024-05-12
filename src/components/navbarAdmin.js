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
                        <Link to="/admin/home/data" className="no-style-link-admin">
                            Категории и акции
                        </Link>
                        <Link to="/admin/home/schemasData" className="no-style-link-admin">
                            Схемы
                        </Link>
                        <Link to="/admin/home/palleteData" className="no-style-link-admin">
                            Палитра
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default navbarAdmin;