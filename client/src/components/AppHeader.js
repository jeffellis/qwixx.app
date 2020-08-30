import React from "react";

import Button from "react-bootstrap/Button";
import Dice from "./Dice";

import "./AppHeader.scss";

const displayName = "AppHeader";

const AppHeader = (props) => {
  return (
    <div className={displayName}>
      <Dice scoreCard={props.scoreCard} />
      <span className="Title">QWIXX.APP</span>
      <Button
        className="ResetButton"
        variant="secondary"
        onClick={props.onReset}
      />
    </div>
  );
};

export default AppHeader;
