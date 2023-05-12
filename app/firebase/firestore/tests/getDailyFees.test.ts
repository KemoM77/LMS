import getDailyFees from '../getDailyFees';
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

describe('getDailyFees', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  test('should successfully get daily fees and return them', async () => {
    const mockedDailyFees = { fee: 10 };

    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (getDoc as jest.Mock).mockResolvedValue({
      data: () => mockedDailyFees,
    });

    const { dailyFees, error } = await getDailyFees();

    expect(doc).toHaveBeenCalledWith(db, 'system', 'defaultDailyFeesAfterDeadline');
    expect(getDoc).toHaveBeenCalledWith('mockedDocRef');
    expect(dailyFees).toEqual(mockedDailyFees);
    expect(error).toBeNull();
  });

  test('should catch error and return it', async () => {
    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (getDoc as jest.Mock).mockRejectedValue(new Error('mockedError'));

    const { dailyFees, error } = await getDailyFees();

    expect(doc).toHaveBeenCalledWith(db, 'system', 'defaultDailyFeesAfterDeadline');
    expect(getDoc).toHaveBeenCalledWith('mockedDocRef');
    expect(dailyFees).toBeUndefined();
    expect(error).toEqual(new Error('mockedError'));
  });

  test('should handle empty daily fees', async () => {
    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (getDoc as jest.Mock).mockResolvedValue({
      data: () => ({}),
    });

    const { dailyFees, error } = await getDailyFees();

    expect(doc).toHaveBeenCalledWith(db, 'system', 'defaultDailyFeesAfterDeadline');
    expect(getDoc).toHaveBeenCalledWith('mockedDocRef');
    expect(dailyFees).toEqual({});
    expect(error).toBeNull();
  });
});
