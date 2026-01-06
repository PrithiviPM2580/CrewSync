import type { NextFunction, Request, Response } from "express";
import { APIError } from "@/lib/error-handler.lib.js";

export default function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof APIError) {
    if (!err.isOperational) {
      console.error("NON-OPERATIONAL ERROR:", err);
    }

    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      error: err.error ?? null,
    });
  }

  console.error("UNHANDLED ERROR:", err);

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
    error: null,
  });
}
