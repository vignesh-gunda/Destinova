import { trendingPlaces } from "../../data/places";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import clientPromise from "../../lib/mongodb";
import { extractFeatures, averageVectors, scaleVector, cosineSimilarity } from "../../utils/featureExtractor";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const client = await clientPromise;
  const db = client.db("auth-demo");

  const favorites = await db.collection("favorites")
    .find({ userEmail: session.user.email })
    .sort({ favoritedAt: -1 }) // Ensure most recent favorites come first
    .toArray();

  const favoritePlaces = favorites.map(fav => fav.place);

  if (favoritePlaces.length === 0) {
    return res.status(400).json({ message: "No favorites yet" });
  }

  // Assign weights to each favorite (more recent => higher weight)
  const totalFavorites = favoritePlaces.length;
  const weightedVectors = favoritePlaces.map((place, index) => {
    const weight = (totalFavorites - index) / totalFavorites; // e.g., for 3 items: [1.0, 0.67, 0.33]
    const vector = extractFeatures(place);
    return scaleVector(vector, weight); // scale the vector by its weight
  });

  const userProfileVector = averageVectors(weightedVectors);

  // Filter out favorites from trending
  const nonFavoritePlaces = trendingPlaces.filter(
    place => !favoritePlaces.some(fav => fav.name === place.name)
  );

  // Score the remaining places
  const scoredPlaces = nonFavoritePlaces.map((place) => {
    const vector = extractFeatures(place);
    const similarity = cosineSimilarity(userProfileVector, vector);
    return { place, similarity };
  });

  // Sort by similarity
  const sortedPlaces = scoredPlaces.sort((a, b) => b.similarity - a.similarity);

  // Return top 5
  const topPlaces = sortedPlaces.slice(0, 20).map(item => item.place);

  return res.status(200).json(topPlaces);
}
