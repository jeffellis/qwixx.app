import React from "react";

import ReactDice from "react-dice-complete";
import "react-dice-complete/dist/react-dice-complete.css";

import { BLACK, BLUE, GREEN, RED, YELLOW, WHITE } from "../Constants";

import "./Dice.scss";

const displayName = "Dice";

const dice = {
  white: {
    dotColor: BLACK,
    faceColor: WHITE,
    numDice: 2,
    ref: null,
  },
  red: {
    dotColor: WHITE,
    faceColor: RED,
    numDice: 1,
    ref: null,
  },
  yellow: {
    dotColor: WHITE,
    faceColor: YELLOW,
    numDice: 1,
    ref: null,
  },
  green: {
    dotColor: WHITE,
    faceColor: GREEN,
    numDice: 1,
    ref: null,
  },
  blue: {
    dotColor: WHITE,
    faceColor: BLUE,
    numDice: 1,
    ref: null,
  },
};

const Dice = (props) => {
  return (
    <div className="DiceContainer" onClick={rollDice}>
      {getDice("white")}
      {props.scoreCard.red.locked == false ? getDice("red") : null}
      {props.scoreCard.yellow.locked == false ? getDice("yellow") : null}
      {props.scoreCard.green.locked == false ? getDice("green") : null}
      {props.scoreCard.blue.locked == false ? getDice("blue") : null}
    </div>
  );
};

Dice.displayName = displayName;

const getDice = (key) => {
  const props = {
    defaultRoll: 6,
    dieSize: 35,
    margin: 8,
    numDice: 1,
    rollTime: 1.5,
    ...dice[key],
    ref: (_dice) => (dice[key].ref = _dice),
  };
  return <ReactDice {...props} />;
};

const rollDice = () => {
  dice.white.ref.rollAll();
  dice.red.ref && dice.red.ref.rollAll();
  dice.yellow.ref && dice.yellow.ref.rollAll();
  dice.green.ref && dice.green.ref.rollAll();
  dice.blue.ref && dice.blue.ref.rollAll();
};

export default Dice;
