import React, { useState } from "react";

export default function Forecast({ weatherData }) {
  const [view, setView] = useState("5days");

  if (!weatherData || !weatherData.daily) {
    return <div className="text-white p-4">No hay datos del clima.</div>;
  }

  const today = weatherData.daily[0];
  const nextDays = weatherData.daily.slice(1, 6); // próximos 5 días (sin contar hoy)

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="flex-1 bg-[#100E1D] text-white overflow-x-hidden">
      <div className="max-w-5xl w-full mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Pronóstico</h2>
          <div className="space-x-2">
            <button
              onClick={() => setView("today")}
              className={`px-4 py-1 rounded ${
                view === "today" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setView("5days")}
              className={`px-4 py-1 rounded ${
                view === "5days" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              5 días
            </button>
          </div>
        </div>

        {view === "today" ? (
          <div className="bg-[#1E213A] p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">
              {formatDate(today.dt)}
            </h3>
            <img
              src={`https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`}
              alt={today.weather[0].description}
              className="w-20 h-20 mx-auto"
            />
            <p className="mt-2">{today.weather[0].description}</p>
            <p className="mt-2">
              🌡️ {Math.round(today.temp.max)}° / {Math.round(today.temp.min)}°
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {nextDays.map((day, index) => (
              <div
                key={index}
                className="bg-[#1E213A] p-4 rounded-lg shadow-lg flex flex-col items-center"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {formatDate(day.dt)}
                </h3>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                  className="w-20 h-20"
                />
                <p className="mt-2">{day.weather[0].description}</p>
                <p className="mt-2">
                  🌡️ {Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
