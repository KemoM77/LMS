import signUp, { getSubstrings } from './signup';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import addData from '../firestore/addData';
import type { Mock } from 'jest-mock';
import { serverTimestamp } from "firebase/firestore";
import { TextEncoder } from "util";

jest.mock('../../firebase', () => {
  return {
    firebase_app: {},
    second_firebase_app: {},
  };
});

jest.mock('../firestore/addData', () => {
    return jest.fn();
  });

jest.mock('firebase/firestore', () => {
    const actualFirestore = jest.requireActual('firebase/firestore');
    return {
      ...actualFirestore,
      serverTimestamp: () => 'mock-server-timestamp',
    };
  });
  

jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('../firestore/addData');



describe('signUp', () => {

    beforeEach(() => {
        (addData as Mock).mockClear();
      });
    

    test('successful sign-up', async () => {
        const mockData = {
          'first-name': 'John',
          'last-name': 'Doe',
          'email-address': 'john.doe@example.com',
          'password': 'password123',
          'date-of-birth': '1990-01-01',
          'userType': 'user',
        };
        const mockResult = { user: { uid: '12345' } };
        const mockTerms = getSubstrings(mockData['first-name'] + ' ' + mockData['last-name']);
    
        (createUserWithEmailAndPassword as Mock).mockImplementation(() =>
          Promise.resolve(mockResult)
        );
        (addData as Mock).mockImplementation(() => Promise.resolve());
    
        const { result, error } = await signUp(mockData);
    
        expect(result).toEqual(mockResult);
        expect(error).toBeNull();
    
        expect(addData).toHaveBeenCalledWith(
          'users',
          mockResult.user.uid,
          expect.objectContaining({
            id: mockResult.user.uid,
            first_name: mockData['first-name'],
            last_name: mockData['last-name'],
            email: mockData['email-address'],
            date_of_birth: mockData['date-of-birth'],
            country: 'Hungary',
            city: 'Budapest',
            address: '',
            postalcode: '0000',
            isLibrarian: false,
            fav_books: [],
            profile_img_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            bio: 'My bio',
            isActive: false,
            pending_requests: 0,
            borrowed_books: 0,
            searchableTerms: mockTerms,
            date_of_registration: 'mock-server-timestamp',
          })
        );
    });
    //////////////////////////////////////////////
    test('successful sign-up as librarian', async () => {
        const mockData = {
          'first-name': 'Jane',
          'last-name': 'Doe',
          'email-address': 'jane.doe@example.com',
          'password': 'password123',
          'date-of-birth': '1990-01-01',
          'userType': 'librarian',
        };
        const mockResult = { user: { uid: '54321' } };
        const mockTerms = getSubstrings(mockData['first-name'] + ' ' + mockData['last-name']);
    
        (createUserWithEmailAndPassword as Mock).mockImplementation(() =>
          Promise.resolve(mockResult)
        );
        (addData as Mock).mockImplementation(() => Promise.resolve());
    
        const { result, error } = await signUp(mockData);
    
        expect(result).toEqual(mockResult);
        expect(error).toBeNull();
    
        expect(addData).toHaveBeenCalledWith(
          'users',
          mockResult.user.uid,
          expect.objectContaining({
            id: mockResult.user.uid,
            first_name: mockData['first-name'],
            last_name: mockData['last-name'],
            email: mockData['email-address'],
            date_of_birth: mockData['date-of-birth'],
            isLibrarian: true,
            isActive: true,
          })
        );
      });
    /////////////////////////////////////////////
      test('sign-up fails', async () => {
        const mockData = {
          'first-name': 'Fail',
          'last-name': 'User',
          'email-address': 'fail.user@example.com',
          'password': 'password123',
          'date-of-birth': '1990-01-01',
          'userType': 'user',
        };
        const mockError = new Error('Sign-up failed');
    
        (createUserWithEmailAndPassword as Mock).mockImplementation(() =>
          Promise.reject(mockError)
        );
    
        const { result, error } = await signUp(mockData);
    
        expect(result).toBeNull();
        expect(error).toEqual(mockError);
        expect(addData).not.toHaveBeenCalled();
      });
      ////////////////////////////////////////////////////////
      test('sign-up with empty fields', async () => {
        const mockData = {
          'first-name': '',
          'last-name': '',
          'email-address': '',
          'password': '',
          'date-of-birth': '',
          'userType': 'user',
        };
        const mockError = new Error('Fields cannot be empty');
    
        (createUserWithEmailAndPassword as Mock).mockImplementation(() =>
          Promise.reject(mockError)
        );
    
        const { result, error } = await signUp(mockData);
    
        expect(result).toBeNull();
        expect(error).toEqual(mockError);
        expect(addData).not.toHaveBeenCalled();
      });
      //////////////////////////////////////////////////////////////////
      test('sign-up with invalid email format', async () => {
        const mockData = {
          'first-name': 'John',
          'last-name': 'Doe',
          'email-address': 'invalid-email',
          'password': 'password123',
          'date-of-birth': '1990-01-01',
          'userType': 'user',
        };
        const mockError = new Error('Invalid email format');
    
        (createUserWithEmailAndPassword as Mock).mockImplementation(() =>
          Promise.reject(mockError)
        );
    
        const { result, error } = await signUp(mockData);
    
        expect(result).toBeNull();
        expect(error).toEqual(mockError);
        expect(addData).not.toHaveBeenCalled();
      });
      /////////////////////////////////////////////////////////////////////////
      test('sign-up with weak password', async () => {
        const mockData = {
          'first-name': 'John',
          'last-name': 'Doe',
          'email-address': 'john.doe@example.com',
          'password': '123',
          'date-of-birth': '1990-01-01',
          'userType': 'user',
        };
        const mockError = new Error('Weak password');
    
        (createUserWithEmailAndPassword as Mock).mockImplementation(() =>
          Promise.reject(mockError)
        );
    
        const { result, error } = await signUp(mockData);
    
        expect(result).toBeNull();
        expect(error).toEqual(mockError);
        expect(addData).not.toHaveBeenCalled();
      });
      //////////////////////////////////////////////////////////////////////////////////
      test('sign-up with future date of birth', async () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        const futureDateString = futureDate.toISOString().split('T')[0];
    
        const mockData = {
          'first-name': 'John',
          'last-name': 'Doe',
          'email-address': 'john.doe@example.com',
          'password': 'password123',
          'date-of-birth': futureDateString,
          'userType': 'user',
        };
        const mockError = new Error('Invalid date of birth');
    
        (createUserWithEmailAndPassword as Mock).mockImplementation(() =>
          Promise.reject(mockError)
        );
    
        const { result, error } = await signUp(mockData);
    
        expect(result).toBeNull();
        expect(error).toEqual(mockError);
        expect(addData).not.toHaveBeenCalled();
      });
      //////////////////////////////////////////////////////////////////////////////////////////////
      test('sign-up with email already in use', async () => {
        const mockData = {
          'first-name': 'John',
          'last-name': 'Doe',
          'email-address': 'john.doe@example.com',
          'password': 'password123',
          'date-of-birth': '1990-01-01',
          'userType': 'user',
        };
        const mockError = new Error('Email already in use');
    
        (createUserWithEmailAndPassword as Mock).mockImplementation(() =>
          Promise.reject(mockError)
        );
    
        const { result, error } = await signUp(mockData);
    
        expect(result).toBeNull();
        expect(error).toEqual(mockError);
        expect(addData).not.toHaveBeenCalled();
      });
      ////////////////////////////////////////////////////////////////////////////////////////////////////
      test('sign-up with invalid user type', async () => {
        const mockData = {
          'first-name': 'John',
          'last-name': 'Doe',
          'email-address': 'john.doe@example.com',
          'password': 'password123',
          'date-of-birth': '1990-01-01',
          'userType': 'invalid',
        };
        const mockError = new Error('Invalid user type');
    
        (createUserWithEmailAndPassword as Mock).mockImplementation(() =>
          Promise.reject(mockError)
        );
    
        const { result, error } = await signUp(mockData);
    
        expect(result).toBeNull();
        expect(error).toEqual(mockError);
        expect(addData).not.toHaveBeenCalled();
      });
    //////////////////////////////////////////////////////////////////////////////////
    test('sign-up by librarian', async () => {
        const mockData = {
          'first-name': 'Jane',
          'last-name': 'Doe',
          'email-address': 'jane.doe@example.com',
          'password': 'password123',
          'date-of-birth': '1990-01-01',
          'userType': 'librarian',
        };
        const mockResult = { user: { uid: '54321' } };
        const mockTerms = getSubstrings(mockData['first-name'] + ' ' + mockData['last-name']);
    
        (createUserWithEmailAndPassword as Mock).mockImplementation(() =>
          Promise.resolve(mockResult)
        );
        (addData as Mock).mockImplementation(() => Promise.resolve());
    
        const { result, error } = await signUp(mockData, true);
    
        expect(result).toEqual(mockResult);
        expect(error).toBeNull();
    
        expect(addData).toHaveBeenCalledWith(
          'users',
          mockResult.user.uid,
          expect.objectContaining({
            id: mockResult.user.uid,
            first_name: mockData['first-name'],
            last_name: mockData['last-name'],
            email: mockData['email-address'],
            date_of_birth: mockData['date-of-birth'],
            country: 'Hungary',
            city: 'Budapest',
            address: '',
            postalcode: '0000',
            isLibrarian: true,
            fav_books: [],
            profile_img_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            bio: 'My bio',
            isActive: true,
            pending_requests: 0,
            borrowed_books: 0,
            searchableTerms: mockTerms,
            date_of_registration: 'mock-server-timestamp',
          })
        );
      });
  });
  