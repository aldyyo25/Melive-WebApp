'use client';

import { useState, useEffect } from 'react';

interface IframeDetectorProps {
  children: React.ReactNode;
}

export const IframeDetector = ({ children }: IframeDetectorProps) => {
  const [isInIframe, setIsInIframe] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if running in iframe
    setIsInIframe(window.self !== window.top);
    setIsLoaded(true);
  }, []);

  // Don't render until we know if we're in an iframe
  if (!isLoaded) {
    return null;
  }

  // Only render children if NOT in iframe
  return !isInIframe ? <>{children}</> : null;
};
