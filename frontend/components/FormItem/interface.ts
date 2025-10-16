import { ColProps } from "../Col/interface";

export interface FormItemChildrenProps<T = any> {
  value?: T;
  onChange?(nextValue: T): void;
}

export type FormLayout = "vertical" | "horizontal";

export interface FormSharedConfig {
  layout?: FormLayout;
  labelCol?: Pick<ColProps, "span">;
  wrapperCol?: Pick<ColProps, "span">;
}

export interface ValidationRule {
  type: "required" | "pattern" | "validator";
  message?: string;
  pattern?: RegExp;
  validator?: (value: any) => Promise<void>;
}

export interface FormItemProps<T = any> extends React.PropsWithChildren, FormSharedConfig {
  label?: string;
  name?: string;
  rules?: ValidationRule[];
  classNames?: string;
}
