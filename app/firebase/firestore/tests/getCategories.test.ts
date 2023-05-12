import getCategories from '../getCategories';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../getData';

// Mock firebase/firestore external dependency
jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

// Mock getData external dependency
jest.mock('../getData', () => ({
  db: {},
}));

describe('getCategories', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  test('should successfully get categories and return them', async () => {
    const mockedCategories = { category1: 'Category 1', category2: 'Category 2' };

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (getDoc as jest.Mock).mockResolvedValue({
      data: () => mockedCategories,
    });

    const { categories, error } = await getCategories();

    expect(doc).toHaveBeenCalledWith(db, 'system', 'categoriesList');
    expect(getDoc).toHaveBeenCalledWith('mockedDocRef');
    expect(categories).toEqual(mockedCategories);
    expect(error).toBeNull();
  });

  test('should catch error and return it', async () => {
    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (getDoc as jest.Mock).mockRejectedValue(new Error('mockedError'));

    const { categories, error } = await getCategories();

    expect(doc).toHaveBeenCalledWith(db, 'system', 'categoriesList');
    expect(getDoc).toHaveBeenCalledWith('mockedDocRef');
    expect(categories).toBeUndefined();
    expect(error).toEqual(new Error('mockedError'));
  });

  test('should handle empty categories', async () => {
    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (getDoc as jest.Mock).mockResolvedValue({
      data: () => ({}),
    });

    const { categories, error } = await getCategories();

    expect(doc).toHaveBeenCalledWith(db, 'system', 'categoriesList');
    expect(getDoc).toHaveBeenCalledWith('mockedDocRef');
    expect(categories).toEqual({});
    expect(error).toBeNull();
  });
});
