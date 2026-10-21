// lib/auth/error-messages.ts

/**
 * Maps Supabase Auth error codes to user-friendly messages.
 * @param error The error object returned from Supabase auth methods.
 * @returns A user-friendly string.
 */
export function getAuthErrorMessage(error: { code?: string; message?: string } | null): string {
  if (!error) {
    return 'An unknown error occurred. Please try again.';
  }

  const code = error.code || '';

  switch (code) {
    case 'email_not_confirmed':
      return 'Your email address has not been verified. Please check your inbox for the confirmation link.';
    case 'invalid_credentials':
      return 'The email or password you entered is incorrect. Please try again.';
    case 'user_not_found':
      // Security best practice: do not reveal if an account exists.
      return 'The email or password you entered is incorrect.';
    case 'weak_password':
      return 'Your password is too weak. Please use at least 8 characters with a mix of letters and numbers.';
    case 'over_email_send_rate_limit':
      return 'You have requested too many emails. Please wait a minute before trying again.';
    case 'over_request_rate_limit':
      return 'Too many login attempts. Please wait a moment and try again.';
    case 'signup_disabled':
      return 'New user registration is currently disabled. Please contact support.';
    case 'email_exists':
    case 'user_already_exists':
      return 'An account with this email already exists. Please sign in or reset your password.';
    case 'session_expired':
      return 'Your session has expired. Please sign in again.';
    default:
      console.warn(`Unhandled Supabase Auth Error Code: ${code}. Original message: ${error.message}`);
      return 'Something went wrong. Please try again.';
  }
}
