import React from "react";
import Sidebar from "../components/Sidebar";
import Forecast from "../components/Forecast";
import Search from "../components/Search";

export default function Home({ city, setCity }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar city={city}>
        <Search setCity={setCity} />
      </Sidebar>
      <Forecast city={city} />
    </div>
  );
}
