import React, { useState } from "react";

export default function Forecast({ weatherData }) {
  const [view, setView] = useState("5days");

  // Verificar que tenemos los datos necesarios
  if (!weatherData || !weatherData.daily || weatherData.daily.length === 0) {
    return (
      <div className="flex-1 bg-[#100E1D] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-2">No hay datos del clima disponibles</p>
          <p className="text-gray-400">Verifica tu conexión a internet</p>
        </div>
      </div>
    );
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

  const formatShortDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
    });
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getWeatherIconLarge = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  return (
    <div className="flex-1 bg-[#100E1D] text-white overflow-x-hidden">
      <div className="max-w-6xl w-full mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Pronóstico</h2>
          <div className="space-x-2">
            <button
              onClick={() => setView("today")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === "today"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setView("5days")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === "5days"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              5 días
            </button>
          </div>
        </div>

        {view === "today" ? (
          <div className="bg-[#1E213A] p-8 rounded-lg text-center shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-blue-300">
              {formatDate(today.dt)}
            </h3>
            <img
              src={getWeatherIconLarge(today.weather[0].icon)}
              alt={today.weather[0].description}
              className="w-32 h-32 mx-auto mb-4"
            />
            <p className="text-xl mb-4 capitalize text-gray-200">
              {today.weather[0].description}
            </p>
            <div className="flex justify-center items-center gap-6 text-2xl mb-6">
              <span className="text-red-400">
                🌡️ {Math.round(today.temp.max)}°
              </span>
              <span className="text-blue-400">
                ❄️ {Math.round(today.temp.min)}°
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-[#2A2D3A] p-3 rounded-lg">
                <p className="text-gray-400 mb-1">Humedad</p>
                <p className="text-white text-lg">{today.humidity}%</p>
              </div>
              <div className="bg-[#2A2D3A] p-3 rounded-lg">
                <p className="text-gray-400 mb-1">Viento</p>
                <p className="text-white text-lg">
                  {Math.round(today.wind_speed)} km/h
                </p>
              </div>
              <div className="bg-[#2A2D3A] p-3 rounded-lg">
                <p className="text-gray-400 mb-1">Presión</p>
                <p className="text-white text-lg">{today.pressure} hPa</p>
              </div>
              <div className="bg-[#2A2D3A] p-3 rounded-lg">
                <p className="text-gray-400 mb-1">UV Index</p>
                <p className="text-white text-lg">{Math.round(today.uvi)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Vista de tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {nextDays.map((day, index) => (
                <div
                  key={index}
                  className="bg-[#1E213A] p-4 rounded-lg shadow-lg flex flex-col items-center hover:bg-[#2A2D3A] transition-colors cursor-pointer"
                >
                  <h3 className="text-sm font-semibold mb-3 text-blue-300">
                    {formatShortDate(day.dt)}
                  </h3>
                  <img
                    src={getWeatherIcon(day.weather[0].icon)}
                    alt={day.weather[0].description}
                    className="w-16 h-16 mb-3"
                  />
                  <p className="text-xs mb-3 text-center capitalize text-gray-300">
                    {day.weather[0].description}
                  </p>
                  <div className="flex justify-between w-full text-sm">
                    <span className="text-red-400">
                      🌡️ {Math.round(day.temp.max)}°
                    </span>
                    <span className="text-blue-400">
                      ❄️ {Math.round(day.temp.min)}°
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Vista de lista detallada */}
            <div className="bg-[#1E213A] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-300">
                Detalles del pronóstico
              </h3>
              <div className="space-y-3">
                {nextDays.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#2A2D3A] rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-gray-300 min-w-[80px]">
                        {formatShortDate(day.dt)}
                      </div>
                      <img
                        src={getWeatherIcon(day.weather[0].icon)}
                        alt={day.weather[0].description}
                        className="w-12 h-12"
                      />
                      <div>
                        <p className="text-sm capitalize text-gray-200">
                          {day.weather[0].description}
                        </p>
                        <p className="text-xs text-gray-400">
                          Humedad: {day.humidity}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-red-400">
                        🌡️ {Math.round(day.temp.max)}°
                      </span>
                      <span className="text-blue-400">
                        ❄️ {Math.round(day.temp.min)}°
                      </span>
                      <span className="text-gray-400">
                        💨 {Math.round(day.wind_speed)} km/h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
