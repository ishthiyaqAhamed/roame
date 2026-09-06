import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db";
import { signToken } from "../utils/jwt";

export async function register(req: Request, res: Response) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "fullName, email, and password are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: "CUSTOMER",
      },
    });

    const token = signToken(user.id, user.role);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Something went wrong while creating the account" });
  }
}
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user.id, user.role);

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Something went wrong while logging in" });
  }
}