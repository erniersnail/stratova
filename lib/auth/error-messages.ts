export function getAuthErrorMessage(error: { code?: string; message?: string } | null): string {
  if (!error) return 'An error occurred. Please try again.';
  
  const code = error.code || '';
  const msg = (error.message || '').toLowerCase();
  
  if (code === 'email_not_confirmed' || msg.includes('email not confirmed') || msg.includes('email not verified')) {
    return 'Your email address has not been verified. Please check your inbox for the confirmation link.';
  }
  if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
    return 'The email or password you entered is incorrect. Please try again.';
  }
  if (code === 'over_request_rate_limit' || msg.includes('rate limit')) {
    return 'Too many login attempts. Please wait a moment and try again.';
  }
  if (code === 'weak_password' || msg.includes('password should be at least')) {
    return 'Your password is too weak. Please use at least 8 characters.';
  }
  if (code === 'user_already_exists' || msg.includes('user already registered')) {
    return 'An account with this email already exists. Please sign in.';
  }
  
  console.error("Unhandled Auth Error:", error);
  return 'Something went wrong. Please try again.';
}
