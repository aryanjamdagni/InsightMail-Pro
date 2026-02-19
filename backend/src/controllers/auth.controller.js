import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { httpError } from "../utils/httpError.js";
import { cookieOptions } from "../utils/cookies.js";

function sign(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return next(httpError(409, "Email already registered"));

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: "user" });

    const token = sign(user);
    res.cookie("token", token, cookieOptions());
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(httpError(401, "Invalid credentials"));

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return next(httpError(401, "Invalid credentials"));

    user.lastLoginAt = new Date();
    await user.save();

    const token = sign(user);
    res.cookie("token", token, cookieOptions());
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res) {
  res.json({ user: req.user });
}

export async function logout(req, res) {
  res.clearCookie("token", { path: "/" });
  res.json({ ok: true });
}
