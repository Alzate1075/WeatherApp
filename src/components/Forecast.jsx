import React, { useState } from "react";
import { useWeather } from "../services/WeatherContext";

export default function Forecast({ weatherData }) {
  const [view, setView] = useState("5days");

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

  const nextDays = weatherData.daily.slice(1, 6);

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

  const { isCelsius, setIsCelsius, currentWeather } = useWeather();

  const convertTemp = (temp) =>
    isCelsius ? Math.round(temp) : Math.round(temp * 1.8 + 32);

  return (
    <div className="flex-1 bg-[#100E1D] text-white overflow-x-hidden">
      <div className="max-w-6xl w-full mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6 xl:mx-25">
          <h2 className="text-3xl font-semibold">Forecast</h2>
          <div className="space-x-2">
            <div className="inline-flex bg-[#1E213A] p-1 rounded-lg overflow-hidden mr-4 gap-2">
              <button
                onClick={() => setIsCelsius(true)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  isCelsius
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setIsCelsius(false)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  !isCelsius
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                °F
              </button>
            </div>
            <div className="inline-flex bg-[#1E213A] p-1 rounded-lg overflow-hidden mr-4 gap-2">
              <button
                onClick={() => setView("today")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  view === "today"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Hoy
              </button>
              <button
                onClick={() => setView("5days")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  view === "5days"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                5 días
              </button>
            </div>
          </div>
        </div>

        {/* INFORMACION CLIMA HOY */}
        {view === "today" ? (
          <div className="bg-[#1E213A] p-8 rounded-lg text-center shadow-lg lg:mx-20">
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
                🌡️ {convertTemp(today.temp.max)}°
              </span>
              <span className="text-blue-400">
                ❄️ {convertTemp(today.temp.min)}°
              </span>
            </div>

            {/* CARDS CLIMA HOY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 mt-8 shadow-xl border border-[#131525] lg:mx-25">
              {/* WIND STATUS */}
              <div className="bg-[#1E213A] p-6 rounded-lg shadow-xl border border-[#131525]">
                <h4 className="text-gray-400 text-sm mb-2">Wind Status</h4>
                <p className="text-3xl font-semibold text-white">
                  {today.wind_speed.toFixed(1)}{" "}
                  <span className="text-sm">m/s</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Dirección: {today.wind_deg}°
                </p>
              </div>
              {/* HUMIDITY */}
              <div className="bg-[#1E213A] p-6 rounded-lg shadow-xl border border-[#131525]">
                <h4 className="text-gray-400 text-sm mb-2">Humidity</h4>
                <p className="text-3xl font-semibold text-white">
                  {today.humidity}%
                </p>
                <div className="w-full h-2 bg-gray-700 rounded mt-2">
                  <div
                    className="h-full bg-yellow-400 rounded"
                    style={{ width: `${today.humidity}%` }}
                  ></div>
                </div>
              </div>

              {/* VISIBILITY */}
              <div className="bg-[#1E213A] p-6 rounded-lg shadow-xl border border-[#131525]">
                <h4 className="text-gray-400 text-sm mb-2">Visibility</h4>
                <p className="text-3xl font-semibold text-white">
                  {(weatherData.current.visibility / 1000).toFixed(2)}{" "}
                  <span className="text-sm">km</span>
                </p>
              </div>

              {/* AIR PRESSURE */}
              <div className="bg-[#1E213A] p-6 rounded-lg shadow-xl border border-[#131525]">
                <h4 className="text-gray-400 text-sm mb-2">Air Pressure</h4>
                <p className="text-3xl font-semibold text-white">
                  {today.pressure} <span className="text-sm">mb</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-6">
            {/* CARDS PROXIMOS 5 DIAS */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 xl:mx-25 border-2 border-[#131525] p-4">
              {nextDays.map((day, index) => (
                <div
                  key={index}
                  className="w-auto h-50 bg-[#1E213A] rounded-lg shadow-lg flex flex-col justify-center items-center hover:bg-[#2A2D3A] transition-colors cursor-pointer"
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
                  <div className="w-full flex justify-between text-sm">
                    <span className="text-red-400">
                      🌡️ {convertTemp(day.temp.max)}°
                    </span>
                    <span className="text-blue-400">
                      ❄️ {convertTemp(day.temp.min)}°
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center border-2 border-[#131525] rounded-lg p-1 xl:mx-25">
              <h3 className="text-3xl font-semibold mb-4 text-blue-300">
                Today`s Hightlights
              </h3>
            </div>

            {/* CARDS LO MAS DESTACADO */}

            <div className="text-center items-center grid grid-cols-1 md:grid-cols-2 gap-6 p-4 mt-3 shadow-xl border-2 border-[#131525] lg:mx-25">
              {/* WIND STATUS */}
              <div className="h-45 bg-[#1E213A] p-6 rounded-lg shadow-xl border border-[#131525] gap-4">
                <h4 className="text-gray-400 text-md mb-2">Wind Status</h4>
                <p className="text-6xl font-bold text-white">
                  {today.wind_speed.toFixed(1)}{" "}
                  <span className="text-[30px]">m/s</span>
                </p>
                <p className="text-gray-400 text-md mt-2">
                  Dirección: {today.wind_deg}°
                </p>
              </div>
              {/* HUMIDITY */}
              <div className="h-45 bg-[#1E213A] p-6 rounded-lg shadow-xl border border-[#131525]">
                <h4 className="text-gray-400 text-md mb-2">Humidity</h4>
                <p className="text-6xl font-bold text-white">
                  {today.humidity}%
                </p>
                <div className="w-full h-2 bg-gray-700 rounded mt-4">
                  <div
                    className="h-full bg-yellow-400 rounded"
                    style={{ width: `${today.humidity}%` }}
                  ></div>
                </div>
              </div>

              {/* VISIBILITY */}
              <div className="h-45 bg-[#1E213A] p-6 rounded-lg shadow-xl border border-[#131525]">
                <h4 className="text-gray-400 text-md mb-2">Visibility</h4>
                <p className="text-6xl font-bold text-white">
                  {(weatherData.current.visibility / 1000).toFixed(2)}{" "}
                  <span className="text-[30px]">km</span>
                </p>
              </div>

              {/* AIR PRESSURE */}
              <div className="h-45 bg-[#1E213A] p-6 rounded-lg shadow-xl border border-[#131525]">
                <h4 className="text-gray-400 text-md mb-2">Air Pressure</h4>
                <p className="text-6xl font-bold text-white">
                  {today.pressure} <span className="text-[30px]">mb</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
