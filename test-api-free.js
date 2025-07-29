// Archivo de prueba para verificar la API gratuita
const API_KEY = "21bf32b9bf8760ff927b8483b5aa1729";

async function testFreeAPI() {
  try {
    console.log("Probando API gratuita de OpenWeather...");
    
    // 1. Probar geocoding
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=Bogotá&limit=1&appid=${API_KEY}`
    );
    
    if (!geoRes.ok) {
      throw new Error("Error en geocoding API");
    }
    
    const geoData = await geoRes.json();
    console.log("Geocoding data:", geoData);
    
    if (geoData.length === 0) {
      throw new Error("No se encontró la ciudad");
    }

    const { lat, lon } = geoData[0];
    console.log(`Coordenadas: ${lat}, ${lon}`);

    // 2. Probar API gratuita de 5 días
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!weatherRes.ok) {
      throw new Error(`Error en Forecast API: ${weatherRes.status}`);
    }
    
    const weatherData = await weatherRes.json();
    console.log("Weather data structure:", {
      list: weatherData.list ? `✅ (${weatherData.list.length} elementos)` : "❌",
      city: weatherData.city ? "✅" : "❌"
    });
    
    if (weatherData.list && weatherData.list.length > 0) {
      console.log("Primer elemento:", {
        dt: weatherData.list[0].dt,
        temp: weatherData.list[0].main.temp,
        weather: weatherData.list[0].weather[0]
      });
    }
    
    console.log("✅ API gratuita funciona correctamente");
    
  } catch (error) {
    console.error("❌ Error en la API:", error.message);
  }
}

// Ejecutar la prueba
testFreeAPI(); 