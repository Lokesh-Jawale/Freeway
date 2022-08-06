import React from 'react';
import './Home.css';
import wordcloudheart from '../../images/heartzz.png';
import { Link } from "react-router-dom";
function Home() {

  return (

    <div className="home">


        {/* main content */}
        <div className="container-fluid">
            <div className="row">

                {/* main left */}
                <div className="left col-lg-7">

                    <h1><span>W e l c o m e</span> Give Free, Take Free</h1>
                    <div className="home__info">
                        <p>
                            Starting a mission of free sharing cycle 
                            (with Give free, take free moto in mind)
                            in order to help people, reduce waste and save resources.
                        </p>
                        {/* <h5>How to use freeway?</h5>
                        <ul>
                            <li>Create new Account or Sign in</li>
                            <li>To Donate : visit give tab and fill the form</li>
                            <li>To Get Stuff: Browse and click on 'GET' button of item to message the doner.</li>
                            <li>To find Donated Stuff | Requested Stuff : click on your username</li>
                        </ul> */}
                    </div>

                    <div className="home__buttons">

                        <Link to="/give">
                            <button type="button" className="Buttons btn btn-success">G I V E</button>
                        </Link>

                        <span>  OR  </span>

                        <Link to="/browse">
                            <button type="button" className="Buttons btn btn-primary">B R O W S E</button>
                        </Link>
                        
                    </div>

                </div>

                {/* main right image */}
                <div className="right col-lg-5" >
                {/* style={{backgroundImage: `url(${freewayimg})`, backgroundSize: '100% 100%', padding: "2em"}} */}
                    <img src={wordcloudheart} alt="Image is not available"/>
                </div>

            </div>

        </div>

    </div>

  );
}

export default Home;