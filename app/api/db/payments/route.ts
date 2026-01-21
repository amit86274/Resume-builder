
import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';
import { getAuthenticatedUser } from '../../../../lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  const user = getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    const query = user.role === 'admin' ? {} : { userId: user.id };
    const payments = await db.collection('payments')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(payments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const db = await getDb();
    
    const payment = { 
      ...body, 
      userId: user.id, 
      createdAt: new Date().toISOString() 
    };
    
    const result = await db.collection('payments').insertOne(payment);
    
    if (payment.status === 'captured') {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + (payment.plan === 'annual' ? 12 : 1));
      
      await db.collection('users').updateOne(
        { _id: new ObjectId(user.id) },
        { 
          $set: { 
            plan: payment.plan,
            "subscription.status": "active",
            "subscription.currentPeriodEnd": expiry.toISOString()
          } 
        }
      );
    }
    
    return NextResponse.json({ ...payment, _id: result.insertedId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
