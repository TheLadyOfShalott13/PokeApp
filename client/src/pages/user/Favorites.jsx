import React, {useEffect, useState} from 'react'
import "../../styles/favorites.css";
import NavigationBar from '../../components/NavigationBar'
import axios from "axios";

const Favorites = () => {
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
            <NavigationBar />
            <div className="Favorites">
                <div className="table-container">

                </div>
            </div>
        </div>
    )
}

export default Favorites
