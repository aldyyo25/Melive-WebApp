/**
 * Security and environment checks for Agora SDK
 */

export const isSecureEnvironment = (): boolean => {
  if (typeof window === 'undefined') {
    return false; // Server-side
  }

  // Check if running on localhost
  const isLocalhost = 
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '::1';

  // Check if running on HTTPS
  const isHTTPS = window.location.protocol === 'https:';

  // Check if browser supports secure context
  const hasSecureContext = window.isSecureContext;

  return isLocalhost || isHTTPS || hasSecureContext;
};

export const getSecurityError = (): string | null => {
  if (typeof window === 'undefined') {
    return 'Not running in browser environment';
  }

  if (!isSecureEnvironment()) {
    return 'Live streaming requires a secure connection. Please use HTTPS or run on localhost.';
  }

  return null;
};

export const isDevelopmentEnvironment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

export const getEnvironmentInfo = () => {
  if (typeof window === 'undefined') {
    return {
      environment: 'server',
      secure: false,
      hostname: 'unknown',
      protocol: 'unknown'
    };
  }

  return {
    environment: isDevelopmentEnvironment() ? 'development' : 'production',
    secure: isSecureEnvironment(),
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    isSecureContext: window.isSecureContext
  };
};
