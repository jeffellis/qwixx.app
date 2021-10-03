import hash from 'hash.js';
import React, { useEffect, useRef, useState } from "react";
import { omit } from "lodash";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ScoreCard from "./components/ScoreCard";
import MenuPage from './components/MenuPage'

import CreateOrJoinGamePage from './components/CreateOrJoinGamePage'
import Announcements from "./components/Announcements";
import { CreateProfilePage, SignOnPage } from "./components/ProfilePage";
import Firebase from './firebase/firebase';
import useAuth from "./firebase/useAuth";

import UserContext from "./UserContext";
import GameContext from "./GameContext";
import useGame from "./useGame";

import "./App.scss";
import { getUser, saveUser } from './services/DBService';

const ANNOUNCEMENT_TIMEOUT = 5000;

const hashPassword = (password) => hash.sha256().update(password).digest('hex');

function App() {
  const timeoutId = useRef();
  const [announcement, setAnnouncement] = useState();
  const authUser = useAuth();
  
  useEffect(() => {
    const autoLogin = async () => {
      const savedUser = await getUser();
      if (savedUser) {
        login(savedUser);
      }  
    }
    autoLogin();
  }, []);

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

  const createUser = async (profile) => {
    const { email, password } = profile;
    const hashedPassword = hashPassword(password);
    const additionalProfileData = omit(profile, ['email', 'password']);
    await Firebase.register(email, hashedPassword, additionalProfileData);
    await saveUser({ email, hashedPassword, ...additionalProfileData });
  };

  const login = async ({ email, hashedPassword, password }) => {
    hashedPassword = hashedPassword || hashPassword(password);
    const user = await Firebase.login(email, hashedPassword);
    return await saveUser({
      displayName: user.displayName,
      email: user.email,
      hashedPassword: hashedPassword,
    })
  };

  const logout = async () => {
    Firebase.logout();
    return await saveUser(null);
  };

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

  const userContext = {
    authUser,
    createUser,
    login,
    logout,
  };
  console.log('user', authUser);
  return (
    <div className="App">
      <UserContext.Provider value={userContext}>        
        <GameContext.Provider value={gameContext}>
          { announcement && <Announcements messages={announcement}/> }
          <BrowserRouter>
            <Switch>
              <Route path="/" exact={true} component={MenuPage} />
              <Route path="/login" component={SignOnPage}/>
              <Route path="/new" component={CreateOrJoinGamePage} />
              <Route path="/profile" component={CreateProfilePage} />
              {/* <Route path="/howtoplay" component={HowToPlayPage} /> */}
              {/* <Route path="/leaderboard" component={Leaderboard} /> */}
              <Route path="/scorecard/:gameId" component={ScoreCard} />
            </Switch>
          </BrowserRouter>
        </GameContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
