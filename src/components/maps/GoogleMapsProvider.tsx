import { ReactNode } from 'react';

interface GoogleMapsProviderProps {
  children: ReactNode;
}

// Simple pass-through provider - the map component loads the script itself
export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  return <>{children}</>;
}
