import React, { Component } from 'react';
import { Link } from "react-router-dom";
//import "../Styles/navbar.scss";

class Navbar extends Component {
  render() {
    return (
      <>
        <div className="menu">
            <div className='menu_cont'>
                <div className='nav'>
                    <Link to="/employee" className="no-style-link">
                        Сотрудники
                    </Link>
                </div>
                <div className='nav'>
                    <Link to="/del_employee" className="no-style-link">
                        Уволенные сотрудники
                    </Link>
                </div>
                <div className='nav'>
                    <Link to="/siz" className="no-style-link">
                        СИЗ
                    </Link>
                </div>
                <div className='nav'>
                    <Link to="/section" className="no-style-link">
                        Участки
                    </Link>
                </div>
                <div className='nav'>
                    <Link to="/training" className="no-style-link">
                        Обучение
                    </Link>
                </div>
                <div className='nav'>
                    <Link to="/lmk" className="no-style-link">
                        ЛМК
                    </Link>
                </div>
            </div>
        </div>
      </>
    );
  }
}

export default Navbar;