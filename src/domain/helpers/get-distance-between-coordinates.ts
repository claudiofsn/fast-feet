interface GetDistanceBetweenCoordinatesProps {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
}

/**
 * Calcula a distância entre duas coordenadas geográficas.
 * Utiliza a fórmula de Haversine para maior precisão em esferas.
 *
 * @param {number} lat1 - Latitude do ponto A
 * @param {number} lon1 - Longitude do ponto A
 * @param {number} lat2 - Latitude do ponto B
 * @param {number} lon2 - Longitude do ponto B
 * @return {number} Distância em quilômetros (km)
 */
export function getDistanceBetweenCoordinates({
  lat1,
  lon1,
  lat2,
  lon2,
}: GetDistanceBetweenCoordinatesProps) {
  function toRad(value: number) {
    return (value * Math.PI) / 180;
  }

  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distância em km

  return d;
}
