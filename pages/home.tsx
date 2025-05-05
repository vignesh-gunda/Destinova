import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { trendingPlaces } from "../data/places";
import Navbar from "../components/Navbar";

export default function Home() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  const filteredPlaces = trendingPlaces.filter((place) =>
    place.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectPlace = (placeName: string) => {
    const slug = placeName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/destination/${slug}`);
    setQuery("");
    setShowDropdown(false);
  };

  return (
    <>
      <Navbar />
      <div className="fixed inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-stone-300 animate-background-blur z-[-1]" />

      <main className="min-h-screen flex flex-col items-center pt-32 justify-start px-4 relative">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-10 text-center z-10 animate-fade-in-up">
          Welcome to <span className="text-green-600">Destinova 🌍</span>
        </h1>

        <section className="text-center mt-4 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 animate-fade-in-up delay-600">
            🌍 Find Places That Match *You*
          </h2>

          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-700 text-lg max-w-2xl animate-fade-in-up delay-600">
              🚀 Your next unforgettable journey starts here. Just type, and let Destinova do the rest.
            </p>
          </div>
        </section>

        {/* Search Input */}
        <div className="w-full max-w-md relative z-10 animate-fade-in-up delay-700">
          <input
            type="text"
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            placeholder="Search destinations..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => handleSelectPlace(place.name)}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-gray-800 border-b text-lg last:border-b-0"
                  >
                    {place.name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No destinations found.</div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
