import path from "node:path";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { HttpException } from "./exceptions/http-exception.js";
import userRoutes from "./routes/user.route.js";
import { ApiResponseHelper } from "./utils/apihelper.util.js";

const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "public/uploads")));

app.use("/api/v1/auth", userRoutes);

// 404 handler (must be after routes)
app.use((_req, res) => {
  return ApiResponseHelper.error(res, "API not found", 404, null);
});

// Global error handler (must be last)
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err instanceof HttpException) {
      return ApiResponseHelper.error(res, err.message, err.status);
    }

    console.error("Unhandled error:", err);
    return ApiResponseHelper.error(res, "Internal server error", 500);
  }
);

export default app;
