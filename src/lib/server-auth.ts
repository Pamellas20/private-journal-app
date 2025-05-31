import { NextRequest } from 'next/server';
   import { getAuth } from 'firebase-admin/auth';
   import { initializeApp, getApps, cert } from 'firebase-admin/app';
   import { DecodedIdToken } from 'firebase-admin/auth';

   if (!getApps().length) {
     initializeApp({
       credential: cert({
         projectId: process.env.FIREBASE_PROJECT_ID,
         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
         privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
       }),
     });
   }

   export async function verifyUser(req: NextRequest): Promise<DecodedIdToken> {
     const authHeader = req.headers.get('authorization');
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
       throw new Error('Unauthorized');
     }
     const idToken = authHeader.split('Bearer ')[1];
     try {
       return await getAuth().verifyIdToken(idToken);
     } catch {
       throw new Error('Invalid token');
     }
   }