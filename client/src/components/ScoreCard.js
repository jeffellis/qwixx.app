import React, { useState } from "react";
import produce from "immer";

import { STATES, LOCK_COLUMN } from "../Constants";

import PointsList from "./PointsList";
import Row from "./Row.js";
import "./ScoreCard.scss";
import Penalties from "./Penalties";

const INITIAL_ROW_STATE = {
  2: STATES.OPEN,
  3: STATES.OPEN,
  4: STATES.OPEN,
  5: STATES.OPEN,
  6: STATES.OPEN,
  7: STATES.OPEN,
  8: STATES.OPEN,
  9: STATES.OPEN,
  10: STATES.OPEN,
  11: STATES.OPEN,
  12: STATES.OPEN,
  [LOCK_COLUMN]: STATES.OPEN,
};

const displayName = "ScoreCard";
const initialState = {
  red: {
    boxState: { ...INITIAL_ROW_STATE },
  },
  yellow: {
    boxState: { ...INITIAL_ROW_STATE },
  },
  green: {
    boxState: { ...INITIAL_ROW_STATE },
    reversed: true,
  },
  blue: {
    boxState: { ...INITIAL_ROW_STATE },
    reversed: true,
  },
  penalties: 0,
};

const markIntermediateBoxes = (row, box, oldState, newState) => {
  let index = row.reversed ? Number(box) + 1 : Number(box) - 1;
  while (index <= 12 && index >= 2 && row.boxState[index] === oldState) {
    row.boxState[index] = newState;
    index += row.reversed ? 1 : -1;
  }
};

const ScoreCard = (props) => {
  const [scores, setScores] = useState(initialState);

  const onPenaltyToggle = (penaltyCount) => {
    setScores(
      produce((scores) => {
        scores.penalties = penaltyCount;
      })
    );
  };

  const onBoxToggled = (color, value) => {
    setScores(
      produce((scores) => {
        const row = scores[color];

        switch (row.boxState[value]) {
          case STATES.WON:
            scores[color].boxState[value] = STATES.OPEN;
            markIntermediateBoxes(
              scores[color],
              value,
              STATES.BLOCKED,
              STATES.OPEN
            );
            break;
          case STATES.OPEN:
            scores[color].boxState[value] = STATES.WON;
            markIntermediateBoxes(
              scores[color],
              value,
              STATES.OPEN,
              STATES.BLOCKED
            );
            break;
          default:
            // Leave unchanged
            break;
        }
      })
    );
  };

  const rowProps = {
    onBoxToggled,
  };

  return (
    <div className={displayName}>
      <h1>QWIXX.APP</h1>
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
    </div>
  );
};

export default ScoreCard;
