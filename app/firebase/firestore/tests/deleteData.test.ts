import { deleteDoc, doc } from 'firebase/firestore';
import { deleteData } from '../deleteData';

// just Mocking the 'db' constant :)
export const db = {};

jest.mock('../getData', () => ({
  db: db,
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => ({
    id: 'mockedDocId',
  })),
  deleteDoc: jest.fn(() => Promise.resolve()),
}));

describe('deleteData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully delete data', async () => {
    const id = 'testId';
    const collectionName = 'testCollection';

    const result = await deleteData(id, collectionName);

    expect(doc).toHaveBeenCalledWith(db, collectionName, id);
    expect(deleteDoc).toHaveBeenCalledWith({ id: 'mockedDocId' });
    expect(result).toEqual({ e: null });
  });

  test('should handle non-existent document', async () => {
    const id = 'nonExistentId';
    const collectionName = 'testCollection';

    (doc as jest.Mock).mockReturnValueOnce({});

    const result = await deleteData(id, collectionName);

    expect(doc).toHaveBeenCalledWith(db, collectionName, id);
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  test('should handle error', async () => {
    const id = 'testId';
    const collectionName = 'testCollection';
    const error = new Error('Test error');

    (deleteDoc as jest.Mock).mockRejectedValueOnce(error);

    const result = await deleteData(id, collectionName);

    expect(doc).toHaveBeenCalledWith(db, collectionName, id);
    expect(deleteDoc).toHaveBeenCalledWith({ id: 'mockedDocId' });
    expect(result).toEqual({ e: error });
  });
  test('should handle document with no id property', async () => {
    const id = 'testId';
    const collectionName = 'testCollection';

    (doc as jest.Mock).mockReturnValueOnce({});

    const result = await deleteData(id, collectionName);

    expect(doc).toHaveBeenCalledWith(db, collectionName, id);
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  test('should handle error with no code property', async () => {
    const id = 'testId';
    const collectionName = 'testCollection';
    const error = new Error('Test error without code');

    (deleteDoc as jest.Mock).mockRejectedValueOnce(error);

    const result = await deleteData(id, collectionName);

    expect(doc).toHaveBeenCalledWith(db, collectionName, id);
    expect(deleteDoc).toHaveBeenCalledWith({ id: 'mockedDocId' });
    expect(result).toEqual({ e: error });  });
});
