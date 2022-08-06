import React, { useState } from 'react';
import './CreateNewUser.css';
import { Link, useHistory } from "react-router-dom";
import { registerUser } from '../../axiosJwt/apiCalls';

function CreateNewUser() {

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const register = (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            alert("Please fill all the fields");
        }
        else{
            const userCredentials = {
                username:username, 
                email: email, 
                password: password
            }
            
            // do firebase register
            registerUser(userCredentials)
            .then((data) => {
                if(data.username){
                    alert("You have registered Successfully.")
                    history.push("/login")
                }
                else {
                    alert("Failed to register")
                }
            })
            .catch((err) => console.log(err));
        }
    }

    return (
        <div className="login container-fluid">

            <div className='login__container'>

                <Link to="/" className="login__logo">
                    <a href="{/}"><span className='login__logo__first'>f</span><span>reeway</span></a>
                </Link>

                <h1>Create New Account</h1>

                <form className='login_form'>
                    <h6>Username</h6>
                    <input className="login__formInputs" type='text' value={username} required
                        onChange={e => setUsername(e.target.value)}
                        // placeholder= "Enter your username"
                    />

                    <h6>E-mail</h6>
                    <input className="login__formInputs" type='text' value={email} required
                        onChange={e => setEmail(e.target.value)}
                        // placeholder= "Enter your email-id"
                    />

                    <h6>Password</h6>
                    <input className="login__formInputs" type='password' value={password} required
                        onChange={e => setPassword(e.target.value)}
                        // placeholder= "Enter your password"
                    />

                </form>

                <p>
                    By creating your account you agree to the FREEWAY terms and conditions.
                    The intent to collect data from you is to only identify you,
                    We don't do misuse of user data.
                </p>

                <button onClick={register} className='login__registerButton'>
                    Create your new account
                </button>

            </div>

        </div>
    );
};

export default CreateNewUser;
