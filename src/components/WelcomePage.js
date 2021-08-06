import React from "react";
import { Link } from "react-router-dom";

const listItemClassNames = "btn btn-primary btn-sm list-group-item list-group-item-action";
const disabledListItemClassNames = `${listItemClassNames} disabled`;

const WelcomeScreen = () => {
    return (
        <div className="app-page WelcomePage">
            <h2>Qwixx</h2>
            <div className="actionList list-group-flush">
                <Link className={listItemClassNames} to="/new">Create or Join a Game</Link>
                <Link className={disabledListItemClassNames} to="/howtoplay">How To Play</Link>
                <Link className={disabledListItemClassNames} to="/leaderboard">Leaderboard</Link>
                <Link className={disabledListItemClassNames} to="/profile">Create a Profile</Link>
            </div>
        </div>    
    );
}
 
export default WelcomeScreen;