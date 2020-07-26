import React from "react";

import "./TotalsRow.scss";

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
        <div className="TotalText">{totals.total > 0 ? totals.total : " "}</div>
      </div>
    </div>
  );
};

export default TotalsRow;

const getTotals = (scorecard) => {
  const totals = {
    red: 0,
    yellow: 0,
    green: 0,
    blue: 0,
    penalties: 0,
    total: 0,
  };

  return totals;
};
