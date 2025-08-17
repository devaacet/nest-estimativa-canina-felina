/**
 * Base interface for all API responses
 */
export interface ApiResponse<TData = unknown> {
  success: boolean;
  data: TData;
  messages: string[];
  metadata?: ApiMetadata;
}

/**
 * Success response interface
 */
export interface SuccessResponse<TData> extends ApiResponse<TData> {
  success: true;
  data: TData;
}

/**
 * Error response interface
 */
export interface ErrorResponse extends ApiResponse<null> {
  success: false;
  data: null;
  error: ApiError;
}

/**
 * API error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stackTrace?: string;
}

/**
 * Validation error response
 */
export interface ValidationErrorResponse extends ErrorResponse {
  error: ValidationError;
}

/**
 * Validation error structure
 */
export interface ValidationError extends ApiError {
  code: 'VALIDATION_ERROR';
  validationErrors: ValidationFieldError[];
}

/**
 * Field validation error
 */
export interface ValidationFieldError {
  field: string;
  message: string;
  value?: unknown;
  constraints?: string[];
}

/**
 * Optional metadata for responses
 */
export interface ApiMetadata {
  timestamp?: string;
  requestId?: string;
  version?: string;
  executionTime?: number;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Paginated response data structure
 */
export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationInfo;
}

/**
 * Paginated success response
 */
export interface PaginatedSuccessResponse<T> extends SuccessResponse<PaginatedData<T>> {
  data: PaginatedData<T>;
}