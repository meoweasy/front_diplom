import '../styles/loginAdmin.scss';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios2 from '../config/axiosConfig';

const LoginAdmin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios2.post('/loginAdmin', {
                email: email,
                password: password
            });

            if (response.status === 200 && response.data) {
                console.log('Успешная авторизация');
                
                localStorage.setItem('token', response.data);
                navigate('/admin/home');
            }

        } catch (err) {
            setError('Неверное имя пользователя или пароль');
        }
    };

    return (
        <div>
            <div class="login-page">
                <div class="form">
                    <form class="login-form">
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
                        <button onClick={handleLogin}>войти</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginAdmin;