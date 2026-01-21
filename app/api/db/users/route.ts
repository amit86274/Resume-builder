
import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';
import { getAuthenticatedUser } from '../../../../lib/auth';

export async function GET(req: Request) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const users = await db.collection('users').find({}).toArray();
    // Strip passwords before sending
    const safeUsers = users.map(u => {
      const { password, ...rest } = u;
      return { ...rest, id: u._id.toString() };
    });
    return NextResponse.json(safeUsers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
