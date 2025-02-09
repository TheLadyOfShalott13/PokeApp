import React, {useEffect, useState} from 'react'
import "../styles/homepage.css";
import Navbar from '../components/Navbar'
import SliderAccordian from "../components/SliderAccordian";
import axios from "axios";

const Homepage = () => {
    const api_url = process.env.REACT_APP_BACKEND_URL
    const redirect_url = process.env.REACT_APP_FRONTEND_URL
    const [responseRecieved, setResponseStatus] = useState(false);
    const [data, setData] = useState([]);
    useEffect(() => {
        const loadData = async () => {
            // Till the data is fetch using API
            // the Loading page will show.
            setResponseStatus(false);

            // Await make wait until that
            // promise settles and return its result
            axios.get(`${api_url}/api/pokemon/list`).then((response) => {
                setData(response.data);
                setResponseStatus(true);
            }).catch((err) => {
                setResponseStatus(true);		//error state
            });
            console.log('Completed');
        };

        // Call the function
        loadData();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="Homepage">
                <div className="table-container">
                    {	responseRecieved ? data.length>0 ? <SliderAccordian data={data} setData={setData} />  : <h1 className="feedback-header">Cannot Find Image</h1> : <h1 className="feedback-header">Loading Image</h1> }
                </div>
            </div>
        </div>
    )
}

export default Homepage
