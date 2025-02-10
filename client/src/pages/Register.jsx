import React from "react";
import NavigationBar from "../components/NavigationBar";
import "../styles/register.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const api_url = process.env.REACT_APP_BACKEND_URL
    const redirect_url = process.env.REACT_APP_FRONTEND_URL
    const navigate = useNavigate();
    const [info, setInfo] = useState({});
    const handleChange = (e) => {
        setInfo(
            (prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }; 

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                `${api_url}/api/user/register`,
                info, { withcredentials: false })

            navigate(`/login`);
        } catch (err) {
            console.log(err)
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
                        <div className="login_button">
                            <button className="button" 
                                    onClick={handleClick}>
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

export default Register;
