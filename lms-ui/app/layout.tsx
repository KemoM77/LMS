'use client';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContextProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
// import { RouterContext } from 'next/dist/shared/lib/router-context';

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" translate="no">
        <title>BookWoods Library Managements System</title>
        <meta name="description" content="My Page"/>
      <body>
      <ToastContainer
      />
        <AuthContextProvider>
        {/* <RouterContext.Provider value={makePub({})}> */}
            {children}
          {/* </RouterContext.Provider> */}
        </AuthContextProvider>
        <ToastContainer/>
      </body>
    </html>
  );
}
