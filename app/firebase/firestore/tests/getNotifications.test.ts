import getManyDocs from '../getManyDocs';
import getNotification from '../getNotifications';

// Mock getManyDocs external dependency
jest.mock('../getManyDocs', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('getNotification', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  test('should successfully get notifications and return them', async () => {
    const uid = 'testUid';
    const mockedNotifications = [
      { id: '1', data: () => ({ isRead: true }) },
      { id: '2', data: () => ({ isRead: false }) },
    ];
    const mockedQuerySnapshot = {
      docs: mockedNotifications,
    };

    (getManyDocs as jest.Mock).mockResolvedValue({
      docsCount: 2,
      querySnapshot: mockedQuerySnapshot,
    });

    const { notifications, docsCount } = await getNotification(uid);

    expect(getManyDocs).toHaveBeenCalledWith(`users/${uid}/notifications`, [], 'And', {
      feild: 'createdAt',
      method: 'desc',
    });
    expect(notifications).toEqual(mockedNotifications);
    expect(docsCount).toBe(2);
  });

  test('should handle empty notifications array', async () => {
    const uid = 'testUid';

    (getManyDocs as jest.Mock).mockResolvedValue({
      docsCount: 0,
      querySnapshot: {
        docs: [],
      },
    });

    const { notifications, docsCount } = await getNotification(uid);

    expect(getManyDocs).toHaveBeenCalledWith(`users/${uid}/notifications`, [], 'And', {
      feild: 'createdAt',
      method: 'desc',
    });
    expect(notifications).toEqual([]);
    expect(docsCount).toBe(0);
  });

  test('should handle error in getManyDocs', async () => {
    const uid = 'testUid';

    (getManyDocs as jest.Mock).mockRejectedValue(new Error('mockedError'));

    try {
      await getNotification(uid);
    } catch (error) {
      expect(getManyDocs).toHaveBeenCalledWith(`users/${uid}/notifications`, [], 'And', {
        feild: 'createdAt',
        method: 'desc',
      });
      expect(error).toEqual(new Error('mockedError'));
    }
  });
});
