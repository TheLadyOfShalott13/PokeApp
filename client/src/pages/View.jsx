import React, {useContext, useEffect, useState} from 'react'
import {Container, Row, Col, Card, Button} from 'react-bootstrap';
import {useParams} from "react-router-dom";
import NavigationBar from '../components/NavigationBar'
import {AuthContext} from "../authContext";
import axios from "axios";


const View = () => {


    const {id}          = useParams();                                                                           //pokemon ID
    const api_url       = process.env.REACT_APP_BACKEND_URL
    const redirect_url  = process.env.REACT_APP_FRONTEND_URL
    const { user }             = useContext(AuthContext);                                                               //logged in users details


    const [isFavorite, setFavoriteStatus]                               = useState(false);            //boolean value to store if the selected pokemon is a user favorite or not
    const [PokemonResponseRecieved, setPokemonResponseStatus]           = useState(false);            //boolean value to store if the pokemon details request was processed or not
    const [PoketypeResponseRecieved, setPoketypeResponseStatus]         = useState(false);            //boolean value to store if the poketype list fetching was processed or not
    const [PokevolutionResponseRecieved, setPokevolutionResponseStatus] = useState(false);            //boolean value to store if the selected pokemon's evolution chain details was processed or not
    const [pokemon, setPokemon]                                           = useState([]);               //state variable to store selected pokemon details
    const [evolutions, setEvolutions]                                     = useState([]);               //state variable to store evolution chain details
    const [types, setTypes]                                                  = useState({});               //state variable to store associative array of pokemon types (key = poketype's ID)


    useEffect(() => {

        /**
         * Function to fetch evolution chain grouped by position
         * @param chain_id (Selected Pokemon's evolution chain ID)
         * @returns {Promise<void>}
         */
        const loadEvolutions = async (chain_id) => {
            axios.get(`${api_url}/api/pokevolution/grouped/${chain_id}`).then((response) => {
                setEvolutions(response.data);
                setPokevolutionResponseStatus(true);
            }).catch((err) => {
                setPokevolutionResponseStatus(true);
                console.log(err);
            });
            console.log('Completed');
        };

        /**
         * Function to fetch pokemon details
         * @returns {Promise<void>}
         */
        const loadPokemon = async () => {
            axios.get(`${api_url}/api/pokemon/get/${id}`).then((response) => {
                setPokemon(response.data);
                setPokemonResponseStatus(true);
                loadEvolutions(response.data[0].pokechain_id);
            }).catch((err) => {
                setPokemonResponseStatus(true);
                console.log(err);
            });
            console.log('Completed');
        };

        /**
         * Function to fetch poketypes from API
         * @returns {Promise<void>}
         */
        const loadPokemonTypes = async () => {
            axios.get(`${api_url}/api/poketype/list`).then((response) => {
                const typesData = {};
                response.data.forEach( type => typesData[type.id] = type );
                setTypes(typesData);
                setPoketypeResponseStatus(true);
            }).catch((err) => {
                setPoketypeResponseStatus(true);
                console.log(err);
            });
            console.log('Completed');
        };

        /**
         * Function to set boolean value on whether selected pokemon is a user favorite or not
         * @returns {Promise<void>}
         */
        const checkFavorite = async () => {
            try {
                const response = await axios.post(
                    `${api_url}/api/favorites/check`,
                    { poke_id: id, user_id: user.dataValues.id },
                    { headers: { "Content-Type": "application/json" } }
                );
                setFavoriteStatus(response.data.favorite_status);
            } catch (err) {
                console.log(err);
            }
        }

        loadPokemon();
        loadPokemonTypes();
        checkFavorite();

    }, [id, api_url, user.dataValues.id]);


    /**
     * Function to favorite or unfavorite selected pokemon
     * Dependency to state variable:- isFavorite
     * @param pokemon_id
     * @returns {Promise<boolean|{favorite_status: boolean}>}
     */
    const setFavorite = async (pokemon_id) => {
        try {
            if (!isFavorite) {
                const response = await axios.post(
                    `${api_url}/api/favorites/add`,
                    { poke_id: pokemon_id, user_id: user.dataValues.id },
                    { headers: { "Content-Type": "application/json" } }
                );
                console.log(response);
                await setFavoriteStatus(true);
                return {favorite_status: true};
            }
            else {
                const response = await axios.post(
                    `${api_url}/api/favorites/remove`,
                    { poke_id: pokemon_id, user_id: user.dataValues.id },
                    { headers: { "Content-Type": "application/json" } }
                );
                console.log(response);
                await setFavoriteStatus(false);
                return {favorite_status: false};
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }


    return (
        <div>
            <NavigationBar />
            <div className="main-body">
                <Container>
                    <Row xs={2} md={4} className="g-4">
                        {pokemon.length > 0 ? (pokemon.map((item, index) => (
                            <React.Fragment key={index}>
                                <Col md={4} className="justify-content-center" key="summary">
                                    <h1 className="text-center mb-4 pokemon-details-header">Current Pokemon</h1>
                                    <Card className="selected-pokemon-card">
                                        <Card.Img src={item.image_path} alt={item.name} className="card-image"  />
                                        <Card.Body>
                                            <Card.Text>
                                                <span className="pokemon-details-text text-left">
                                                    <span className="pokemon-font-outline">Name:</span>
                                                    <span className="pokemon-font-solid">{item.name}</span>
                                                </span>
                                                <span className="pokemon-details-text text-left">
                                                    <span className="pokemon-font-outline">Poke-api ID:</span>
                                                    {item.identifier}
                                                </span>
                                                <span className="pokemon-details-text text-left">
                                                    <span className="pokemon-font-outline">Evolution Chain ID:</span>
                                                    {item.pokechain_id}
                                                </span>
                                                <span className="pokemon-details-text text-left">
                                                    <span className="pokemon-font-outline">Pokemon Types:</span>
                                                    {
                                                        item.type.map((type) => (                                       //Iterating through the selected pokemon's poketypes and displaying them along with assigned colours
                                                            <span style={{backgroundColor: type.colour}} className="pokemon-type-label">#{type.name}</span>
                                                        ))
                                                    }
                                                    {
                                                        isFavorite ?                                                    //Adding the label to indicate whether user favorite or not
                                                            (
                                                                <span className="pokemon-type-label favorites-label" key={-1}>
                                                                    #favorite
                                                                    <span style={{color: "red"}}>&hearts;</span>
                                                                </span>
                                                            )
                                                            : ""
                                                    }
                                                </span>
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Footer >
                                            {
                                                isFavorite ?                                                            // Favorite/unFavorite action button
                                                    (
                                                        <Button variant="dark" size="lg" onClick={() => setFavorite(item.id)}>Remove from favorites</Button>
                                                    )
                                                    : (
                                                        <Button variant="dark" size="lg" onClick={() => setFavorite(item.id)}>Add to favorites</Button>
                                                    )
                                            }
                                        </Card.Footer>
                                    </Card>
                                </Col>
                                <Col md={8} className="justify-content-center" key="evolutions">
                                    <Row className="g-4 mb-4">
                                        <Col md={12}>
                                            <h1 className="text-center pokemon-details-header">Evolution Chart</h1>
                                        </Col>
                                    </Row>
                                    {
                                        PokevolutionResponseRecieved ? (
                                            Object.keys(evolutions).map((position, index) => (
                                                <Row className="g-4 justify-content-center mb-5" key={index}>
                                                    <Col md={12} className="justify-content-center">
                                                        <h3 className="text-center pokemon-font-outline" style={{ color: "black" }}>STAGE {position}</h3>
                                                        {
                                                            //iterating through the pokemon evolutions per position
                                                            evolutions[position].map((evolution, eindex) => (
                                                                    <Card className={`evolution-card mx-auto text-center ${evolution.pokemon_id == id ? 'highlight-card' : 'hover-card'}`} key={eindex}>
                                                                        <a href={`${redirect_url}/view/${evolution.pokemon_id}`} className="text-decoration-none">
                                                                            <Card.Img src={evolution.Pokemon.image_path} alt={evolution.Pokemon.name} className="card-image"  />
                                                                            <Card.Body>
                                                                                <Card.Title>{evolution.Pokemon.name}</Card.Title>
                                                                                <Card.Text>
                                                                                    {evolution.ways} possible condition(s) to achieve this evolution<br></br>
                                                                                    {
                                                                                        //iterating through evolution stage pokemon's poketypes
                                                                                        evolution.Pokemon.poketypes.split(",").map((poketype) => (
                                                                                            <span style={{backgroundColor: types[poketype].colour}} className="pokemon-type-label">
                                                                                                #{types[poketype].name}
                                                                                            </span>
                                                                                        ))
                                                                                    }
                                                                                </Card.Text>
                                                                            </Card.Body>
                                                                        </a>
                                                                    </Card>
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
