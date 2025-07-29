const IPINFO_TOKEN = "ea1aff434d60e8";

export async function getCityByIP() {
  try {
    const res = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
    if (!res.ok) throw new Error("No se pudo obtener la ubicación");
    const data = await res.json();
    return data.city || "Bogotá";
  } catch (error) {
    console.error("Error al obtener la ubicación por IP:", error);
    return "Bogotá";
  }
}

export async function getLocationByIP() {
  try {
    const res = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
    if (!res.ok) throw new Error("No se pudo obtener la ubicación");
    const data = await res.json();

    const [lat, lon] = data.loc.split(",").map((coord) => parseFloat(coord));

    return {
      city: data.city,
      country: data.country,
      region: data.region,
      lat,
      lon,
    };
  } catch (error) {
    console.error("Error al obtener la ubicación por IP:", error);
    throw error;
  }
}

export async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalización no soportada"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error("Error al obtener ubicación actual"));
      }
    );
  });
}
