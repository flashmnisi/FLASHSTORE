export const getErrorMessage = (statusCode?: number, fallbackMessage?: string): string => {
    switch (statusCode) {
      case 400:
        return 'Bad Request. Please check your input.';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Forbidden. You don’t have permission.';
      case 404:
        return 'Not found. The requested resource doesn’t exist.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Try again in a moment.';
      default:
        return fallbackMessage || 'Something went wrong. Please try again.';
    }
  };