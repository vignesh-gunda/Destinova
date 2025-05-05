import clientPromise from "../lib/mongodb";
import bcrypt from "bcryptjs";

export async function addUser(email: string, password: string) {
  const client = await clientPromise;
  const db = client.db("auth-demo");

  const existing = await db.collection("users").findOne({ email });
  if (existing) return null;

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = { email, password: hashedPassword, createdAt: new Date() };
  const result = await db.collection("users").insertOne(user);
  return { id: result.insertedId, email: user.email };
}

export async function verifyUser(email: string, password: string) {
  const client = await clientPromise;
  const db = client.db("auth-demo");

  const user = await db.collection("users").findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) return null;

  return { id: user._id, email: user.email };
}