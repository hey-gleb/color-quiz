import React from "react";
import cn from "classnames";

import Button, { Props as ButtonProps } from "../button/Button";

import "./HintButton.css";

const HintButton: React.FC<ButtonProps> = (props) => {
  const { className = "", ...otherProps } = props;

  return (
    <Button
      className={cn("hint-button", { [className]: !!className })}
      {...otherProps}
    />
  );
};

export default HintButton;
