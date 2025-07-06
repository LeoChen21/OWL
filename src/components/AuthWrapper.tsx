import React, { useState, useEffect } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { getCurrentUser } from 'aws-amplify/auth';
import { useGuestAuth } from '../contexts/GuestAuthContext';
import LoginChoice from './LoginChoice';
import App from '../App';

const AuthenticatedApp: React.FC = () => {
  const { user, signOut } = useAuthenticator();
  return <App authUser={user} signOut={signOut} />;
};

const AuthWrapper: React.FC = () => {
  const { user: guestUser, isGuest } = useGuestAuth();
  const [authUser, setAuthUser] = useState<any>(null);
  const [showAuthenticator, setShowAuthenticator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const user = await getCurrentUser();
      setAuthUser(user);
    } catch (error) {
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  };

  // If guest user is logged in, show the app
  if (isGuest && guestUser) {
    return <App />;
  }

  // If authenticated user is logged in, show the app
  if (authUser) {
    return (
      <Authenticator>
        <AuthenticatedApp />
      </Authenticator>
    );
  }

  // If showing authenticator, wrap in Authenticator component
  if (showAuthenticator) {
    return (
      <Authenticator>
        <AuthenticatedApp />
      </Authenticator>
    );
  }

  // If loading, show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user, show login choice
  return (
    <div className="auth-wrapper">
      <LoginChoice onShowAuthenticator={() => setShowAuthenticator(true)} />
    </div>
  );
};

export default AuthWrapper;