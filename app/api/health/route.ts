
import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    if (!db) {
       return NextResponse.json({ status: "error", message: "Database not initialized" }, { status: 503 });
    }
    await db.command({ ping: 1 });
    
    return NextResponse.json({ 
      status: "online", 
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: "error", 
      message: error.message || "Database connection failed"
    }, { status: 503 });
  }
}
