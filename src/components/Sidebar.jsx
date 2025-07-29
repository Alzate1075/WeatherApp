import React, { useState } from "react";
import { getCurrentLocation } from "../services/LocationService";
import { getWeatherByCoords } from "../services/WeatherService";

export default function Sidebar({
  city,
  weatherData,
  setWeatherData,
  children,
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Extraer datos del clima actual del weatherData
  const currentWeather = weatherData?.current;
  const todayForecast = weatherData?.daily?.[0];
  const cityInfo = weatherData?.cityInfo;

  const handleLocationClick = async () => {
    setLoadingLocation(true);
    try {
      const coords = await getCurrentLocation();
      const weatherData = await getWeatherByCoords(coords.lat, coords.lon);
      setWeatherData(weatherData);
    } catch (error) {
      console.error("Error obteniendo ubicación actual:", error);
      alert(
        "No se pudo obtener tu ubicación actual. Verifica que hayas dado permisos de ubicación."
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="md:w-[40%] lg:w-[30%] bg-[#1E213A] flex flex-col items-center text-center relative">
      {showSearch &&
        React.cloneElement(children, {
          setCity: children.props.setCity,
          onClose: () => setShowSearch(false),
        })}

      <div className="w-full bg-[url('/others/Cloud-background2.png')] bg-no-repeat bg-cover bg-center pt-6 z-0">
        <div className="flex justify-between z-10 gap-4 mx-6">
          <button
            className="cursor-pointer w-45 bg-gray-600 text-white py-2 hover:bg-gray-700 transition-colors"
            onClick={() => setShowSearch(true)}
          >
            Search for places
          </button>
          <button
            className={`cursor-pointer bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition-colors ${
              loadingLocation ? "animate-spin" : ""
            }`}
            onClick={handleLocationClick}
            disabled={loadingLocation}
          >
            <img src="/location.svg" alt="Location" className="w-6" />
          </button>
        </div>

        <div className="mt-8">
          {currentWeather && (
            <img
              src={getWeatherIcon(currentWeather.weather[0].icon)}
              alt={currentWeather.weather[0].main}
              className="w-60 h-50 mx-auto"
            />
          )}
        </div>
      </div>

      <div className="flex items-center text-[100px] text-white font-bold">
        {currentWeather ? Math.round(currentWeather.temp) : "--"}
        <span className="text-4xl align-top text-gray-400">°C</span>
      </div>

      <div className="text-4xl text-gray-300 capitalize">
        {currentWeather ? currentWeather.weather[0].description : "Cargando..."}
      </div>

      <div className="mt-10 text-sm text-gray-400 space-y-2">
        <p>Today • {formatDate(Date.now() / 1000)}</p>
        <div className="flex items-center justify-center gap-2">
          <img src="/location_on.svg" alt="Location" className="w-4 h-4" />
          <p className="text-white">
            {cityInfo?.name || city}
            {cityInfo?.country && `, ${cityInfo.country}`}
          </p>
        </div>
      </div>

      {/* Información adicional del clima actual */}
      {currentWeather && (
        <div className="mt-8 w-full px-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-[#2A2D3A] p-3 rounded-lg">
              <p className="text-gray-400">Humedad</p>
              <p className="text-white text-lg">{currentWeather.humidity}%</p>
            </div>
            <div className="bg-[#2A2D3A] p-3 rounded-lg">
              <p className="text-gray-400">Viento</p>
              <p className="text-white text-lg">
                {Math.round(currentWeather.wind_speed)} km/h
              </p>
            </div>
            <div className="bg-[#2A2D3A] p-3 rounded-lg">
              <p className="text-gray-400">Presión</p>
              <p className="text-white text-lg">
                {currentWeather.pressure} hPa
              </p>
            </div>
            <div className="bg-[#2A2D3A] p-3 rounded-lg">
              <p className="text-gray-400">UV Index</p>
              <p className="text-white text-lg">
                {Math.round(currentWeather.uvi)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
