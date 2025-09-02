import {
  ApiError,
  ApiResponse,
  ErrorResponse,
  PaginatedSuccessResponse,
  SuccessResponse,
  ValidationErrorResponse,
} from './api-response.interface';

/**
 * Utility type to wrap existing DTOs in standard response format
 */
export type StandardResponse<T> = SuccessResponse<T>;

/**
 * Extract data type from response
 */
export type ResponseData<T> = T extends ApiResponse<infer U> ? U : never;

/**
 * Create paginated version of any type
 */
export type PaginatedResponse<T> = PaginatedSuccessResponse<T>;

/**
 * Union of all possible response types
 */
export type AnyApiResponse = SuccessResponse<unknown> | ErrorResponse;

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>,
): response is SuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse(
  response: ApiResponse<unknown>,
): response is ErrorResponse {
  return response.success === false;
}

/**
 * Type guard to check if response is a validation error
 */
export function isValidationError(
  response: ApiResponse<unknown>,
): response is ValidationErrorResponse {
  return (
    isErrorResponse(response) && response.error?.code === 'VALIDATION_ERROR'
  );
}

/**
 * Legacy response format for backward compatibility
 */
export type LegacyResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
};

/**
 * Convert legacy response to standard format
 */
export function fromLegacyFormat<T>(
  legacy: LegacyResponse<T>,
): StandardResponse<T> | ErrorResponse {
  const messages: string[] = [];

  if (legacy.message) {
    messages.push(legacy.message);
  }

  if (legacy.error) {
    messages.push(legacy.error);
  }

  if (legacy.success) {
    return {
      success: true,
      data: legacy.data,
      messages,
    };
  } else {
    return {
      success: false,
      data: null,
      messages,
      error: {
        code: 'LEGACY_ERROR',
        message: legacy.error || 'Operation failed',
      } as ApiError,
    };
  }
}

/**
 * Convert standard response to legacy format
 */
export function toLegacyFormat<T>(
  response: StandardResponse<T>,
): LegacyResponse<T> {
  return {
    success: response.success,
    data: response.data,
    message: response.messages.length > 0 ? response.messages[0] : undefined,
  };
}
