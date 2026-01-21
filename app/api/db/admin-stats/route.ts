
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
    const totalUsers = await db.collection('users').countDocuments();
    const totalResumes = await db.collection('resumes').countDocuments();
    const payments = await db.collection('payments').find({}).toArray();
    
    const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    
    return NextResponse.json({
      totalUsers,
      totalRevenue,
      dbStats: { 
        documentCount: totalUsers + totalResumes + payments.length 
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
