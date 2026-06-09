import type { Request, Response } from "express";
import { z } from "zod";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto.js";
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
      throw error;
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
      throw error;
    }
  };
}
