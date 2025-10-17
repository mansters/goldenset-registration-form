import { EmailDuplicationCheckResultDto, RegisterUserResponseDto, UserRegistrationDto } from "./interface";

const BACKEND_URL = "http://localhost:3001";

export const isEmailRegistered = async (email: string): Promise<EmailDuplicationCheckResultDto> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/check-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: EmailDuplicationCheckResultDto = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking email:", error);
    return {
      duplicate: false,
      errMsg: "Unable to check email. Please try again.",
    };
  }
};

export const registerUser = async (user: UserRegistrationDto): Promise<RegisterUserResponseDto> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: false,
        errMsg: data.errMsg || "Registration failed. Please try again.",
      };
    }

    return {
      status: data.status,
      errMsg: data.errMsg,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      status: false,
      errMsg: "Unable to register. Please check your connection and try again.",
    };
  }
};
