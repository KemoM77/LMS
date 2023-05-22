import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';
import { useRouter } from 'next/navigation';

import { createMockRouter } from '@/app/test-utils/createMockRouter';
import { fireEvent, render, screen } from '@testing-library/react';

import ActionDialog from './dialog';

jest.mock('next/navigation');

describe('ActionDialog Component', () => {
  const useRouterMock = useRouter as jest.Mock;
  const mockRouter = createMockRouter({});

  beforeEach(() => {
    useRouterMock.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the dialog with correct title and content', () => {
    render(
      <AppRouterContext.Provider value={mockRouter}>
        <ActionDialog
          title="Test Dialog Title"
          content="Test Dialog Content"
          isOpen={true}
          onClose={jest.fn()}
        />
      </AppRouterContext.Provider>
    );

    expect(screen.getByText(/Test Dialog Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Dialog Content/i)).toBeInTheDocument();
  });

  test('calls onClose prop when the Close button is clicked', () => {
    const onCloseMock = jest.fn();
    render(
      <AppRouterContext.Provider value={mockRouter}>
        <ActionDialog
          title="Test Dialog Title"
          content="Test Dialog Content"
          isOpen={true}
          onClose={onCloseMock}
        />
      </AppRouterContext.Provider>
    );

    fireEvent.click(screen.getByText(/close/i));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('calls router.refresh when the dialog is closed', () => {
    render(
      <AppRouterContext.Provider value={mockRouter}>
        <ActionDialog
          title="Test Dialog Title"
          content="Test Dialog Content"
          isOpen={true}
          onClose={jest.fn()}
        />
      </AppRouterContext.Provider>
    );

    fireEvent.click(screen.getByText(/close/i));

    expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
  });
});
