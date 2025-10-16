import { ValidationRule } from "../FormItem/interface";
import { isEmpty } from "lodash";

export async function validateRule(rule: ValidationRule, value: any): Promise<void> {
  return {
    required: () => validateRequired(value, rule.message),
    pattern: () => validatePattern(value, rule.pattern, rule.message),
    validator: () => validateCustom(value, rule.validator),
  }[rule.type]?.();
}

function validateRequired(value: any, message?: string) {
  if (isEmpty(value)) {
    return Promise.reject(message || "This field is required");
  }
  return Promise.resolve();
}

function validatePattern(value: any, pattern?: RegExp, message?: string) {
  if (!pattern || isEmpty(value)) {
    return Promise.resolve();
  }

  if (!pattern.test(value?.toString?.())) {
    return Promise.reject(message || "Invalid format");
  }

  return Promise.resolve();
}

async function validateCustom(value: any, validator?: (value: any) => Promise<void>) {
  if (!validator) {
    return Promise.resolve();
  }

  return validator(value);
}
