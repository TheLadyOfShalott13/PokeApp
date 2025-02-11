import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../components/NavigationBar";
import "../styles/register.css";

function RegisterUsers() {
    const api_url                                    = process.env.REACT_APP_BACKEND_URL
    const redirect_url                               = process.env.REACT_APP_FRONTEND_URL
    const navigate                          = useNavigate();
    const [info, setInfo]                               = useState({});
    const [feedbackMessage, setFeedbackMessage]      = useState('');

    const handleChange = (e) => {                                                   //realtime updating of form values into variable "info"
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }; 

    const register = async (e) => {                                         // async function posting to register user
        e.preventDefault();
        try {
            await axios.post(
                `${api_url}/api/user/register`,
                info,
                { withcredentials: false }
            )
            navigate(`/login`);
        } catch (err) {
            setFeedbackMessage(err.response.data.message);
        }
    };
    return (
        <div className="register">
            <NavigationBar />
            <div className="registerCard">
                <div className="center">
                    <div className="image-container">
                        <img src={`${redirect_url}/pokemon-logo.png`} alt="Pokemon Logo" height={200} />
                    </div>
                    <form>
                        <div className="formInput">
                            <div className="txt_field">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    name="name"
                                    onChange={handleChange}
                                    id="name"
                                    required />
                            </div>
                            <div className="txt_field">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    onChange={handleChange}
                                    id="email"
                                    required />
                            </div>
                            <div className="txt_field">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    onChange={handleChange}
                                    id="password"
                                    required />
                            </div>
                        </div>
                        <div className="formInput" id="feedback-message">
                            <p>{feedbackMessage}</p>
                        </div>
                        <div className="login_button">
                            <button className="button" 
                                    onClick={register}>
                                Register
                            </button>
                        </div>
                        <div className="signup_link">
                            <p>
                                Already Registered?&nbsp;
                                <Link to="/login">Login Now</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
}

export default RegisterUsers;
