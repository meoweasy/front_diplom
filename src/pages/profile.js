import React, { useState, useEffect } from "react";
import '../styles/profile.scss';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../components/UserProvider';
import axios2 from '../config/axiosConfig';
import { jwtDecode } from "jwt-decode";

const Profile = () => {
    const [activeTab, setActiveTab] = useState('данные');
    const navigate = useNavigate();
    const mail = localStorage.getItem("emailUser");
    const [data, setData] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem('tokenUser');
        localStorage.removeItem('emailUser');
        navigate('/login');
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userProfileResponse = await axios2.get(`/users/byemail/${mail}`);
                console.log(userProfileResponse.data);
                setData(userProfileResponse.data);
            } catch (err) {
                console.error('Ошибка при получении профиля:', err);
            }
        };
    
        fetchUserProfile();
    }, []);

    const renderContent = () => {
        switch(activeTab) {
            case 'данные':
                return (
                    <div>
                        <div className="title_prof">Личные данные</div>
                        <hr></hr>
                        <div className="info_prof2">Имя: {data.name}</div>
                    </div>
                );
            case 'заказы':
                return (
                    <div>
                        <div className="title_prof">Заказы</div>
                        <hr></hr>
                        <div className="zak_cont"></div>
                    </div>
                );
            default:
                return null;
        }
    };



    return ( 
        <>
            <div className="profile_cont">
                <div className="nav_dash">
                    <button onClick={() => setActiveTab('данные')}>личные данные</button>
                    <button onClick={() => setActiveTab('заказы')}>заказы</button>
                    <button onClick={handleLogout}>выход</button>
                </div>
                <div className="cont_info_pr">
                    {renderContent()}
                </div>
            </div>
        </>
    );
}
 
export default Profile;