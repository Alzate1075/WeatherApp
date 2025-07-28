import React, { useEffect, useState } from "react";
import { getWeatherByCity } from "../services/WeatherService";

export default function Sidebar({ city, children }) {
  const [weather, setWeather] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (city) {
        const weatherData = await getWeatherByCity(city);
        setWeather(weatherData);
      }
    }
    fetchData();
  }, [city]);

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
            className="cursor-pointer w-45 bg-gray-600 text-white py-2"
            onClick={() => setShowSearch(true)}
          >
            Search for places
          </button>
          <button className="cursor-pointer bg-gray-600 text-white p-2 rounded-full">
            <img src="/location.svg" alt="Location" className="w-6" />
          </button>
        </div>

        <div>
          {weather && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt={weather.weather[0].main}
              className="w-60 h-50 mx-auto"
            />
          )}
        </div>
      </div>

      <div className="flex items-center text-[100px] text-white font-bold">
        {weather ? Math.round(weather.main.temp) : "--"}
        <span className="text-4xl align-top text-gray-400">°C</span>
      </div>

      <div className="text-4xl text-gray-300">
        {weather ? weather.weather[0].main : "Cargando..."}
      </div>

      <div className="mt-10 text-sm text-gray-400 space-y-2">
        <p>Today • {new Date().toDateString()}</p>
        <div className="w-5 flex gap-2">
          <img src="/public/location_on.svg" alt="Location" />
          <p>{city}</p>
        </div>
      </div>
    </div>
  );
}
