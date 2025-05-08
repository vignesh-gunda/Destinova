// import Link from "next/link";
// import Navbar from "../components/Navbar";
// import { trendingPlaces } from "../data/places";
// import { useSession } from "next-auth/react";
// import { useMemo, useState, useEffect } from "react";
// import Image from "next/image";

// export default function Browse() {
//   const { data: session } = useSession();
//   const [activeCategory, setActiveCategory] = useState<string | null>(null);
//   const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

//   const TRENDING_LIMIT = 9;
//   const [latestTrendingPlaces, setLatestTrendingPlaces] = useState<any[]>([]);

//   useEffect(() => {
//     const shuffled = [...trendingPlaces].sort(() => Math.random() - 0.5);
//     setLatestTrendingPlaces(shuffled.slice(0, TRENDING_LIMIT));

//     shuffled.slice(0, TRENDING_LIMIT).forEach(async (place) => {
//       const res = await fetch(
//         `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
//           place.name
//         )}&per_page=1`,
//         {
//           headers: {
//             Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
//           },
//         }
//       );
//       const data = await res.json();
//       const url = data.results?.[0]?.urls?.regular || "/images/default.jpg";
//       setImageUrls((prev) => ({ ...prev, [place.name]: url }));
//     });
//   }, []);

//   const broadClimateCategories = ["Desert", "Alpine", "Tropical", "Temperate", "Coastal"];
//   const broadActivityCategories = ["Adventure Sports", "Hiking & Camping", "Water Activities"];
//   const broadLandscapeCategories = ["Mountains", "Beaches", "Lakes", "Deserts"];

//   const mapCategories = (place: any) => {
//     const categories: string[] = [];
//     if (place.climate.includes("Desert")) categories.push("Desert");
//     if (place.climate.includes("Alpine")) categories.push("Alpine");
//     if (place.climate.includes("Tropical")) categories.push("Tropical");
//     if (place.climate.includes("Temperate")) categories.push("Temperate");
//     if (place.climate.includes("Coastal") || place.climate.includes("Mediterranean")) categories.push("Coastal");

//     if (place.landscape.includes("Mountains")) categories.push("Mountains");
//     if (place.landscape.includes("Beach")) categories.push("Beaches");
//     if (place.landscape.includes("Lake")) categories.push("Lakes");
//     if (place.landscape.includes("Desert") || place.landscape.includes("Canyon")) categories.push("Deserts");

//     if (place.activities.some((a: string) => ["Surfing", "Boating", "Snorkeling", "Kayaking"].includes(a)))
//       categories.push("Water Activities");
//     if (place.activities.some((a: string) => ["Hiking", "Camping", "Wildlife Watching"].includes(a)))
//       categories.push("Hiking & Camping");
//     if (place.activities.some((a: string) => ["Skiing", "Jeep Tours", "Scenic Drives", "Rafting"].includes(a)))
//       categories.push("Adventure Sports");

//     return categories;
//   };

//   const categoryMappings = useMemo(() => {
//     const map = new Map<string, any[]>();
//     trendingPlaces.forEach((place) => {
//       const placeCategories = mapCategories(place);
//       placeCategories.forEach((category) => {
//         if (!map.has(category)) map.set(category, []);
//         map.get(category)?.push(place);
//       });
//     });
//     return map;
//   }, []);

//   const addToFavorites = async (place: any) => {
//     const res = await fetch("/api/favorites", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ place }),
//     });

//     if (res.ok) {
//       alert(`${place.name} added to your favorites`);
//     } else {
//       alert("Please sign in to access the favorite places.");
//     }
//   };

//   const renderCategorySlider = (title: string, categories: string[], color: string) => (
//     <section className="mb-20 px-6 py-8 bg-gray-200/70 border-2 border-gray-300 rounded-3xl shadow-xl">
//       <h2 className={`text-4xl font-extrabold ${color} mb-8 tracking-tight`}>{title}</h2>

//       <div className="flex overflow-x-auto space-x-6 p-3 no-scrollbar snap-x snap-mandatory">
//         {categories.map((category) => (
//           <div
//             key={category}
//             onClick={() => setActiveCategory(category === activeCategory ? null : category)}
//             className={`min-w-[130px] min-h-[130px] snap-start flex items-center justify-center rounded-full 
//               border-2 border-gray-400 bg-gradient-to-br from-blue-100 to-blue-200 
//               hover:from-blue-200 hover:to-blue-300 hover:border-blue-500 shadow-md 
//               text-center cursor-pointer transition-all transform duration-300 
//               hover:-translate-y-2 hover:shadow-lg ${
//                 category === activeCategory ? 'ring-4 ring-blue-400' : ''
//               }`}
//           >
//             <span className="text-lg font-semibold text-gray-800 px-3">{category}</span>
//           </div>
//         ))}
//       </div>

//       {activeCategory && categories.includes(activeCategory) && categoryMappings.has(activeCategory) && (
//         <div className="mt-10 overflow-x-auto py-4">
//           <div className="grid grid-rows-3 auto-cols-[300px] grid-flow-col gap-6">
//             {categoryMappings.get(activeCategory)?.map((place) => (
//               <div
//                 key={`${place.id}-${activeCategory}`}
//                 className="relative bg-white rounded-2xl shadow-md hover:shadow-xl w-[280px] p-4 transition transform hover:-translate-y-1 group"
//               >
//                 <button
//                   onClick={() => addToFavorites(place)}
//                   className="absolute top-3 right-3 bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded-full text-sm shadow-sm"
//                 >
//                   ❤️
//                 </button>
//                 <Link href={`/destination/${place.name.toLowerCase().replace(/\s+/g, "-")}`}>
//                   <div className="cursor-pointer">
//                     <h3 className="text-lg font-bold text-green-700 group-hover:text-green-900">{place.name}</h3>
//                     <p className="text-gray-600 mt-2 text-sm leading-relaxed">
//                       {place.description.slice(0, 70)}...
//                     </p>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </section>
//   );

//   return (
//     <>
//       <Navbar />

//       <div className="fixed inset-0 z-[-1]">
//               {/* Background Image with blur */}
//               <div className="relative w-full h-full text-black">
//               <Image
//                 src="/images/travel.jpg"
//                 alt="Background"
//                 fill
//                 priority
//                 className="object-cover scale-105"
//                 style={{ filter: "blur(8px)" }}
//               />
      
//                 {/* Overlay for dimming */}
//                 <div className="absolute inset-0 bg-white opacity-30" />
//               </div>
//         </div>

//       <main className="max-w-7xl mx-auto mt-16 px-6">
//         <section className="mb-16 px-6 py-10 bg-gray-200/70 border-2 border-gray-300 rounded-3xl shadow-2xl">
//           <h2 className="text-4xl font-extrabold text-blue-800 mb-10 text-center tracking-tight">
//             Trending Tourist Places ⭐
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
//             {latestTrendingPlaces.map((place) => (
//               <div
//                 key={place.id}
//                 className="relative bg-white rounded-2xl shadow-md hover:shadow-lg p-4 transition transform hover:-translate-y-1 group"
//               >
//                 <img
//                   src={imageUrls[place.name] || "/images/default.jpg"}
//                   alt={place.name}
//                   className="w-full h-40 object-cover rounded-xl mb-4"
//                 />
//                 <button
//                   onClick={() => addToFavorites(place)}
//                   className="absolute top-3 right-3 bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded-full text-xs"
//                 >
//                   ❤️
//                 </button>
//                 <Link href={`/destination/${place.name.toLowerCase().replace(/\s+/g, "-")}`}>
//                   <div className="cursor-pointer">
//                     <h3 className="text-2xl font-semibold text-green-700 group-hover:text-green-900">
//                       {place.name}
//                     </h3>
//                     <p className="text-gray-600 mt-2 leading-relaxed">
//                       {place.description.slice(0, 80)}...
//                     </p>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </section>

//         {renderCategorySlider("Browse by Climate ☀️❄️🏝️", broadClimateCategories, "text-yellow-600")}
//         {renderCategorySlider("Browse by Activities 🏕️🏄🚵", broadActivityCategories, "text-green-600")}
//         {renderCategorySlider("Browse by Landscapes 🏔️🏖️🏜️", broadLandscapeCategories, "text-purple-600")}
//       </main>
//     </>
//   );
// }

import Link from "next/link";
import Navbar from "../components/Navbar";
import { trendingPlaces } from "../data/places";
import { useSession } from "next-auth/react";
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";

export default function Browse() {
  const { data: session } = useSession();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [favoritedPlaceIds, setFavoritedPlaceIds] = useState<Set<number>>(new Set());
  const [latestTrendingPlaces, setLatestTrendingPlaces] = useState<any[]>([]);

  const TRENDING_LIMIT = 9;

  useEffect(() => {
    const fetchTrendingPlaces = () => {
      const cached = localStorage.getItem("latestTrendingPlaces");
      const timestamp = localStorage.getItem("lastTrendingTime");

      const now = Date.now();
      if (cached && timestamp && now - parseInt(timestamp) < 20000) {
        setLatestTrendingPlaces(JSON.parse(cached));
      } else {
        const shuffled = [...trendingPlaces].sort(() => Math.random() - 0.5).slice(0, TRENDING_LIMIT);
        setLatestTrendingPlaces(shuffled);
        localStorage.setItem("latestTrendingPlaces", JSON.stringify(shuffled));
        localStorage.setItem("lastTrendingTime", now.toString());
      }
    };

    fetchTrendingPlaces();
  }, []);

  useEffect(() => {
    latestTrendingPlaces.forEach(async (place) => {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(place.name)}&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      const data = await res.json();
      const url = data.results?.[0]?.urls?.regular || "/images/default.jpg";
      setImageUrls((prev) => ({ ...prev, [place.name]: url }));
    });
  }, [latestTrendingPlaces]);

  const broadClimateCategories = ["Desert", "Alpine", "Tropical", "Temperate", "Coastal"];
  const broadActivityCategories = ["Adventure Sports", "Hiking & Camping", "Water Activities"];
  const broadLandscapeCategories = ["Mountains", "Beaches", "Lakes", "Deserts"];

  const mapCategories = (place: any) => {
    const categories: string[] = [];
    if (place.climate.includes("Desert")) categories.push("Desert");
    if (place.climate.includes("Alpine")) categories.push("Alpine");
    if (place.climate.includes("Tropical")) categories.push("Tropical");
    if (place.climate.includes("Temperate")) categories.push("Temperate");
    if (place.climate.includes("Coastal") || place.climate.includes("Mediterranean")) categories.push("Coastal");
    if (place.landscape.includes("Mountains")) categories.push("Mountains");
    if (place.landscape.includes("Beach")) categories.push("Beaches");
    if (place.landscape.includes("Lake")) categories.push("Lakes");
    if (place.landscape.includes("Desert") || place.landscape.includes("Canyon")) categories.push("Deserts");
    if (place.activities.some((a: string) => ["Surfing", "Boating", "Snorkeling", "Kayaking"].includes(a)))
      categories.push("Water Activities");
    if (place.activities.some((a: string) => ["Hiking", "Camping", "Wildlife Watching"].includes(a)))
      categories.push("Hiking & Camping");
    if (place.activities.some((a: string) => ["Skiing", "Jeep Tours", "Scenic Drives", "Rafting"].includes(a)))
      categories.push("Adventure Sports");
    return categories;
  };

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
      setFavoritedPlaceIds((prev) => new Set(prev).add(place.id));
      setTimeout(() => {
        setFavoritedPlaceIds((prev) => {
          const updated = new Set(prev);
          updated.delete(place.id);
          return updated;
        });
      }, 1500);
    } else {
      alert("Please sign in to access the favorite places.");
    }
  };

  const renderHeartButton = (place: any) => (
    <>
      <button
        onClick={() => addToFavorites(place)}
        className={`
          absolute top-3 right-3 rounded-full p-2 text-md text-red-600 shadow-md
          transition-all duration-300 ease-in-out
          ${favoritedPlaceIds.has(place.id) ? "animate-pingOnce bg-red-200 scale-110" : "bg-red-100 hover:bg-red-200"}
        `}
      >
        ❤️
      </button>

      {favoritedPlaceIds.has(place.id) && (
        <span
          className="absolute top-3 left-3 text-green-800 text-md font-bold bg-green-100 px-3 py-1 rounded-full
          shadow-sm animate-fadeInOut transition-opacity"
        >
          ✓ Added!
        </span>
      )}
    </>
  );

  const renderCategorySlider = (title: string, categories: string[], color: string) => (
    <section className="mb-20 px-6 py-8 bg-gray-200/70 border-2 border-gray-300 rounded-3xl shadow-xl">
      <h2 className={`text-4xl font-extrabold ${color} mb-8 tracking-tight`}>{title}</h2>
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

      {activeCategory && categories.includes(activeCategory) && categoryMappings.has(activeCategory) && (
        <div className="mt-10 overflow-x-auto py-4">
          <div className="grid grid-rows-3 auto-cols-[300px] grid-flow-col gap-6">
            {categoryMappings.get(activeCategory)?.map((place) => (
              <div
                key={`${place.id}-${activeCategory}`}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-xl w-[280px] p-4 transition transform hover:-translate-y-1 group"
              >
                {renderHeartButton(place)}
                <Link href={`/destination/${place.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="cursor-pointer">
                    <h3 className="text-lg font-bold text-green-700 group-hover:text-green-900">{place.name}</h3>
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                      {place.description.slice(0, 70)}...
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );

  return (
    <>
      <Navbar />

      <div className="fixed inset-0 z-[-1]">
        <div className="relative w-full h-full text-black">
          <Image
            src="/images/travel.jpg"
            alt="Background"
            fill
            priority
            className="object-cover scale-105"
            style={{ filter: "blur(8px)" }}
          />
          <div className="absolute inset-0 bg-white opacity-30" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto mt-16 px-6">
        <section className="mb-16 px-6 py-10 bg-gray-200/70 border-2 border-gray-300 rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-extrabold text-blue-800 mb-10 text-center tracking-tight">
            Trending Tourist Places ⭐
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {latestTrendingPlaces.map((place) => (
              <div
                key={place.id}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-lg p-4 transition transform hover:-translate-y-1 group"
              >
                <img
                  src={imageUrls[place.name] || "/images/default.jpg"}
                  alt={place.name}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
                {renderHeartButton(place)}
                <Link href={`/destination/${place.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="cursor-pointer">
                    <h3 className="text-2xl font-semibold text-green-700 group-hover:text-green-900">
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
        </section>

        {renderCategorySlider("Browse by Climate ☀️❄️🏝️", broadClimateCategories, "text-yellow-600")}
        {renderCategorySlider("Browse by Activities 🏕️🏄🚵", broadActivityCategories, "text-green-600")}
        {renderCategorySlider("Browse by Landscapes 🏔️🏖️🏜️", broadLandscapeCategories, "text-purple-600")}
      </main>
    </>
  );
}
