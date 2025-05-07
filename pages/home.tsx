import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { trendingPlaces } from "../data/places";
import Navbar from "../components/Navbar";

export default function Home() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isClient, setIsClient] = useState(false); // 👈 New state
  const router = useRouter();
  const inputRef = useRef(null);

  // Set client-render flag
  useEffect(() => {
    setIsClient(true);
  }, []);

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

      {isClient && (
        <div className="fixed inset-0 z-[-1] overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover blur-[3px] scale-105"
          >
            <source src="videos/background.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-white opacity-20" />
        </div>
      )}

      <main className="min-h-screen flex flex-col items-center pt-24 justify-start px-4 relative">
        <h1 className="text-7xl font-extrabold text-blue-700 mb-10 text-center z-10">
          <div className="text-5xl animate-fade-in-up delay-600">Welcome to</div>
          <div className="mt-5">
            {"Destinova".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block animate-fade-in-up"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {char}
              </span>
            ))}
          </div>
        </h1>

        <section className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 animate-fade-in-up delay-600">
            Find Places That Match <span className="font-extrabold text-slate-900">You</span>
          </h2>
          <p className="text-black font-bold text-xl max-w-xl animate-fade-in-up delay-600">
            Your next unforgettable journey starts here. Just type, and let Destinova do the rest.
          </p>
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

      <style jsx global>{`
        @keyframes fade-letter {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-letter {
          animation: fade-letter 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}
