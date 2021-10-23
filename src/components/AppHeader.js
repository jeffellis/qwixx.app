import React from "react";

import Dice from "./Dice";

import "./AppHeader.scss";
import TurnInfo from "./TurnInfo";
import BackButton from "./BackButton";

const displayName = "AppHeader";

const AppHeader = (props) => {
  return (
    <div className={displayName}>
      <BackButton />
      <Dice scoreCard={props.scoreCard} />
      <TurnInfo />
      <button className="btn btn-link ResetButton" onClick={props.onReset} type="button"/>
    </div>
  );
};

export default AppHeader;
