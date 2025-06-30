export {};

declare global {
  interface Console {
    error: jest.SpyInstance;
  }
}