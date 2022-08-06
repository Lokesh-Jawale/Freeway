import React, {useEffect, useState, useRef} from 'react';
import './ItemMessage.css';
import { db } from '../../firebase.js';
import { useStateValue } from '../../StateProvider';
import Message from '../message/Message.js';
import { Row } from "react-bootstrap";
import { Button, FormControl, Input, InputLabel} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import BasketItem from '../basketItem/BasketItem';
import { io } from "socket.io-client";
import { addConversation, addMessage, getMessages } from '../../axiosJwt/apiCalls';

function ItemMessage() {

    const [{ user, requestedItemId, requestedItem, inProcessItems }, dispatch] = useStateValue();
    const [inputMessage, setInputMessage] = useState('');
    const [requestMessages, setRequestMessages] = useState([]);
    const [newMessage, setNewMessage] = useState(null);
    const [loadMessages, setLoadMessages] = useState(null)
    const [loading, setLoading] = useState(true);

    const divRef = useRef(null);
    const socket = useRef();
    const history = useHistory();

    var options = {
        rememberUpgrade:true,
        transports: ['websocket', 'polling', 'flashsocket'],
        secure:true, 
        rejectUnauthorized: false
    }

    useEffect(() => {
        socket.current = io("https://freeway0.herokuapp.com", options)

        requestedItemId && localStorage.setItem("requestedItemId", requestedItemId)
        !requestedItemId && dispatch({
            type: 'SET_REQUESTED_ITEM_ID',
            requestedItemId: localStorage.getItem("requestedItemId"),
        })

        !requestedItemId && history.push("/browse")
        
        // joining a room
        socket.current.emit("join-room", requestedItemId)

        socket.current.on("get-message", (data) => {
            setNewMessage({
              senderId: data.senderId,
              conversationId: data.roomId,
              senderEmail: data.senderEmail,
              message: data.message,
            });
        });

        !loadMessages && setLoadMessages(true)
    }, [])

    useEffect(() => {
        divRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start"
        });
    }, [requestMessages]);

    useEffect(() => {
        // requesting messages of the current requested item id
        getMessages(requestedItemId, user.accessToken)
        .then((data) => {
            setRequestMessages(data)
            setLoading(false)
        })        
        .catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }, [loadMessages])

    useEffect(() => {
        if(newMessage){
            setRequestMessages([...requestMessages, newMessage])
        }
    }, [newMessage])

    const sendMessage = (e) => {
        e.preventDefault();
        if(requestedItemId?.length > 0){
            var messageData = {
                conversationId: requestedItemId,
                senderId: user?._id,
                message: inputMessage,
                senderEmail: user?.email,
            };

            setRequestMessages([...requestMessages, messageData]);
            setInputMessage('');

            const data = JSON.stringify(messageData)
            addMessage(data, user.accessToken)
            .then((res) => {
                socket.current.emit('send-message', 
                    user?._id,
                    user?.email,
                    requestedItemId,
                    inputMessage,
                )
            })
            .catch((err) => {
                alert("Internal Server Error while saving the message")
                console.log(err)
            })
        }
    };

    return (
        <div className="row itemMessage container-fluid">
            <hr/>
            <h1>Messages</h1>

            <div className="itemMessage__itemReview col-md-4">
                <BasketItem
                    id= {requestedItem.id}
                    donatedBy= {requestedItem.donatedBy}
                    title= {requestedItem.title}
                    image= {requestedItem.image}
                    description= {requestedItem.description}
                    condition= {requestedItem.condition}
                    category= {requestedItem.category}
                    city= {requestedItem.city}
                    state= {requestedItem.state}
                    country= {requestedItem.country}
                />
            </div>
            
            <div className="itemMessage__container col-md-8">

                    {/* All messages in group chat*/}
                    {(requestMessages?.length > 0)
                        ?
                        <div className="itemMessage__messages">
                            
                            <Row xs={1} md={1} lg={1} className="itemMessage__message">
                                {requestMessages?.map(item => (
                                    <div ref={divRef} >
                                        <Message
                                            sender= {item.senderEmail}
                                            message= {item.message}
                                        />
                                    </div>
                                ))}
                            </Row>
                        </div>
                        :
                        
                        <div className="itemMessage__messages messages__loading">
                            {loading
                                ? ( <div className="spinner-border text-primary"></div> )
                                :
                                ( <div className="itemMessage__messages">There are no messages yet </div>)
                            }
                        </div>
                    }

                <div className="itemMessage__compose">
                    <form>
                        <FormControl className="itemMessage__form">
                            <InputLabel className="itemMessage__input">Type a message...</InputLabel>
                            <Input value={inputMessage} onChange={event => setInputMessage(event.target.value)}/>
                            <Button className="itemMessage__button" type='submit' disabled={!inputMessage} onClick= {sendMessage} variant="contained" color="primary">
                                SEND
                            </Button>
                        </FormControl>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default ItemMessage;

