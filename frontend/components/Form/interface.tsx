import { FormSharedConfig, ValidationRule } from "../FormItem/interface";

export type FieldValue = any;
export type StoredFieldValue = { value: FieldValue; touched: boolean; errors: string[] };
export type Store = Record<string, StoredFieldValue>;
export type ForceUpdateListener = () => void;
export type ForceUpdateListenerUnsubscriber = () => void;

export interface FormInstance<FormValues = any> {
  getFieldValue: (name: string) => FieldValue;
  getFieldsValue: () => FormValues;
  setFieldValue: (name: string, value: any) => void;
  setFieldsValue: (newStore: Record<string, any>) => void;
  getFieldError: (name: string) => string[];
  setFieldError: (name: string, errors: string[]) => void;
  setFieldTouched: (name: string, touched: boolean) => void;
  isFieldTouched: (name: string) => boolean;
  validateField: (name: string) => Promise<void>;
  validateAllFields: () => Promise<void>;
  submit: (onFinish: FormProps["onFinish"], onFinishFailed: FormProps["onFinishFailed"]) => Promise<FormValues>;
  reset: () => void;
  // for internal
  __register: (name: string, rules: ValidationRule[], listener: ForceUpdateListener) => ForceUpdateListenerUnsubscriber;
  __setValidateBehavior: (validationBehavior: ValidationBehavior) => void;
  __getStore: () => Record<string, StoredFieldValue>;
}

export enum ValidationBehavior {
  ALL = "ALL",
  ONE_BY_ONE = "ONE_BY_ONE",
}

export interface FormProps<FormValues = any> extends React.PropsWithChildren, FormSharedConfig {
  form?: FormInstance<FormValues>;
  validationBehavior?: ValidationBehavior;
  onFinish?: (values: FormValues) => void;
  onFinishFailed?: () => void;
}
