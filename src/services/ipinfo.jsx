export const getCityFromIP = async () => {
  try {
    const res = await fetch(
      `https://ipinfo.io/json?token=${import.meta.env.VITE_IPINFO_TOKEN}`
    );
    const data = await res.json();
    return data.city;
  } catch (error) {
    console.error("Error al obtener ciudad con IPinfo:", error);
    return "Bogotá"; // Valor por defecto
  }
};
