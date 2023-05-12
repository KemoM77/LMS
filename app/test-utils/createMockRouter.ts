import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import {  } from 'next/navigation';

export function createMockRouter(router: Partial<AppRouterInstance>): AppRouterInstance {
  return {
    back: jest.fn(),
    prefetch: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    forward: jest.fn(),
    refresh:jest.fn(),
    ...router,
  };
}
