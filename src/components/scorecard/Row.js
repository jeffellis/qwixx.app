import React from "react";

import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

import "./Row.scss";
import { STATES, LOCK_COLUMN } from "../../Constants";

const displayName = "Row";

const Row = (props) => {
  const onBoxToggled = (event) => {
    props.onBoxToggled(props.color, event.target.value);
  };

  const getButtons = () => {
    const buttonProps = {
      active: false,
      onChange: onBoxToggled,
      size: "lg",
      type: "checkbox",
      variant: "outline-primary",
    };

    const buttons = [];
    for (let i = 2; i <= 12; i++) {
      const extraProps = {
        className: `btn-${props.boxState[i]} btn-${i}`,
        key: i,
        value: i,
      };

      switch (props.boxState[i]) {
        case STATES.BLOCKED:
        case STATES.LOCKED:
          extraProps.disabled = true;
          break;

        case STATES.WON:
          extraProps.checked = true;
          break;

        default:
          break;
      }

      buttons.push(
        <ToggleButton {...buttonProps} {...extraProps}>
          {i}
        </ToggleButton>
      );
    }

    if (props.reversed) {
      buttons.reverse();
    }

    const lockButtonProps = {
      ...buttonProps,
      className: `btn-${props.boxState[LOCK_COLUMN]} btn-lock`,
      key: LOCK_COLUMN,
      value: LOCK_COLUMN,
    };

    buttons.push(<ToggleButton {...lockButtonProps}>&nbsp;</ToggleButton>);

    return buttons;
  };

  const toggleButtonGroupProps = {
    type: "checkbox",
  };

  return (
    <div className={`${displayName} ${displayName}-${props.color}`}>
      <ToggleButtonGroup {...toggleButtonGroupProps}>
        {getButtons(props)}
      </ToggleButtonGroup>
    </div>
  );
};

export default Row;
