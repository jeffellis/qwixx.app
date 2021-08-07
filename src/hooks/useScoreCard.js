import { useState } from "react";
import produce, { current } from "immer";

import { STATES, LOCK_COLUMN, WINS_NEEDED_TO_LOCK_ROW } from "../Constants";
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
  12: STATES.DISABLED,
  [LOCK_COLUMN]: STATES.UNLOCKED,
};

const INITIAL_REVERSED_ROW_STATE = {
  ...INITIAL_ROW_STATE,
  2: STATES.DISABLED,
  12: STATES.OPEN,
};

const initialState = produce(
  {
    red: {
      boxState: { ...INITIAL_ROW_STATE },
      locked: false,
      winCount: 0,
    },
    yellow: {
      boxState: { ...INITIAL_ROW_STATE },
      locked: false,
      winCount: 0,
    },
    green: {
      boxState: { ...INITIAL_REVERSED_ROW_STATE },
      locked: false,
      reversed: true,
      winCount: 0,
    },
    blue: {
      boxState: { ...INITIAL_REVERSED_ROW_STATE },
      locked: false,
      reversed: true,
      winCount: 0,
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

  const getFinalBox = (row) => (row.reversed ? "2" : "12");

  const markBoxWon = (row, value) => {
    row.boxState[value] = STATES.WON;
    row.winCount++;
    markIntermediateBoxes(row, value, STATES.OPEN, STATES.BLOCKED);

    const finalBox = getFinalBox(row);
    if (value === finalBox) {
      row.boxState[LOCK_COLUMN] = STATES.WON;
      row.winCount++;
      row.locked = true;
    } else if (row.winCount >= WINS_NEEDED_TO_LOCK_ROW) {
      row.boxState[finalBox] = STATES.OPEN;
    }
  };

  const markBoxOpen = (row, value) => {
    row.boxState[value] = STATES.OPEN;
    row.winCount--;
    markIntermediateBoxes(row, value, STATES.BLOCKED, STATES.OPEN);

    const finalBox = getFinalBox(row);
    if (value === finalBox) {
      row.boxState[LOCK_COLUMN] = STATES.UNLOCKED;
      row.winCount--;
      row.locked = false;
    } else if (row.winCount < WINS_NEEDED_TO_LOCK_ROW) {
      row.boxState[finalBox] = STATES.DISABLED;
    }
  };

  const lockRowForOtherPlayer = (row) => {
    const finalBox = getFinalBox(row);
    row.locked = true;
    row.boxState[LOCK_COLUMN] = STATES.LOCKED;
    row.boxState[finalBox] = STATES.BLOCKED;
    markIntermediateBoxes(row, finalBox, STATES.OPEN, STATES.BLOCKED);
  };

  const unlockRowForOtherPlayer = (row) => {
    const finalBox = getFinalBox(row);
    row.locked = false;
    row.boxState[LOCK_COLUMN] = STATES.UNLOCKED;
    row.boxState[finalBox] =
      row.winCount < WINS_NEEDED_TO_LOCK_ROW ? STATES.DISABLED : STATES.OPEN;
    markIntermediateBoxes(row, finalBox, STATES.BLOCKED, STATES.OPEN);
  };

  const toggleBox = (color, value) => {
    setScores(
      produce((scores) => {
        const row = scores[color];

        switch (row.boxState[value]) {
          case STATES.DISABLED:
            break;
          case STATES.LOCKED:
            unlockRowForOtherPlayer(row);
            break;
          case STATES.OPEN:
            if (Number(value) !== LOCK_COLUMN) {
              markBoxWon(row, value);
            }
            break;
          case STATES.UNLOCKED:
            lockRowForOtherPlayer(row);
            break;
          case STATES.WON:
            if (Number(value) !== LOCK_COLUMN) {
              markBoxOpen(row, value);
            }
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

export const countWonBoxes = (row) => {
  let count = 0;
  for (let i = 2; i <= LOCK_COLUMN; i++) {
    count += row.boxState[i] === STATES.WON ? 1 : 0;
  }
  return count;
};

export default useScoreCard;
