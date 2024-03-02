import React, { Component } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../styles/navbar.scss";

const Navbar = () => {
    const location = useLocation();

    if (location.pathname === '/admin_home') {
        return null;
    }

    return (
      <>
        <div className="header">
            <div className='header_cont'>
                <div className='header_cont_first'>
                    <div className='logo'>ColorWave</div>
                    <div className='social_network'>
                        <a href="ссылка" target="_blank" class="social">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
                                <circle cx="11" cy="11" r="11" fill="#7D8AFA"/>  
                            </svg>
                        </a>
                        <a href="ссылка" target="_blank" class="social">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
                                <circle cx="11" cy="11" r="11" fill="#7D8AFA"/>  
                            </svg>
                        </a>
                        <a href="ссылка" target="_blank" class="social">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
                                <circle cx="11" cy="11" r="11" fill="#7D8AFA"/>  
                            </svg>
                        </a>
                        <a href="ссылка" target="_blank" class="social">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
                                <circle cx="11" cy="11" r="11" fill="#7D8AFA"/>  
                            </svg>
                        </a>
                    </div>
                    <div className='phone'>+7 (999) 000 12-34</div>
                    <div className='navigation_first'>
                        <div className='nav'>
                            <Link to="/home" className="no-style-link">
                                Главная
                            </Link>
                        </div>
                        <div className='nav'>
                            <Link to="/catslog" className="no-style-link">
                                Каталог
                            </Link>
                        </div>
                        <div className='nav'>
                            <Link to="/contacts" className="no-style-link">
                                Контакты
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='header_cont_second'>
                    <div className='categories_cont'>
                        <div class="dropdown hover">
                            <a href="8">Категории</a>
                            <ul>
                                <li><a href="#">Категория1</a></li>
                                <li><a href="#">Категория2</a></li>
                                <li><a href="#">Категория3</a></li>
                                <li><a href="#">Категория4</a></li>
                                <li><a href="#">Категория5</a></li>
                                <li><a href="#">Категория6</a></li>
                                <li><a href="#">Категория7</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className='search_cont'>
                        <input type='text' placeholder="Найти на сайте..." ></input>
                        <button type="submit">Поиск</button>
                    </div>
                    <div className='navigation_second'>
                        <div className='nav2'>
                            <div className='svg'>
                                <svg fill="#7D8AFA" width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path d="M10.31,9.12H5.5A4.52,4.52,0,0,0,1,13.62,2.34,2.34,0,0,0,1,14H14.78a2.34,2.34,0,0,0,0-.38A4.51,4.51,0,0,0,10.31,9.12ZM8,7.88A3.94,3.94,0,1,0,4.06,3.94,3.94,3.94,0,0,0,8,7.88Z"/>
                                    </g>
                                </svg>
                            </div>
                            <div className='label'>Профиль</div>
                        </div>
                        <div className='nav2'>
                            <div className='svg2'>
                                <svg fill="#7D8AFA" width="21px" height="21px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.132 2.504 4.42 9H3a1.001 1.001 0 0 0-.965 1.263l2.799 10.263A2.004 2.004 0 0 0 6.764 22h10.473c.898 0 1.692-.605 1.93-1.475l2.799-10.263A.998.998 0 0 0 21 9h-1.42l-3.712-6.496-1.736.992L17.277 9H6.723l3.145-5.504-1.736-.992zM14 13h2v5h-2v-5zm-6 0h2v5H8v-5z"/></svg>
                            </div>
                            <div className='label'>Корзина</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </>
    );
}

export default Navbar;