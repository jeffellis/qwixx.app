import React, { useState } from "react";
import produce, { current } from "immer";

import { STATES, LOCK_COLUMN } from "../Constants";
import { saveScoreCard, getScoreCard } from "../services/DBService";

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

const initialState = produce(
  {
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
  },
  () => {}
);

const markIntermediateBoxes = (row, box, oldState, newState) => {
  let index = row.reversed ? Number(box) + 1 : Number(box) - 1;
  while (index <= 12 && index >= 2 && row.boxState[index] === oldState) {
    row.boxState[index] = newState;
    index += row.reversed ? 1 : -1;
  }
};

const useScoreCard = () => {
  const [scores, setScores] = useState(() => {
    getScoreCard().then((scorecard) => {
      if (scorecard && scorecard.red) {
        setScores(scorecard);
      }
    });
    return initialState;
  });

  const reset = () => {
    setScores(initialState);
    saveScoreCard(null);
  };

  const setPenalties = (penaltyCount) => {
    setScores(
      produce((scores) => {
        scores.penalties = penaltyCount;
        saveScoreCard(current(scores));
      })
    );
  };

  const toggleBox = (color, value) => {
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
        saveScoreCard(current(scores));
      })
    );
  };

  return { reset, scores, setPenalties, toggleBox };
};

export default useScoreCard;
