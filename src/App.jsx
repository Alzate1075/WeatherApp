import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Forecast from "./components/Forecast";
import Search from "./components/Search";
import { getLocationByIP } from "./services/LocationService";
import { getWeatherByCity } from "./services/WeatherService";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Bogotá");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherByCity(cityName);
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = async (newCity) => {
    setCity(newCity);
    await fetchWeatherData(newCity);
  };

  const handleWeatherDataUpdate = (newWeatherData) => {
    setWeatherData(newWeatherData);
    if (newWeatherData?.cityInfo?.name) {
      setCity(newWeatherData.cityInfo.name);
    }
  };

  useEffect(() => {
    const fetchInitialWeather = async () => {
      try {
        const locationData = await getLocationByIP();
        const cityName = locationData.city;
        setCity(cityName);
        await fetchWeatherData(cityName);
      } catch (error) {
        console.error("Error getting initial location:", error);
        // Fallback a una ciudad por defecto
        await fetchWeatherData("Bogotá");
      }
    };

    fetchInitialWeather();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#100E1D]">
      <Sidebar
        city={city}
        weatherData={weatherData}
        setWeatherData={handleWeatherDataUpdate}
      >
        <Search
          setCity={handleCityChange}
          onClose={() => {}} // Placeholder
        />
      </Sidebar>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-white text-lg">Cargando clima...</div>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-lg mb-2">
              Error al cargar el clima
            </div>
            <div className="text-gray-400 text-sm mb-4">{error}</div>
            <button
              onClick={() => fetchWeatherData(city)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : weatherData ? (
        <Forecast weatherData={weatherData} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-lg">No hay datos disponibles</div>
        </div>
      )}
    </div>
  );
}

export default App;
