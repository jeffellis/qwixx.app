import React from "react";

import Dice from "./Dice";

import TurnInfo from "./TurnInfo";
import BackButton from "../BackButton";

import "./ScoreCardHeader.scss";

const displayName = "ScoreCardHeader";

const ScoreCardHeader = (props) => {
  return (
    <div className={displayName}>
      <BackButton />
      <Dice scoreCard={props.scoreCard} />
      <TurnInfo />
      <button className="btn btn-link ResetButton" onClick={props.onReset} type="button"/>
    </div>
  );
};

export default ScoreCardHeader;
