import { createContext } from "react";
import { RowContextValue } from "./interface";

const RowContext = createContext<RowContextValue>({ gutter: [0, 0] });

export default RowContext;
