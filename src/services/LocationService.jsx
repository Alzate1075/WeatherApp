const IPINFO_TOKEN = "ea1aff434d60e8"; // tu token real

export async function getCityByIP() {
  try {
    const res = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
    if (!res.ok) throw new Error("No se pudo obtener la ubicación");
    const data = await res.json();
    return data.city;
  } catch (error) {
    console.error("Error al obtener la ubicación por IP:", error);
    return "Bogotá"; // fallback
  }
}
