import { AppError } from './errors';

export type SuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ErrorResponse = {
  success: false;
  error: string;
  code: string;
  message: string;
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export function success<T>(data: T, message?: string): SuccessResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
}

export function failure(error: unknown): ErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.name,
      code: error.code,
      message: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: 'InternalError',
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
    };
  }

  return {
    success: false,
    error: 'UnknownError',
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
  };
}
