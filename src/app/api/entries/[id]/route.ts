import { NextRequest, NextResponse } from 'next/server';
   import { db } from '@/lib/firebase';
   import { query, where, getDocs, deleteDoc, doc, collection } from 'firebase/firestore';
   import { verifyUser } from '@/lib/server-auth';

   export async function DELETE(req: NextRequest): Promise<NextResponse> {
     try {
       const url = new URL(req.url);
       const id = url.pathname.split('/').pop();
       if (!id) {
         return NextResponse.json({ error: 'Missing entry ID' }, { status: 400 });
       }
       const user = await verifyUser(req);
       const entryRef = doc(db, 'entries', id);
       const snapshot = await getDocs(query(collection(db, 'entries'), where('userId', '==', user.uid)));
       const entryExists = snapshot.docs.some((doc) => doc.id === id);
       if (!entryExists) {
         return NextResponse.json({ error: 'Entry not found or unauthorized' }, { status: 404 });
       }
       await deleteDoc(entryRef);
       return NextResponse.json({ success: true });
     } catch {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
   }