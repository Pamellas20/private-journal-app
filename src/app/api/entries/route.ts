import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = getFirestore();

// Helper function to verify token and get user
async function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('No valid authorization header');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('No token provided');
    }

    // Verify the token
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Token verification failed: ' + (error as Error).message);
  }
}

// GET - Fetch all entries for the user
export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const userId = decodedToken.uid;

    const entriesRef = db.collection('entries');
    const snapshot = await entriesRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const entries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json(entries);
  } catch (error) {
    console.error('GET entries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries: ' + (error as Error).message },
      { status: 401 }
    );
  }
}

// POST - Create a new entry
export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const userId = decodedToken.uid;

    const body = await request.json();
    console.log('Received body:', body); // Debug received body
    const { title, content } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const entryData = {
      title: title.trim(),
      content: content.trim(),
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('entries').add(entryData);
    console.log('Entry saved with ID:', docRef.id); // Debug save success

    return NextResponse.json({
      id: docRef.id,
      ...entryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('POST entries error:', error);
    return NextResponse.json(
      { error: 'Failed to create entry: ' + (error as Error).message },
      { status: 401 }
    );
  }
}

// DELETE - Delete an entry
export async function DELETE(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const userId = decodedToken.uid;

    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('id');

    if (!entryId) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    // First verify the entry belongs to the user
    const entryRef = db.collection('entries').doc(entryId);
    const entryDoc = await entryRef.get();

    if (!entryDoc.exists) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    const entryData = entryDoc.data();
    if (entryData?.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this entry' },
        { status: 403 }
      );
    }

    await entryRef.delete();

    return NextResponse.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('DELETE entries error:', error);
    return NextResponse.json(
      { error: 'Failed to delete entry: ' + (error as Error).message },
      { status: 401 }
    );
  }
}