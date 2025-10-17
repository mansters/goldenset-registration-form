export interface ValidatorResult {
  valid: boolean;
  code?: number;
  error?: string;
}

export interface Validator {
  validate(data: any): ValidatorResult;
}
