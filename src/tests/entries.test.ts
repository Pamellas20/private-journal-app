// src/tests/entries.test.ts

import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/entries/route';

jest.mock('@/lib/firebase-admin', () => ({
  db: {
    collection: jest.fn(() => ({
      add: jest.fn(async () => ({ id: 'mockEntryId' })),
      get: jest.fn(async () => ({
        docs: [
          {
            id: '1',
            data: () => ({ title: 'Test Entry', content: 'This is a test', createdAt: { toDate: () => new Date() } }),
          },
        ],
      })),
    })),
  },
}));

describe('/api/entries API route', () => {
  it('should return entries on GET', async () => {
    const req = {} as NextRequest;
    const res = await GET(req);

    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].title).toBe('Test Entry');
  });

  it('should create an entry on POST', async () => {
    const body = JSON.stringify({ title: 'New Entry', content: 'Entry content' });
    const req = {
      json: async () => JSON.parse(body),
      headers: new Headers(),
    } as unknown as NextRequest;

    const res = await POST(req);

    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.id).toBe('mockEntryId');
  });
});
