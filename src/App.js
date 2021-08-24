import React, { useRef, useState } from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ScoreCard from "./components/ScoreCard";
import WelcomePage from "./components/WelcomePage";
import CreateOrJoinGamePage from './components/CreateOrJoinGamePage'

import GameContext from "./GameContext";
import useGame from "./useGame";

import "./App.scss";
import Announcements from "./components/Announcements";

const ANNOUNCEMENT_TIMEOUT = 5000;

function App() {
  const timeoutId = useRef();
  const [announcement, setAnnouncement] = useState();
  
  const handleAnnouncement = (messages) => {
    timeoutId.current && clearTimeout(timeoutId.current);
    setAnnouncement(messages);
    timeoutId.current = setTimeout(() => {
      setAnnouncement(null);
      timeoutId.current = null;
    }, ANNOUNCEMENT_TIMEOUT);
  }

  const onPlayersAdded = (newPlayers) => {
    handleAnnouncement(newPlayers.map((player) => `${player} has joined the game`));
  }

  const {
    completeTurn,
    currentPlayer,
    diceValues,
    gameId,
    hasRolledOnThisTurn,
    joinOrCreateGame,
    myTurn,
    newGame,
    numPlayers,
    players,
    rollDice
  } = useGame({ onPlayersAdded });

  const gameContext = {
    announcement,
    completeTurn,
    currentPlayer,
    diceValues,
    gameId,
    hasRolledOnThisTurn,
    joinOrCreateGame,
    newGame,
    myTurn,
    numPlayers,
    players,
    rollDice,
  };

  return (
    <div className="App">
      <GameContext.Provider value={gameContext}>
        { announcement && <Announcements messages={announcement}/> }
        <BrowserRouter>
          <Switch>
            <Route path="/" exact={true} component={WelcomePage} />
            <Route path="/new" component={CreateOrJoinGamePage} />
            {/* <Route path="/howtoplay" component={HowToPlayPage} /> */}
            {/* <Route path="/leaderboard" component={Leaderboard} /> */}
            <Route path="/scorecard/:gameId" component={ScoreCard} />
          </Switch>
        </BrowserRouter>
      </GameContext.Provider>
    </div>
  );
}

export default App;
