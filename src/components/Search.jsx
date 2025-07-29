import React, { useState, useEffect, useRef } from "react";

const API_KEY = "21bf32b9bf8760ff927b8483b5aa1729";

export default function Search({ setCity, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      await searchCities(query);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const searchCities = async (searchQuery) => {
    if (searchQuery.trim().length < 2) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          searchQuery
        )}&limit=5&appid=${API_KEY}`
      );

      if (!res.ok) throw new Error("Error en la búsqueda");

      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Error buscando ciudades:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "Enter":
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Escape":
        onClose();
        break;
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    setCity(query.trim());
    setQuery("");
    setResults([]);
    onClose();
  };

  const handleSelect = (place) => {
    const cityName = place.name;
    const countryName = place.country;
    const displayName = countryName ? `${cityName}, ${countryName}` : cityName;

    setCity(displayName);
    setQuery("");
    setResults([]);
    onClose();
  };

  const formatLocationName = (place) => {
    const parts = [place.name];
    if (place.state) parts.push(place.state);
    if (place.country) parts.push(place.country);
    return parts.join(", ");
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-[#1E213A] p-4 z-50">
      <div className="flex items-end justify-end hover:transition transform scale-105 m-4">
        <button
          onClick={onClose}
          className="cursor-pointer text-white text-xl ml-4 hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-around">
        <div className="relative w-full flex flex-row items-center justify-start">
          <img
            src="/search.svg"
            alt="Search"
            className="absolute w-5 h-5 text-gray-400 ml-3"
          />
          <input
            type="text"
            placeholder="Buscar ciudad..."
            className="w-full p-2 pl-10 text-gray-400 border border-white font-semibold rounded bg-transparent focus:outline-none focus:border-blue-500"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        <button
          className="cursor-pointer bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>

      <div className="mt-4 max-h-64 overflow-y-auto">
        {loading && (
          <div className="text-center text-gray-400 py-4">Buscando...</div>
        )}

        {!loading && results.length > 0 && (
          <ul className="space-y-1">
            {results.map((place, index) => (
              <li
                key={`${place.name}-${place.country}-${index}`}
                className={`text-white p-3 rounded cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? "bg-blue-600"
                    : "bg-[#2e2e40] hover:bg-[#444]"
                }`}
                onClick={() => handleSelect(place)}
              >
                <div className="flex items-center">
                  <img
                    src="/location_on.svg"
                    alt="Location"
                    className="w-4 h-4 mr-2 text-gray-400"
                  />
                  <span>{formatLocationName(place)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            No se encontraron ciudades
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-gray-400">
        <p>Escribe para buscar ciudades o usa las flechas para navegar</p>
        <p className="text-sm mt-2">Presiona Enter para seleccionar o buscar</p>
      </div>
    </div>
  );
}
