import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/loginUser.scss';
import InputMask from 'react-input-mask';
import axios2 from '../config/axiosConfig';
import Swal from 'sweetalert2';

const LoginUser = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [nameUser, setNameUser] = useState("");
    const [adress, setAdress] = useState("");
    const [phone, setPhone] = useState("");

    const [isLogin, setIsLogin] = useState(true); // состояние для переключения между "Вход" и "Регистрация"

    const addUser = async (newUser) => {
        try {
            const formData = {
                name: newUser.name,
                address: newUser.address,
                phone: newUser.phone,
                email: newUser.email,
                password: newUser.password
            };
    
            const response = await axios2.post(`/users`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response;
        } catch (error) {
            console.error('Ошибка при добавлении:', error);
            throw error;
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !nameUser || !adress || !phone) {
            Swal.fire({
                icon: 'error',
                title: 'Ошибка',
                text: 'Пожалуйста, заполните все поля',
            });
            return;
        }
    
        const user = {
            name: nameUser,
            address: adress,
            phone: phone,
            email: email,
            password: password
        };
    
        try {
            const addedUser = await addUser(user);
            if (addedUser.status === 200) {
                Swal.fire({
                    icon: 'succes',
                    title: 'Успешно',
                    text: 'Ваша учетная запись создана',
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Ошибка',
                text: error.message || 'Ошибка при добавлении',
            });
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Ошибка',
                text: 'Пожалуйста, заполните все поля',
            });
            return;
        }

        try {
            const response = await axios2.post('/loginUser', {
                email: email,
                password: password
            });

            if (response.status === 200 && response.data) {
                console.log('Успешная авторизация');
                
                localStorage.setItem('tokenUser', response.data);
                localStorage.setItem('emailUser', email);
                navigate('/profile');
            }

        } catch (err) {
            setError('Неверное имя пользователя или пароль');
            Swal.fire({
                icon: 'error',
                title: 'Ошибка',
                text: 'Неверная почта или пароль',
            });
        }
    };

    return (
        <div>
            <div className="login-page1">
                <div className="form1">
                    <div className="btn_form_cont">
                        <button 
                            className={`btn_log ${isLogin ? 'active' : ''}`} 
                            onClick={() => setIsLogin(true)}
                        >
                            Вход
                        </button>
                        <button 
                            className={`btn_reg ${!isLogin ? 'active' : ''}`} 
                            onClick={() => setIsLogin(false)}
                        >
                            Регистрация
                        </button>
                    </div>
                    <div className="login-form2">
                        {!isLogin && (
                            <>
                                <input 
                                    type="text" 
                                    placeholder="Имя"
                                    value={nameUser}
                                    onChange={(e) => setNameUser(e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Адрес"
                                    value={adress}
                                    onChange={(e) => setAdress(e.target.value)}
                                />
                                <InputMask
                                    className="phone_form"
                                    mask="+7 999 999 99-99"
                                    maskChar="_"
                                    placeholder="+7 ___ ___ __-__"
                                    id="phone"
                                    name='phone'
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </>
                        )}
                        <input 
                            type="text" 
                            placeholder="почта"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input 
                            type="password" 
                            placeholder="пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {isLogin ? <button onClick={handleLogin}>Войти</button>: <button onClick={handleRegister}>Зарегистрироваться</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginUser;