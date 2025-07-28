const API_KEY = "21bf32b9bf8760ff927b8483b5aa1729"; // tu apiKey real

export async function getWeatherByCity(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) throw new Error("No se pudo obtener el clima");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el clima:", error);
    return null;
  }
}
