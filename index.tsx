import React from 'react';
import ReactDOM from 'react-dom/client';
import RootLayout from './app/layout';
import { RouterProvider, RouteHandler } from './services/router';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider>
        <RootLayout>
          <RouteHandler />
        </RootLayout>
      </RouterProvider>
    </React.StrictMode>
  );
}