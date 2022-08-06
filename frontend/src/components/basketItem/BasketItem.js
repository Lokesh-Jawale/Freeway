import React from 'react';
import './BasketItem.css';
import { useStateValue } from '../../StateProvider';
import {Card, Col} from 'react-bootstrap/';
import { useHistory } from 'react-router-dom';
import { db } from '../../firebase.js';
import firebase from 'firebase';


function BasketItem({id, donatedBy, title, image, description, condition,
                        category, city, state, country}) {

    const [{ basket, user, requestedItemId, requestedItem}, dispatch] = useStateValue();
    const history = useHistory();

    const requestItem = (e) => {
        e.preventDefault();
        // add item to basket

        if(id?.length==0) alert("The id is not valid");
        if(user && id?.length>0){

            var itemData = {
                id: id,
                donatedBy: donatedBy,
                title: title,
                image: image,
                description: description,
                condition: condition,
                category: category,
                city: city,
                state: state,
                country: country,
            };

            dispatch({
                type: 'SET_REQUESTED_ITEM_ID',
                requestedItemId: id,
            })

            dispatch({
                type: 'SET_REQUESTED_ITEM',
                requestedItem: itemData,
            })

            history.push('/itemMessage');
        }
        else{
            alert('Please sign in to get the item : ' + title);
        }
    };

    const renderCondition = () => {
        switch(condition) {
            case "1":
              return "Fine";
            case "2":
                return "Good";
            case "3":
                return "Very Good";
            case "4":
                return "Excellent"
            default:
              return "Fine";
        }
    }

    return (
        <div className="item">
            <Col className="item__container">
                <Card className="item__card">
                    <Card.Img className="item__image" variant="top" src={image || "http://via.placeholder.com/150x250"} />
                    <Card.Body className="item__info">
                        <Card.Title className="item__title">{title}</Card.Title>

                        <Card.Text className="item__description">{description}</Card.Text>

                        <Card.Text className="item__extraInfo">
                            <div><span>Location </span> : {city}, {state}, {country} </div>
                            <div><span>Condition </span> : {renderCondition()} </div>
                        </Card.Text> 

                        <button type="button" className="item__button Buttons btn btn-primary btn-sm" onClick={requestItem}>
                            G E T
                        </button>
                        {/* <DeleteForeverIcon onClick={event => db.collection('todos').doc(props.todo.id).delete()}/> */}

                    </Card.Body>
                </Card>
            </Col>
        </div>
    );
}

export default BasketItem;
