import getData, { db } from '../getData';
import { getDoc, doc, getFirestore } from 'firebase/firestore';

// Mock firebase/firestore external dependency
jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
  getFirestore: jest.fn(), // Add this line to mock getFirestore
}));

describe('getData', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  test('should successfully get data and return document data', async () => {
    const collection = 'testCollection';
    const id = 'testId';

    const mockResult = {
      exists: true,
      data: () => ({ key: 'value' }),
    };

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (getDoc as jest.Mock).mockResolvedValue(mockResult);

    const { docData, error } = await getData(collection, id);

    expect(doc).toHaveBeenCalledWith(db, collection, id);
    expect(getDoc).toHaveBeenCalledWith('mockedDocRef');
    expect(docData).toEqual({ key: 'value' });
    expect(error).toBeNull();
  });

  test('should return null document data if document does not exist', async () => {
    const collection = 'testCollection';
    const id = 'testId';

    const mockResult = {
      exists: false,
      data: () => null,
    };

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (getDoc as jest.Mock).mockResolvedValue(mockResult);

    const { docData, error } = await getData(collection, id);

    expect(doc).toHaveBeenCalledWith(db, collection, id);
    expect(getDoc).toHaveBeenCalledWith('mockedDocRef');
    expect(docData).toBeNull();
    expect(error).toBeNull();
  });

  test('should catch error and return it', async () => {
    const collection = 'testCollection';
    const id = 'testId';

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (getDoc as jest.Mock).mockRejectedValue(new Error('mockedError'));

    const { docData, error } = await getData(collection, id);

    expect(doc).toHaveBeenCalledWith(db, collection, id);
    expect(getDoc).toHaveBeenCalledWith('mockedDocRef');
    expect(docData).toBeNull();
    expect(error).toEqual(new Error('mockedError'));
  });
});
