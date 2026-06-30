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
        user,
        "User profile updated successfully"
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

  listUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
      const search =
        typeof req.query.search === "string" ? req.query.search : undefined;

      const { users, total } = await this.userService.getUsers(
        page,
        limit,
        search
      );

      return ApiResponseHelper.success(
        res,
        users,
        "Users fetched successfully",
        200,
        { page, limit, total }
      );
    } catch (error) {
      console.error("List users error:", error);
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status, null);
      }
      return ApiResponseHelper.error(res, "Internal server error", 500, null);
    }
  };

  adminCreateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = CreateUserDTO.safeParse(req.body);
      if (!parsed.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsed.error),
          400
        );
      }

      const role = req.body.role === "admin" ? "admin" : "user";
      const user = await this.userService.adminCreateUser({
        ...parsed.data,
        role,
      });

      return ApiResponseHelper.success(
        res,
        user,
        "User created successfully by admin",
        201
      );
    } catch (error) {
      console.error("Admin create user error:", error);
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status, null);
      }
      return ApiResponseHelper.error(res, "Internal server error", 500, null);
    }
  };

  getUserDetail = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.userService.getCurrentUser(String(req.params.id));
      return ApiResponseHelper.success(
        res,
        user,
        "User detail fetched successfully"
      );
    } catch (error) {
      console.error("Get user detail error:", error);
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status, null);
      }
      return ApiResponseHelper.error(res, "Internal server error", 500, null);
    }
  };

  adminUpdateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = String(req.params.id);
      const data = req.body;

      const user = await this.userService.adminUpdateUser(id, data);
      return ApiResponseHelper.success(
        res,
        user,
        "User updated successfully by admin"
      );
    } catch (error) {
      console.error("Admin update user error:", error);
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status, null);
      }
      return ApiResponseHelper.error(res, "Internal server error", 500, null);
    }
  };

  adminDeleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = String(req.params.id);
      await this.userService.adminDeleteUser(id);
      return ApiResponseHelper.success(res, null, "User deleted successfully");
    } catch (error) {
      console.error("Admin delete user error:", error);
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status, null);
      }
      return ApiResponseHelper.error(res, "Internal server error", 500, null);
    }
  };
}
