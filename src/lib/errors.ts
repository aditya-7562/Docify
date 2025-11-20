

export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
}

export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  statusCode?: number;
  originalError?: unknown;
  context?: Record<string, unknown>;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly context?: Record<string, unknown>;
  public readonly originalError?: unknown;

  constructor(details: ErrorDetails) {
    super(details.message);
    this.name = this.constructor.name;
    this.code = details.code;
    this.statusCode = details.statusCode ?? 500;
    this.context = details.context;
    this.originalError = details.originalError;


    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      ...(this.context && { context: this.context }),
    };
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", context?: Record<string, unknown>) {
    super({
      code: ErrorCode.UNAUTHORIZED,
      message,
      statusCode: 401,
      context,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", context?: Record<string, unknown>) {
    super({
      code: ErrorCode.FORBIDDEN,
      message,
      statusCode: 403,
      context,
    });
  }
}


export class NotFoundError extends AppError {
  constructor(message = "Resource not found", context?: Record<string, unknown>) {
    super({
      code: ErrorCode.NOT_FOUND,
      message,
      statusCode: 404,
      context,
    });
  }
}


export class ValidationError extends AppError {
  constructor(
    message = "Validation failed",
    context?: Record<string, unknown>
  ) {
    super({
      code: ErrorCode.VALIDATION_ERROR,
      message,
      statusCode: 400,
      context,
    });
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Rate limit exceeded", context?: Record<string, unknown>) {
    super({
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      message,
      statusCode: 429,
      context,
    });
  }
}

export interface ErrorLogger {
  error(error: Error | AppError, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
}

class ConsoleErrorLogger implements ErrorLogger {
  error(error: Error | AppError, context?: Record<string, unknown>): void {
    const errorData = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof AppError && {
        code: error.code,
        statusCode: error.statusCode,
        context: error.context,
      }),
      ...context,
      timestamp: new Date().toISOString(),
    };

    console.error("Error occurred:", errorData);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn("Warning:", { message, ...context, timestamp: new Date().toISOString() });
  }

  info(message: string, context?: Record<string, unknown>): void {
    console.info("Info:", { message, ...context, timestamp: new Date().toISOString() });
  }
}

export const logger: ErrorLogger = new ConsoleErrorLogger();

export function handleError(error: unknown, context?: Record<string, unknown>): AppError {
  if (error instanceof AppError) {
    logger.error(error, context);
    return error;
  }

  if (error instanceof Error) {
    const appError = new AppError({
      code: ErrorCode.INTERNAL_ERROR,
      message: error.message,
      originalError: error,
      context,
    });
    logger.error(appError, context);
    return appError;
  }

  const appError = new AppError({
    code: ErrorCode.INTERNAL_ERROR,
    message: "An unknown error occurred",
    originalError: error,
    context,
  });
  logger.error(appError, context);
  return appError;
}

export function createErrorResponse(error: AppError): Response {
  return Response.json(
    {
      error: {
        code: error.code,
        message: error.message,
        ...(error.context && { context: error.context }),
      },
    },
    { status: error.statusCode }
  );
}

