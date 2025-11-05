import { useEffect, useState } from "react";

export default function WeatherWidget() {
  const [temp, setTemp] = useState(null);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current_weather=true"
    )
      .then((res) => res.json())
      .then((data) => {
        setTemp(Math.round(data.current_weather.temperature));
        setDesc(data.current_weather.weathercode);
      })
      .catch(() => setDesc("N/A"))
      .finally(() => setLoading(false));
  }, []);

  const date = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const weatherIcon = "🌤️";

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg px-6 py-4 text-white text-sm">
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xl font-bold">
              {weatherIcon} {temp}°C
            </div>
            <div className="text-sm text-gray-100">Paris</div>
          </div>
          <div className="text-right capitalize">{date}</div>
        </div>
      )}
    </div>
  );
}
