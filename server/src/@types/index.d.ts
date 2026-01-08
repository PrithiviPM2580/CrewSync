import type { ZodTypeAny } from "zod";

declare global {
  type APIErrorType = {
    type?: string;
    details?: APIErrorDetails[];
  };

  type APIErrorDetails = {
    field?: string;
    message?: string;
  };

  type RequestValidate = {
    body?: ZodTypeAny;
    query?: ZodTypeAny;
    params?: ZodTypeAny;
  };
}

export {};
