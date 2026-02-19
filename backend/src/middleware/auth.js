import jwt from "jsonwebtoken";
import { httpError } from "../utils/httpError.js";

export function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return next(httpError(401, "Not authenticated"));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    next(httpError(401, "Invalid token"));
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(httpError(401, "Not authenticated"));
    if (!roles.includes(req.user.role)) return next(httpError(403, "Forbidden"));
    next();
  };
}
