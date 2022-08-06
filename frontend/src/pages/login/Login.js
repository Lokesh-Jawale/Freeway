import React, { useState } from 'react';
import './Login.css';
import { Link, useHistory } from "react-router-dom";
import { loginUser } from '../../axiosJwt/apiCalls';
import { useStateValue } from '../../StateProvider';

function Login() {

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [{basket, user}, dispatch] = useStateValue();
    
    const signIn = e => {
        e.preventDefault();

        loginUser(email, password)
        .then((res) => {
            if(res.status === 200){
                const data = res.data
                const userData = {
                    ...data.user,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                };

                dispatch({
                    type: 'SET_USER',
                    user: userData,
                })
                
                localStorage.setItem("user", JSON.stringify(userData));
                alert("You have Logged in successfully")
                history.push('/');
            }
            else {
                alert("Failed to login user")
            }
        })
        .catch(error => {alert(error)});
    };

    return (
        <div className="login container-fluid">

            <div className='login__container'>

                <Link to="/" className="login__logo">
                    <a href="{/}"><span className='login__logo__first'>f</span><span>reeway</span></a>
                </Link>

                <h1>Sign-in</h1>

                <form className='login_form'>
                    <h6>E-mail</h6>
                    <input className="login__formInputs" type='text' value={email} 
                    onChange={e => setEmail(e.target.value)}/>

                    <h6>Password</h6>
                    <input className="login__formInputs" type='password' value={password} 
                    onChange={e => setPassword(e.target.value)}/>

                    <button type='submit' className='login__signInButton' onClick={signIn}>
                        Sign In
                    </button>
                </form>

                {/* <p className="login__forgotPassword" onClick={forgotPassword}>
                    forgot password?
                </p> */}

                <p className="login__tnc">
                    By signing-in you agree to the FREEWAY terms and conditions.
                    The intent to collect data from you is to only identify you,
                    We don't do misuse of user data.
                </p>

                <Link to="/createNewUser">
                    <button className='login__registerButton'>
                        Create your new account
                    </button>
                </Link>

            </div>

        </div>
    );
};

export default Login;
