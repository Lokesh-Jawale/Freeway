import React, {useState, useEffect} from 'react';
import './Browse.css';
import {Navbar, Nav, Row, NavDropdown, NavItem, Form, FormControl, Button } from 'react-bootstrap/';
import { Link, useHistory } from "react-router-dom";
import {useStateValue} from '../../StateProvider.js';
import BasketItem from '../basketItem/BasketItem.js';
import SearchIcon from '@material-ui/icons/Search';
import {Helmet} from 'react-helmet';
import { getItems } from '../../axiosJwt/apiCalls';

function Browse() {

    const [{basket, user}, dispatch] = useStateValue();
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(true);
    const [tempBasket, setTempBasket] = useState([]);

    useEffect(() => {
        // make a request for getting all items.
        getItems()
        .then((res) => {
            if(res.status == 200){
                dispatch({
                    type: "ADD_TO_ALL",
                    item: res.data,
                })
                setTempBasket(res.data)
            }
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
            console.log(err)
        })

    }, [])
    

    const sortByCity = (e) => {
        e.preventDefault();
        setTempBasket([]);
        setLoading(true);
        
        const filteredCityItems = basket.filter(item => city?.toUpperCase() === item?.city?.toUpperCase());
        setTempBasket(filteredCityItems);
        setLoading(false);
    };

    const handleCitySort = (e) => {
        if (e.keyCode === 13) {sortByCity(e)}
    };

    return (
        <div className="browse">

            <Helmet>
                <title>freeway | Browse</title>
            </Helmet>

            <div className="browse__container">
                <Navbar className="browse__nav" collapseOnSelect expand="lg">
                    <Navbar.Brand className="browse__header">Browse</Navbar.Brand>
                    <Navbar.Toggle className="justify-content-end" aria-controls="responsive-navbar-nav" />

                    <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
                        <Nav>
                            <NavItem className="mt-2 browse__searchBox">
                                <Form className="d-flex browse__searchBox">
                                    <FormControl
                                        type="search"
                                        placeholder="Search by city"
                                        className="browse__searchInput"
                                        value={city}
                                        onChange= {e => setCity(e.target.value.trim())}
                                        onKeyPress={handleCitySort}
                                        aria-label="Search"
                                    />
                                    {/* <Button variant="outline-success">Search</Button> */}
                                    <button 
                                        type="submit" 
                                        disabled={!city} 
                                        onClick={sortByCity}
                                        className="browse__searchButton Buttons btn btn-primary"
                                    >
                                        <SearchIcon />
                                    </button>

                                </Form>
                            </NavItem>

                            {/* <NavDropdown className="browse__sortBy mt-2" title="Sort by" id="collasible-nav-dropdown">
                                <NavDropdown.Item onClick={sortByConditionAsc}>Condition Asc</NavDropdown.Item>
                                <NavDropdown.Item onClick={sortByConditionDesc}>Condition Desc</NavDropdown.Item>
                            </NavDropdown> */}
                            
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <div className="browse__itemContainer row">
                    {tempBasket?.length === 0 ? (
                        <div>
                            {loading
                                ? (<div className="browse__itemsLoading">
                                    <div className="spinner-border text-primary"></div> 
                                </div>)
                                :
                                (<div> 
                                    <h2>There are no items currently.</h2>
                                    <p>Try selecting your city or wait till someone donates something.</p>
                                </div>)
                            }
                        </div>
                    ) : (
                        <div>
                            {/* list of all checkout products */}
                            <Row xs={1} md={2} lg={3} xl={4} className="g-4 browse__itemRow">
                                {tempBasket.map(item => (
                                    <BasketItem
                                        id= {item._id}
                                        donatedBy= {item.donatedBy}
                                        title= {item.title}
                                        image= {item.image}
                                        description= {item.description}
                                        condition= {item.condition}
                                        category= {item.category}
                                        city= {item.city}
                                        state= {item.state}
                                        country= {item.country}
                                    />
                                ))}
                            </Row>

                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}

export default Browse;