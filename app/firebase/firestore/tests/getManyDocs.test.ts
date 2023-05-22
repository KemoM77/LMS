import {
    collection, getCountFromServer, getDocs, limit, or, orderBy, query, QueryOrderByConstraint,
    startAfter, where
} from 'firebase/firestore';

import { FeildQueryConstraint, OrderContraint } from '../constraints';
import { db } from '../getData';
import getManyDocs from '../getManyDocs';

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
  or:jest.fn()
}));



describe('getManyDocs', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  test('should successfully get documents and return them with count', async () => {
    const collectionName = 'testCollection';
    const constraints : FeildQueryConstraint[] = [
      { feild: 'field1', comparison: "==", value: 'value1' },
      { feild: 'field2', comparison: ">=", value: 10 },
    ] ;
    const orderConstraint : OrderContraint = { feild: 'createdAt', method: 'desc' };
    const limitTo = 10;

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
    (getCountFromServer as jest.Mock).mockResolvedValue({ data: () => ({ count: 2 }) });

    const { querySnapshot, docsCount } = await getManyDocs(
      collectionName,
      constraints,
      'And',
      orderConstraint,
      limitTo
    );

    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(query).toHaveBeenCalled();
    expect(where).toHaveBeenCalledTimes(constraints.length);
    expect(getDocs).toHaveBeenCalledWith('mockedFinalQuery');
    expect(getCountFromServer).toHaveBeenCalled();
    expect(querySnapshot).toEqual(mockedQuerySnapshot);
    expect(docsCount).toBe(2);
  });

  test('should handle empty constraints array', async () => {
    const collectionName = 'testCollection';

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
    (getCountFromServer as jest.Mock).mockResolvedValue({ data: () => ({ count: 2 }) });

    const { querySnapshot, docsCount } = await getManyDocs(collectionName);

    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(query).toHaveBeenCalled();
    expect(where).not.toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalledWith('mockedFinalQuery');
    expect(getCountFromServer).toHaveBeenCalled();
    expect(querySnapshot).toEqual(mockedQuerySnapshot);
    expect(docsCount).toBe(2);
  });

  test('should handle error in getDocs', async () => {
    const collectionName = 'testCollection';

    (collection as jest.Mock).mockReturnValue('mockedCollectionRef');
    (query as jest.Mock).mockReturnValue('mockedFinalQuery');
    (getDocs as jest.Mock).mockRejectedValue(new Error('Error getting documents'));
    try {
      await getManyDocs(collectionName);
    } catch (e) {
      expect(e).toEqual(new Error('Error getting documents'));
    }

    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(query).toHaveBeenCalled();
    expect(where).not.toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalledWith('mockedFinalQuery');
    expect(getCountFromServer).not.toHaveBeenCalled();
  });

  test('should handle error in getCountFromServer', async () => {
    const collectionName = 'testCollection';
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
    (getCountFromServer as jest.Mock).mockRejectedValue(new Error('Error getting count'));

    try {
      await getManyDocs(collectionName);
    } catch (e) {
      expect(e).toEqual(new Error('Error getting count'));
    }

    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(query).toHaveBeenCalled();
    expect(where).not.toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalledWith('mockedFinalQuery');
    expect(getCountFromServer).toHaveBeenCalled();
  });
  ///////////////////////////////////////
  test('should call getManyDocs with only collectionName', async () => {
    const collectionName = 'testCollection';
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    await getManyDocs(collectionName);

    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(getDocs).toHaveBeenCalled();
  });

  test('should call getManyDocs with collectionName and constraints', async () => {
    const collectionName = 'testCollection';
    const constraints : FeildQueryConstraint[] = [
      { feild: 'field1', comparison: '==', value: 'value1' },
      { feild: 'field2', comparison: '>=', value: 10 },
    ];
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    await getManyDocs(collectionName, constraints);

    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(where).toHaveBeenCalledWith('field1', '==', 'value1');
    expect(where).toHaveBeenCalledWith('field2', '>=', 10);
    expect(getDocs).toHaveBeenCalled();
  });

  test('should call getManyDocs with collectionName, constraints, and relation', async () => {
    const collectionName = 'testCollection';
    const constraints : FeildQueryConstraint[]  = [
      { feild: 'field1', comparison: '==', value: 'value1' },
      { feild: 'field2', comparison: '>=', value: 10 },
    ];
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    await getManyDocs(collectionName, constraints, 'Or');

    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(where).toHaveBeenCalledWith('field1', '==', 'value1');
    expect(where).toHaveBeenCalledWith('field2', '>=', 10);
    expect(getDocs).toHaveBeenCalled();
  });

  test('should call getManyDocs with collectionName, constraints, relation, and orderConstraint', async () => {
    const collectionName = 'testCollection';
    const constraints : FeildQueryConstraint[]  = [
      { feild: 'field1', comparison: '==', value: 'value1' },
      { feild: 'field2', comparison: '>=', value: 10 },
    ];
    const orderConstraint:OrderContraint = { feild: 'field1', method: 'asc' };
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    await getManyDocs(collectionName, constraints, 'Or', orderConstraint);

    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(where).toHaveBeenCalledWith('field1', '==', 'value1');
    expect(where).toHaveBeenCalledWith('field2', '>=', 10);
    expect(orderBy).toHaveBeenCalledWith('field1', 'asc');
    expect(getDocs).toHaveBeenCalled();
  });
  ///////////////////////////////////
  test('should call getManyDocs with collectionName, constraints, relation, orderConstraint, limit, and startAfter', async () => {
    const collectionName = 'testCollection';
    const constraints:FeildQueryConstraint[] = [
      { feild: 'field1', comparison: '==', value: 'value1' },
      { feild: 'field2', comparison: '>=', value: 10 },
    ];
    const orderConstraint : OrderContraint = { feild: 'field1', method: 'asc' };
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    await getManyDocs(collectionName, constraints, 'Or', orderConstraint, 5, 'startAfterValue');

    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(where).toHaveBeenCalledWith('field1', '==', 'value1');
    expect(where).toHaveBeenCalledWith('field2', '>=', 10);
    expect(orderBy).toHaveBeenCalledWith('field1', 'asc');
    expect(limit).toHaveBeenCalledWith(5);
    expect(startAfter).toHaveBeenCalledWith('startAfterValue');
    expect(getDocs).toHaveBeenCalled();
  });
  ///////////////////////////////////
  test('should call getManyDocs with collectionName, constraints, relation, orderConstraint, and limit', async () => {
    const collectionName = 'testCollection';
    const constraints:FeildQueryConstraint[] = [
      { feild: 'field1', comparison: '==', value: 'value1' },
      { feild: 'field2', comparison: '>=', value: 10 },
    ];
    const orderConstraint : OrderContraint = { feild: 'field1', method: 'asc' };
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    await getManyDocs(collectionName, constraints, 'Or', orderConstraint, 5);

    expect(collection).toHaveBeenCalledWith(db, collectionName);
    expect(where).toHaveBeenCalledWith('field1', '==', 'value1');
    expect(where).toHaveBeenCalledWith('field2', '>=', 10);
    expect(orderBy).toHaveBeenCalledWith('field1', 'asc');
    expect(limit).toHaveBeenCalledWith(5);
    expect(getDocs).toHaveBeenCalled();
  });
//////////////////////////////////
test('should return empty array when no documents are found', async () => {
  const collectionName = 'testCollection';
  const constraints : FeildQueryConstraint[] = [
    { feild: 'field1', comparison: "==", value: 'value1' },
    { feild: 'field2', comparison: ">=", value: 10 },
  ] ;

  const mockedQuerySnapshot = {
    docs: [],
  };

  (collection as jest.Mock).mockReturnValue('mockedCollectionRef');
  (query as jest.Mock).mockReturnValue('mockedFinalQuery');
  (getDocs as jest.Mock).mockResolvedValue(mockedQuerySnapshot);
  (getCountFromServer as jest.Mock).mockResolvedValue({ data: () => ({ count: 0 }) });

  const { querySnapshot, docsCount } = await getManyDocs(
    collectionName,
    constraints,
    'And'
  );

  expect(collection).toHaveBeenCalledWith(db, collectionName);
  expect(query).toHaveBeenCalled();
  expect(getDocs).toHaveBeenCalledWith('mockedFinalQuery');
  expect(getCountFromServer).toHaveBeenCalled();
  expect(querySnapshot).toEqual(mockedQuerySnapshot);
  expect(docsCount).toBe(0);
});
////////////////////////////////////////////////////////////////////////
test('should return empty array when documents do not match constraints', async () => {
  const collectionName = 'testCollection';
  const constraints : FeildQueryConstraint[] = [
    { feild: 'field1', comparison: "==", value: 'value3' },
  ] ;

  const mockedDocs = [
    { id: '1', data: () => ({ field1: 'value1' }) },
    { id: '2', data: () => ({ field1: 'value2' }) },
  ];
  const mockedQuerySnapshot = {
    docs: [],
  };

  (collection as jest.Mock).mockReturnValue('mockedCollectionRef');
  (query as jest.Mock).mockReturnValue('mockedFinalQuery');
  (getDocs as jest.Mock).mockResolvedValue(mockedQuerySnapshot);
  (getCountFromServer as jest.Mock).mockResolvedValue({ data: () => ({ count: 0 }) });

  const { querySnapshot, docsCount } = await getManyDocs(
    collectionName,
    constraints,
    'And'
  );

  expect(collection).toHaveBeenCalledWith(db, collectionName);
  expect(query).toHaveBeenCalled();
  expect(getDocs).toHaveBeenCalledWith('mockedFinalQuery');
  expect(getCountFromServer).toHaveBeenCalled();
  expect(querySnapshot).toEqual(mockedQuerySnapshot);
  expect(docsCount).toBe(0);
});
////////////////////////////////////////////////////////////////////////////////////////
test('should call getManyDocs with collectionName, constraints, relation, and limit', async () => {
  const collectionName = 'testCollection';
  const constraints : FeildQueryConstraint[] = [
    { feild: 'field1', comparison: '==', value: 'value1' },
    { feild: 'field2', comparison: '>=', value: 10 },
  ];
  const limitTo = 2;

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
  (getCountFromServer as jest.Mock).mockResolvedValue({ data: () => ({ count: 2 }) });

  const { querySnapshot, docsCount } = await getManyDocs(
    collectionName,
    constraints,
    'And',
    null,
    limitTo
  );

  expect(collection).toHaveBeenCalledWith(db, collectionName);
  expect(query).toHaveBeenCalled();
  expect(where).toHaveBeenCalledTimes(constraints.length);
  expect(limit).toHaveBeenCalledWith(limitTo);
  expect(getDocs).toHaveBeenCalledWith('mockedFinalQuery');
  expect(getCountFromServer).toHaveBeenCalled();
  expect(querySnapshot).toEqual(mockedQuerySnapshot);
  expect(docsCount).toBe(2);
});

});
