import { MouseEvent } from "react";

export type ButtonType = "default" | "primary";

export interface ButtonProps extends React.PropsWithChildren {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: ButtonType;
  className?: string;
  disabled?: boolean;
}
