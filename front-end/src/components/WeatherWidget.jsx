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
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  function getWeatherIcon(code) {
    if (code === 0) return "☀️";
    if (code >= 1 && code <= 3) return "🌤️";
    if (code === 45 || code === 48) return "🌫️";
    if (code >= 51 && code <= 67) return "🌦️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 80 && code <= 82) return "🌧️";
    if (code >= 95 && code <= 99) return "⛈️";
    return "❔";
  }

  const weatherIcon = getWeatherIcon(desc);

  return (
    <div className="bg-neutral-200 dark:bg-neutral-900 rounded-md h-12 flex gap-2 px-4 text-base">
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm opacity-25">Strasbourg</div>
          <div className="opacity-50">
            {weatherIcon} {temp}°C
          </div>
          <div className="capitalize opacity-25">{date}</div>
        </div>
      )}
    </div>
  );
}
