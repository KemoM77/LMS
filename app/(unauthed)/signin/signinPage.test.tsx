import '@testing-library/jest-dom';

import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';
import React from 'react';

import { createMockRouter } from '@/app/test-utils/createMockRouter';
import { render, screen } from '@testing-library/react';

import LoginPage from './page';

jest.mock('../../firebase');
jest.mock('firebase/auth');
jest.mock('../../firebase/auth/signin');

describe('LoginPage', () => {
  test('renders the login page', () => {
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <LoginPage />
      </AppRouterContext.Provider>
    );

    // Check if the header is rendered
    const headerElement = screen.getByText('Login to your account');
    expect(headerElement).toBeInTheDocument();

    // Check if the paragraph is rendered
    const paragraphElement = screen.getByText(/Don't have an account yet?/i);
    expect(paragraphElement).toBeInTheDocument();

    // Check if the Signup link is rendered
    const signupLinkElement = screen.getByText('Signup');
    expect(signupLinkElement).toBeInTheDocument();
    expect(signupLinkElement).toHaveAttribute('href', '/signup');

    // Check if the Login component is rendered
    const loginElement = screen.getByTestId('login-component');
    expect(loginElement).toBeInTheDocument();
  });
});
