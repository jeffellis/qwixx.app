import React from "react";

import "./TotalsRow.scss";
import { LOCK_COLUMN, STATES, POINT_VALUES, PENALTY } from "../Constants";

const displayName = "TotalsRow";

const TotalsRow = (props) => {
  const totals = getTotals(props.scorecard);

  return (
    <div className={displayName}>
      <span>Totals:</span>
      <div className="Total Total-red">
        <div className="TotalText">{totals.red > 0 ? totals.red : " "}</div>
      </div>
      <span className="plus">+</span>
      <div className="Total Total-yellow">
        <div className="TotalText">
          {totals.yellow > 0 ? totals.yellow : " "}
        </div>
      </div>
      <span className="plus">+</span>
      <div className="Total Total-green">
        <div className="TotalText">{totals.green > 0 ? totals.green : " "}</div>
      </div>
      <span className="plus">+</span>
      <div className="Total Total-blue">
        <div className="TotalText">{totals.blue > 0 ? totals.blue : " "}</div>
      </div>
      <span className="minus">-</span>
      <div className="Total Total-penalty">
        <div className="TotalText">
          {totals.penalties > 0 ? totals.penalties : " "}
        </div>
      </div>
      <span className="equals">=</span>
      <div className="Total Total-grandTotal">
        <div className="TotalText">
          {totals.total !== 0 ? totals.total : " "}
        </div>
      </div>
    </div>
  );
};

export default TotalsRow;

const getTotals = (scorecard) => {
  const totals = {
    red: getScore(scorecard.red.boxState),
    yellow: getScore(scorecard.yellow.boxState),
    green: getScore(scorecard.green.boxState),
    blue: getScore(scorecard.blue.boxState),
    penalties: scorecard.penalties * PENALTY,
  };

  totals.total =
    totals.red + totals.yellow + totals.green + totals.blue - totals.penalties;

  return totals;
};

const getScore = (boxState) => {
  let count = 0;
  for (let i = 2; i < LOCK_COLUMN; i++) {
    count += boxState[i] === STATES.WON ? 1 : 0;
  }

  return POINT_VALUES[count];
};
