import React, { Component } from 'react';
import '../styles/home.scss';
import SliderStocks from '../components/sliderStocks';

class Home extends Component {
    render() {
        return (
          <div>
            <div className='home'>
                <SliderStocks/>
            </div>
          </div>
        );
    }
}

export default Home;
