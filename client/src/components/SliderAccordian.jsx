import React, {useRef, useState} from 'react';
import Slider from 'react-slick';

const SliderAccordion = ({data}) => {
    const slidesToShow = 3;
    const [currentSlide, setCurrentSlide] = useState(1);
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0px',
        afterChange: (index) => {
            setCurrentSlide(index + 1);
        },
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                },
            },
        ],
    };

    return (
        <div className="slider-accordion">
            <Slider {...settings}>
                {data.map((item, index) => (
                    <div key={index} className={`card ${((index === currentSlide) || (index === 0 && currentSlide === 3)) ? 'highlight' : ''}`}>
                        <img src={item.image_path} alt={item.name} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SliderAccordion;
