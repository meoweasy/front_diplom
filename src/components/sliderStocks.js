import React, { useState, useEffect } from 'react';
import '../styles/sliderStocks.scss';
import axios2 from '../config/axiosConfig';

const SliderStocks = () => {
    const [pos, setPos] = useState(0);
    const totalSlides = 3;
    const [dataStock, setDataStock] = useState([]);

    const slideLeft = () => {
        setPos(prevPos => (prevPos === 0 ? totalSlides - 1 : prevPos - 1));
    };

    const slideRight = () => {
        setPos(prevPos => (prevPos === totalSlides - 1 ? 0 : prevPos + 1));
    };

    useEffect(() => {
        const slider = document.getElementById("slider");
        const sliderWidth = slider.clientWidth;
        slider.style.transform = `translateX(-${pos * sliderWidth}px)`;
    }, [pos]);

    const fetchStocks = async () => {
        try {
            const response = await axios2.get(`/stocks`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await fetchStocks();
                setDataStock(fetchedData);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        
        fetchData();
    }, []);

    return (
        <div className='slider_cont'>
            <div id="slider-wrap">
                <div className="btns left" onClick={slideLeft}>
                    <i className="fa fa-arrow-left"></i>
                </div>
                <ul id="slider">
                    {dataStock.map((row, index) => (
                        <li key={index}>
                            <div>
                                <img class="act" src={`data:image/png;base64,${row.imagestock}`}/>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="btns right" onClick={slideRight}>
                    <i className="fa fa-arrow-right"></i>
                </div>
            </div>
        </div>
    );
};

export default SliderStocks;