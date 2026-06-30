import type { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export class ApiResponseHelper {
  /**
   * Sends a successful JSON response.
   * Supports two signatures:
   * 1. success(res, message, data, status, meta) - existing codebase format
   * 2. success(res, data, message, status, meta) - guideline format
   */
  static success<T>(
    res: Response,
    dataOrMessage: T | string,
    messageOrData?: string | T,
    status = 200,
    meta?: PaginationMeta
  ): Response {
    let finalMessage = "Success";
    let finalData: any = null;

    if (typeof dataOrMessage === "string") {
      // Signature 1: (res, message, data, status, meta)
      finalMessage = dataOrMessage;
      finalData = messageOrData !== undefined ? messageOrData : null;
    } else {
      // Signature 2: (res, data, message, status, meta)
      finalData = dataOrMessage;
      if (typeof messageOrData === "string") {
        finalMessage = messageOrData;
      }
    }

    const response: ApiResponse<any> = {
      status,
      success: true,
      message: finalMessage,
      data: finalData,
    };

    if (meta) {
      response.meta = meta;
    }

    return res.status(status).json(response);
  }

  static error(
    res: Response,
    message = "Error",
    status = 500,
    data: any = null
  ): Response {
    const response: ApiResponse<any> = {
      status,
      success: false,
      message,
      data,
    };

    return res.status(status).json(response);
  }
}
