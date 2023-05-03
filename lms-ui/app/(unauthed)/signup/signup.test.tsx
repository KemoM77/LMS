import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupPage from './page';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';
import { createMockRouter } from '@/app/test-utils/createMockRouter';

jest.mock('../../firebase');
jest.mock('firebase/auth');
jest.mock('../../firebase/auth/signup');

describe('Signup page', () => {
  test('renders the sign up page', () => {
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <SignupPage />
      </AppRouterContext.Provider>
    );

    // Check if the header is rendered
    const headerElement = screen.getByText('Signup to create an account');
    expect(headerElement).toBeInTheDocument();

    // Check if the paragraph is rendered
    const paragraphElement = screen.getByText(/Already have an account?/i);
    expect(paragraphElement).toBeInTheDocument();

    // Check if the Login link is rendered
    const loginLinkElement = screen.getByText('Login');
    expect(loginLinkElement).toBeInTheDocument();
    expect(loginLinkElement).toHaveAttribute('href', '/signin');

    // Check if the Signup component is rendered
    const signupElement = screen.getByTestId('signup-component');
    expect(signupElement).toBeInTheDocument();
  });
});
