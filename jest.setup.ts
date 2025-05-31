// C:\Upamella\OneDrive\Desktop\Shecan-pro\my-journal-app\jest.setup.ts
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock Firebase Admin SDK
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  cert: jest.fn(() => ({})),
  getAuth: jest.fn(() => ({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-uid' }),
  })),
  credential: {
    cert: jest.fn(() => ({})),
  },
  apps: [], // Mock the apps array
}));

// Mock Response constructor
global.Response = class Response {
  constructor(body: any, options: { status?: number; headers?: Record<string, string> } = {}) {
    this.status = options.status || 200;
    this.headers = new Headers(options.headers || {});
    this.body = body;
  }
  json(): Promise<any> {
    return Promise.resolve(this.body);
  }
  status: number;
  headers: Headers;
  body: any;
} as unknown as typeof Response;