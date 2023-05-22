import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { firebase_app } from '@/app/firebase';
import { ForgotPassword } from './forgotPassword';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock('@/app/firebase', () => ({}));

describe('ForgotPassword', () => {
  const mockEmail = 'test@example.com';
  
  // Mocking the global functions
  global.prompt = jest.fn();
  global.alert = jest.fn();

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    getAuth.mockClear();
    sendPasswordResetEmail.mockClear();
    global.prompt.mockClear();
    global.alert.mockClear();
  });

  it('should send password reset email when valid email is provided', async () => {
    global.prompt.mockReturnValue(mockEmail);
    await ForgotPassword();

    expect(getAuth).toHaveBeenCalledWith(firebase_app);
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(getAuth(firebase_app), mockEmail);
    expect(global.alert).toHaveBeenCalledWith('Password reset email sent. Please check your inbox.');
  });

  it('should show error when invalid email is provided', async () => {
    const mockError = { code: 'auth/invalid-email' };
    global.prompt.mockReturnValue(mockEmail);
    sendPasswordResetEmail.mockImplementationOnce(() => {
      throw mockError;
    });

    await ForgotPassword();

    expect(global.alert).toHaveBeenCalledWith('Invalid Email, please enter a valid email');
  });

  it('should return if no email is provided', async () => {
    global.prompt.mockReturnValue(null);  // Simulating no email input
    await ForgotPassword();

    expect(getAuth).not.toHaveBeenCalled();  // getAuth should not be called
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();  // sendPasswordResetEmail should not be called
    expect(global.alert).not.toHaveBeenCalled();  // No alert should be shown
  });

  it('should show error when user email not found', async () => {
    const mockError = { code: 'auth/user-not-found' };
    global.prompt.mockReturnValue(mockEmail);
    sendPasswordResetEmail.mockImplementationOnce(() => {
      throw mockError;
    });

    await ForgotPassword();

    expect(global.alert).toHaveBeenCalledWith('User does not exist, please sign up');
  });

  it('should show general error message when any other error code is received', async () => {
    const mockError = { code: 'auth/other-error' };  // Some error that's not explicitly handled
    global.prompt.mockReturnValue(mockEmail);
    sendPasswordResetEmail.mockImplementationOnce(() => {
      throw mockError;
    });

    await ForgotPassword();

    expect(global.alert).toHaveBeenCalledWith('Failed sending email, try again later.');
  });});
