import * as UserModel from "./user.model";
import pool from "../config/database";
import bcrypt from "bcrypt";

jest.mock("../config/database");
jest.mock("bcrypt");

const hashedPassword = "!@#$%^&*(1234567";

describe("Model/User", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("isEmailExists", () => {
    it("happy flow", async () => {
      const testEmail = "abc@gmail.com";

      (pool.query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      const result = await UserModel.isEmailExists(testEmail);

      expect(result).toBe(false);
      expect(pool.query).toHaveBeenCalledWith("SELECT id FROM users WHERE email = $1", [testEmail]);
    });

    it("return true when exist", async () => {
      const testEmail = "abc@gmail.com";

      (pool.query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [
          {
            id: 10,
            first_name: "Alice",
            last_name: "Johnson",
            email: "alice@gmail.com",
            password_hash: hashedPassword,
            created_at: new Date("2024-01-15"),
          },
        ],
      });

      const result = await UserModel.isEmailExists(testEmail);

      expect(result).toBe(true);
      expect(pool.query).toHaveBeenCalledWith("SELECT id FROM users WHERE email = $1", [testEmail]);
    });
  });

  describe("createUser", () => {
    it("happy flow", async () => {
      const newUserData = {
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice@gmail.com",
        password: "MyPassword123!",
      };

      const mockDbResponse = {
        id: 10,
        first_name: "Alice",
        last_name: "Johnson",
        email: "alice@gmail.com",
        password_hash: hashedPassword,
        created_at: new Date("2024-01-15"),
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      (pool.query as jest.Mock).mockResolvedValue({
        rows: [mockDbResponse],
      });

      const result = await UserModel.createUser(newUserData);

      expect(bcrypt.hash).toHaveBeenCalledWith("MyPassword123!", 10);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO users"), ["Alice", "Johnson", "alice@gmail.com", hashedPassword]);

      expect(result).toEqual({
        id: 10,
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice@gmail.com",
      });

      expect(result).not.toHaveProperty("password");
      expect(result).not.toHaveProperty("password_hash");
    });
  });
});
