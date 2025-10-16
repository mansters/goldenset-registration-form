import { UserRegistrationDto } from "@/service/user/interface";

export interface RegistrationFormSchema extends Omit<UserRegistrationDto, "id"> {
  confirmPassword: string;
}

export interface RegistrationFormStatusMessage {
  type: "success" | "error";
  message?: string;
}
