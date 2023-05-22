import {
    collection, getCountFromServer, getDocs, limit, or, orderBy, query, QueryOrderByConstraint,
    startAfter, where
} from 'firebase/firestore';

import { FeildQueryConstraint, OrderContraint } from '../constraints';
import { db } from '../getData';
import getManyDocs from '../getManyDocs';
import getPaginatedDocs, { getQueryCount } from '../getPaginatedDocs';

jest.mock('../getData', () => ({
  db: {},
}));
// Mock firebase/firestore external dependencies
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  getCountFromServer: jest.fn(),
  limit: jest.fn(),
  orderBy: jest.fn(),
  startAfter: jest.fn(),
  or: jest.fn(),
  startAt: jest.fn(),
  endAt: jest.fn(),
}));

describe('getPaginatedDocs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully get paginated documents', async () => {
    const collectionName = 'testCollection';
    const startAtValue = 'someStartAtValue';
    const endAtValue = 10;
    const orderConstraint: OrderContraint = { feild: 'id', method: 'desc' };

    const mockedDocs = [
      { id: '1', data: () => ({ field1: 'value1' }) },
      { id: '2', data: () => ({ field1: 'value2' }) },
    ];
    const mockedQuerySnapshot = {
      docs: mockedDocs,
    };

    (collection as jest.Mock).mockReturnValue('mockedCollectionRef');
    (query as jest.Mock).mockReturnValue('mockedFinalQuery');
    (getDocs as jest.Mock).mockResolvedValue(mockedQuerySnapshot);

    const { querySnapshot } = await getPaginatedDocs(collectionName, startAtValue, endAtValue, orderConstraint);

    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(query).toHaveBeenCalled();
    expect(orderBy).toHaveBeenCalledWith(orderConstraint.feild, orderConstraint.method);
    expect(startAfter).toHaveBeenCalledWith(startAtValue);
    expect(limit).toHaveBeenCalledWith(endAtValue);
    expect(getDocs).toHaveBeenCalledWith('mockedFinalQuery');
    expect(querySnapshot).toEqual(mockedQuerySnapshot);
  });
  /////////////////////
  test('should call getPaginatedDocs with only collectionName, startAt, and endAt', async () => {
    const collectionName = 'testCollection';
    const startAtValue = 'someStartAtValue';
    const endAtValue = 10;

    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    await getPaginatedDocs(collectionName, startAtValue, endAtValue);

    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(orderBy).toHaveBeenCalledWith('id', 'desc');
    expect(startAfter).toHaveBeenCalledWith(startAtValue);
    expect(limit).toHaveBeenCalledWith(endAtValue);
    expect(getDocs).toHaveBeenCalled();
  });
  //////////////////////////////

  test('should call getPaginatedDocs with collectionName, startAt, endAt, and custom orderConstraint', async () => {
    const collectionName = 'testCollection';
    const startAtValue = 'someStartAtValue';
    const endAtValue = 10;
    const orderConstraint: OrderContraint = { feild: 'createdAt', method: 'asc' };

    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    await getPaginatedDocs(collectionName, startAtValue, endAtValue, orderConstraint);

    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(orderBy).toHaveBeenCalledWith(orderConstraint.feild, orderConstraint.method);
    expect(startAfter).toHaveBeenCalledWith(startAtValue);
    expect(limit).toHaveBeenCalledWith(endAtValue);
    expect(getDocs).toHaveBeenCalled();
  });
//////////////////////////////////////////////////

test('should handle error in getDocs for getPaginatedDocs', async () => {
    const collectionName = 'testCollection';
    const startAtValue = 'someStartAtValue';
    const endAtValue = 10;
  
    (collection as jest.Mock).mockReturnValue('mockedCollectionRef');
    (query as jest.Mock).mockReturnValue('mockedFinalQuery');
    (getDocs as jest.Mock).mockRejectedValue(new Error('Error getting paginated documents'));
  
    try {
      await getPaginatedDocs(collectionName, startAtValue, endAtValue);
    } catch (e) {
      expect(e).toEqual(new Error('Error getting paginated documents'));
    }
  
    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(query).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalledWith('mockedFinalQuery');
  });
});

describe('getQueryCount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully get query count', async () => {
    const collectionName = 'testCollection';
    const count = 5;

    (collection as jest.Mock).mockReturnValue('mockedCollectionRef');
    (getCountFromServer as jest.Mock).mockResolvedValue({ data: () => ({ count }) });

    const { count: queryCount } = await getQueryCount(collectionName);

    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(getCountFromServer).toHaveBeenCalled();
    expect(queryCount).toBe(count);
  });
});
