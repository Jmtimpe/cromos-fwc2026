// Helpers para manejar fechas/horas del Mundial 2026
// Forzamos siempre America/Guayaquil (GMT-5)
import { SEDES } from './partidosData';

const ECUADOR_GMT = -5;

// Convierte fecha + hora local de sede a Date en Ecuador
export const fechaPartidoEnEcuador = (fechaStr, horaLocalStr, sedeKey) => {
  const sede = SEDES[sedeKey];
  if (!sede) return null;
  
  // Parsear fecha y hora local de la sede
  const [year, month, day] = fechaStr.split('-').map(Number);
  const [hours, minutes] = horaLocalStr.split(':').map(Number);
  
  // Crear timestamp UTC asumiendo la hora es local de la sede
  const utcTimestamp = Date.UTC(year, month - 1, day, hours - sede.gmtOffset, minutes);
  
  // Crear Date object (interpretación nativa)
  const fecha = new Date(utcTimestamp);
  return fecha;
};

// Formatear hora en Ecuador (HH:MM)
export const horaEcuador = (fechaStr, horaLocalStr, sedeKey) => {
  const fecha = fechaPartidoEnEcuador(fechaStr, horaLocalStr, sedeKey);
  if (!fecha) return '--:--';
  
  // Calcular hora en Ecuador
  const horaUtc = fecha.getUTCHours();
  const minUtc = fecha.getUTCMinutes();
  let horaEc = horaUtc + ECUADOR_GMT;
  if (horaEc < 0) horaEc += 24;
  
  return `${String(horaEc).padStart(2, '0')}:${String(minUtc).padStart(2, '0')}`;
};

// Fecha formateada para mostrar (ej: "Sáb 13 Jun")
export const fechaFormateada = (fechaStr, horaLocalStr, sedeKey) => {
  const fecha = fechaPartidoEnEcuador(fechaStr, horaLocalStr, sedeKey);
  if (!fecha) return fechaStr;
  
  // Restamos 5 horas para obtener fecha en Ecuador
  const fechaEc = new Date(fecha.getTime() + ECUADOR_GMT * 60 * 60 * 1000);
  
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  return `${dias[fechaEc.getUTCDay()]} ${fechaEc.getUTCDate()} ${meses[fechaEc.getUTCMonth()]}`;
};

// Determinar si es "hoy" en Ecuador
export const esPartidoHoy = (fechaStr, horaLocalStr, sedeKey) => {
  const fecha = fechaPartidoEnEcuador(fechaStr, horaLocalStr, sedeKey);
  if (!fecha) return false;
  
  const ahora = new Date();
  const offsetMs = ECUADOR_GMT * 60 * 60 * 1000;
  
  // Día de hoy en Ecuador
  const hoyEc = new Date(ahora.getTime() + offsetMs);
  const partidoEc = new Date(fecha.getTime() + offsetMs);
  
  return (
    hoyEc.getUTCFullYear() === partidoEc.getUTCFullYear() &&
    hoyEc.getUTCMonth() === partidoEc.getUTCMonth() &&
    hoyEc.getUTCDate() === partidoEc.getUTCDate()
  );
};

// Próximo partido (el siguiente que aún no ha empezado)
export const calcularProximoPartido = (partidos) => {
  const ahora = new Date();
  let proximo = null;
  let menorDif = Infinity;
  
  partidos.forEach(p => {
    const fecha = fechaPartidoEnEcuador(p.fecha, p.horaLocal, p.sede);
    if (!fecha) return;
    const dif = fecha.getTime() - ahora.getTime();
    if (dif > 0 && dif < menorDif) {
      menorDif = dif;
      proximo = p;
    }
  });
  
  return proximo;
};

// Cuenta regresiva en formato "Xd Yh Zm"
export const cuentaRegresiva = (fechaStr, horaLocalStr, sedeKey) => {
  const fecha = fechaPartidoEnEcuador(fechaStr, horaLocalStr, sedeKey);
  if (!fecha) return null;
  
  const ahora = new Date();
  const dif = fecha.getTime() - ahora.getTime();
  
  if (dif <= 0) return { texto: 'EN VIVO', enVivo: true };
  
  const dias = Math.floor(dif / (1000 * 60 * 60 * 24));
  const horas = Math.floor((dif % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));
  
  let texto = '';
  if (dias > 0) texto += `${dias}d `;
  if (horas > 0 || dias > 0) texto += `${horas}h `;
  texto += `${minutos}m`;
  
  return { texto: texto.trim(), enVivo: false, dias, horas, minutos };
};

// Filtrar partidos por fase
export const filtrarPorFase = (partidos, fase) => {
  if (fase === 'TODOS') return partidos;
  return partidos.filter(p => p.fase === fase);
};

// Filtrar partidos por equipo (ya sea equipo1 o equipo2)
export const filtrarPorEquipo = (partidos, equipo) => {
  if (!equipo || equipo === 'TODOS') return partidos;
  return partidos.filter(p => p.equipo1 === equipo || p.equipo2 === equipo);
};

// Agrupar partidos por fecha (para el listado)
export const agruparPorFecha = (partidos) => {
  const grupos = {};
  partidos.forEach(p => {
    const key = fechaFormateada(p.fecha, p.horaLocal, p.sede);
    if (!grupos[key]) grupos[key] = [];
    grupos[key].push(p);
  });
  return grupos;
};