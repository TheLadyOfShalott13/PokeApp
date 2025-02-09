import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/slider-accordion.css';

const SliderAccordion = ({data}) => {
    const settings = {
        //dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true
    };

    return (
        <div className="slider-accordion">
            <Slider {...settings}>
                {data.map((item, index) => (
                    <div key={index} className="card">
                        <img src={item.image_path} alt={item.name} />
                        <h3>{item.name}</h3>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SliderAccordion;
