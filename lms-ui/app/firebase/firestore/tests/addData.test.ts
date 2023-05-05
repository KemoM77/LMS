import addData from '../addData';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../getData';

// Mock firebase/firestore external dependency
jest.mock('firebase/firestore', () => ({
  setDoc: jest.fn(),
  doc: jest.fn(),
}));

// Mock getData external dependency
jest.mock('../getData', () => ({
  db: {},
}));

describe('addData', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  test('should successfully add data and return result', async () => {
    const collection = 'testCollection';
    const id = 'testId';
    const data = { key: 'value' };

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockResolvedValue('mockedResult');

    const { result, error } = await addData(collection, id, data);

    expect(doc).toHaveBeenCalledWith(db, collection, id);
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', data, { merge: true });
    expect(result).toBe('mockedResult');
    expect(error).toBeNull();
  });
//////////////////////////////////////////////////////////////
  test('should catch error and return it', async () => {
    const collection = 'testCollection';
    const id = 'testId';
    const data = { key: 'value' };

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockRejectedValue(new Error('mockedError'));

    const { result, error } = await addData(collection, id, data);

    expect(doc).toHaveBeenCalledWith(db, collection, id);
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', data, { merge: true });
    expect(result).toBeNull();
    expect(error).toEqual(new Error('mockedError'));
  });
  //////////////////////////////////////////////////////////////
  test('should handle empty collection string', async () => {
    const collection = '';
    const id = 'testId';
    const data = { key: 'value' };

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockResolvedValue('mockedResult');

    const { result, error } = await addData(collection, id, data);

    expect(doc).toHaveBeenCalledWith(db, collection, id);
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', data, { merge: true });
    expect(result).toBe('mockedResult');
    expect(error).toBeNull();
  });
  ///////////////////////////////////////////////////////////////////////////////////////////
  test('should handle empty id string', async () => {
    const collection = 'testCollection';
    const id = '';
    const data = { key: 'value' };

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockResolvedValue('mockedResult');

    const { result, error } = await addData(collection, id, data);

    expect(doc).toHaveBeenCalledWith(db, collection, id);
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', data, { merge: true });
    expect(result).toBe('mockedResult');
    expect(error).toBeNull();
  });
  ///////////////////////////////////////////
  test('should handle null data', async () => {
    const collection = 'testCollection';
    const id = 'testId';
    const data = null;

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockResolvedValue('mockedResult');

    const { result, error } = await addData(collection, id, data);

    expect(doc).toHaveBeenCalledWith(db, collection, id);
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', data, { merge: true });
    expect(result).toBe('mockedResult');
    expect(error).toBeNull();
  });

  test('should handle empty data object', async () => {
    const collection = 'testCollection';
    const id = 'testId';
    const data = {};

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockResolvedValue('mockedResult');

    const { result, error } = await addData(collection, id, data);

    expect(doc).toHaveBeenCalledWith(db, collection, id);
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', data, { merge: true });
    expect(result).toBe('mockedResult');
    expect(error).toBeNull();
  });
});
