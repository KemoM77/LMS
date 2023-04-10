'use client';

import './globals.css';
import { AuthContextProvider, useAuthContext } from './context/AuthContext';
import { useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
            {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
