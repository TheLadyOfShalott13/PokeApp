import '../styles/navbar.css';
import React, { useContext } from 'react';
import {Navbar, Nav, Container} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../authContext';

const NavigationBar = () => {
    const navigate = useNavigate();
    const { user, dispatch } = useContext(AuthContext);

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };

    return (
        <Navbar bg="black" variant="dark" fixed="top">
            <Container>
                <Navbar.Brand href="/">
                    <b>P<img src={`${process.env.REACT_APP_FRONTEND_URL}/pokeball.png`} alt="O" height={20} className="pokeball" />
                        KEAPP</b>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {user ? (
                            <>
                                <Nav.Item>
                                    <Nav.Link as={Link} to={`/user/${user._id}`}>
                                        <li onClick={handleClick} style={{ cursor: 'pointer' }}>
                                            <p>Logout</p>
                                        </li>
                                        <li id="username">
                                            <p>{user.username}</p>
                                        </li>
                                    </Nav.Link>
                                </Nav.Item>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
