import React, {useEffect, useState} from 'react'
import {Container, Row, Col, Card} from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar'
import axios from "axios";
import {useParams} from "react-router-dom";

const View = () => {

    const {id} = useParams();
    const api_url = process.env.REACT_APP_BACKEND_URL
    const redirect_url = process.env.REACT_APP_FRONTEND_URL
    const [PokemonResponseRecieved, setPokemonResponseStatus] = useState(false);
    const [PoketypeResponseRecieved, setPoketypeResponseStatus] = useState(false);
    const [PokevolutionResponseRecieved, setPokevolutionResponseStatus] = useState(false);
    const [pokemon, setPokemon] = useState([]);
    const [types, setTypes] = useState({});
    const [evolutions, setEvolutions] = useState([]);

    useEffect(() => {
        const loadPokemon = async () => {
            axios.get(`${api_url}/api/pokemon/get/${id}`).then((response) => {
                setPokemon(response.data);
                setPokemonResponseStatus(true);
                loadEvolutions(response.data[0].pokechain_id);
            }).catch((err) => {
                setPokemonResponseStatus(true);
            });
            console.log('Completed');
        };

        const loadPokemonTypes = async () => {                                                           //Loading pokemon types from API
            axios.get(`${api_url}/api/poketype/list`).then((response) => {
                const typesData = {};
                response.data.forEach(type => {
                    typesData[type.id] = type;
                });
                setTypes(typesData);
                setPoketypeResponseStatus(true);
            }).catch((err) => {
                setPoketypeResponseStatus(true);
            });
            console.log('Completed');
        };


        const loadEvolutions = async (chain_id) => {
            axios.get(`${api_url}/api/pokevolution/grouped/${chain_id}`).then((response) => {
                setEvolutions(response.data);
                setPokevolutionResponseStatus(true);
            }).catch((err) => {
                setPokevolutionResponseStatus(true);
            });
            console.log('Completed');
        };

        loadPokemon();
        loadPokemonTypes();
    }, [id, api_url]);

    return (
        <div>
            <NavigationBar />
            <div className="main-body">
                <Container>
                    <Row xs={2} md={4} className="g-4">
                        {pokemon.length > 0 ? (pokemon.map((item, index) => (
                            <React.Fragment key={index}>
                                <Col md={4} className="justify-content-center" key="summary">
                                    <h1 className="text-center mb-4" style={{color: "black", textDecoration: "underline"}}>Current Pokemon</h1>
                                    <Card style={{border: "solid 4px black"}}>
                                        <Card.Img src={item.image_path} alt={item.name} className="card-image"  />
                                        <Card.Body>
                                            <Card.Text>
                                                <h3 className="text-left" style={{color: "black"}}><span className=" pokemon-font-outline">Name:</span> <span className=" pokemon-font-solid">{item.name}</span></h3>
                                                <h3 className="text-left" style={{color: "black"}}><span className=" pokemon-font-outline">Poke-api ID:</span> {item.identifier}</h3>
                                                <h3 className="text-left" style={{color: "black"}}><span className=" pokemon-font-outline">Evolution Chain ID:</span> {item.pokechain_id}</h3>
                                                <h3 className="text-left" style={{color: "black"}}><span className=" pokemon-font-outline">Pokemon Types:</span>
                                                    {item.type.map((type, tindex) => (
                                                        <span style={{backgroundColor: type.colour}} className="pokemon-type-label">#{type.name}</span>
                                                    ))}
                                                </h3>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={8} className="justify-content-center" key="evolutions">
                                    <Row className="g-4 mb-4">
                                        <Col md={12}>
                                            <h1 className="text-center" style={{color: "black", textDecoration: "underline"}}>Evolution Chart</h1>
                                        </Col>
                                    </Row>
                                    {
                                        PokevolutionResponseRecieved ? (
                                            Object.keys(evolutions).map((position, index) => (
                                                <Row className="g-4 justify-content-center mb-5" key={index}>
                                                    <Col md={12} className="justify-content-center">
                                                        <h3 className="text-center pokemon-font-outline" style={{ color: "black" }}>STAGE {position}</h3>
                                                        {
                                                            evolutions[position].map((evolution, eindex) => (
                                                                <a href={`${redirect_url}/view/${evolution.pokemon_id}`} className="text-decoration-none">
                                                                    <Card className={`mx-auto text-center ${evolution.pokemon_id == id ? 'highlight-card' : 'hover-card'}`}  style={{ width: '16rem', border: "solid 1px grey" }} key={eindex}>
                                                                        <Card.Img src={evolution.Pokemon.image_path} alt={evolution.Pokemon.name} className="card-image"  />
                                                                        <Card.Body>
                                                                            <Card.Title>{evolution.Pokemon.name}</Card.Title>
                                                                            <Card.Text>
                                                                                {evolution.ways} possible condition(s) to achieve this evolution<br></br>
                                                                                {evolution.Pokemon.poketypes.split(",").map((poketype, index) => (
                                                                                    <span style={{backgroundColor: types[poketype].colour}} className="pokemon-type-label">#{types[poketype].name}</span>
                                                                                ))}
                                                                            </Card.Text>
                                                                        </Card.Body>
                                                                    </Card>
                                                                </a>
                                                            ))
                                                        }
                                                    </Col>
                                                </Row>
                                            ))
                                        ) : (
                                            <Row className="g-4">
                                                <Col md={12}>
                                                    <h4 className="text-center pokemon-font-solid" style={{ color: "grey" }}>Evolutions Not Found</h4>
                                                </Col>
                                            </Row>
                                        )
                                    }
                                </Col>
                            </React.Fragment>
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

export default View
