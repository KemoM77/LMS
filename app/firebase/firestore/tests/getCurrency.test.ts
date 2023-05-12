import getCurrency from '../getCurrency';
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

describe('getCurrency', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  test('should successfully get currency and return it', async () => {
    const mockedCurrency = { currency: 'USD' };

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (getDoc as jest.Mock).mockResolvedValue({
      data: () => mockedCurrency,
    });

    const { currency, error } = await getCurrency();

    expect(doc).toHaveBeenCalledWith(db, 'system', 'currency');
    expect(getDoc).toHaveBeenCalledWith('mockedDocRef');
    expect(currency).toEqual(mockedCurrency);
    expect(error).toBeNull();
  });

  test('should catch error and return it', async () => {
    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (getDoc as jest.Mock).mockRejectedValue(new Error('mockedError'));

    const { currency, error } = await getCurrency();

    expect(doc).toHaveBeenCalledWith(db, 'system', 'currency');
    expect(getDoc).toHaveBeenCalledWith('mockedDocRef');
    expect(currency).toBeUndefined();
    expect(error).toEqual(new Error('mockedError'));
  });

  test('should handle empty currency', async () => {
    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (getDoc as jest.Mock).mockResolvedValue({
      data: () => ({}),
    });

    const { currency, error } = await getCurrency();

    expect(doc).toHaveBeenCalledWith(db, 'system', 'currency');
    expect(getDoc).toHaveBeenCalledWith('mockedDocRef');
    expect(currency).toEqual({});
    expect(error).toBeNull();
  });
});
