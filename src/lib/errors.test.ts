import { describe, it, expect } from "vitest";
import {
  AppError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  handleError,
  ErrorCode,
} from "./errors";

describe("Error Classes", () => {
  it("should create AppError with correct properties", () => {
    const error = new AppError({
      code: ErrorCode.INTERNAL_ERROR,
      message: "Test error",
      statusCode: 500,
    });

    expect(error.message).toBe("Test error");
    expect(error.code).toBe(ErrorCode.INTERNAL_ERROR);
    expect(error.statusCode).toBe(500);
    expect(error.name).toBe("AppError");
  });

  it("should create UnauthorizedError with 401 status", () => {
    const error = new UnauthorizedError("Not authorized");
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
  });

  it("should create ForbiddenError with 403 status", () => {
    const error = new ForbiddenError("Access denied");
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe(ErrorCode.FORBIDDEN);
  });

  it("should create NotFoundError with 404 status", () => {
    const error = new NotFoundError("Resource not found");
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe(ErrorCode.NOT_FOUND);
  });

  it("should create ValidationError with 400 status", () => {
    const error = new ValidationError("Invalid input");
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
  });

  it("should create RateLimitError with 429 status", () => {
    const error = new RateLimitError("Too many requests");
    expect(error.statusCode).toBe(429);
    expect(error.code).toBe(ErrorCode.RATE_LIMIT_EXCEEDED);
  });

  it("should serialize to JSON correctly", () => {
    const error = new AppError({
      code: ErrorCode.INTERNAL_ERROR,
      message: "Test",
      context: { key: "value" },
    });

    const json = error.toJSON();
    expect(json).toHaveProperty("name", "AppError");
    expect(json).toHaveProperty("code", ErrorCode.INTERNAL_ERROR);
    expect(json).toHaveProperty("message", "Test");
    expect(json).toHaveProperty("context", { key: "value" });
  });
});

describe("handleError", () => {
  it("should return AppError as-is", () => {
    const error = new UnauthorizedError("Test");
    const result = handleError(error);
    expect(result).toBe(error);
  });

  it("should wrap Error in AppError", () => {
    const error = new Error("Test error");
    const result = handleError(error);
    expect(result).toBeInstanceOf(AppError);
    expect(result.message).toBe("Test error");
  });

  it("should handle unknown error types", () => {
    const error = "String error";
    const result = handleError(error);
    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe(ErrorCode.INTERNAL_ERROR);
  });
});

