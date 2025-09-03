export function toLocalISOString(date: Date): string {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 19);
}

export function formatFechaHora(date: Date): string {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  const dia = String(localDate.getDate()).padStart(2, "0");
  const mes = String(localDate.getMonth() + 1).padStart(2, "0");
  const anio = localDate.getFullYear();
  const hora = String(localDate.getHours()).padStart(2, "0");
  const min = String(localDate.getMinutes()).padStart(2, "0");
  const seg = String(localDate.getSeconds()).padStart(2, "0");
  return `${dia}/${mes}/${anio} ${hora}:${min}:${seg}`;
}
