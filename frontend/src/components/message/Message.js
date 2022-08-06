import React from 'react';
import './Message.css';
import { useStateValue } from '../../StateProvider';

function Message({sender, message}) {

    const [{user}] = useStateValue();

    return (
        <div className="message">

                {(user?.email === sender) ? (
                    <div className="message__container">
                        <div className="user__message">
                            <span>{message}</span><br/>
                            <p className="message__sender">~{sender}</p>
                        </div>
                    </div>
                ) : (
                    <div className="message__container">
                        <div className="nonUser__message">
                            <span>{message}</span><br/>
                            <p className="message__sender">~{sender}</p>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default Message;
