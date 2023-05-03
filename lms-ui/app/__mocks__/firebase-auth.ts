const signInWithEmailAndPassword = jest.fn();
const signOut = jest.fn();

signInWithEmailAndPassword.mockRejectedValue = signInWithEmailAndPassword.mockRejectedValue.bind(
  signInWithEmailAndPassword
);

const getAuth = () => ({
  signInWithEmailAndPassword,
  signOut,
});

export { signInWithEmailAndPassword, signOut, getAuth };
