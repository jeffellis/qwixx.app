import React, { useState } from "react";

import { initDB } from "./services/DBService";
import ScoreCard from "./components/ScoreCard";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <ScoreCard />
    </div>
  );
}

export default App;
