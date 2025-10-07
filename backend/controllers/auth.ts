import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authService } from "../services/auth";
import { ApiError, serializeError } from "../utils/error";

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    throw new ApiError("All fields are required", 400);
  }

  try {
    const result = await authService.register(name, email, password);
    const token = jwt.sign(
      {
        userId: (result as any).insertId,
        email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1w",
      }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        name,
        email,
        userId: (result as any).insertId,
      },
    });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      serializeError(res, { ...error, message: "Email already exists" });
    }
    serializeError(res, error);
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    throw new ApiError("All fields are required", 400);
  }
  try {
    const user = (await authService.login(email)) as any;

    if (!user) {
      throw new ApiError("Invalid email or password", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError("Invalid email or password", 400);
    }

    const userPayload = { userId: user.id, email: user.email };

    // 🔐 Create JWT token
    const token = jwt.sign(userPayload, process.env.JWT_SECRET as string, {
      // expiresIn: "1d", // Token valid for 1 day
    });

    res.cookie("token", token);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.username,
        email: user.email,
        userId: user.id,
      },
    });
  } catch (error: any) {
    serializeError(res, error);
  }
};

const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const allUsers = await authService.getAllUsers();
    res.status(200).json({ users: allUsers });
  } catch (error: any) {
    serializeError(res, error);
  }
};

export const authController = {
  register,
  login,
  getAllUsers,
};
