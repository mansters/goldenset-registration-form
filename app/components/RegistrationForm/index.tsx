"use client";
import useForm from "@/components/Form/useForm";
import FormItem from "@/components/FormItem";
import Input from "@/components/Input";
import { RegistrationFormSchema, RegistrationFormStatusMessage } from "./interface";
import Form from "@/components/Form";
import Button from "@/components/Button";
import { useCallback, useMemo, useState } from "react";
import rules from "./rules";
import { ValidationRule } from "@/components/FormItem/interface";
import { FormProps } from "@/components/Form/interface";
import { registerUser } from "@/service/user";
import { omit } from "lodash";

const RegistrationForm = () => {
  const [instance] = useForm<RegistrationFormSchema>();
  const [message, setMessage] = useState<RegistrationFormStatusMessage | null>(null);

  const confirmPasswordRules = useMemo<ValidationRule[]>(
    () => [
      { type: "required", message: "Please fill in the confirmation of password" },
      {
        type: "validator",
        validator: (value) => {
          if (value === instance.getFieldValue("password")) {
            return Promise.resolve();
          }

          return Promise.reject("Password confirmation does not match.");
        },
      },
    ],
    []
  );

  const handleSubmit = useCallback<Required<FormProps<RegistrationFormSchema>>["onFinish"]>(async (formSchema) => {
    try {
      const response = await registerUser(omit(formSchema, ["confirmPassword"]));
      if (response.status) {
        setMessage({
          type: "success",
          message: "Registration Successful",
        });
      } else {
        throw new Error(response.errMsg);
      }
    } catch (e: any) {
      setMessage({
        type: "error",
        message: e?.message || e || "Oops! Something went wrong on our end. Please try again later or contact the administrator for further support.",
      });
    }
  }, []);

  const handleReset = useCallback(() => {
    instance.reset();
    setMessage(null);
  }, []);

  return (
    <div>
      <Form form={instance} onFinish={handleSubmit}>
        <FormItem label="First Name" name="firstName" rules={rules.firstName}>
          <Input />
        </FormItem>
        <FormItem label="Last Name" name="lastName" rules={rules.lastName}>
          <Input />
        </FormItem>
        <FormItem label="Email" name="email" rules={rules.email}>
          <Input />
        </FormItem>
        <FormItem label="Password" name="password" rules={rules.password}>
          <Input type="password" />
        </FormItem>
        <FormItem label="Confirm Password" name="confirmPassword" rules={confirmPasswordRules}>
          <Input type="password" />
        </FormItem>

        <FormItem>
          <div className="space-x-4">
            <Button onClick={handleReset}>Reset</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </FormItem>
      </Form>
    </div>
  );
};

export default RegistrationForm;
