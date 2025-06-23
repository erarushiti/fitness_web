// frontend/jest.setup.ts
import '@testing-library/jest-dom';
import 'whatwg-fetch';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}));
