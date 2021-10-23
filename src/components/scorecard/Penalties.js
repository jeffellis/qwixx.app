import React from "react";

import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

import "./Penalties.scss";

const CHECKED_BOXES = [[], [1], [1, 2], [1, 2, 3], [1, 2, 3, 4]];
const displayName = "Penalties";

const Penalties = (props) => {
  const onBoxToggled = (checkedValues) => {
    props.onBoxToggled(checkedValues.length);
  };

  const toggleButtonGroupProps = {
    type: "checkbox",
    onChange: onBoxToggled,
    value: CHECKED_BOXES[props.penalties],
  };

  return (
    <div className={`${displayName}`}>
      <span className="PenaltyText">Penalties (-5 for each)</span>
      <ToggleButtonGroup {...toggleButtonGroupProps}>
        {getToggleButton(1)}
        {getToggleButton(2)}
        {getToggleButton(3)}
        {getToggleButton(4)}
      </ToggleButtonGroup>
    </div>
  );
};

Penalties.displayName = displayName;

const getToggleButton = (value) => {
  const checkboxProps = {
    size: "lg",
    type: "checkbox",
    variant: "outline-danger",
    value,
  };

  return <ToggleButton {...checkboxProps} />;
};

export default Penalties;
