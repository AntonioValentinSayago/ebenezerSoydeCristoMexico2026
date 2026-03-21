/**
 * Formatear la Fecha
 * @param isoString
 * @returns
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const formatter = new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formatter.format(date);
}

/** Obtener la Fecha Mexico City */
export const getMexicoDate = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Mexico_City",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  // Usamos 'es-MX' para asegurar que el nombre del mes sea en español
  const formatter = new Intl.DateTimeFormat("es-MX", options);
  const parts = formatter.format(new Date());

  // Pequeño ajuste decorativo para usar "del" en lugar de "de" para el año
  // Resultado: "20 de marzo de 2026" -> "20 de marzo del 2026"
  return parts.replace(/ de (\d{4})/, " del $1");
};
