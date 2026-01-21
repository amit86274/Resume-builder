
import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';
import { signToken } from '../../../../lib/auth';

export async function POST(req: Request) {
  try {
    const { email, name, providerId } = await req.json();
    const db = await getDb();
    let user = await db.collection('users').findOne({ email: email.toLowerCase() });

    if (!user) {
      const newUser = {
        name,
        email: email.toLowerCase(),
        password: `social_${providerId}`,
        role: 'user',
        plan: 'free',
        createdAt: new Date().toISOString()
      };
      const result = await db.collection('users').insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    }

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });
    return NextResponse.json({ user, token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
