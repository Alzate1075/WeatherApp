import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [city, setCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_API_KEY_WEATHER;
  const IPINFO_TOKEN = import.meta.env.VITE_IPINFO_TOKEN;

  // Obtener ciudad desde IP
  const getCityFromIP = async () => {
    try {
      const res = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
      const data = await res.json();
      return data.city || "Bogotá";
    } catch (error) {
      console.error("Error al obtener ciudad por IP:", error);
      return "Bogotá";
    }
  };

  // Obtener clima a partir del nombre de ciudad
  const fetchWeatherByCity = async (cityName) => {
    try {
      setLoading(true);

      const resCity = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
      );
      const { lat, lon } = resCity.data.coord;

      const resForecast = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      setWeatherData(resForecast.data);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener clima:", err);
      setWeatherData(null);
      setLoading(false);
    }
  };

  // Al iniciar, obtener ciudad desde IP y luego el clima
  useEffect(() => {
    const init = async () => {
      const initialCity = await getCityFromIP();
      setCity(initialCity);
      fetchWeatherByCity(initialCity);
    };
    init();
  }, []);

  // Si cambia la ciudad manualmente
  useEffect(() => {
    if (city) {
      fetchWeatherByCity(city);
    }
  }, [city]);

  return (
    <WeatherContext.Provider value={{ city, setCity, weatherData, loading }}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => useContext(WeatherContext);
