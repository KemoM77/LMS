import { doc, setDoc } from 'firebase/firestore';

import { db } from '../getData';
import modifyCurrency from '../modifyCurrency';

// Mock firebase/firestore external dependency
jest.mock('firebase/firestore', () => ({
  setDoc: jest.fn(),
  doc: jest.fn(),
}));

// Mock getData external dependency
jest.mock('../getData', () => ({
  db: {},
}));

describe('modifyCurrency', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  test('should successfully modify currency and return result', async () => {
    const newCurrency = 'USD';

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockResolvedValue('mockedResult');

    const { addResult, addError } = await modifyCurrency(newCurrency);

    expect(doc).toHaveBeenCalledWith(db, 'system', 'currency');
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', { currency: newCurrency }, { merge: true });
    expect(addResult).toBe('mockedResult');
    expect(addError).toBeNull();
  });

  test('should catch error and return it', async () => {
    const newCurrency = 'USD';

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockRejectedValue(new Error('mockedError'));

    const { addResult, addError } = await modifyCurrency(newCurrency);

    expect(doc).toHaveBeenCalledWith(db, 'system', 'currency');
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', { currency: newCurrency }, { merge: true });
    expect(addResult).toBeNull();
    expect(addError).toEqual(new Error('mockedError'));
  });

  test('should handle empty currency string', async () => {
    const newCurrency = '';

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockResolvedValue('mockedResult');

    const { addResult, addError } = await modifyCurrency(newCurrency);

    expect(doc).toHaveBeenCalledWith(db, 'system', 'currency');
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', { currency: newCurrency }, { merge: true });
    expect(addResult).toBe('mockedResult');
    expect(addError).toBeNull();
  });
});
