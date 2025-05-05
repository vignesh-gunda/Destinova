// pages/api/weather.ts
export default async function handler(req, res) {
    const { lat, lon } = req.query;
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  
    if (!lat || !lon) {
      return res.status(400).json({ message: "Latitude and Longitude are required" });
    }
  
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
  
      const data = await weatherRes.json();
  
      if (data.cod && data.cod !== 200) {
        return res.status(data.cod).json({ message: data.message });
      }
  
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching weather" });
    }
  }
  