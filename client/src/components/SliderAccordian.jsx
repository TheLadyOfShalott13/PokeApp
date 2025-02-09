import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/slider-accordion.css';

const data = [
    {
        name: 'Pikachu',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png' // Replace with actual paths
    },
    {
        name: 'Charmander',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
    },
    {
        name: 'Squirtle',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png'
    },
    // Add more items as needed
];

const SliderAccordion = () => {
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
                        <img src={item.image} alt={item.name} />
                        <h3>{item.name}</h3>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SliderAccordion;
