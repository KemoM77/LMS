import getLifeTime from '../getLifetime';
import { connectFirestoreEmulator, doc, getDoc, initializeFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const testApp = initializeApp({
  projectId: 'test-project',
});
const testFirestore = initializeFirestore(testApp, {});
connectFirestoreEmulator(testFirestore, 'localhost', 8080);

jest.mock('../getData', () => {
    const { initializeTestApp } = require('firebase/testing');
    const { connectFirestoreEmulator } = require('firebase/firestore');
    const testApp = initializeTestApp({ projectId: 'test-project' });
    const testFirestore = testApp.firestore();
    connectFirestoreEmulator(testFirestore, 'localhost', 8080);
  
    return {
      db: testFirestore,
    };
  });
  
  jest.mock('firebase/firestore', () => {
    const originalFirestore = jest.requireActual('firebase/firestore');
    return {
      ...originalFirestore,
      doc: jest.fn(originalFirestore.doc),
      getDoc: jest.fn(originalFirestore.getDoc),
    };
  });
  
describe('getLifeTime', () => {
  test('should get lifeTime data and not throw an error', async () => {
    const mockedData = { some: 'data' };
    (getDoc as jest.Mock).mockResolvedValue({
      data: () => mockedData,
    });

    const { lifeTime, error } = await getLifeTime();

    expect(doc).toHaveBeenCalledWith(testFirestore, 'system', 'requestsLifeTime');
    expect(getDoc).toHaveBeenCalledWith(expect.objectContaining({ _path: { segments: ['system', 'requestsLifeTime'] } }));
    expect(lifeTime).toEqual(mockedData);
    expect(error).toBeNull();
  });

  test('should handle error when getting lifeTime data', async () => {
    const mockedError = new Error('Test error');
    (getDoc as jest.Mock).mockRejectedValue(mockedError);

    const { lifeTime, error } = await getLifeTime();

    expect(doc).toHaveBeenCalledWith(testFirestore, 'system', 'requestsLifeTime');
    expect(getDoc).toHaveBeenCalledWith(expect.objectContaining({ _path: { segments: ['system', 'requestsLifeTime'] } }));
    expect(lifeTime).toBeUndefined();
    expect(error).toEqual(mockedError);
  });
});
