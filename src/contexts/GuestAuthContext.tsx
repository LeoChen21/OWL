import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface GuestUser {
  id: string;
  email: string;
  isGuest: boolean;
  sessionId: string;
}

interface GuestAuthContextType {
  user: GuestUser | null;
  isGuest: boolean;
  login: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
}

const GuestAuthContext = createContext<GuestAuthContextType | undefined>(undefined);

interface GuestAuthProviderProps {
  children: ReactNode;
}

export const GuestAuthProvider: React.FC<GuestAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<GuestUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check for existing guest session
    const guestSession = localStorage.getItem('guestSession');
    const guestExpiry = localStorage.getItem('guestSessionExpiry');
    
    if (guestSession && guestExpiry) {
      const expiryTime = parseInt(guestExpiry);
      const currentTime = Date.now();
      
      // Check if session has expired
      if (currentTime < expiryTime) {
        const guestData = JSON.parse(guestSession);
        setUser(guestData);
        setIsGuest(true);
      } else {
        // Session expired, clean up
        cleanupGuestSession();
      }
    }
  }, []);

  // Set up cleanup interval to check for expired sessions
  useEffect(() => {
    const interval = setInterval(() => {
      const guestExpiry = localStorage.getItem('guestSessionExpiry');
      if (guestExpiry) {
        const expiryTime = parseInt(guestExpiry);
        const currentTime = Date.now();
        
        if (currentTime >= expiryTime) {
          cleanupGuestSession();
          setUser(null);
          setIsGuest(false);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const cleanupGuestSession = () => {
    localStorage.removeItem('guestSession');
    localStorage.removeItem('guestSessionExpiry');
    localStorage.removeItem('guestTodos');
  };

  const generateGuestId = () => {
    return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const loginAsGuest = () => {
    const guestId = generateGuestId();
    const sessionId = `session_${Date.now()}`;
    
    const guestUser: GuestUser = {
      id: guestId,
      email: `guest_${guestId}@temporary.local`,
      isGuest: true,
      sessionId: sessionId
    };

    setUser(guestUser);
    setIsGuest(true);
    
    // Store guest session
    localStorage.setItem('guestSession', JSON.stringify(guestUser));
    
    // Set expiration (24 hours)
    const expirationTime = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('guestSessionExpiry', expirationTime.toString());
  };

  const login = async () => {
    // This would integrate with your existing AWS Cognito auth
    // For now, we'll just simulate a regular login
    throw new Error('Regular login not implemented in this demo');
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    cleanupGuestSession();
  };

  const value: GuestAuthContextType = {
    user,
    isGuest,
    login,
    loginAsGuest,
    logout
  };

  return (
    <GuestAuthContext.Provider value={value}>
      {children}
    </GuestAuthContext.Provider>
  );
};

export const useGuestAuth = () => {
  const context = useContext(GuestAuthContext);
  if (context === undefined) {
    throw new Error('useGuestAuth must be used within a GuestAuthProvider');
  }
  return context;
};