import hash from 'hash.js';
import React, { useEffect, useRef, useState } from "react";
import { omit } from "lodash";
import { Route, Switch, useHistory } from 'react-router-dom';

import ScoreCard from "./components/scorecard/ScoreCard";
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
  const history = useHistory();
  
  useEffect(() => {
    const autoLogin = async () => {
      const savedUser = await getUser();
      if (savedUser) {
        login(savedUser);
      }  
    }
    autoLogin();
  }, []);

  const handleAnnouncement = (messages, callback) => {
    timeoutId.current && clearTimeout(timeoutId.current);
    setAnnouncement(messages);
    timeoutId.current = setTimeout(() => {
      setAnnouncement(null);
      timeoutId.current = null;
      callback && callback(messages);
    }, ANNOUNCEMENT_TIMEOUT);
  }

  const onPlayersAdded = (newPlayers) => {
    handleAnnouncement(newPlayers.map((player) => `${player} has joined the game`));
  }

  const onError = (messages) => {
    history.replace('/');
    handleAnnouncement(messages);
  };

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

  const game = useGame({ onError, onPlayersAdded, user: authUser });

  const gameContext = {
    announcement,
    ...game,
  };

  const userContext = {
    authUser,
    createUser,
    login,
    logout,
  };

  return (
    <div className="App">
      <UserContext.Provider value={userContext}>        
        <GameContext.Provider value={gameContext}>
          { announcement && <Announcements messages={announcement}/> }
            <Switch>
              <Route path="/" exact={true} component={MenuPage} />
              <Route path="/login" component={SignOnPage}/>
              <Route path="/new" component={CreateOrJoinGamePage} />
              <Route path="/profile" component={CreateProfilePage} />
              {/* <Route path="/howtoplay" component={HowToPlayPage} /> */}
              {/* <Route path="/leaderboard" component={Leaderboard} /> */}
              <Route path="/:gameId/scorecard" component={ScoreCard} />
            </Switch>
        </GameContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
