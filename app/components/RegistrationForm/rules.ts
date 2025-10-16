import { ValidationRule } from "@/components/FormItem/interface";
import { RegistrationFormSchema } from "./interface";
import { debounce } from "lodash";
import { isEmailRegistered } from "@/service/user";
import * as Regular from "@/utils/regular";

const isEmailRegisteredDebounce = debounce(isEmailRegistered, 300);

const rules: Record<keyof Omit<RegistrationFormSchema, "confirmPassword">, ValidationRule[]> = {
  firstName: [{ type: "required", message: "Please fill in your first name" }],
  lastName: [{ type: "required", message: "Please fill in your last name" }],
  email: [
    { type: "required", message: "Please fill in your email" },
    {
      type: "validator",
      async validator(value) {
        if (!Regular.email.test(value)) {
          return Promise.reject("Please input correct email");
        }

        const response = await isEmailRegisteredDebounce(value);
        if (response?.duplicate) {
          return Promise.reject(response.errMsg || "the email has been registered");
        }

        return Promise.resolve();
      },
    },
  ],
  password: [
    { type: "required", message: "Please fill in your password" },
    {
      type: "validator",
      validator(value) {
        if (!Regular.password.test(value)) {
          return Promise.reject("Password must be between 8 and 30 character, having at least one lower case, one upper case, one number, and one special character");
        }

        return Promise.resolve();
      },
    },
  ],
};

export default rules;
