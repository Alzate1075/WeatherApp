import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Forecast from "./components/Forecast";
import { getCityByIP } from "./services/LocationService";
import { getWeatherByCity } from "./services/WeatherService";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Bogotá");

  useEffect(() => {
    const fetchInitialWeather = async () => {
      const cityFromIP = await getCityByIP();
      setCity(cityFromIP);
      const data = await getWeatherByCity(cityFromIP);
      setWeatherData(data);
    };

    fetchInitialWeather();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#100E1D]">
      <Sidebar city={city} setCity={setCity} setWeatherData={setWeatherData} />
      {weatherData ? (
        <Forecast weatherData={weatherData} />
      ) : (
        <div className="text-white m-auto text-lg">Cargando clima...</div>
      )}
    </div>
  );
}

export default App;
