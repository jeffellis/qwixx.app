import React, { useContext } from "react";

import AppHeader from "./AppHeader";
import Penalties from "./Penalties";
import PointsList from "./PointsList";
import Row from "./Row.js";
import GameContext from '../GameContext';
import TotalsRow from "./TotalsRow";
import useScoreCard from "../hooks/useScoreCard";

import "./ScoreCard.scss";

import ScoreCardContext from "./ScoreCardContext";

const displayName = "ScoreCard";

const ScoreCard = (props) => {
  const { diceValues, myTurn, newGame, rollDice } = useContext(GameContext);

  const { reset, scores, setPenalties, toggleBox } = useScoreCard();

  const onPenaltyToggle = (penaltyCount) => {
    setPenalties(penaltyCount);
  };

  const onBoxToggled = (color, value) => {
    toggleBox(color, value);
  };

  const onReset = () => {
    newGame();
    reset();
  }

  const rowProps = {
    onBoxToggled,
  };

  const scoreCardContext = {
    diceValues,
    myTurn,
    onRollDice: rollDice,
  };

  return (
    <div className={displayName}>
      <ScoreCardContext.Provider value={scoreCardContext}>
        <AppHeader scoreCard={scores} onReset={onReset} />
        <Row color="red" {...rowProps} {...scores.red} />
        <Row color="yellow" {...rowProps} {...scores.yellow} />
        <Row color="green" {...rowProps} {...scores.green} />
        <Row color="blue" {...rowProps} {...scores.blue} />
        <div className="PointsAndPenalties">
          <PointsList />
          <Penalties
            penalties={scores.penalties}
            onBoxToggled={onPenaltyToggle}
          />
        </div>
        <TotalsRow scorecard={scores} />
      </ScoreCardContext.Provider>
    </div>
  );
};

export default ScoreCard;
