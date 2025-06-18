require('@testing-library/jest-dom');
require("whatwg-fetch");

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


