import clientPromise from "../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const session = await getServerSession(req, res, authOptions);
        if (!session) return res.status(401).json({ message: "Unauthorized" });
      
        const client = await clientPromise;
        const db = client.db("auth-demo");
      
        const { place } = req.body;
      
        // 🧠 Only add if not already saved
        const exists = await db.collection("favorites").findOne({
          userEmail: session.user.email,
          "place.name": place.name, // Assuming place name is unique
        });
      
        if (!exists) {
          await db.collection("favorites").insertOne({
            userEmail: session.user.email,
            place,
            addedAt: new Date(),
          });
        }
      
        return res.status(200).json({ message: "Favorite stored (or already existed)" });
      }

  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json([]); // return empty array, not error object
  
    const client = await clientPromise;
    const db = client.db("auth-demo");
  
    const favorites = await db
      .collection("favorites")
      .find({ userEmail: session.user.email })
      .toArray();
  
    return res.status(200).json(favorites);
  }
  if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: "Unauthorized" });
  
    const { placeId } = req.body;
    if (!placeId) return res.status(400).json({ message: "Missing placeId" });
  
    const client = await clientPromise;
    const db = client.db("auth-demo");
  
    await db.collection("favorites").deleteOne({
      userEmail: session.user.email,
      "place.name": placeId, // Use name as unique identifier for simplicity
    });
  
    return res.status(200).json({ message: "Removed from favorites" });
  }

  return res.status(405).end();
}


