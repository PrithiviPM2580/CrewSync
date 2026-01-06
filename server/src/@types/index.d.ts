declare global {
  type APIErrorType = {
    type?: string;
    details?: APIErrorDetails[];
  };

  type APIErrorDetails = {
    field?: string;
    message?: string;
  };
}

export {};
