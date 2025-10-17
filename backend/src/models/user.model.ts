import pool from "../config/database";
import bcrypt from "bcrypt";
import { DbUser, UserDto } from "./interface";

export const isEmailExists = async (email: string): Promise<boolean> => {
  try {
    const query = "SELECT id FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw new Error("Database error while checking email");
  }
};

export const createUser = async (user: UserDto): Promise<Omit<UserDto, "password">> => {
  try {
    const passwordHash = await bcrypt.hash(user.password, 10);

    const query = `
      INSERT INTO users (first_name, last_name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, first_name, last_name, email, created_at
    `;

    const values = [user.firstName, user.lastName, user.email, passwordHash];
    const result = await pool.query<DbUser>(query, values);

    const dbUser = result.rows[0];
    return {
      id: dbUser.id,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      email: dbUser.email,
    };
  } catch (error: any) {
    // Handle unique constraint violation (duplicate email)
    if (error.code === "23505") {
      throw new Error("Email already registered");
    }

    console.error("Error creating user:", error);
    throw new Error("Database error while creating user");
  }
};
