import React from "react";

import AppHeader from "./AppHeader";
import Penalties from "./Penalties";
import PointsList from "./PointsList";
import Row from "./Row.js";
import TotalsRow from "./TotalsRow";
import useScoreCard from "../hooks/useScoreCard";

import "./ScoreCard.scss";
import { withRouter } from "react-router-dom";

const displayName = "ScoreCard";

const ScoreCard = (props) => {
  const { reset, scores, setPenalties, toggleBox } = useScoreCard();

  const onPenaltyToggle = (penaltyCount) => {
    setPenalties(penaltyCount);
  };

  const onBoxToggled = (color, value) => {
    toggleBox(color, value);
  };

  const onReset = () => {
    reset();
  }

  const onBack = () => {
    props.history.push('/');
  }

  const rowProps = {
    onBoxToggled,
  };

  return (
    <div className={displayName}>
      <AppHeader scoreCard={scores} onBack={onBack} onReset={onReset} />
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
  );
};

export default withRouter(ScoreCard);
