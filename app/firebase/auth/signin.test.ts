import { signInWithEmailAndPassword } from 'firebase/auth';
import { TextEncoder } from 'util';

import signIn from './signin';

import type { Mock } from 'jest-mock';
jest.mock('@/app/firebase', () => {
  return {
    firebase_app: {},
  };
});

jest.mock('firebase/auth');

describe('signIn', () => {
  test('signs in successfully', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const mockResult = { user: { uid: '12345' } };

    (signInWithEmailAndPassword as Mock).mockImplementation(() =>
      Promise.resolve(mockResult)
    );

    const { result, error } = await signIn(email, password);

    expect(result).toEqual(mockResult);
    expect(error).toBeNull();
  });

  test('sign in fails', async () => {
    const email = 'test@example.com';
    const password = 'wrongpassword';
    const mockError = new Error('Invalid email or password');

    (signInWithEmailAndPassword as Mock).mockImplementation(() =>
      Promise.reject(mockError)
    );

    const { result, error } = await signIn(email, password);

    expect(result).toBeNull();
    expect(error).toEqual(mockError);
  });
  ////////////////////
  test('sign in with empty email or password', async () => {
    const emptyEmail = '';
    const emptyPassword = '';
    const errorText = 'Email and password cannot be empty';

    (signInWithEmailAndPassword as Mock).mockImplementation(() =>
      Promise.reject(new Error(errorText))
    );

    const emptyEmailResult = await signIn(emptyEmail, 'password123');
    expect(emptyEmailResult.result).toBeNull();
    expect(emptyEmailResult.error.message).toEqual(errorText);

    const emptyPasswordResult = await signIn('test@example.com', emptyPassword);
    expect(emptyPasswordResult.result).toBeNull();
    expect(emptyPasswordResult.error.message).toEqual(errorText);
  });
///////////////////////////
test('sign in with invalid email format', async () => {
    const invalidEmail = 'invalid-email';
    const password = 'password123';
    const errorText = 'Invalid email format';

    (signInWithEmailAndPassword as Mock).mockImplementation(() =>
      Promise.reject(new Error(errorText))
    );

    const { result, error } = await signIn(invalidEmail, password);

    expect(result).toBeNull();
    expect(error.message).toEqual(errorText);
  });
  ////////////////////////////////////////////////
  test('sign in with a non-existent email', async () => {
    const nonExistentEmail = 'nonexistent@example.com';
    const password = 'password123';
    const errorText = 'User not found';

    (signInWithEmailAndPassword as Mock).mockImplementation(() =>
      Promise.reject(new Error(errorText))
    );

    const { result, error } = await signIn(nonExistentEmail, password);

    expect(result).toBeNull();
    expect(error.message).toEqual(errorText);
  });
  ////////////////////////////////////////////////////////
  test('sign in with correct email but incorrect password', async () => {
    const email = 'test@example.com';
    const incorrectPassword = 'incorrectPassword';
    const errorText = 'Incorrect password';

    (signInWithEmailAndPassword as Mock).mockImplementation(() =>
      Promise.reject(new Error(errorText))
    );

    const { result, error } = await signIn(email, incorrectPassword);

    expect(result).toBeNull();
    expect(error.message).toEqual(errorText);
  });
});
