export type AlertType = "success" | "warning" | "error";

export interface AlertProps {
  type: AlertType;
  message?: string;
  className?: string;
}
