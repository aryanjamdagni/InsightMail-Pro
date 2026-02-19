import { Router } from "express";
import { register, login, logout, me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";
import { httpError } from "../utils/httpError.js";

const r = Router();

function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return next(httpError(400, parsed.error.issues[0]?.message || "Invalid input"));
    req.body = parsed.data;
    next();
  };
}

r.post("/register", validate(registerSchema), register);
r.post("/login", validate(loginSchema), login);
r.post("/logout", logout);
r.get("/me", requireAuth, me);

export default r;
