import React from "react";
import cn from "classnames";

import "./ProgressBar.css";

interface Props {
  className?: string;
  value: number;
  total: number;
}

const ProgressBar: React.FC<Props> = (props) => {
  const { className = "", value, total } = props;

  return (
    <div className={cn("progress-bar", { [className]: !!className })}>
      <div
        className={"progress-fill"}
        style={{ width: `${(value / total) * 100}%` }}
      />
    </div>
  );
};

export default ProgressBar;
