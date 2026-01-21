
import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';
import { getAuthenticatedUser } from '../../../../lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  const user = getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  const resumes = await db.collection('resumes').find({ userId: user.id }).toArray();
  return NextResponse.json(resumes);
}

export async function POST(req: Request) {
  const user = getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const db = await getDb();
  const result = await db.collection('resumes').insertOne({ ...data, userId: user.id, lastEdited: new Date().toISOString() });
  return NextResponse.json({ ...data, _id: result.insertedId });
}

export async function PUT(req: Request) {
  const user = getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { _id, update } = await req.json();
  const { _id: unused, userId: unused2, ...cleanUpdate } = update;
  const db = await getDb();
  await db.collection('resumes').updateOne({ _id: new ObjectId(_id), userId: user.id }, { $set: { ...cleanUpdate, lastEdited: new Date().toISOString() } });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const user = getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { _id } = await req.json();
  const db = await getDb();
  await db.collection('resumes').deleteOne({ _id: new ObjectId(_id), userId: user.id });
  return NextResponse.json({ success: true });
}
