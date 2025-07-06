import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { GuestAuthProvider } from './contexts/GuestAuthContext.tsx';
import AuthWrapper from './components/AuthWrapper.tsx';
import outputs from '../amplify_outputs.json';
import './index.css';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GuestAuthProvider>
      <AuthWrapper />
    </GuestAuthProvider>
  </React.StrictMode>
);