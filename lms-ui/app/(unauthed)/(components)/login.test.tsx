import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { Mock } from 'jest-mock';
import * as signInModule from '../../firebase/auth/signin';
import Login from './login';
import { NextRouter } from 'next/router';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';
import { createMockRouter } from '@/app/test-utils/createMockRouter';

jest.mock('../../firebase');
jest.mock('firebase/auth');
jest.mock('../../firebase/auth/signin');


describe('Login Component', () => {
  test('renders login form correctly', () => {
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Login />
      </AppRouterContext.Provider>
    );

    const emailInput = screen.getAllByRole('textbox');
    const passwordInput = screen.getAllByLabelText('Password*:');
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(emailInput.length).toBe(1); // Check if both email and password inputs are rendered
    expect(passwordInput.length).toBe(1); // Check if both email and password inputs are rendered
    expect(loginButton).toBeInTheDocument();
  });
////////////////
  test('displays an error message when password is less than 6 characters', async () => {
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Login />
      </AppRouterContext.Provider>
    );

    const emailInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText('Password*:');
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Password must be more than 6 characters/i)).toBeInTheDocument();
    });
  });
/////////////////////////
  test('calls signIn with correct email and password when the form is submitted', async () => {
    const signInMock = (signInModule.default as Mock).mockImplementation(() =>
    Promise.resolve({ result: { user: { uid: '123' } }, error: null })
  );

    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Login />
      </AppRouterContext.Provider>
    );

    const emailInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText('Password*:');
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledTimes(1);
      expect(signInMock).toHaveBeenCalledWith('test@example.com', 'password');
    });
  });
/////////////////////////
  test('displays an error message when the login attempt is unsuccessful', async () => {
    const signInMock = (signInModule.default as Mock).mockImplementation(() =>
      Promise.resolve({ result: null, error: { code: 'auth/wrong-password' } })
    );
  
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Login />
      </AppRouterContext.Provider>
    );
  
    const emailInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText('Password*:');
    const loginButton = screen.getByRole('button', { name: /login/i });
  
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'incorrect-password' } });
    fireEvent.click(loginButton);
  
    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });
/////////////////////////////////
test('redirects to the dashboard after successful login', async () => {
    const signInMock = (signInModule.default as unknown as Mock).mockImplementation(() =>
      Promise.resolve({ result: { user: { uid: '123' } }, error: null })
    );
    const mockRouter = createMockRouter({});
    render(
      <AppRouterContext.Provider value={mockRouter}>
        <Login />
      </AppRouterContext.Provider>
    );
  
    const emailInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText('Password*:');
    const loginButton = screen.getByRole('button', { name: /login/i });
  
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'correct-password' } });
    fireEvent.click(loginButton);
  
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });
  ////////////////////////////////

  test('displays an error message when there are too many requests', async () => {
    const signInMock = (signInModule.default as unknown as Mock).mockImplementation(() =>
      Promise.resolve({ result: null, error: { code: 'auth/too-many-requests' } })
    );
  
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Login />
      </AppRouterContext.Provider>
    );
  
    const emailInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText('Password*:');
    const loginButton = screen.getByRole('button', { name: /login/i });
  
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);
  
    await waitFor(() => {
      expect(screen.getByText(/Too many Requests\.Try again later, or reset your password/i)).toBeInTheDocument();
    });
  });
  /////////////////////////////
  test('displays an error message when the user is not found', async () => {
    const signInMock = (signInModule.default as unknown as Mock).mockImplementation(() =>
      Promise.resolve({ result: null, error: { code: 'auth/user-not-found' } })
    );
  
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Login />
      </AppRouterContext.Provider>
    );
  
    const emailInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText('Password*:');
    const loginButton = screen.getByRole('button', { name: /login/i });
  
    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);
  
    await waitFor(() => {
      expect(screen.getByText(/User does not exist, sign up first/i)).toBeInTheDocument();
    });
  });
  //////////////////////////
  test('displays a generic error message when there is an unknown error', async () => {
    const signInMock = (signInModule.default as unknown as Mock).mockImplementation(() =>
      Promise.resolve({ result: null, error: { code: 'auth/unknown-error' } })
    );
  
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Login />
      </AppRouterContext.Provider>
    );
  
    const emailInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText('Password*:');
    const loginButton = screen.getByRole('button', { name: /login/i });
  
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);
  
    await waitFor(() => {
      expect(screen.getByText(/Login Error, try again later\./i)).toBeInTheDocument();
    });
  });
  ////////////////////////////////////////////////////
  test('displays a loading indicator while waiting for a response', async () => {
    const signInMock = (signInModule.default as unknown as Mock).mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve({ result: null, error: null }), 1000))
    );
  
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Login />
      </AppRouterContext.Provider>
    );
  
    const emailInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText('Password*:');
    const loginButton = screen.getByRole('button', { name: /login/i });
  
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);
  
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  
    await waitFor(() => expect(signInMock).toHaveBeenCalled());
  });
  
});
