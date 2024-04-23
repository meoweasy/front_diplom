import React, { useState, useEffect } from 'react';
import '../styles/sliderStocks.scss';

const SliderStocks = () => {
    const [pos, setPos] = useState(0);
    const totalSlides = 2;

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

    const slides = [
        {
            color: "#1abc9c",
            title: "Slide #1"
        },
        {
            color: "#3498db",
            title: "Slide #2"
        }
    ];

    return (
        <div className='slider_cont'>
            <div id="slider-wrap">
                <div className="btns left" onClick={slideLeft}>
                    <i className="fa fa-arrow-left"></i>
                </div>
                <ul id="slider">
                    {slides.map((slide, index) => (
                        <li key={index} style={{backgroundColor: slide.color}}>
                            <div>
                                <img class="act" src='77.jpeg'/>
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