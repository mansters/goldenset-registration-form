import { FormItemChildrenProps } from "../FormItem/interface";

export interface InputProps extends FormItemChildrenProps<string> {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  type?: "text" | "password";
}
