import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../authContext";
import axios from "axios";
import NavigationBar from "../components/NavigationBar";
import "../styles/login.css";

function Login() {

    const api_url             = process.env.REACT_APP_BACKEND_URL
    const redirect_url        = process.env.REACT_APP_FRONTEND_URL
    const { dispatch }              = useContext(AuthContext);
    const navigate   = useNavigate();

    const [feedbackMessage, setFeedbackMessage]                    = useState('');                          //used for feedback message while logging in
    const [credentials, setCredentials] = useState({                            //setting credentials initially to undefined
        username: undefined,
        password: undefined,
    });

    const handleChange = (e) => {                                                                                     // realtime update of input fields to be sent for validation
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };


    const loginAction = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        try {
            const res =  await axios.post(`${api_url}/api/user/login`, credentials);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
            navigate('/');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.includes("Error: Wrong password or email!")) {
                setFeedbackMessage("Error: Wrong password or email");
                dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });                                            //If error response and data exist, dispatch LOGIN_FAILURE with error message
            } else {
                setFeedbackMessage("An error occurred while logging in. Please check if email has been registered.");
                dispatch({ type: "LOGIN_FAILURE", payload: "An error occurred while logging in" });                         // If no error response or data, dispatch generic error message
            }
        }
    };

    return (
        <div className="login">
            <NavigationBar />
            <div className="loginCard">
                <div className="center">
                    <div className="image-container">
                        <img src={`${process.env.REACT_APP_FRONTEND_URL}/pokemon-logo.png`} alt="Pokemon Logo" height={200} />
                    </div>
                    <form>
                        <div className="txt_field">
                            <input 
                                type="text"
                                placeholder="Email"
                                id="email"
                                onChange={handleChange}
                                className="lInput"/>
                        </div>
                        <div className="txt_field">
                            <input
                                type="password"
                                placeholder="Password"
                                id="password"
                                onChange={handleChange}
                                className="lInput"/>
                        </div>
                        <div className="formInput" id="feedback-message">
                            <p>{feedbackMessage}</p>
                        </div>
                        <div className="login_button">
                            <button className="button"
                                onClick={loginAction}>
                                Login
                            </button>
                        </div>

                        <div className="signup_link">
                            <p>
                                Not registered?&nbsp;
                                <Link to="/register">
                                    Register Now
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
