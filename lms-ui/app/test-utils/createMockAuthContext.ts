import { IdTokenResult, User,PhoneAuthCredential, AuthCredential } from 'firebase/auth';
import { AuthContextType } from '../context/AuthContext';
import { UserInfo } from '../(authed)/profile/user';
import { auth } from 'firebase-admin';
import type { Mock } from 'jest-mock';


export const createMockAuthContext = (options: Partial<AuthContextType> = {}): AuthContextType => {
  const { user = {}, currentUser = {}, loading = false } = options;


  const defaultUser :User = {
    uid: '1',
    displayName: 'John Doe',
    email: 'johndoe@example.com',
    phoneNumber: '+1234567890',
    photoURL: 'https://example.com/profile.jpg',
    emailVerified: true,
    isAnonymous: false,
    tenantId: null,
    providerData: [],
    providerId: 'password',
    metadata: {
      creationTime: '2021-01-01T00:00:00.000Z',
      lastSignInTime: '2023-05-07T00:00:00.000Z',
    },
    getIdTokenResult: async (): Promise<IdTokenResult> => {
      // Return a mock IdTokenResult
      return {
        claims: {
          user_id: '1',
        },
        token: 'mockToken',
        authTime: '0',
        issuedAtTime: '0',
        expirationTime: '0',
        signInProvider: null,
        signInSecondFactor: null,
      };
    },
    getIdToken: async () => 'mockToken',
    refreshToken: 'mockRefreshToken',
    reload: async () => {},
    toJSON: () => JSON.parse(this),
    delete: async () => {},
    ...user,
  };



  const defaultCurrentUser: UserInfo = {
    id: '1',
    first_name: 'Hakeem',
    last_name: 'Al-Absi',
    email: 'kemo@example.com',
    date_of_birth: '1990-01-01',
    isLibrarian: false,
    date_of_registration: new Date('2021-01-01'),
    fav_books: [],
    profile_img_url: 'https://example.com/profile.jpg',
    bio: 'qrrrrqrqrqrqrqrqrqrqrqrqrq.',
    isActive: true,
    valid_until: new Date('2022-01-01'),
    country: 'United States',
    pending_requests: 0,
    borrowed_books: 0,
    city: 'New York',
    address: 'buggyyyyyyy',
    postalcode: '1019',
    fines: 0,
    searchableTerms: [],
    ...currentUser,
  };

  const signout = async () => {
    jest.fn();
  };

  const setCurrentUser = (newUser: UserInfo) => {
    jest.fn();
  };

  return {
    user: defaultUser,
    currentUser: defaultCurrentUser,
    signout,
    setCurrentUser,
    loading,
  };
};
