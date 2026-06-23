import type { Request, Response } from "express";
import { z } from "zod";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto.js";
import { HttpException } from "../exceptions/http-exception.js";
import { UserService } from "../services/user.service.js";
import { ApiResponseHelper } from "../utils/apihelper.util.js";

export class UserController {
  private userService: UserService;

  constructor(userService?: UserService) {
    this.userService = userService ?? new UserService();
  }

  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = CreateUserDTO.safeParse(req.body);

      if (!parsed.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsed.error),
          400
        );
      }

      const user = await this.userService.createUser(parsed.data);

      return ApiResponseHelper.success(
        res,
        "User registered successfully",
        user,
        201
      );
    } catch (error) {
      console.error("Register error:", error);
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status, null);
      }
      return ApiResponseHelper.error(res, "Internal server error", 500, null);
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = LoginUserDTO.safeParse(req.body);

      if (!parsed.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsed.error),
          400
        );
      }

      const result = await this.userService.loginUser(parsed.data);

      return ApiResponseHelper.success(res, "Login successful", result);
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status, null);
      }
      return ApiResponseHelper.error(res, "Internal server error", 500, null);
    }
  };

  whoAmI = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.user) {
        return ApiResponseHelper.error(res, "Unauthorized", 401, null);
      }

      const user = await this.userService.getCurrentUser(String(req.user._id));

      return ApiResponseHelper.success(
        res,
        "User detail fetched successfully",
        user
      );
    } catch (error) {
      console.error("Who am I error:", error);
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status, null);
      }
      return ApiResponseHelper.error(res, "Internal server error", 500, null);
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.user) {
        return ApiResponseHelper.error(res, "Unauthorized", 401, null);
      }

      const parsed = UpdateUserDTO.safeParse({
        ...req.body,
        profileImage: req.file
          ? `/uploads/users/${req.file.filename}`
          : undefined,
      });

      if (!parsed.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsed.error),
          400,
          null
        );
      }

      const user = await this.userService.updateUser(
        String(req.user._id),
        parsed.data
      );

      return ApiResponseHelper.success(
        res,
        "User profile updated successfully",
        user
      );
    } catch (error) {
      console.error("Update user error:", error);
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status, null);
      }
      if (error instanceof Error) {
        return ApiResponseHelper.error(res, error.message, 400, null);
      }
      return ApiResponseHelper.error(res, "Internal server error", 500, null);
    }
  };
}
