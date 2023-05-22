import { doc, setDoc } from 'firebase/firestore';

import { db } from '../getData';
import modifyDailyFees from '../modifyDailyFees';

// Mock firebase/firestore external dependency
jest.mock('firebase/firestore', () => ({
  setDoc: jest.fn(),
  doc: jest.fn(),
}));

// Mock getData external dependency
jest.mock('../getData', () => ({
  db: {},
}));

describe('modifyDailyFees', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  test('should successfully modify daily fees and return result', async () => {
    const newFees = 100;

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockResolvedValue('mockedResult');

    const { addResult, addError } = await modifyDailyFees(newFees);

    expect(doc).toHaveBeenCalledWith(db, 'system', 'defaultDailyFeesAfterDeadline');
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', { fee: newFees }, { merge: true });
    expect(addResult).toBe('mockedResult');
    expect(addError).toBeNull();
  });

  test('should catch error and return it', async () => {
    const newFees = 100;

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockRejectedValue(new Error('mockedError'));

    const { addResult, addError } = await modifyDailyFees(newFees);

    expect(doc).toHaveBeenCalledWith(db, 'system', 'defaultDailyFeesAfterDeadline');
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', { fee: newFees }, { merge: true });
    expect(addResult).toBeNull();
    expect(addError).toEqual(new Error('mockedError'));
  });

  test('should handle negative fees', async () => {
    const newFees = -100;

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockResolvedValue('mockedResult');

    const { addResult, addError } = await modifyDailyFees(newFees);

    expect(doc).toHaveBeenCalledWith(db, 'system', 'defaultDailyFeesAfterDeadline');
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', { fee: newFees }, { merge: true });
    expect(addResult).toBe('mockedResult');
    expect(addError).toBeNull();
  });
});
