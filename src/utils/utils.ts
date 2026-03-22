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

  const formatter = new Intl.DateTimeFormat("es-MX", options);
  const parts = formatter.format(new Date());

  return parts.replace(/ de (\d{4})/, " del $1");
};


/** Estilos para el Input del Formulario */

export const inputClassName =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";