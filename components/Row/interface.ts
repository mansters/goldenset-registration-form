export interface RowProps extends React.PropsWithChildren {
  gutter?: number | [number, number];
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "top" | "middle" | "bottom" | "stretch";
  className?: string;
}

export interface RowContextValue {
  gutter: [number, number];
}
