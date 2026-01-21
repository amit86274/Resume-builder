
import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';
import { signToken } from '../../../../lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const db = await getDb();
    
    const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existing) return NextResponse.json({ error: "Email exists" }, { status: 400 });

    const newUser = {
      name,
      email: email.toLowerCase(),
      password,
      role: email.toLowerCase() === 'amit86274@gmail.com' ? 'admin' : 'user',
      plan: 'free',
      createdAt: new Date().toISOString()
    };

    const result = await db.collection('users').insertOne(newUser);
    const token = signToken({ id: result.insertedId.toString(), email: newUser.email, role: newUser.role as any });
    
    return NextResponse.json({ user: { ...newUser, _id: result.insertedId }, token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
