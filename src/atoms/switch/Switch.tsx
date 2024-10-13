import React from "react";
import cn from "classnames";

import "./Switch.css";

interface SwitchOptionDetails {
  value: string;
  label: string;
}

interface Props {
  className?: string;
  options: SwitchOptionDetails[];
  onCheck: (value: string) => void;
}

const Switch: React.FC<Props> = (props) => {
  const { className = "", onCheck, options } = props;

  const [currentChecked, setCurrentChecked] = React.useState(
    options[0].value || "",
  );

  const onClickHandler = (value: string) => {
    setCurrentChecked(value);
    onCheck(value);
  };

  return (
    <div className={cn("switch-container", { [className]: !!className })}>
      <div className="switch">
        <div className="switch-toggle"></div>
        {options.map(({ value, label }, index) => (
          <SwitchOption
            key={index}
            isChecked={value === currentChecked}
            value={value}
            label={label}
            onClick={onClickHandler}
          />
        ))}
      </div>
    </div>
  );
};

interface SwitchOptionProps {
  value: string;
  label: string;
  onClick: (value: string) => void;
  isChecked: boolean;
}

const SwitchOption: React.FC<SwitchOptionProps> = (props) => {
  const { onClick, isChecked, value, label } = props;

  return (
    <div
      className={`switch-option ${isChecked ? "active" : ""}`}
      onClick={() => onClick(value)}
    >
      {label}
    </div>
  );
};

export default Switch;
