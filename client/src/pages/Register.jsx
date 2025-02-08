import React from "react";
import Navbar from "../components/Navbar";
import "../styles/register.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
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
                "/users/register",
                info, { withcredentials: false })

            navigate("/login");
        } catch (err) {
            console.log(err)
        }

    };
    return (
        <div className="register">
            <Navbar />
            <div className="registerCard">
                <div className="center">
                    <h1>Join Us Now! :-)</h1>
                    <form>
                        <div className="formInput">
                            <div className="txt_field">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                    onChange={handleChange}
                                    id="username"
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
