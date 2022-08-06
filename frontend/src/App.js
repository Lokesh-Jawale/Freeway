import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Header from './components/header/Header.js';
import Footer from './components/footer/Footer.js';
import Browse from './components/browse/Browse.js';
import Give from './components/give/Give.js';
import Home from './components/home/Home.js';
import Login from './pages/login/Login.js';
import CreateNewUser from './pages/createUser/CreateNewUser';
import About from './components/about/About.js';
import RequestedItems from './components/requestedItems/RequestedItems.js';
import DonatedItems from './components/donatedItems/DonatedItems.js';
import ItemMessage from './components/itemMessage/ItemMessage.js';
import { useStateValue } from './StateProvider';
import { Helmet } from 'react-helmet';
import axios from "axios";
import jwt_decode from "jwt-decode";
import { axiosJWT } from './axiosJwt/AxiosJWT';

axios.defaults.baseURL = 'https://freeway0.herokuapp.com/api/'

function App() {
    const [{basket, user}, dispatch] = useStateValue();

    const refreshToken = async () => {
		try {
			const res = await axios.post("/refresh", { user: user });
            const userData = {
                ...user,
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
            }
            dispatch({
                type: 'SET_USER',
                user: userData
            })
            localStorage.setItem("user", JSON.stringify(userData));

			return res.data;
		} catch (err) {
		  	console.log(err);
		}
	};

	axiosJWT.interceptors.request.use(
		async (config) => {
            const accessToken = JSON.parse(localStorage.getItem("user"))?.accessToken
            if(!accessToken){
                return config;
            }
            // console.log("Request Intercepted ")
            
			const currentDate = new Date()
			const decodedToken = jwt_decode(accessToken);
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                const data = await refreshToken();
                config.headers["authorization"] = "Bearer " + data.accessToken;
            }
            return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

    useEffect(() => {
        try{
            const userData = JSON.parse(localStorage.getItem("user"))
            dispatch({
                type: "SET_USER",
                user: userData,
            })
        }
        catch(err){}

    }, [])

    return (
        <div className="App">
            <Helmet>
                <title>freeway.com</title>
            </Helmet>
            <Router>
                {/* Route paths */}
                <Switch>
                    <Route exact path="/">
                        <Header />
                        <Home />
                        <About />
                        <Footer />
                    </Route>

                    <Route exact path="/browse">
                        <Header />
                        <Browse />
                        <About />
                        <Footer />
                    </Route>

                    <Route exact path="/give">
                        <Header />
                        <Give />
                        <About />
                        <Footer />
                    </Route>

                    <Route exact path="/login">
                        <Login />
                    </Route>

                    <Route exact path="/createNewUser">
                        <CreateNewUser />
                    </Route>

                    <Route exact path="/requestedItems">
                        <Header />
                        <RequestedItems />
                        <About />
                        <Footer />
                    </Route>

                    <Route exact path="/itemMessage">
                        <Header />
                        <ItemMessage />
                        <About />
                        <Footer />
                    </Route>

                    <Route exact path="/donatedItems">
                        <Header />
                        <DonatedItems />
                        <About />
                        <Footer />
                    </Route>
                    
                </Switch>

            </Router>

        </div>
    );
}

export default App;