import React from 'react';
import '../styles/home.scss';
import SliderStocks from '../components/sliderStocks';

const HomePage = () => {
    return (
        <div>
            <div className='home'>
                <SliderStocks/>
                <div className='delivery_info'>
                    <div className='del_main_cont'>
                        <div className='delivery_cont'>
                            <img src="gifs/shop.gif" alt="" width={"70px"} height={"70px"}/>
                            <div className='del1'>
                                <div className='delivery_title'>Оформление</div>
                                <div className='delivery_subtitle'>создайте заказ в личном кабинете</div>
                            </div>
                        </div>
                        <div className='delivery_cont'>
                            <img src="gifs/clock.gif" alt="" width={"75px"} height={"75px"}/>
                            <div className='del2'>
                                <div className='delivery_title'>Обработка</div>
                                <div className='delivery_subtitle'>мы соберем и упакуем заказ в короткие сроки</div>
                            </div>
                        </div>
                        <div className='delivery_cont'>
                            <img src="gifs/truck.gif" alt="" width={"90px"} height={"60px"} />
                            <div className='del3'>
                                <div className='delivery_title'>Доставка</div>
                                <div className='delivery_subtitle'>следите за доставкой в личном кабинете</div>
                            </div>
                        </div>
                        <div className='delivery_cont'>
                            <img src="gifs/like.gif" alt="" width={"80px"} height={"80px"}/>
                            <div className='del4'>
                                <div className='delivery_title'>Получение</div>
                                <div className='delivery_subtitle'>оставьте отзыв на сайте</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='sale_inf'>Скидка 20% при первом заказе</div>
            </div>
        </div>
    );
}

export default HomePage;