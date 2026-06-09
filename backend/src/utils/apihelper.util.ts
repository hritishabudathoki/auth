import type { Response } from "express";

interface ApiResponse<T = unknown> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export class ApiResponseHelper {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    status = 200,
    meta?: Record<string, unknown>
  ): Response {
    const response: ApiResponse<T> = {
      status,
      success: true,
      message,
      data,
    };

    if (meta) {
      response.meta = meta;
    }

    return res.status(status).json(response);
  }

  static error(
    res: Response,
    message: string,
    status = 500,
    data?: unknown
  ): Response {
    const response: ApiResponse = {
      status,
      success: false,
      message,
      data,
    };

    return res.status(status).json(response);
  }
}
