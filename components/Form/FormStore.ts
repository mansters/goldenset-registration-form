import { ValidationRule } from "../FormItem/interface";
import { type Store, type FormInstance, type StoredFieldValue, ValidationBehavior, FormProps } from "./interface";
import { validateRule } from "./validators";

class FormStore {
  private store: Record<string, StoredFieldValue> = {};
  private rules: Record<string, ValidationRule[]> = {};
  private listeners = new Set<() => void>();
  private validationBehavior = ValidationBehavior.ONE_BY_ONE;

  /************************************** get/set fields value **************************************/
  private getFieldValue = (name: string) => {
    return this.store?.[name]?.value;
  };

  private getFieldsValue = () => {
    return Object.entries(this.store).reduce((formValue, [fieldName, storedFieldValue]) => {
      formValue[fieldName] = this.getFieldValue(fieldName);
      return formValue;
    }, {} as any);
  };
  private setFieldValue = (name: string, value: any) => {
    if (!this.store[name]) {
      this.store[name] = { value: undefined, errors: [], touched: false };
    }

    this.store[name].value = value;
    this.notify();
  };

  private setFieldsValue = (newStore: Store) => {
    Object.entries(newStore).forEach(([fieldName, value]) => {
      this.setFieldValue(fieldName, value);
    });
  };

  /************************************** get/set error **************************************/
  private getFieldError = (name: string) => {
    return this.store?.[name]?.errors || [];
  };

  private setFieldError = (name: string, errors: string[]) => {
    if (!this.store[name]) {
      this.store[name] = { value: undefined, errors: [], touched: false };
    }
    this.store[name].errors = errors;
    this.notify();
  };

  /************************************** get/set touch **************************************/
  private setFieldTouched = (name: string, touched: boolean) => {
    if (!this.store[name]) {
      this.store[name] = { value: undefined, errors: [], touched: false };
    }

    this.store[name].touched = touched;
    this.notify();
  };

  isFieldTouched = (name: string) => {
    return this.store?.[name]?.touched || false;
  };

  /************************************** validation **************************************/
  private validateField = async (name: string) => {
    const rules = this.rules[name];
    this.store[name].touched = true;

    if (!rules || rules.length === 0) {
      return Promise.resolve();
    }

    const value = this.store[name]?.value;
    const errors: string[] = [];
    const validateAll = this.validationBehavior === ValidationBehavior.ALL;

    if (validateAll) {
      const result = await Promise.allSettled(rules.map((rule) => validateRule(rule, value)));
      result.forEach((item) => {
        if (item.status === "rejected") {
          console.log(item.reason);
          errors.push(item.reason);
        }
      });
    } else {
      for (const rule of rules) {
        try {
          await validateRule(rule, value);
        } catch (e: any) {
          errors.push(e || "error");
          break;
        }
      }
    }

    this.setFieldError(name, errors);
    this.notify();

    return errors.length ? Promise.reject(errors) : Promise.resolve();
  };

  private validateAllFields = async () => {
    const fieldNames = Object.keys(this.store);
    const validationResults = await Promise.allSettled(fieldNames.map((name) => this.validateField(name)));
    const errors = validationResults.flatMap((item) => {
      if (item.status === "rejected") {
        console.log(item.reason);
        return item.reason;
      }

      return [];
    });

    return errors.length ? Promise.reject(errors) : Promise.resolve();
  };

  private reset = () => {
    Object.keys(this.store).forEach((fieldName) => {
      this.store[fieldName].value = undefined;
      this.store[fieldName].touched = false;
      this.store[fieldName].errors = [];
    });

    this.notify();
  };

  private submit = async (onFinish: FormProps["onFinish"], onFinishFailed: FormProps["onFinishFailed"]) => {
    try {
      await this.validateAllFields();
      onFinish?.(this.getFieldsValue());
    } catch {
      onFinishFailed?.();
    }
  };

  /**********************************************************************************************/
  /************************************** For Internal Use **************************************/
  /**********************************************************************************************/

  private notify = () => {
    this.listeners.forEach((listener) => listener());
  };

  public register = (name: string, rules: ValidationRule[], listener: () => void) => {
    if (!this.store[name]) {
      this.store[name] = { value: undefined, errors: [], touched: false };
    }

    this.rules[name] = rules;
    this.listeners.add(listener);

    this.notify();

    return () => {
      this.listeners.delete(listener);
    };
  };

  public registerField = (name: string) => {
    if (!this.store[name]) {
      this.store[name] = { value: undefined, errors: [], touched: false };
      this.notify();
    }
  };

  public unregisterField = (name: string) => {
    delete this.store[name];
    delete this.rules[name];
    this.notify();
  };

  public setRules = (name: string, rules: ValidationRule[]) => {
    this.rules[name] = rules;
  };

  public setValidateBehavior = (validationBehavior: ValidationBehavior) => {
    this.validationBehavior = validationBehavior;
  };

  public getStore = () => {
    return this.store;
  };

  public subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getForm = (): FormInstance => {
    return {
      getFieldValue: this.getFieldValue,
      getFieldsValue: this.getFieldsValue,
      setFieldValue: this.setFieldValue,
      setFieldsValue: this.setFieldsValue,
      getFieldError: this.getFieldError,
      setFieldError: this.setFieldError,
      setFieldTouched: this.setFieldTouched,
      isFieldTouched: this.isFieldTouched,
      validateField: this.validateField,
      validateAllFields: this.validateAllFields,
      submit: this.submit,
      reset: this.reset,
      __register: this.register,
      __setValidateBehavior: this.setValidateBehavior,
      __getStore: this.getStore,
    };
  };
}

export default FormStore;
