import { Request, Response } from "express";
import * as UserModel from "../models/user.model";
import * as Regular from "../utils/regular";
import { ValidatorChain } from "../utils/validator";
import { EmailFormatValidator, EmailRequiredValidator, PasswordStrengthValidator, RequiredFieldsValidator } from "./user.controller.validator";

export const checkEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const validatorChain = new ValidatorChain().add(new EmailRequiredValidator()).add(new EmailFormatValidator());

    const result = validatorChain.validate(req.body);
    if (!result.valid) {
      res.status(result.code!).json({ duplicate: false, errMsg: result.error });
      return;
    }

    const exists = await UserModel.isEmailExists(email.toLowerCase().trim());

    if (exists) {
      res.status(200).json({
        duplicate: true,
        errMsg: `${email} has been registered.`,
      });
    } else {
      res.status(200).json({
        duplicate: false,
      });
    }
  } catch (error) {
    console.error("Error in checkEmail:", error);
    res.status(500).json({
      duplicate: false,
      errMsg: "Internal server error",
    });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const firstName = req.body.firstName?.trim?.();
    const lastName = req.body.lastName?.trim?.();
    const email = req.body.email?.trim?.();
    const password = req.body.password?.trim?.();

    const validatorChain = new ValidatorChain().add(new RequiredFieldsValidator()).add(new EmailFormatValidator()).add(new PasswordStrengthValidator());

    const result = validatorChain.validate(req.body);
    if (!result.valid) {
      res.status(400).json({ status: false, errMsg: result.error });
      return;
    }

    const newUser = await UserModel.createUser({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
    });

    res.status(201).json({
      status: true,
      data: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    console.error("Error in registerUser:", error);

    if (error.message === "Email already registered") {
      res.status(400).json({
        status: false,
        errMsg: "Email already registered",
      });
      return;
    }

    res.status(500).json({
      status: false,
      errMsg: "Internal server error",
    });
  }
};
