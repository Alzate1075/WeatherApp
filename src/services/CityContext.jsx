import React, { createContext, useContext, useState } from "react";

const CityContext = createContext();

export const useCity = () => useContext(CityContext);

export function CityProvider({ children }) {
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  return (
    <CityContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        weatherData,
        setWeatherData,
        isCelsius,
        setIsCelsius,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}
