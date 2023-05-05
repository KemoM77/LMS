import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { Mock } from 'jest-mock';
import * as signUpModule from '@/app/firebase/auth/signup';
import Signup from './signup';

import { createMockRouter } from '@/app/test-utils/createMockRouter';

jest.mock('@/app/firebase', () => {
  const mockedModule = require('@/app/__mocks__/firebase');
  return {
    ...mockedModule,
    firebase_app: mockedModule.firebase_app,
  };
});

jest.mock('firebase/auth');
jest.mock('@/app/firebase/auth/signup');

import { getFirestore } from 'firebase/firestore';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';

const getFirestoreMock = getFirestore as jest.Mock;
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

describe('Signup Component', () => {
  test('renders signup form correctly', () => {
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Signup />
      </AppRouterContext.Provider>
    );

    const firstNameInput = screen.getByLabelText('First name*:');
    const lastNameInput = screen.getByLabelText('Last name*:');
    const dateOfBirthInput = screen.getByLabelText('Date of birth*:');
    const emailAddressInput = screen.getByLabelText('Email address*:');
    const passwordInput = screen.getByLabelText('Password*:');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password*:');
    const signupButton = screen.getByRole('button', { name: /signup/i });

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(dateOfBirthInput).toBeInTheDocument();
    expect(emailAddressInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
  });

  test('displays an error message when password is less than 6 characters', async () => {
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Signup />
      </AppRouterContext.Provider>
    );

    const passwordInput = screen.getByLabelText('Password*:');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password*:');
    const signupButton = screen.getByRole('button', { name: /signup/i });

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText(/Password must be more than 6 characters/i)).toBeInTheDocument();
    });
  });
  ////////////////////////////////

  test('calls signUp with correct form data when the form is submitted', async () => {
    const signUpMock = (signUpModule.default as Mock).mockImplementation(() =>
      Promise.resolve({ result: { user: { uid: '123' } }, error: null })
    );

    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Signup />
      </AppRouterContext.Provider>
    );

    const firstNameInput = screen.getByLabelText('First name*:');
    const lastNameInput = screen.getByLabelText('Last name*:');
    const dateOfBirthInput = screen.getByLabelText('Date of birth*:');
    const emailAddressInput = screen.getByLabelText('Email address*:');
    const passwordInput = screen.getByLabelText('Password*:');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password*:');
    const signupButton = screen.getByRole('button', { name: /signup/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(dateOfBirthInput, { target: { value: '1990-01-01' } });
    fireEvent.change(emailAddressInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(signUpMock).toHaveBeenCalledTimes(1);
      expect(signUpMock).toHaveBeenCalledWith(
        {
          'first-name': 'John',
          'last-name': 'Doe',
          'date-of-birth': '1990-01-01',
          'email-address': 'test@example.com',
          password: 'password',
          'confirm-password': 'password',
          userType: 'user',
        },
        false
      );
    });
  });
  //////////////////////////////////////////////////////////
  test('displays an error message when passwords do not match', async () => {
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Signup />
      </AppRouterContext.Provider>
    );

    const passwordInput = screen.getByLabelText('Password*:');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password*:');
    const signupButton = screen.getByRole('button', { name: /signup/i });

    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password2' } });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText(/Passwords don't match/i)).toBeInTheDocument();
    });
  });
  /////////////////////////////////////////////////////////////////////

  test('displays a loading indicator while waiting for signup response', async () => {
    const signUpMock = (signUpModule.default as Mock).mockImplementation(() =>
    Promise.resolve({ result: {}, error: null })
  );
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Signup />
      </AppRouterContext.Provider>
    );

    const firstNameInput = screen.getByLabelText('First name*:');
    const lastNameInput = screen.getByLabelText('Last name*:');
    const dateOfBirthInput = screen.getByLabelText('Date of birth*:');
    const emailAddressInput = screen.getByLabelText('Email address*:');
    const passwordInput = screen.getByLabelText('Password*:');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password*:');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(dateOfBirthInput, { target: { value: '1990-01-01' } });
    fireEvent.change(emailAddressInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });

    const signupButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(signupButton);

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();

    await waitFor(() => {
        const loadingIndicator = screen.queryByTestId('loading-indicator');
        expect(loadingIndicator).not.toBeInTheDocument();
      });
  });
//////////////////////////////////////////////////////////////////////////////
test('displays the correct error message based on the error code', async () => {
    const signUpMock = (signUpModule.default as Mock).mockImplementation(() =>
      Promise.resolve({ result: null, error: { code: 'auth/too-many-requests' } })
    );
  

    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Signup />
      </AppRouterContext.Provider>
    );
  
    const firstNameInput = screen.getByLabelText('First name*:');
    const lastNameInput = screen.getByLabelText('Last name*:');
    const dateOfBirthInput = screen.getByLabelText('Date of birth*:');
    const emailAddressInput = screen.getByLabelText('Email address*:');
    const passwordInput = screen.getByLabelText('Password*:');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password*:');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(dateOfBirthInput, { target: { value: '1990-01-01' } });
    fireEvent.change(emailAddressInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });
  
    const signupButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(signupButton);
  
    await waitFor(() => {
      expect(screen.getByText(/Too many Requests.Try again later, or reset your password/i)).toBeInTheDocument();
    });
  
    expect(signUpMock).toHaveBeenCalled()
  });
  ////////////////////////////////////////////////////////////

  test('displays the correct error message when email already exists', async () => {
    const signUpMock = (signUpModule.default as Mock).mockImplementation(() =>
      Promise.resolve({ result: null, error: { code: 'auth/email-already-in-use' } })
    );
  
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Signup />
      </AppRouterContext.Provider>
    );
  
    const firstNameInput = screen.getByLabelText('First name*:');
    const lastNameInput = screen.getByLabelText('Last name*:');
    const dateOfBirthInput = screen.getByLabelText('Date of birth*:');
    const emailAddressInput = screen.getByLabelText('Email address*:');
    const passwordInput = screen.getByLabelText('Password*:');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password*:');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(dateOfBirthInput, { target: { value: '1990-01-01' } });
    fireEvent.change(emailAddressInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });  
    const signupButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(signupButton);
  
    await waitFor(() => {
      expect(screen.getByText(/Email already exists, please login instead/i)).toBeInTheDocument();
    });
  
    expect(signUpMock).toHaveBeenCalled();
  });
  ////////////////////////////////////////////////////////////////////////////////
  test('displays the correct error message when entering a date of birth in the future', async () => {
    const signUpMock = (signUpModule.default as Mock).mockImplementation(() =>
      Promise.resolve({ result: null, error: { message: 'Invalid date of birth' } })
    );
  
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Signup />
      </AppRouterContext.Provider>
    );
  
    const firstNameInput = screen.getByLabelText('First name*:');
    const lastNameInput = screen.getByLabelText('Last name*:');
    const dateOfBirthInput = screen.getByLabelText('Date of birth*:');
    const emailAddressInput = screen.getByLabelText('Email address*:');
    const passwordInput = screen.getByLabelText('Password*:');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password*:');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(dateOfBirthInput, { target: { value: '2990-01-01' } });
    fireEvent.change(emailAddressInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });  
    const signupButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(signupButton);
  
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid date of birth in the past!/i)).toBeInTheDocument();
    });
  
    expect(signUpMock).toHaveBeenCalled();
  });
  ////////////////////////////////////////////////////////////////////////////////
  test('displays the correct error message when user does not exist', async () => {
    const signUpMock = (signUpModule.default as Mock).mockImplementation(() =>
      Promise.resolve({ result: null, error: { code: 'auth/user-not-found' } })
    );
  
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Signup />
      </AppRouterContext.Provider>
    );
  
    const firstNameInput = screen.getByLabelText('First name*:');
    const lastNameInput = screen.getByLabelText('Last name*:');
    const dateOfBirthInput = screen.getByLabelText('Date of birth*:');
    const emailAddressInput = screen.getByLabelText('Email address*:');
    const passwordInput = screen.getByLabelText('Password*:');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password*:');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(dateOfBirthInput, { target: { value: '1990-01-01' } });
    fireEvent.change(emailAddressInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });  
    const signupButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(signupButton);
  
    await waitFor(() => {
      expect(screen.getByText(/User does not exist, sign up first/i)).toBeInTheDocument();
    });
  
    expect(signUpMock).toHaveBeenCalled();
  });
  ////////////////////////////////////////////////
  test('displays a generic error message for other errors', async () => {
    const signUpMock = (signUpModule.default as Mock).mockImplementation(() =>
      Promise.resolve({ result: null, error: { code: 'some-other-error' } })
    );
  
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Signup />
      </AppRouterContext.Provider>
    );
  
    const firstNameInput = screen.getByLabelText('First name*:');
    const lastNameInput = screen.getByLabelText('Last name*:');
    const dateOfBirthInput = screen.getByLabelText('Date of birth*:');
    const emailAddressInput = screen.getByLabelText('Email address*:');
    const passwordInput = screen.getByLabelText('Password*:');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password*:');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(dateOfBirthInput, { target: { value: '1990-01-01' } });
    fireEvent.change(emailAddressInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });  
    const signupButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(signupButton);
  
    await waitFor(() => {
      expect(screen.getByText(/Sign up Error, try again later./i)).toBeInTheDocument();
    });
  
    expect(signUpMock).toHaveBeenCalled();
  });
  
//////////////////////////////////////////////
test('displays user type selection and submits correct user type when byLibrarian prop is passed', async () => {
    const signUpMock = (signUpModule.default as Mock).mockImplementation(() =>
      Promise.resolve({ result: { user: { uid: '123' } }, error: null })
    );
  
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Signup byLibrarian />
      </AppRouterContext.Provider>
    );
  
    const firstNameInput = screen.getByLabelText('First name*:');
    const lastNameInput = screen.getByLabelText('Last name*:');
    const dateOfBirthInput = screen.getByLabelText('Date of birth*:');
    const emailAddressInput = screen.getByLabelText('Email address*:');
    const passwordInput = screen.getByLabelText('Password*:');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password*:');
  
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(dateOfBirthInput, { target: { value: '1990-01-01' } });
    fireEvent.change(emailAddressInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });
  
    const librarianRadio = screen.getByLabelText('Librarian');
    const userRadio = screen.getByLabelText('User');
  
    expect(librarianRadio).toBeInTheDocument();
    expect(userRadio).toBeInTheDocument();
  
    fireEvent.click(librarianRadio);
  
    const signupButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(signupButton);
  
    await waitFor(() => {
      expect(signUpMock).toHaveBeenCalledWith(
        expect.objectContaining({
          userType: 'librarian',
        }),
        true
      );
    });
  });
  //////////////////////////////////////////////////////////////
  test('user type selection is not displayed when byLibrarian prop is not passed', () => {
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <Signup />
      </AppRouterContext.Provider>
    );

    const librarianRadio = screen.queryByLabelText('Librarian');
    const userRadio = screen.queryByLabelText('User');

    expect(librarianRadio).not.toBeInTheDocument();
    expect(userRadio).not.toBeInTheDocument();
  });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

  // Continue adding the test cases similar to the Login component tests
});
