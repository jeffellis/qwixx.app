import React from "react";

import { POINT_VALUES } from "../Constants";

import "./PointsList.scss";

const displayName = "PointsList";

const PointsList = (props) => {
  const values = [];
  for (let i = 1; i <= 12; i++) {
    values.push(getPointValue(i));
  }

  return (
    <div className="PointsList">
      <span>Points:</span>
      {values}
    </div>
  );
};

PointsList.displayName = displayName;

const getPointValue = (value) => {
  return (
    <div className="PointValue" key={value}>
      <div className="Multiplier">{`${value}x`}</div>
      <div className="Value">{POINT_VALUES[value]}</div>
    </div>
  );
};

export default PointsList;
