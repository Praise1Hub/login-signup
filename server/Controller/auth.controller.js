import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../Database/db.js";

export const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [cleanEmail]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, cleanEmail, hashedPassword]
    );

    res.status(201).json({ message: "Sign up successful", user: result.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }
    const cleanEmail = email.toLowerCase().trim();

    const checkUser = await pool.query("SELECT * FROM users WHERE email = $1", [cleanEmail]);
    if (!checkUser.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = checkUser.rows[0];
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.status(200).json({ message: "Login successful", token, user });
  } 
  
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}