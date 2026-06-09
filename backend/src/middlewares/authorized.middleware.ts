import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant.js";
import { HttpException } from "../exceptions/http-exception.js";
import { UserMongoRepository } from "../repositories/user.repository.js";
import { ApiResponseHelper } from "../utils/apihelper.util.js";

interface JwtPayload {
  id: string;
  email: string;
  role: "admin" | "user";
}

const userRepository = new UserMongoRepository();

export async function authorizedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ApiResponseHelper.error(res, "Unauthorized", 401);
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      ApiResponseHelper.error(res, "Unauthorized", 401);
      return;
    }

    req.user = user;
    next();
  } catch {
    ApiResponseHelper.error(res, "Unauthorized", 401);
  }
}

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== "admin") {
    ApiResponseHelper.error(res, "Forbidden", 403);
    return;
  }

  next();
}

export function handleAuthError(
  error: unknown,
  res: Response,
  next: NextFunction
): void {
  if (error instanceof HttpException) {
    ApiResponseHelper.error(res, error.message, error.status);
    return;
  }

  next(error);
}
