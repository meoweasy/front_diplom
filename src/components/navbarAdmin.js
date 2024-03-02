import React from "react";
import { Link } from "react-router-dom";
import '../styles/navbarAdmin.scss';

const navbarAdmin = () => {
    return (
        <div>
            <div className="headerAdmin">
                <div className="header_admin_cont">
                    <div className='nav_admin'>
                        <Link to="/admin_home/schema" className="no-style-link-admin">
                            Создание схемы
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default navbarAdmin;