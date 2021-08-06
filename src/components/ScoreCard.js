import React from "react";

import AppHeader from "./AppHeader";
import Penalties from "./Penalties";
import PointsList from "./PointsList";
import Row from "./Row.js";
import ScoreCardContext from './ScoreCardContext';
import TotalsRow from "./TotalsRow";
import useScoreCard from "../hooks/useScoreCard";

import "./ScoreCard.scss";
import useGame from "../useGame";

const displayName = "ScoreCard";

const ScoreCard = (props) => {
  const { currentGame, newGame, rollDice } = useGame();

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
    diceValues: currentGame.diceValues,
    onRollDice: rollDice,
  };

  return (
    <ScoreCardContext.Provider value={scoreCardContext}>
      <div className={displayName}>
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
      </div>
    </ScoreCardContext.Provider>
  );
};

export default ScoreCard;
