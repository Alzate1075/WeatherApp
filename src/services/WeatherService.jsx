const API_KEY = "21bf32b9bf8760ff927b8483b5aa1729";

export async function getWeatherByCity(city) {
  try {
    // Primero obtenemos las coordenadas de la ciudad
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        city
      )}&limit=1&appid=${API_KEY}`
    );

    if (!geoRes.ok) {
      throw new Error("No se pudo obtener las coordenadas de la ciudad");
    }

    const geoData = await geoRes.json();

    if (geoData.length === 0) {
      throw new Error("Ciudad no encontrada");
    }

    const { lat, lon } = geoData[0];

    // Usar la API gratuita de 5 días en lugar de One Call API 3.0
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!weatherRes.ok) {
      throw new Error("No se pudo obtener el clima");
    }

    const weatherData = await weatherRes.json();

    // Transformar los datos para que sean compatibles con nuestro componente
    const transformedData = transformWeatherData(weatherData);

    // Agregar información de la ciudad
    transformedData.cityInfo = {
      name: geoData[0].name,
      country: geoData[0].country,
      state: geoData[0].state,
    };

    return transformedData;
  } catch (error) {
    console.error("Error al obtener el clima:", error);
    throw error;
  }
}

export async function getWeatherByCoords(lat, lon) {
  try {
    // Usar la API gratuita de 5 días
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!weatherRes.ok) {
      throw new Error("No se pudo obtener el clima");
    }

    const weatherData = await weatherRes.json();

    // Transformar los datos
    const transformedData = transformWeatherData(weatherData);

    // Obtener información de la ciudad por coordenadas
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );

    if (geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData.length > 0) {
        transformedData.cityInfo = {
          name: geoData[0].name,
          country: geoData[0].country,
          state: geoData[0].state,
        };
      }
    }

    return transformedData;
  } catch (error) {
    console.error("Error al obtener el clima por coordenadas:", error);
    throw error;
  }
}

// Función para transformar los datos de la API gratuita al formato que esperan nuestros componentes
function transformWeatherData(apiData) {
  // Obtener el clima actual (primer elemento de la lista)
  const current = apiData.list[0];

  // Agrupar por día para obtener el pronóstico diario
  const dailyForecasts = [];
  const dailyMap = new Map();

  apiData.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toDateString();

    if (!dailyMap.has(dayKey)) {
      dailyMap.set(dayKey, {
        dt: item.dt,
        temp: {
          day: item.main.temp,
          min: item.main.temp_min,
          max: item.main.temp_max,
        },
        weather: item.weather,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        pressure: item.main.pressure,
        uvi: 0, // La API gratuita no incluye UV index
      });
    } else {
      // Actualizar temperaturas máximas y mínimas
      const existing = dailyMap.get(dayKey);
      existing.temp.min = Math.min(existing.temp.min, item.main.temp_min);
      existing.temp.max = Math.max(existing.temp.max, item.main.temp_max);
    }
  });

  // Convertir el Map a array y tomar solo 6 días (hoy + 5 días)
  const daily = Array.from(dailyMap.values()).slice(0, 6);

  return {
    current: {
      dt: current.dt,
      temp: current.main.temp,
      weather: current.weather,
      humidity: current.main.humidity,
      wind_speed: current.wind.speed,
      pressure: current.main.pressure,
      uvi: 0,
    },
    daily: daily,
  };
}
