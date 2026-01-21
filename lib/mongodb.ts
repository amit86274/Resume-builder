
import { MongoClient } from 'mongodb';

const URI = "mongodb+srv://keyframe:D3v3l0p3r@cluster0.uzvsg.mongodb.net/resumebuilder?retryWrites=true&w=majority";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

if (!client) {
  client = new MongoClient(URI);
  clientPromise = client.connect();
} else {
  clientPromise = Promise.resolve(client);
}

export async function getDb() {
  const connectedClient = await clientPromise;
  return connectedClient.db("resumebuilder");
}

export default clientPromise;
