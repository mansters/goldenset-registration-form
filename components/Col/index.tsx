"use client";

import React, { useContext, useMemo } from "react";
import { ColProps } from "./interface";
import "./style.css";
import RowContext from "../Row/context";

const Col: React.FC<ColProps> = ({ children, span = 24, className = "" }) => {
  const { gutter } = useContext(RowContext);

  const spanClass = `col col-${span}`;

  const style = useMemo<React.CSSProperties>(() => {
    const style: React.CSSProperties = {};
    const [gutterX, gutterY] = gutter;

    if (gutterX > 0) {
      style.paddingLeft = `${gutterX / 2}px`;
      style.paddingRight = `${gutterX / 2}px`;
    }

    if (gutterY > 0) {
      style.paddingTop = `${gutterY / 2}px`;
      style.paddingBottom = `${gutterY / 2}px`;
    }

    return style;
  }, []);

  return (
    <div className={`${spanClass} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Col;
