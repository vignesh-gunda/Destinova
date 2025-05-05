import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [placeImages, setPlaceImages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchFavorites = async () => {
      const res = await fetch("/api/favorites");
      const data = await res.json();

      if (Array.isArray(data)) {
        const places = data.map((item) => item.place);
        setFavorites(places);

        // Fetch Unsplash images
        places.forEach(async (place) => {
          const imgUrl = await fetchImageFromUnsplash(place.name);
          setPlaceImages((prev) => ({ ...prev, [place.name]: imgUrl }));
        });
      } else {
        console.warn("Invalid favorites data:", data);
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (placeName: string) => {
    const res = await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId: placeName }),
    });

    if (res.ok) {
      setFavorites((prev) => prev.filter((p) => p.name !== placeName));
    } else {
      alert("Failed to remove favorite.");
    }
  };

  const fetchImageFromUnsplash = async (query: string) => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      const data = await res.json();
      return data.results?.[0]?.urls?.regular || "/images/default.jpg";
    } catch (error) {
      console.error("Failed to fetch image:", error);
      return "/images/default.jpg";
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto mt-20 px-4">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
          Your Favorite Places ❤️
        </h2>

        {favorites.length === 0 ? (
          <div className="bg-white/70 border border-gray-200 rounded-2xl p-8 text-center shadow-md backdrop-blur-md">
            <p className="text-lg text-gray-600">No favorites yet. Go explore and add some destinations to your list!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((place, idx) => (
              <div
                key={idx}
                className="relative bg-white border border-gray-300 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Unsplash Image */}
                <img
                  src={placeImages[place.name] || "/images/default.jpg"}
                  alt={place.name}
                  className="w-full h-48 object-cover rounded-t-3xl"
                />

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-blue-800 mb-2">{place.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {place.description.slice(0, 100)}...
                  </p>

                  <div className="flex justify-between items-center mt-6">
                    <Link
                      href={`/destination/${place.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                      View Details →
                    </Link>

                    <button
                      onClick={() => handleRemove(place.name)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 text-sm px-3 py-1 rounded-full transition"
                    >
                      ✖ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
