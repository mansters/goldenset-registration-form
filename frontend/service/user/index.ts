import { EmailDuplicationCheckResultDto, RegisterUserResponseDto, UserRegistrationDto } from "./interface";

export const isEmailRegistered = async (email: string): Promise<EmailDuplicationCheckResultDto> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === "test@gmail.com") {
        resolve({ duplicate: true, errMsg: "test@gmail.com has been registered." });
      } else {
        resolve({ duplicate: false });
      }
    }, 800);
  });
};

export const registerUser = (user: UserRegistrationDto): Promise<RegisterUserResponseDto> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (user.email === "error@gmail.com") {
        resolve({ status: false, errMsg: "Internal failure" });
      } else {
        resolve({ status: true });
      }
    }, 800);
  });
};
