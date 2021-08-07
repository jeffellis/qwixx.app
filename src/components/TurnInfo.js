import React, { useContext } from 'react';
import GameContext from '../GameContext';

import './TurnInfo.scss';

const TurnInfo = () => {
    const { completeTurn, currentPlayer, myTurn, numPlayers } = useContext(GameContext);

    const getTitle = () => {
        return <span className="Title">QWIXX.APP</span>            

    };

    const getTurnDetails = () => {
        return (
            <>
                <div className="TurnInfo">
                    <p>Players: {numPlayers}</p>
                    {myTurn
                        ? <p>It's your turn</p>
                        : <p>{currentPlayer.name} is playing</p>
                    }
                </div>
                {myTurn && <button className="btn btn-outline-dark CompleteTurnButton" onClick={completeTurn} />}
            </>
        );
    };

    return (
        <div className="TurnInfoContainer">
            { !currentPlayer ? getTitle() : getTurnDetails() }
        </div>
     );
}
 
export default TurnInfo;