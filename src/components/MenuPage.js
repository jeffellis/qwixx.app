import { Button } from "react-bootstrap";
import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import GameContext from "../GameContext";
import UserContext from "../UserContext";

const listItemClassNames = "btn btn-primary btn-sm list-group-item list-group-item-action";
const disabledListItemClassNames = `${listItemClassNames} disabled`;

const MenuPage = () => {
    const { gameId } = useContext(GameContext);
    const { authUser, logout } = useContext(UserContext);
    const history = useHistory();

    const signOff = () => {
        logout();
        history.push('/');
    };

    return (
        <div className="app-page WelcomePage">
            <h2>Qwixx</h2>
            <div className="actionList list-group-flush">
                {gameId && <Link className={listItemClassNames} to={`/${gameId}/scorecard`}>Return to Game</Link>}
                <Link className={authUser ? listItemClassNames : disabledListItemClassNames } to="/new">Create or Join a Game</Link>
                <Link className={disabledListItemClassNames} to="/howtoplay">How To Play</Link>
                {authUser ?
                    <Button className={listItemClassNames} variant="link" onClick={signOff}>{`Logout (${authUser.displayName})`}</Button> :
                    <Link className={listItemClassNames} to="/login">Sign In</Link> 
                }
            </div>
        </div>    
    );
}
 
export default MenuPage;