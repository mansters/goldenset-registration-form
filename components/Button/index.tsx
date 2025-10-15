import React from "react";
import { ButtonProps } from "./interface";
import "./style.css";

const Button: React.FC<ButtonProps> = ({ children, onClick, type = "default", className = "", disabled = false }) => {
  const buttonClass = `btn btn-${type}`;

  return (
    <button className={`${buttonClass} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
