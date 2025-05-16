import React, {useContext} from "react";
import  {NavLink} from 'react-router-dom';
import { AuthContext } from "../../context/auth-contex";

import './NavLinks.css';

const NavLinks = props =>{
    const auth = useContext(AuthContext);
    return(
        <ul className="nav-links">
            <li>
                <NavLink to="/" exact>All Users</NavLink>
            </li>
            {auth.isLoggedIn&&(<li>
                <NavLink to={`/${auth.userID }/places`}>My Places</NavLink>
            </li>)}
            {auth.isLoggedIn&&(<li>
                <NavLink to="/places/new" exact>Add Places</NavLink>
            </li>)}
            {!auth.isLoggedIn&&(<li>
                <NavLink to="/auth" exact>Authenticate</NavLink>
            </li>)}
            {auth.isLoggedIn && (
                <li>
                    <button onClick={auth.logout}>LOGOUT</button>
                </li>
            )}
        </ul>
    );
};

export default NavLinks;

