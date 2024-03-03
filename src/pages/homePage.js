import React from 'react';
import '../styles/home.scss';
import SliderStocks from '../components/sliderStocks';

const HomePage = () => {
    return (
        <div>
            <div className='home'>
                <SliderStocks/>
            </div>
        </div>
    );
}

export default HomePage;