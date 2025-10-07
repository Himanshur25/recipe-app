import { pool } from "../connect";
import bcrypt from "bcrypt";

const register = async (username: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword]
  );

  return result;
};

const login = async (email: string) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  const user = (rows as any)[0];
  return user;
};

const getAllUsers = async () => {
  const [rows] = await pool.query("SELECT id, username, email FROM users");
  return rows;
};

export const authService = {
  register,
  login,
  getAllUsers,
};
