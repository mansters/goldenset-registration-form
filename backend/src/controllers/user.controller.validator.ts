import { Validator } from "../utils/validator/interface";
import * as Regular from "../utils/regular";

export class RequiredFieldsValidator implements Validator {
  validate(data: any) {
    const required = ["firstName", "lastName", "email", "password"];
    const missing = required.filter((field) => !data[field]?.trim?.());

    if (missing.length > 0) {
      return { valid: false, code: 400, error: `Missing fields: ${missing.join(", ")}` };
    }
    return { valid: true };
  }
}

export class EmailRequiredValidator implements Validator {
  validate(data: any) {
    if (!data.email) {
      return { valid: false, code: 400, error: "Email is required" };
    }
    return { valid: true };
  }
}

export class EmailFormatValidator implements Validator {
  validate(data: any) {
    if (!Regular.email.test(data.email)) {
      return { valid: false, code: 400, error: "Only Gmail are supported" };
    }
    return { valid: true };
  }
}

export class PasswordStrengthValidator implements Validator {
  validate(data: any) {
    const { password } = data;

    if (!Regular.password.test(password)) {
      return {
        valid: false,
        code: 400,
        error: "Password must be between 8 and 30 character, having at least one lower case, one upper case, one number, and one special character",
      };
    }

    return { valid: true };
  }
}
