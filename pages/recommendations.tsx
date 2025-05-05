import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { extractFeatures, cosineSimilarity } from "../utils/featureExtractor";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      const res = await fetch("/api/recommend");
      const data = await res.json();
      setRecommendations(data);
    };

    fetchRecommendations();
  }, []);

  useEffect(() => {
    if (recommendations[currentIndex]) {
      fetchUnsplashImage(recommendations[currentIndex].name);
    }
  }, [currentIndex, recommendations]);

  const fetchUnsplashImage = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      const data = await response.json();
      const url = data.results?.[0]?.urls?.regular;
      if (url) setImageUrl(url);
      else setImageUrl("/images/default.jpg");
    } catch (err) {
      console.error("Image fetch failed:", err);
      setImageUrl("/images/default.jpg");
    }
  };

  const handleNext = () => {
    if (favorites.length > 0) {
      const sorted = recommendations
        .filter((_, idx) => idx !== currentIndex)
        .sort((a, b) => {
          return (
            getSimilarityScore(b, favorites) - getSimilarityScore(a, favorites)
          );
        });

      if (sorted.length > 0) {
        setCurrentIndex(recommendations.indexOf(sorted[0]));
      } else {
        setCurrentIndex((prev) => (prev + 1) % recommendations.length);
      }
    } else {
      setCurrentIndex((prev) => (prev + 1) % recommendations.length);
    }
    setMessage("");
  };

  const handleFavorite = async (place: any) => {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ place }),
    });

    if (res.ok) {
      setMessage("✅ Added to Favorites!");
      setFavorites((prev) => [...prev, place]);
    } else {
      setMessage("❌ Failed to add. Try again.");
    }
  };

  const getSimilarityScore = (place: any, favs: any[]) => {
    const placeVec = extractFeatures(place);
    const favVecs = favs.map((fav) => extractFeatures(fav));
    const avgFavVec = averageVectors(favVecs);
    return cosineSimilarity(placeVec, avgFavVec);
  };

  const averageVectors = (vectors: number[][]) => {
    const avg = vectors[0].map((_, idx) =>
      vectors.reduce((sum, vec) => sum + vec[idx], 0) / vectors.length
    );
    return avg;
  };

  const current = recommendations[currentIndex];

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto min-h-screen px-3 py-8 flex flex-col items-center justify-start">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-8 tracking-tight text-center animate-fade-in-up">
          Your Recommended Destinations
        </h1>

        {current ? (
          <div className="relative w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-300 overflow-hidden animate-fade-in-up transition-all duration-500">
            {/* Image Section */}
            <div className="relative group">
              <img
                src={imageUrl}
                alt={current.name}
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-left">
                <h3 className="text-2xl font-bold text-white drop-shadow-md">{current.name}</h3>
                <p className="text-white/80 mt-1 text-xs">{current.description}</p>
              </div>
            </div>

            {/* Destination Info Section */}
            <div className="p-5 sm:p-6 text-center bg-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xl text-gray-700 mb-4 ">
                {[
                  { label: "Climate", value: current.climate },
                  { label: "Landscape", value: current.landscape },
                  { label: "Culture", value: current.culture },
                  { label: "Budget", value: current.budget },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border-2 border-gray-300 rounded-md p-3 shadow-sm hover:shadow-md hover:border-indigo-400 transition"
                  >
                    <span className="block font-semibold text-indigo-700 text-md mb-1">{item.label}</span>
                    <p className="text-gray-800 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border-2 border-gray-300 px-4 py-3 rounded-md shadow-sm hover:shadow-md hover:border-indigo-400 transition mb-6 text-md sm:text-sm">
                <span className="block font-semibold text-indigo-700 text-xl mb-1">Activities</span>
                <p className="text-gray-800">{current.activities.join(", ")}</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                {recommendations.length > 1 && (
                  <button
                    onClick={handleNext}
                    className="px-5 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 transition"
                  >
                    Next ➡️
                  </button>
                )}
                <button
                  onClick={() => handleFavorite(current)}
                  className="px-5 py-1.5 bg-red-500 text-white text-sm font-medium rounded-md shadow hover:bg-red-600 transition"
                >
                  ❤️ Favorite
                </button>
              </div>

              {message && (
                <p className="mt-4 text-green-600 font-semibold text-sm animate-fade-in">
                  {message}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic mt-10 animate-pulse">
            Fetching your perfect match...
          </p>
        )}
      </main>



    </>
  );
}
