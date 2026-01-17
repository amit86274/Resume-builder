import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './context/UserContext';
import { RouterProvider } from './services/router';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </RouterProvider>
    </React.StrictMode>
  );
}