import React from "react";

export default function NextDaysWeather({ forecast }) {
  if (!forecast || forecast.length === 0) {
    return <p className="text-white">No hay pronóstico disponible.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-white">
      {forecast.slice(1, 6).map((day, i) => (
        <div key={i} className="bg-[#1E213A] p-4 text-center">
          <h3 className="mb-2">
            {new Date(day.dt_txt).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </h3>
          <img
            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
            alt="weather icon"
            className="mx-auto h-12"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span>{Math.round(day.main.temp_max)}°C</span>
            <span className="text-gray-400">
              {Math.round(day.main.temp_min)}°C
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
