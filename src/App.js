import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ScoreCard from "./components/ScoreCard";
import WelcomePage from "./components/WelcomePage";
import CreateOrJoinGamePage from './components/CreateOrJoinGamePage'

import GameContext from "./GameContext";
import useGame from "./useGame";

import "./App.scss";

function App() {
  const { completeTurn, currentPlayer, diceValues, gameId, hasRolledOnThisTurn, joinOrCreateGame, myTurn, newGame, numPlayers, players, rollDice } = useGame();

  const gameContext = {
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
