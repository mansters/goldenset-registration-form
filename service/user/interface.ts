export interface UserRegistrationDto {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface EmailDuplicationCheckResultDto {
  duplicate: boolean;
  errMsg?: string;
}

export interface RegisterUserResponseDto {
  status: boolean;
  errMsg?: string;
}
