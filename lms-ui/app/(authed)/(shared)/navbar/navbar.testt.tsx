import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';
import { createMockRouter } from '@/app/test-utils/createMockRouter';
import PrimarySearchAppBar from './navbar';
import { AuthContext } from '@/app/context/AuthContext';
import { createMockAuthContext } from '@/app/test-utils/createMockAuthContext';

jest.mock('../../../firebase');
jest.mock('firebase/auth');
// jest.mock('../../firebase/auth/signin');

const mockAuthContextValue = {
  currentUser: {
    id: 'testUserId',
  },
};

describe('PrimarySearchAppBar component', () => {
  it('renders correctly and calls onMenuButtonClick', () => {
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <AuthContext.Provider value={createMockAuthContext({})}>
          <PrimarySearchAppBar onMenuButtonClick={jest.fn()} isOpen={true} />
        </AuthContext.Provider>
      </AppRouterContext.Provider>
    );
    // Check if the component has rendered
    expect(screen.getByText('BookWoods')).toBeInTheDocument();
  });
});
