import React, { useState } from "react";
import axios from "axios";

export default function Search({ setCity, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=TU_API_KEY`
      );
      setResults(res.data.features);
    } catch (err) {
      console.error("Error buscando ciudad:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = (place) => {
    const name = place.properties.city || place.properties.name;
    setCity(name);
    setQuery("");
    setResults([]);
    onClose();
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-[#1E213A] p-4 z-50">
      <div className="flex items-end justify-end hover:transition transform scale-105 m-4">
        <button
          onClick={onClose}
          className="cursor-pointer text-white text-xl ml-4"
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
            placeholder="Search location"
            className="w-full p-2 pl-10 text-gray-400 border border-white font-semibold rounded bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          className="cursor-pointer bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {results.map((place, index) => (
          <li
            key={index}
            className="text-white bg-[#2e2e40] p-2 rounded cursor-pointer hover:bg-[#444]"
            onClick={() => handleSelect(place)}
          >
            {place.properties.name},{" "}
            {place.properties.country_code.toUpperCase()}
          </li>
        ))}
      </ul>
    </div>
  );
}
