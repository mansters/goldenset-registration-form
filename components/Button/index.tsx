import React from "react";
import { ButtonProps } from "./interface";
import "./style.css";

const Button: React.FC<ButtonProps> = ({ children, onClick, type = "default", className = "", disabled = false, htmlType = "button", loading = false }) => {
  const buttonClass = `btn btn-${type}`;
  const isDisabled = disabled || loading;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button className={`${buttonClass} ${className}`} onClick={handleClick} disabled={isDisabled} type={htmlType}>
      {loading && <span className="btn-loading-spinner" />}
      {children}
    </button>
  );
};

export default Button;
