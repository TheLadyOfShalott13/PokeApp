import React, {useEffect, useState} from 'react'
import {Container, Row, Col, Card, Form} from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar'
import axios from "axios";

const Homepage = () => {

    const api_url = process.env.REACT_APP_BACKEND_URL
    const redirect_url = process.env.REACT_APP_FRONTEND_URL
    const [PokemonResponseRecieved, setPokemonResponseStatus] = useState(false);
    const [PoketypeResponseRecieved, setPoketypeResponseStatus] = useState(false);
    const [data, setData] = useState([]);
    const [types, setTypes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadPokemon = async () => {
            axios.get(`${api_url}/api/pokemon/list`).then((response) => {
                setData(response.data);
                setPokemonResponseStatus(true);
            }).catch((err) => {
                setPokemonResponseStatus(true);
            });
            console.log('Completed');
        };

        const loadPokemonTypes = async () => {
            axios.get(`${api_url}/api/poketype/list`).then((response) => {
                setTypes(response.data);
                setPoketypeResponseStatus(true);
            }).catch((err) => {
                setPoketypeResponseStatus(true);
            });
            console.log('Completed');
        };

        loadPokemonTypes();
        loadPokemon();
    }, []);

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.some(type => type.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <NavigationBar />
            <div className="main-body">
                <Container>
                    <Row xs={2} md={4} className="g-4 justify-content-center ">
                        <Col md={6}>
                            <h1 className="text-center">View All Pokemon</h1>
                            <Form.Control
                                type="text"
                                placeholder="Search for pokemon by name or type"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {types.map((item, index) => (
                                <p style={{
                                        backgroundColor: item.colour,
                                        display: "inline-block",
                                        padding: "1px 5px",
                                        margin: "5px 5px 10px 5px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                   key={index}
                                   onClick={(e) => setSearchTerm(item.name)}
                                >
                                    #{item.name}
                                </p>
                            ))}
                        </Col>
                    </Row>
                    <Row xs={2} md={4} className="g-4">
                        {filteredData.length > 0 ? (filteredData.map((item, index) => (
                            <Col md={3} key={index} >
                                <Card className="card-center" style={{border: "solid 1px black"}}>
                                    <Card.Img variant="top" src={item.image_path} alt={item.name} className="card-image" />
                                    <Card.Body>
                                        <Card.Title><h2 className="pokemon-font-solid">{item.name}</h2></Card.Title>
                                        <Card.Text>
                                            {item.type.map((type, index) => (
                                                <p style={{backgroundColor: type.colour, display: "inline-block", padding: "1px 5px", borderRadius: "5px"}} key={index}>
                                                    #{type.name}
                                                </p>
                                            ))}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))) :(
                            <Col md={12}>
                                <h3 className="text-center" style={{color: "grey"}}>No Pokemon Found</h3>
                            </Col>
                        )}
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default Homepage
