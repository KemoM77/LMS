'use client';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';

import { AuthContextProvider } from './context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" translate="no">
        <title>BookWoods Library Managements System</title>
        <meta name="description" content="My Page"/>
      <body>
      <ToastContainer
      />
        <AuthContextProvider>
            {children}
›        </AuthContextProvider>
        <ToastContainer/>
      </body>
    </html>
  );
}
