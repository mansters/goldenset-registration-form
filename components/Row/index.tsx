"use client";

import React from "react";
import { RowProps } from "./interface";
import RowContext from "./context";
import "./style.css";

const Row: React.FC<RowProps> = ({ children, gutter = 0, justify = "start", align = "top", className = "" }) => {
  const gutterX = Array.isArray(gutter) ? gutter[0] : gutter;
  const gutterY = Array.isArray(gutter) ? gutter[1] : 0;

  const justifyClass = `row-justify-${justify}`;
  const alignClass = `row-align-${align}`;

  const gutterStyle = gutterX > 0 ? { marginLeft: `-${gutterX / 2}px`, marginRight: `-${gutterX / 2}px` } : {};

  return (
    <RowContext.Provider value={{ gutter: [gutterX, gutterY] }}>
      <div className={`row ${justifyClass} ${alignClass} ${className}`} style={gutterStyle}>
        {children}
      </div>
    </RowContext.Provider>
  );
};

export default Row;
