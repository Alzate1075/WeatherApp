import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [city, setCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
  const IPINFO_TOKEN = import.meta.env.VITE_IPINFO_TOKEN;

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

  const fetchWeather = async (cityName) => {
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&lang=es&appid=${
            import.meta.env.VITE_API_KEY_WEATHER
          }`
        );
        const data = await res.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error al obtener clima:", error);
      }
    };

    fetchWeather();
  }, [city]);

  return (
    <WeatherContext.Provider value={{ city, setCity, weatherData, loading }}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => useContext(WeatherContext);
