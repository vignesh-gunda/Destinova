import Link from "next/link";
import Navbar from "../components/Navbar";
import { trendingPlaces } from "../data/places";
import { useSession } from "next-auth/react";
import { useMemo, useState , useEffect} from "react";

export default function Browse() {
  const { data: session } = useSession();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const TRENDING_LIMIT = 9; // Limit trending places to the latest 9

  // Take latest added trending places
  // const latestTrendingPlaces = useMemo(() => {
  //   return trendingPlaces.slice(-TRENDING_LIMIT).reverse();
  // }, []);

  const [latestTrendingPlaces, setLatestTrendingPlaces] = useState([]);

  useEffect(() => {
    const shuffled = [...trendingPlaces].sort(() => Math.random() - 0.5);
    setLatestTrendingPlaces(shuffled.slice(0, TRENDING_LIMIT));
  }, []);

  // Broad categories
  const broadClimateCategories = ["Desert", "Alpine", "Tropical", "Temperate", "Coastal"];
  const broadActivityCategories = ["Adventure Sports", "Hiking & Camping", "Water Activities"];
  const broadLandscapeCategories = ["Mountains", "Beaches", "Lakes", "Deserts"];

  // Mapping function for multiple category matching
  const mapCategories = (place: any) => {
    const categories: string[] = [];

    // Climate
    if (place.climate.includes("Desert")) categories.push("Desert");
    if (place.climate.includes("Alpine")) categories.push("Alpine");
    if (place.climate.includes("Tropical")) categories.push("Tropical");
    if (place.climate.includes("Temperate")) categories.push("Temperate");
    if (place.climate.includes("Coastal") || place.climate.includes("Mediterranean")) categories.push("Coastal");

    // Landscape
    if (place.landscape.includes("Mountains")) categories.push("Mountains");
    if (place.landscape.includes("Beach")) categories.push("Beaches");
    if (place.landscape.includes("Lake")) categories.push("Lakes");
    if (place.landscape.includes("Desert") || place.landscape.includes("Canyon")) categories.push("Deserts");

    // Activities
    if (place.activities.some((a: string) => ["Surfing", "Boating", "Snorkeling", "Kayaking"].includes(a)))
      categories.push("Water Activities");
    if (place.activities.some((a: string) => ["Hiking", "Camping", "Wildlife Watching"].includes(a)))
      categories.push("Hiking & Camping");
    if (place.activities.some((a: string) => ["Skiing", "Jeep Tours", "Scenic Drives", "Rafting"].includes(a)))
      categories.push("Adventure Sports");

    return categories;
  };

  // Now allow a place to be part of multiple categories
  const categoryMappings = useMemo(() => {
    const map = new Map<string, any[]>();
    trendingPlaces.forEach((place) => {
      const placeCategories = mapCategories(place);
      placeCategories.forEach((category) => {
        if (!map.has(category)) map.set(category, []);
        map.get(category)?.push(place);
      });
    });
    return map;
  }, []);

  const addToFavorites = async (place: any) => {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ place }),
    });

    if (res.ok) {
      alert(`${place.name} added to your favorites`);
    } else {
      alert("Please sign in to access the favorite places.");
    }
  };

  const renderCategorySlider = (title: string, categories: string[], color: string) => (
    <section className="mb-20 px-6 py-8 bg-gray-200 backdrop-blur-md border-2 border-gray-300 rounded-3xl shadow-xl transition-all duration-300">
      <h2 className={`text-4xl font-extrabold ${color} mb-8 tracking-tight animate-fade-in`}>
        {title}
      </h2>
  
      {/* Horizontal scrollable category pills */}
      <div className="flex overflow-x-auto space-x-6 p-3 no-scrollbar snap-x snap-mandatory">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => setActiveCategory(category === activeCategory ? null : category)}
            className={`min-w-[130px] min-h-[130px] snap-start flex items-center justify-center rounded-full 
              border-2 border-gray-400 bg-gradient-to-br from-blue-100 to-blue-200 
              hover:from-blue-200 hover:to-blue-300 hover:border-blue-500 shadow-md 
              text-center cursor-pointer transition-all transform duration-300 
              hover:-translate-y-2 hover:shadow-lg ${
                category === activeCategory ? 'ring-4 ring-blue-400' : ''
              }`}
          >
            <span className="text-lg font-semibold text-gray-800 px-3">{category}</span>
          </div>
        ))}
      </div>
  
      {/* Expand selected category cards */}
      {activeCategory && categories.includes(activeCategory) && categoryMappings.has(activeCategory) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12 animate-fade-in">
          {categoryMappings.get(activeCategory)?.map((place) => (
            <div
              key={`${place.id}-${activeCategory}`}
              className="relative bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition-all duration-300 transform hover:-translate-y-1 group"
            >
              {/* Favorite Button */}
              <button
                onClick={() => addToFavorites(place)}
                className="absolute top-4 right-4 bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded-full text-sm shadow-sm transition"
                aria-label="Add to favorites"
              >
                ❤️
              </button>
  
              {/* Linkable Card */}
              <Link href={`/destination/${place.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="cursor-pointer">
                  <h3 className="text-xl font-bold text-green-700 group-hover:text-green-900 transition">
                    {place.name}
                  </h3>
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    {place.description.slice(0, 80)}...
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto mt-16 px-6">
        {/* Trending Section */}
        <section className="mb-16 px-6 py-10 bg-gray-200 backdrop-blur-lg border-2 border-gray-300 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-blue-200">
          <h2 className="text-4xl font-extrabold text-blue-800 mb-10 text-center tracking-tight animate-fade-in">
            Trending Tourist Places ⭐
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {latestTrendingPlaces.map((place) => (
              <div
                key={place.id}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all transform duration-300 hover:-translate-y-1 group"
              >
                {/* Favorite Button */}
                <button
                  onClick={() => addToFavorites(place)}
                  className="absolute top-4 right-4 bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded-full text-xs transition shadow-sm"
                  aria-label="Add to favorites"
                >
                  ❤️
                </button>

                {/* Clickable Card */}
                <Link href={`/destination/${place.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="cursor-pointer">
                    <h3 className="text-2xl font-semibold text-green-700 group-hover:text-green-900 transition">
                      {place.name}
                    </h3>
                    <p className="text-gray-600 mt-3 leading-relaxed">
                      {place.description.slice(0, 80)}...
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Browse Sections */}
        {renderCategorySlider("Browse by Climate ☀️❄️🏝️", broadClimateCategories, "text-yellow-600")}
        {renderCategorySlider("Browse by Activities 🏕️🏄🚵", broadActivityCategories, "text-green-600")}
        {renderCategorySlider("Browse by Landscapes 🏔️🏖️🏜️", broadLandscapeCategories, "text-purple-600")}
      </main>

    </>
  );
}
