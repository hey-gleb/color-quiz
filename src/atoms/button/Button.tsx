import React from 'react';

import './Button.css';


interface Props extends React.HTMLProps<HTMLButtonElement> {
  className?: string;
  type?: "submit" | "reset" | "button"
}

const Button: React.FC<Props> = props => {
  const {className, ...otherProps} = props;

  return <button className={`button ${className}`} {...otherProps}/>
}

export default Button;