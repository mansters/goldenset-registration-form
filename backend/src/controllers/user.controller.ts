import { Request, Response } from "express";
import * as UserModel from "../models/user.model";
import * as Regular from "../utils/regular";

export const checkEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      res.status(400).json({
        duplicate: false,
        errMsg: "Email is required",
      });
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

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({
        status: false,
        errMsg: "All fields are required",
      });
      return;
    }

    if (!Regular.email.test(email)) {
      res.status(400).json({
        status: false,
        errMsg: "Only Gmail are supported",
      });
      return;
    }

    if (!Regular.password.test(password)) {
      res.status(400).json({
        status: false,
        errMsg: "Password must be between 8 and 30 character, having at least one lower case, one upper case, one number, and one special character",
      });
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
