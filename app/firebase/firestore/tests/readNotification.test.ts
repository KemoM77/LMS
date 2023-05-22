import { Notification } from '@/app/(authed)/profile/notification';

import addData from '../addData';
import ReadNotification from '../readNotification';

// Mock addData external dependency
jest.mock('../addData', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('ReadNotification', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  test('should successfully mark notification as read', async () => {
    const uid = 'testUid';
    const notif :Notification = {
      id: 'notifId',
      title: 'Notification Title',
      content: 'Notification content',
      createdAt: new Date(),
      isRead: false,
    };

    (addData as jest.Mock).mockResolvedValue({ result: 'mockedResult', error: null });

    await ReadNotification(uid, notif);

    const expectedData = {
      ...notif,
      isRead: true,
    };

    expect(addData).toHaveBeenCalledWith(`users/${uid}/notifications`, notif.id, expectedData);
  });

  test('should handle error while marking notification as read', async () => {
    const uid = 'testUid';
    const notif = {
      id: 'notifId',
      title: 'Notification Title',
      content: 'Notification content',
      createdAt: new Date(),
      isRead: false,
    };

    (addData as jest.Mock).mockResolvedValue({ result: null, error: new Error('mockedError') });

    await ReadNotification(uid, notif);

    const expectedData = {
      ...notif,
      isRead: true,
    };

    expect(addData).toHaveBeenCalledWith(`users/${uid}/notifications`, notif.id, expectedData);
  });
});
