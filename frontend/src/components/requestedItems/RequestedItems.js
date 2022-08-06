import React, {useEffect, useState} from 'react';
import './RequestedItems.css';
import { Row } from 'react-bootstrap/';
import {useStateValue} from '../../StateProvider.js';
import BasketItem from '../basketItem/BasketItem.js';
import firebase from "firebase";
import { db } from '../../firebase.js';
import { getItems } from '../../axiosJwt/apiCalls';

function RequestedItems() {

    const [{ user, requestedItems }, dispatch] = useStateValue();

    useEffect(() => {
        // get all times filtered according to the "requesed By user"
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
        <div className="requestedItems">
            {/* <p>The items that you have requeseted (or messaged in other words)</p> */}

            <div className="requestedItems__container row">
                <h3>Your Requested Items : </h3>

                {requestedItems?.length === 0 ? (
                    <div>
                        <h4>You haven't requested anything yet.</h4>
                        <p>Request items you need and when you message them to get it, the item will appear here</p>
                    </div>
                ) : (
                    <div>
                        {/* list of all checkout products */}
                        <Row xs={1} md={2} lg={4} className="g-4">
                            {requestedItems.map(item => (
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

export default RequestedItems;
