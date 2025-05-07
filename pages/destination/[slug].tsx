import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import { trendingPlaces } from "../../data/places";
import { useEffect, useState } from "react";

export default function DestinationPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [weather, setWeather] = useState(null);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const place = trendingPlaces.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, "-") === (slug as string)
  );

  useEffect(() => {
    if (!place || !slug) return;

    const fetchWeather = async () => {
      try {
        const response = await fetch(`/api/weather?lat=${place.lat}&lon=${place.lon}`);
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      }
    };

    const fetchUnsplashImage = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(place.name)}&per_page=6`,
          {
            headers: {
              Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
            },
          }
        );
        const data = await response.json();
        const urls = data.results.map((img) => img.urls?.regular);
        if (urls.length > 0) {
          setImageUrl(urls[0]);
          setImageUrls(urls);
        }
      } catch (err) {
        console.error("Failed to fetch Unsplash image:", err);
      }
    };

    fetchWeather();
    fetchUnsplashImage();
  }, [place]);

  const addToFavorites = async (place) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place }),
      });

      if (res.ok) {
        setMessage("✅ Added to Favorites!");
      } else {
        setMessage("❌ Please sign in to access the favorite places page.");
      }
    } catch (error) {
      console.error("Failed to add to favorites:", error);
      setMessage("❌ An error occurred.");
    }
  };

  const renderBlockSection = (title, items, color) => (
    <section className="mb-12 p-5 bg-gray-200/50 rounded-3xl border-2 border-gray-300 z-10 relative">
      <h2 className={`text-3xl font-semibold mb-6 ${color}`}>{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white border-2 rounded-lg shadow-md p-4 hover:shadow-lg hover:border-gray-400 transition transform hover:scale-105"
          >
            <p className="text-gray-800 text-lg font-medium">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );

  if (!place) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold text-red-600">Destination not found</h2>
        </div>
      </>
    );
  }

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
            <source src="/background.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-white opacity-40" />
        </div>
      )}

      <main className="max-w-6xl mx-auto mt-16 px-6 relative z-10">
        {imageUrl && (
          <div className="relative mb-12 cursor-pointer group" onClick={() => setShowGallery(true)}>
            <img
              src={imageUrl}
              alt={place.name}
              className="w-full h-80 object-cover rounded-3xl shadow-md transition group-hover:opacity-90"
            />
            {imageUrls.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full shadow-lg backdrop-blur-sm transition-transform group-hover:scale-105">
                📷 View {imageUrls.length} Photos
              </div>
            )}
          </div>
        )}

        {showGallery && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
            <div className="bg-white rounded-2xl max-w-6xl w-full p-6 relative shadow-2xl">
              <button
                onClick={() => setShowGallery(false)}
                className="absolute top-4 right-4 text-red-600 font-bold text-xl hover:text-red-800"
              >
                ✖
              </button>
              <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">{place.name} Gallery</h2>
              <div className="overflow-x-auto whitespace-nowrap space-x-4 px-2">
                {imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${place.name} - ${index}`}
                    className="inline-block h-80 rounded-xl shadow-md hover:scale-105 transition"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10">
          <h1 className="text-5xl font-extrabold text-blue-800 tracking-tight animate-fade-in">
            {place.name}
            <h3 className="text-2xl font-extrabold text-blue-500 tracking-tight animate-fade-in">
              {place.address}
            </h3>
          </h1>

          <button
            onClick={() => addToFavorites(place)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:-translate-y-1"
          >
            ❤️ Add to Favorites
          </button>
        </div>

        {message && (
          <div className="mb-6 text-green-600 font-semibold bg-green-50 px-4 py-2 rounded shadow-sm animate-fade-in">
            {message}
          </div>
        )}

        <section className="mb-14">
          <h2 className="text-3xl font-bold text-green-700 mb-4 animate-fade-in">About {place.name}</h2>
          <h3 className="text-xl text-gray-700 leading-relaxed mb-3">{place.description}</h3>
          <p className="text-lg text-gray-700 leading-relaxed">{place.about}</p>
        </section>

        <section className="mb-16">
          <h2 className="text-4xl font-extrabold text-indigo-400 mb-8 animate-fade-in">Current Weather 🌦️</h2>
          {weather && weather.current ? (
            <div className="bg-gradient-to-r from-blue-100 via-white to-blue-200 rounded-2xl p-8 shadow-xl border border-indigo-200 backdrop-blur-md transition hover:shadow-indigo-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center gap-6 mb-6 md:mb-0">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@4x.png`}
                    alt={weather.current.weather[0].description}
                    className="w-20 h-20 bg-blue-300 rounded-full"
                  />
                  <div>
                    <p className="text-3xl font-semibold text-gray-800 capitalize">
                      {weather.current.weather[0].description}
                    </p>
                    <p className="text-5xl font-bold text-blue-700">
                      {weather.current.temp}°C
                    </p>
                    <p className="text-gray-600 text-lg">Feels like: {weather.current.feels_like}°C</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                  <div className="bg-white/80 px-6 py-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-lg font-semibold text-indigo-700">Humidity</p>
                    <p className="text-gray-700">{weather.current.humidity}%</p>
                  </div>
                  <div className="bg-white/80 px-6 py-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-lg font-semibold text-indigo-700">Wind</p>
                    <p className="text-gray-700">{weather.current.wind_speed} m/s</p>
                  </div>
                  <div className="bg-white/80 px-6 py-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-lg font-semibold text-indigo-700">Clouds</p>
                    <p className="text-gray-700">{weather.current.clouds}%</p>
                  </div>
                  <div className="bg-white/80 px-6 py-4 rounded-lg shadow-sm border border-gray-200 col-span-2 md:col-span-1">
                    <p className="text-lg font-semibold text-indigo-700">Sunrise</p>
                    <p className="text-gray-700">
                      {new Date(weather.current.sunrise * 1000).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="bg-white/80 px-6 py-4 rounded-lg shadow-sm border border-gray-200 col-span-2 md:col-span-1">
                    <p className="text-lg font-semibold text-indigo-700">Sunset</p>
                    <p className="text-gray-700">
                      {new Date(weather.current.sunset * 1000).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Loading weather information...</p>
          )}
        </section>

        {place.localAttractions &&
          renderBlockSection("Local Attractions 🎡", place.localAttractions, "text-pink-600")}
        {place.adventures &&
          renderBlockSection("Adventures 🚀", place.adventures, "text-orange-600")}
        {place.localCuisines &&
          renderBlockSection("Local Cuisines 🍴", place.localCuisines, "text-red-600")}
        {place.shopping &&
          renderBlockSection("Shopping 🛍️", place.shopping, "text-purple-600")}
      </main>
    </>
  );
}
