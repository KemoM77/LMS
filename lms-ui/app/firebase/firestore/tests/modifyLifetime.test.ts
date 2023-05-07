import modifyLifeTime from '../modifyLifetime';
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

describe('modifyLifeTime', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  test('should successfully modify lifetime and return result', async () => {
    const newTime = 30;

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockResolvedValue('mockedResult');

    const { addResult, addError } = await modifyLifeTime(newTime);

    expect(doc).toHaveBeenCalledWith(db, 'system', 'requestsLifeTime');
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', { lifetime: newTime }, { merge: true });
    expect(addResult).toBe('mockedResult');
    expect(addError).toBeNull();
  });

  test('should catch error and return it', async () => {
    const newTime = 30;

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockRejectedValue(new Error('mockedError'));

    const { addResult, addError } = await modifyLifeTime(newTime);

    expect(doc).toHaveBeenCalledWith(db, 'system', 'requestsLifeTime');
    expect(setDoc).toHaveBeenCalledWith('mockedDocRef', { lifetime: newTime }, { merge: true });
    expect(addResult).toBeNull();
    expect(addError).toEqual(new Error('mockedError'));
  });

  test('should handle negative lifetime', async () => {
    const newTime = -30;

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockResolvedValue('mockedResult');

    const { addResult, addError } = await modifyLifeTime(newTime);

    expect(doc).not.toHaveBeenCalledWith(db, 'system', 'requestsLifeTime');
    expect(setDoc).not.toHaveBeenCalledWith('mockedDocRef', { lifetime: newTime }, { merge: true });
    expect(addResult).toBeNull();
    expect(addError.message).toBe('Invalid Life Time');
  });
});
