import React, {useState} from 'react';
import './Header.css';
import {Navbar, Nav, NavItem, NavDropdown} from 'react-bootstrap/';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Link, NavLink, useHistory } from "react-router-dom";
import { useStateValue } from '../../StateProvider';
import { auth } from '../../firebase.js';
import { logoutUser } from '../../axiosJwt/apiCalls';

function Header() {

	const history = useHistory();
	const [{basket, user}, dispatch] = useStateValue();
	const [clicked, setClicked] = useState(false);
	const [dropDown, setDropDown] = useState(false);

	const logout = () => {
		if(user){
			// logout the user
			logoutUser(user.accessToken, user.email)
			.then((statusCode) => {
				if(statusCode == 200){
					// Sign-out successful.
					setDropDown(false);
					setClicked(false);

					alert("You have logged out successfully");
					history.push('/login');
					dispatch({
						type: "SET_USER",
						user: null
					})
					localStorage.removeItem("user");
				}
				else {
					alert("Failed to logout the User")
				}
			})
			.catch(function(error) {
				// Failed to Sign-out
				alert("Failed to logout the User");
			});
		}
	};

	const donatedItemsClicked = (e) => {
		setClicked(!clicked);
		setDropDown(!dropDown);
		history.push('/donatedItems');
	};

	const requestedItemsClicked = (e) => {
		setClicked(!clicked);
		setDropDown(!dropDown);
		history.push('/requestedItems');
	};

	const handleClick = (e) => {
		setClicked(false);
		setDropDown(false);
	}
	
	return(
  
		<div className="header">
			
			<header>
				<Link to="/" className="header__logo">
					<a href="{/}"><span className="header__logo__first">f</span><span>reeway</span></a>
				</Link>

				<nav>
					<ul className={(clicked) ? "header__nav__links" : "header__nav__links close"}>
						<li>
							<NavLink exact activeClassName="active" to="/" className="inactive" onClick={handleClick}>
								Home
							</NavLink>
						</li>

						<li>
							<NavLink exact activeClassName="active" to="/browse" className="inactive" onClick={handleClick}>
								Browse
							</NavLink>
						</li>

						<li>
							<NavLink exact activeClassName="active" to="/give" className="inactive" onClick={handleClick}>
								Give
							</NavLink>
						</li>

						<li>
							{user ? 
								(<div className="dropdown">
									<a className="dropbtn" onClick={e => {setDropDown(!dropDown)}}>
										{user.username} <span> </span>
										<i className="fa fa-caret-down"></i>
									</a>
									<div className={(dropDown) ? "dropdown-content" : "dropdown-content close"}>
										<a onClick={donatedItemsClicked}>Donated Items</a>
										<a onClick={requestedItemsClicked}>Requested Items</a>
										<a onClick={logout}>Sign out</a>
									</div>
								</div> )
								:
								<NavLink to="/login" className="inactive">
									Sign in
								</NavLink>
							}
						</li>
					</ul>

					{/* toggle button */}
					<label className="checkbtn" onClick={e => {setClicked(!clicked)}}>
						<AccountCircleIcon style={{ fontSize: 40 }} />
					</label>

				</nav>
			</header>

		</div>
	)
}

export default Header;
