import React from "react";

import ScoreCard from "./components/ScoreCard";
import firebase from "./firebase/firebase";
import FirebaseContext from "./firebase/FirebaseContext";

import "./App.scss";

function App() {

  const firebaseContext = {
    firebase,
  };

  return (
    <FirebaseContext.Provider value={firebaseContext}>
      <div className="App">
        <ScoreCard />
      </div>
    </FirebaseContext.Provider>
  );
}

export default App;
