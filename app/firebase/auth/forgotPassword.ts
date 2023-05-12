import { firebase_app } from '@/app/firebase';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export async function ForgotPassword() {

  const email = prompt('Please enter your email address:');
  if (!email) {
    return;
  }

  try {
    const auth = getAuth(firebase_app);
    await sendPasswordResetEmail(auth, email);
    alert('Password reset email sent. Please check your inbox.');
  } catch (error) {

   const erroemesg =   error?.code == 'auth/invalid-email'
    ? 'Invalid Email, please enter a valid email'
    : error?.code === 'auth/user-not-found'
    ? 'User does not exist, please sign up'
    : 'Failed sending email, try again later.'
    alert(erroemesg);
  }
}
