import React from "react";

import Button from "react-bootstrap/Button";

import "./AppHeader.scss";

const displayName = "AppHeader";

const AppHeader = (props) => {
  return (
    <div className={displayName}>
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
