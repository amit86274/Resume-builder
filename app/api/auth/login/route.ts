
import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';
import { signToken } from '../../../../lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const db = await getDb();
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser, token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
