/**
 * API response type definitions
 */

import { ErrorCode } from "@/lib/errors";

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    context?: Record<string, unknown>;
  };
}

/**
 * Liveblocks auth request
 */
export interface LiveblocksAuthRequest {
  room: string;
}

/**
 * Liveblocks auth response (raw body, not JSON)
 */
export type LiveblocksAuthResponse = Response;

/**
 * Document API response
 */
export interface DocumentResponse {
  id: string;
  name: string;
}

/**
 * User API response
 */
export interface UserResponse {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

