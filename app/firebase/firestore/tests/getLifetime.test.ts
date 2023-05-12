import getLifeTime from '../getLifetime';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../getData';

// Mock Firebase module and functions
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock('../getData', () => ({
  db: {},
}));

describe('getLifeTime()', () => {
  test('returns the lifetime data from the "system/requestsLifeTime" document', async () => {
    // Set up mock data and functions
    const mockData = {
      data: jest.fn(() => ({ lifetime: 60 })),
    };

    (doc as jest.Mock).mockReturnValueOnce(mockData);
   ( getDoc as jest.Mock).mockResolvedValueOnce(mockData);

    // Call the function and assert the result
    const result = await getLifeTime();

    expect(result).toHaveProperty('lifeTime');
    expect(result).toHaveProperty('error', null);
    expect(result.lifeTime).toEqual({ lifetime: 60 });
  });

  test('handles error when getDoc() fails', async () => {
    // Set up mock functions
    (doc as jest.Mock).mockReturnValueOnce({});
    (getDoc as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Failed to get document');
    });
  
    // Call the function and assert the result
    const result = await getLifeTime();
  
    expect(result).toHaveProperty('lifeTime', null);
    expect(result).toHaveProperty('error');
  });
});
