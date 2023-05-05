import addCategories from '../addCategories';
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

describe('addCategories', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  test('should successfully add categories and return result', async () => {
    const newCategories = ['cat1', 'cat2', 'cat3'];

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockResolvedValue('mockedAddResult');

    const { addResult, addError } = await addCategories(newCategories);

    expect(doc).toHaveBeenCalledWith(db, 'system', 'categoriesList');
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', { categories: newCategories }, { merge: true });
    expect(addResult).toBe('mockedAddResult');
    expect(addError).toBeNull();
  });

  test('should handle empty newCategories array', async () => {
    const newCategories = [];

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockResolvedValue('mockedAddResult');

    const { addResult, addError } = await addCategories(newCategories);

    expect(doc).toHaveBeenCalledWith(db, 'system', 'categoriesList');
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', { categories: newCategories }, { merge: true });
    expect(addResult).toBe('mockedAddResult');
    expect(addError).toBeNull();
  });

  test('should catch error and return it', async () => {
    const newCategories = ['cat1', 'cat2', 'cat3'];

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockRejectedValue(new Error('mockedAddError'));

    const { addResult, addError } = await addCategories(newCategories);

    expect(doc).toHaveBeenCalledWith(db, 'system', 'categoriesList');
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', { categories: newCategories }, { merge: true });
    expect(addResult).toBeNull();
    expect(addError).toEqual(new Error('mockedAddError'));
  });
});
