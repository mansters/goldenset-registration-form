"use client";

import React, { ChangeEvent, useState } from "react";
import classnames from "classnames";
import { InputProps } from "./interface";
import "./style.css";

const Input: React.FC<InputProps> = ({ value, onChange, placeholder, disabled = false, className = "", type = "text" }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  if (isPassword) {
    return (
      <div className="input-wrapper">
        <input type={inputType} value={value || ""} onChange={handleChange} placeholder={placeholder} disabled={disabled} className={classnames("input", "input-with-toggle", className)} />
        <button type="button" className="input-toggle" onClick={togglePasswordVisibility} disabled={disabled} tabIndex={-1}>
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    );
  }

  return <input type={type} value={value || ""} onChange={handleChange} placeholder={placeholder} disabled={disabled} className={classnames("input", className)} />;
};

export default Input;
