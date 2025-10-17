import { Request, Response } from "express";
import * as userController from "./user.controller";
import * as UserModel from "../models/user.model";

jest.mock("../models/user.model");

describe("Controller/User", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  describe("checkEmail", () => {
    it("happy flow", async () => {
      const testEmail = "newemail@gmail.com";
      mockRequest.body = { email: testEmail };

      (UserModel.isEmailExists as jest.Mock).mockResolvedValue(false);

      await userController.checkEmail(mockRequest as Request, mockResponse as Response);

      expect(UserModel.isEmailExists).toHaveBeenCalledWith(testEmail);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        duplicate: false,
      });
    });

    it("validation: email should be required", async () => {
      const testEmail = "";
      mockRequest.body = { email: testEmail };

      (UserModel.isEmailExists as jest.Mock).mockResolvedValue(false);

      await userController.checkEmail(mockRequest as Request, mockResponse as Response);

      expect(UserModel.isEmailExists).not.toHaveBeenCalled();

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        duplicate: false,
        errMsg: "Email is required",
      });
    });

    it("validation: not gmail", async () => {
      const testEmail = "abc@example.com";
      mockRequest.body = { email: testEmail };

      (UserModel.isEmailExists as jest.Mock).mockResolvedValue(false);

      await userController.checkEmail(mockRequest as Request, mockResponse as Response);

      expect(UserModel.isEmailExists).not.toHaveBeenCalled();

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        duplicate: false,
        errMsg: "Only Gmail are supported",
      });
    });
  });

  describe("registerUser", () => {
    it("happy flow", async () => {
      const validUserData = {
        firstName: "AAA",
        lastName: "BB",
        email: "test@gmail.com",
        password: "Aa1234567890~",
      };
      mockRequest.body = validUserData;

      const mockCreatedUser = {
        id: 1,
        firstName: "AAA",
        lastName: "BB",
        email: "test@gmail.com",
      };
      (UserModel.createUser as jest.Mock).mockResolvedValue(mockCreatedUser);

      await userController.registerUser(mockRequest as Request, mockResponse as Response);

      expect(UserModel.createUser).toHaveBeenCalled();

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        status: true,
        data: mockCreatedUser,
      });
    });

    it("validation: required fields check", async () => {
      mockRequest.body = {
        firstName: "",
        lastName: "",
        email: "",
        password: " ",
      };

      await userController.registerUser(mockRequest as Request, mockResponse as Response);

      expect(UserModel.isEmailExists).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        status: false,
        errMsg: "Missing fields: firstName, lastName, email, password",
      });
    });

    it("validation: not gmail", async () => {
      mockRequest.body = {
        firstName: "AAA",
        lastName: "BB",
        email: "test@examle.com",
        password: "Aa1234567890~",
      };

      await userController.registerUser(mockRequest as Request, mockResponse as Response);

      expect(UserModel.isEmailExists).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        status: false,
        errMsg: "Only Gmail are supported",
      });
    });

    it("validation: password strength", async () => {
      mockRequest.body = {
        firstName: "AAA",
        lastName: "BB",
        email: "test@gmail.com",
        password: "123abc",
      };

      await userController.registerUser(mockRequest as Request, mockResponse as Response);

      expect(UserModel.isEmailExists).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        status: false,
        errMsg: "Password must be between 8 and 30 character, having at least one lower case, one upper case, one number, and one special character",
      });
    });
  });
});
