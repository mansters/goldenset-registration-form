import { Validator, ValidatorResult } from "./interface";

export class ValidatorChain {
  private validators: Validator[] = [];

  add(validator: Validator): ValidatorChain {
    this.validators.push(validator);
    return this;
  }

  validate(data: any): ValidatorResult {
    for (const validator of this.validators) {
      const result = validator.validate(data);
      if (!result.valid) {
        return result;
      }
    }

    return { valid: true };
  }
}
