import React, {useState} from 'react'
import "../styles/homepage.css";
import Navbar from '../components/Navbar'
import SliderAccordian from "../components/SliderAccordian";

const Homepage = ({ type }) => {
    return (
        <div>
            <Navbar />
            <div className="Homepage">
                <div className="table-container">
                    <SliderAccordian />
                </div>
            </div>
        </div>
    )
}

export default Homepage
