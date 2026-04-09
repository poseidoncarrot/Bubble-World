import { AppError, ValidationError, ServiceResponse } from '../types/enhanced';

export class ErrorService {
  static createError(code: string, message: string, details?: unknown): AppError {
    const error: AppError = {
      code,
      message,
      details
    };
    
    console.error('Application Error:', error);
    return error;
  }

  static createValidationError(field: string, value: unknown, message: string): ValidationError {
    const error: ValidationError = {
      code: 'VALIDATION_ERROR',
      message,
      field,
      value,
      details: `Validation failed for field: ${field}`
    };
    
    console.warn('Validation Error:', error);
    return error;
  }

  static handleAsyncError<T>(error: unknown): ServiceResponse<T> {
    console.error('Async operation failed:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        error: {
          code: 'ASYNC_ERROR',
          message: error.message,
          details: error.stack
        }
      };
    }
    
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
        details: error
      }
    };
  }

  static logError(error: AppError, context?: string): void {
    const logMessage = context ? `[${context}] ${error.message}` : error.message;
    console.error(logMessage, error);
  }

  static logWarning(message: string, context?: string): void {
    const logMessage = context ? `[${context}] ${message}` : message;
    console.warn(logMessage);
  }

  static logInfo(message: string, context?: string): void {
    const logMessage = context ? `[${context}] ${message}` : message;
    console.info(logMessage);
  }

  static getUserFriendlyMessage(error: AppError): string {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        return error.message;
      case 'NETWORK_ERROR':
        return 'Connection failed. Please check your internet connection.';
      case 'AUTH_ERROR':
        return 'Authentication failed. Please log in again.';
      case 'PERMISSION_ERROR':
        return 'You don\'t have permission to perform this action.';
      case 'NOT_FOUND':
        return 'The requested resource was not found.';
      case 'SERVER_ERROR':
        return 'Server error occurred. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  static isRetryableError(error: AppError): boolean {
    const retryableCodes = [
      'NETWORK_ERROR',
      'SERVER_ERROR',
      'TIMEOUT_ERROR'
    ];
    
    return retryableCodes.includes(error.code);
  }
}

// Error boundary helper
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      ErrorService.logError(
        ErrorService.handleAsyncError(error).error!,
        context
      );
      throw error;
    }
  }) as T;
};
