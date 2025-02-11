import React, {useContext, useEffect, useState} from 'react'
import {Container, Row, Col, Card, Form} from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar'
import axios from "axios";
import {AuthContext} from "../authContext";

const Homepage = () => {

    const api_url = process.env.REACT_APP_BACKEND_URL
    const redirect_url = process.env.REACT_APP_FRONTEND_URL

    const [PokemonResponseRecieved, setPokemonResponseStatus] = useState(false);                    //included for checking if response from API was successful
    const [PoketypeResponseRecieved, setPoketypeResponseStatus] = useState(false);
    const [FavoritesResponseRecieved, setFavoritesResponseStatus] = useState(false);

    const [data, setData] = useState([]);                                                             //state variables for loading data from APIs
    const [types, setTypes] = useState([]);
    const [favs, setFaves] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = useContext(AuthContext);                                                                         //Loading user data from logged in session

    useEffect(() => {
        const loadPokemon = async () => {                                                                //Loading pokemon data from API
            axios.get(`${api_url}/api/pokemon/list`).then((response) => {
                setData(response.data);
                setPokemonResponseStatus(true);
            }).catch((err) => {
                setPokemonResponseStatus(true);
            });
            console.log('Completed');
        };

        const loadPokemonTypes = async () => {                                                           //Loading pokemon types from API
            axios.get(`${api_url}/api/poketype/list`).then((response) => {
                setTypes(response.data);
                setPoketypeResponseStatus(true);
            }).catch((err) => {
                setPoketypeResponseStatus(true);
            });
            console.log('Completed');
        };

        const loadFavorites = async () => {                                                              //Loading user pokemon favorites from API
            axios.get(`${api_url}/api/favorites/list/${user.dataValues.id}`).then((response) => {
                let favorites = []
                response.data.map(fav => favorites.push(fav.poke_id))
                setFaves(favorites);
                setFavoritesResponseStatus(true);
            }).catch((err) => {
                setFavoritesResponseStatus(true);
            });
        }

        loadPokemonTypes();
        loadPokemon();
        loadFavorites();
    }, []);


    const filteredData = searchTerm.toLowerCase() === 'favorite'                                                // search filter logic
        ? data.filter(item => favs.includes(item.id))                                                                 // if search term = favorite, then filter by favorite included pokemon IDs
        : data.filter(item =>                                                                                         // else filter by specified name or type
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
                            <p style={{backgroundColor: "#85ff00"}}
                               className="pokemon-type-label search-filter"
                               key={-1}
                               onClick={(e) => setSearchTerm('')}
                            >
                                #viewall
                            </p>
                            <p style={{backgroundColor: "#000000", color: "white"}}
                               className="pokemon-type-label search-filter"
                               key={0}
                               onClick={(e) => setSearchTerm('favorite')}
                            >
                                #favorite<span style={{color: "red"}}>&hearts;</span>
                            </p>
                            {types.map((item, index) => (
                                <p style={{backgroundColor: item.colour}}
                                   className="pokemon-type-label search-filter"
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
                                            {item.type.map((type, tindex) => (
                                                <span style={{backgroundColor: type.colour}} className="pokemon-type-label" key={tindex}>
                                                    #{type.name}
                                                </span>
                                            ))}
                                            {
                                                favs.includes(item.id) ?
                                                    <span style={{backgroundColor: "#000000", color: "white"}} className="pokemon-type-label" key={-1}>
                                                        #favorite<span style={{color: "red"}}>&hearts;</span>
                                                    </span>
                                                : ''
                                            }
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
