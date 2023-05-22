import { serverTimestamp } from 'firebase/firestore';

// Correct the import statement for faker
import * as faker from '@faker-js/faker';

import addData from '../addData';
import addNotification from '../addNotification';

// Mock external dependencies
jest.mock('../addData', () => jest.fn());
jest.mock('firebase/firestore', () => ({
  serverTimestamp: () => 'mockedServerTimestamp',
}));

// Mock mongodbObjectId to return a consistent value
faker.faker.database.mongodbObjectId = jest.fn(() => 'mockedObjectId');

describe('addNotification', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  test('should successfully add notification', async () => {
    const uid = 'testUid';
    const title = 'testTitle';
    const content = 'testContent';

    (addData as jest.Mock).mockResolvedValue({ result: 'mockedResult', error: null });

    await addNotification(uid, title, content);

    const expectedData = {
      id: 'mockedObjectId' + uid + title,
      createdAt: 'mockedServerTimestamp',
      content: content,
      title: title,
      isRead: false,
    };

    expect(addData).toHaveBeenCalledWith(`users/${uid}/notifications`, expectedData.id, expectedData);
  });

  test('should handle empty title and content', async () => {
    const uid = 'testUid';
    const title = '';
    const content = '';

    (addData as jest.Mock).mockResolvedValue({ result: 'mockedResult', error: null });

    await addNotification(uid, title, content);

    const expectedData = {
      id: 'mockedObjectId' + uid + title,
      createdAt: 'mockedServerTimestamp',
      content: content,
      title: title,
      isRead: false,
    };

    expect(addData).toHaveBeenCalledWith(`users/${uid}/notifications`, expectedData.id, expectedData);
  });
});
