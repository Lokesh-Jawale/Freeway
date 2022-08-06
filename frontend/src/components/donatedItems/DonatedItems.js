import React, {useEffect} from 'react';
import './DonatedItems.css';
import { Row } from 'react-bootstrap/';
import {useStateValue} from '../../StateProvider.js';
import BasketItem from '../basketItem/BasketItem.js';
import { getItems } from '../../axiosJwt/apiCalls';

function DonatedItems() {

    const [{donatedItems, user}, dispatch] = useStateValue();

    useEffect(() => {
        // get all times filtered according to the "donated By"
        // apiCalls.getDonatedItems()
        getItems()
        .then((res) => {
            if(res.status == 200){
                dispatch({
                    type: "ADD_TO_ALL",
                    item: res.data,
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
    }, [])
    

    return (
        <div className="donatedItems">

            <div className="donatedItems__container row">
                <h3>Your Donated Items : </h3>
                {donatedItems?.length === 0 ? (
                    <div>
                        <h4>You haven't donated anything yet.</h4>
                        <p>Donate things that you don't need anymore or you don't use much to the people in need</p>
                    </div>
                ) : (
                    <div>
                        {/* list of all checkout products */}
                        <Row xs={1} md={2} lg={4} className="g-4">
                            {donatedItems.map(item => (
                                <BasketItem
                                    id= {item.id}
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
                            {/* <DeleteForeverIcon onClick={event => db.collection('basket').doc(id).delete()}/> */}
                        </Row>
                    </div>
                )}

            </div>
        </div>
    )
}

export default DonatedItems;
