// ============================================================================
// CALENDARIO COPA MUNDIAL FIFA 2026
// Todos los horarios están en hora Ecuador (GMT-5 / America/Guayaquil)
// 104 partidos totales: 72 de fase de grupos + 32 de fase eliminatoria
// ============================================================================

// === CONSTANTES DE FASES ===
export const FASES = {
  GRUPO: 'GRUPO',
  R32: 'R32',           // 16avos de final
  R16: 'R16',           // Octavos de final
  CUARTOS: 'CUARTOS',   // Cuartos de final
  SEMI: 'SEMI',         // Semifinales
  TERCERO: 'TERCERO',   // Tercer puesto
  FINAL: 'FINAL',       // Final
};

// === SEDES OFICIALES (16 estadios) ===
export const SEDES = {
  AZTECA: {
    id: 'AZTECA',
    nombre: 'Estadio Azteca',
    ciudad: 'Ciudad de México',
    pais: 'México',
    iso: 'mx',
    gmtOffset: -6,
  },
  AKRON: {
    id: 'AKRON',
    nombre: 'Estadio Akron',
    ciudad: 'Guadalajara',
    pais: 'México',
    iso: 'mx',
    gmtOffset: -6,
  },
  BBVA: {
    id: 'BBVA',
    nombre: 'Estadio BBVA',
    ciudad: 'Monterrey',
    pais: 'México',
    iso: 'mx',
    gmtOffset: -6,
  },
  BMO: {
    id: 'BMO',
    nombre: 'BMO Field',
    ciudad: 'Toronto',
    pais: 'Canadá',
    iso: 'ca',
    gmtOffset: -4,
  },
  BC_PLACE: {
    id: 'BC_PLACE',
    nombre: 'BC Place',
    ciudad: 'Vancouver',
    pais: 'Canadá',
    iso: 'ca',
    gmtOffset: -7,
  },
  SOFI: {
    id: 'SOFI',
    nombre: 'SoFi Stadium',
    ciudad: 'Inglewood',
    pais: 'Estados Unidos',
    iso: 'us',
    gmtOffset: -7,
  },
  LEVIS: {
    id: 'LEVIS',
    nombre: 'Levi\'s Stadium',
    ciudad: 'Santa Clara',
    pais: 'Estados Unidos',
    iso: 'us',
    gmtOffset: -7,
  },
  LUMEN: {
    id: 'LUMEN',
    nombre: 'Lumen Field',
    ciudad: 'Seattle',
    pais: 'Estados Unidos',
    iso: 'us',
    gmtOffset: -7,
  },
  METLIFE: {
    id: 'METLIFE',
    nombre: 'MetLife Stadium',
    ciudad: 'East Rutherford',
    pais: 'Estados Unidos',
    iso: 'us',
    gmtOffset: -4,
  },
  LINCOLN: {
    id: 'LINCOLN',
    nombre: 'Lincoln Financial Field',
    ciudad: 'Filadelfia',
    pais: 'Estados Unidos',
    iso: 'us',
    gmtOffset: -4,
  },
  GILLETTE: {
    id: 'GILLETTE',
    nombre: 'Gillette Stadium',
    ciudad: 'Foxborough',
    pais: 'Estados Unidos',
    iso: 'us',
    gmtOffset: -4,
  },
  HARD_ROCK: {
    id: 'HARD_ROCK',
    nombre: 'Hard Rock Stadium',
    ciudad: 'Miami Gardens',
    pais: 'Estados Unidos',
    iso: 'us',
    gmtOffset: -4,
  },
  MERCEDES: {
    id: 'MERCEDES',
    nombre: 'Mercedes-Benz Stadium',
    ciudad: 'Atlanta',
    pais: 'Estados Unidos',
    iso: 'us',
    gmtOffset: -4,
  },
  ATT: {
    id: 'ATT',
    nombre: 'AT&T Stadium',
    ciudad: 'Arlington',
    pais: 'Estados Unidos',
    iso: 'us',
    gmtOffset: -5,
  },
  NRG: {
    id: 'NRG',
    nombre: 'NRG Stadium',
    ciudad: 'Houston',
    pais: 'Estados Unidos',
    iso: 'us',
    gmtOffset: -5,
  },
  ARROWHEAD: {
    id: 'ARROWHEAD',
    nombre: 'GEHA Field at Arrowhead',
    ciudad: 'Kansas City',
    pais: 'Estados Unidos',
    iso: 'us',
    gmtOffset: -5,
  },
};

// === FASE DE GRUPOS (72 partidos) ===
const partidosFaseGrupos = [
  // === JORNADA 1 ===
  // Jueves 11 jun 2026
  { numero: 1, fase: FASES.GRUPO, grupo: 'A', fecha: '2026-06-11', hora: '14:00', sede: SEDES.AZTECA, equipoLocal: 'México', equipoVisitante: 'Sudáfrica' },
  { numero: 2, fase: FASES.GRUPO, grupo: 'A', fecha: '2026-06-11', hora: '21:00', sede: SEDES.AKRON, equipoLocal: 'República de Corea', equipoVisitante: 'República Checa' },
  
  // Viernes 12 jun 2026
  { numero: 3, fase: FASES.GRUPO, grupo: 'B', fecha: '2026-06-12', hora: '14:00', sede: SEDES.BMO, equipoLocal: 'Canadá', equipoVisitante: 'Bosnia y Herzegovina' },
  { numero: 4, fase: FASES.GRUPO, grupo: 'D', fecha: '2026-06-12', hora: '20:00', sede: SEDES.SOFI, equipoLocal: 'Estados Unidos', equipoVisitante: 'Paraguay' },
  
  // Sábado 13 jun 2026
  { numero: 5, fase: FASES.GRUPO, grupo: 'B', fecha: '2026-06-13', hora: '14:00', sede: SEDES.LEVIS, equipoLocal: 'Catar', equipoVisitante: 'Suiza' },
  { numero: 6, fase: FASES.GRUPO, grupo: 'C', fecha: '2026-06-13', hora: '17:00', sede: SEDES.METLIFE, equipoLocal: 'Brasil', equipoVisitante: 'Marruecos' },
  { numero: 7, fase: FASES.GRUPO, grupo: 'C', fecha: '2026-06-13', hora: '20:00', sede: SEDES.GILLETTE, equipoLocal: 'Haití', equipoVisitante: 'Escocia' },
  { numero: 8, fase: FASES.GRUPO, grupo: 'D', fecha: '2026-06-13', hora: '23:00', sede: SEDES.BC_PLACE, equipoLocal: 'Australia', equipoVisitante: 'Turquía' },
  
  // Domingo 14 jun 2026
  { numero: 9, fase: FASES.GRUPO, grupo: 'E', fecha: '2026-06-14', hora: '12:00', sede: SEDES.NRG, equipoLocal: 'Alemania', equipoVisitante: 'Curazao' },
  { numero: 10, fase: FASES.GRUPO, grupo: 'F', fecha: '2026-06-14', hora: '15:00', sede: SEDES.ATT, equipoLocal: 'Países Bajos', equipoVisitante: 'Japón' },
  { numero: 11, fase: FASES.GRUPO, grupo: 'E', fecha: '2026-06-14', hora: '18:00', sede: SEDES.LINCOLN, equipoLocal: 'Costa de Marfil', equipoVisitante: 'Ecuador' },
  { numero: 12, fase: FASES.GRUPO, grupo: 'F', fecha: '2026-06-14', hora: '21:00', sede: SEDES.BBVA, equipoLocal: 'Suecia', equipoVisitante: 'Túnez' },
  
  // Lunes 15 jun 2026
  { numero: 13, fase: FASES.GRUPO, grupo: 'H', fecha: '2026-06-15', hora: '11:00', sede: SEDES.MERCEDES, equipoLocal: 'España', equipoVisitante: 'Cabo Verde' },
  { numero: 14, fase: FASES.GRUPO, grupo: 'G', fecha: '2026-06-15', hora: '14:00', sede: SEDES.LUMEN, equipoLocal: 'Bélgica', equipoVisitante: 'Egipto' },
  { numero: 15, fase: FASES.GRUPO, grupo: 'H', fecha: '2026-06-15', hora: '17:00', sede: SEDES.HARD_ROCK, equipoLocal: 'Arabia Saudí', equipoVisitante: 'Uruguay' },
  { numero: 16, fase: FASES.GRUPO, grupo: 'G', fecha: '2026-06-15', hora: '20:00', sede: SEDES.BC_PLACE, equipoLocal: 'Irán', equipoVisitante: 'Nueva Zelanda' },

  // === JORNADA 2 ===
  // Jueves 18 jun 2026
  { numero: 17, fase: FASES.GRUPO, grupo: 'A', fecha: '2026-06-18', hora: '11:00', sede: SEDES.MERCEDES, equipoLocal: 'República Checa', equipoVisitante: 'Sudáfrica' },
  { numero: 18, fase: FASES.GRUPO, grupo: 'B', fecha: '2026-06-18', hora: '14:00', sede: SEDES.SOFI, equipoLocal: 'Suiza', equipoVisitante: 'Bosnia y Herzegovina' },
  { numero: 19, fase: FASES.GRUPO, grupo: 'B', fecha: '2026-06-18', hora: '17:00', sede: SEDES.BC_PLACE, equipoLocal: 'Canadá', equipoVisitante: 'Catar' },
  { numero: 20, fase: FASES.GRUPO, grupo: 'A', fecha: '2026-06-18', hora: '20:00', sede: SEDES.AKRON, equipoLocal: 'México', equipoVisitante: 'República de Corea' },
  
  // Viernes 19 jun 2026
  { numero: 21, fase: FASES.GRUPO, grupo: 'D', fecha: '2026-06-19', hora: '14:00', sede: SEDES.LUMEN, equipoLocal: 'Estados Unidos', equipoVisitante: 'Australia' },
  { numero: 22, fase: FASES.GRUPO, grupo: 'C', fecha: '2026-06-19', hora: '17:00', sede: SEDES.GILLETTE, equipoLocal: 'Escocia', equipoVisitante: 'Marruecos' },
  { numero: 23, fase: FASES.GRUPO, grupo: 'C', fecha: '2026-06-19', hora: '20:00', sede: SEDES.LINCOLN, equipoLocal: 'Brasil', equipoVisitante: 'Haití' },
  { numero: 24, fase: FASES.GRUPO, grupo: 'D', fecha: '2026-06-19', hora: '23:00', sede: SEDES.LEVIS, equipoLocal: 'Turquía', equipoVisitante: 'Paraguay' },
  
  // Sábado 20 jun 2026
  { numero: 25, fase: FASES.GRUPO, grupo: 'F', fecha: '2026-06-20', hora: '12:00', sede: SEDES.NRG, equipoLocal: 'Países Bajos', equipoVisitante: 'Suecia' },
  { numero: 26, fase: FASES.GRUPO, grupo: 'E', fecha: '2026-06-20', hora: '15:00', sede: SEDES.BMO, equipoLocal: 'Alemania', equipoVisitante: 'Costa de Marfil' },
  { numero: 27, fase: FASES.GRUPO, grupo: 'E', fecha: '2026-06-20', hora: '21:00', sede: SEDES.ARROWHEAD, equipoLocal: 'Ecuador', equipoVisitante: 'Curazao' },
  { numero: 28, fase: FASES.GRUPO, grupo: 'F', fecha: '2026-06-20', hora: '23:00', sede: SEDES.BBVA, equipoLocal: 'Túnez', equipoVisitante: 'Japón' },
  
  // Domingo 21 jun 2026
  { numero: 29, fase: FASES.GRUPO, grupo: 'H', fecha: '2026-06-21', hora: '11:00', sede: SEDES.MERCEDES, equipoLocal: 'España', equipoVisitante: 'Arabia Saudí' },
  { numero: 30, fase: FASES.GRUPO, grupo: 'G', fecha: '2026-06-21', hora: '14:00', sede: SEDES.SOFI, equipoLocal: 'Bélgica', equipoVisitante: 'Irán' },
  { numero: 31, fase: FASES.GRUPO, grupo: 'H', fecha: '2026-06-21', hora: '17:00', sede: SEDES.HARD_ROCK, equipoLocal: 'Uruguay', equipoVisitante: 'Cabo Verde' },
  { numero: 32, fase: FASES.GRUPO, grupo: 'G', fecha: '2026-06-21', hora: '20:00', sede: SEDES.BC_PLACE, equipoLocal: 'Nueva Zelanda', equipoVisitante: 'Egipto' },
  
  // Lunes 22 jun 2026
  { numero: 33, fase: FASES.GRUPO, grupo: 'J', fecha: '2026-06-22', hora: '12:00', sede: SEDES.ATT, equipoLocal: 'Argentina', equipoVisitante: 'Austria' },
  { numero: 34, fase: FASES.GRUPO, grupo: 'I', fecha: '2026-06-22', hora: '16:00', sede: SEDES.LINCOLN, equipoLocal: 'Francia', equipoVisitante: 'Irak' },
  { numero: 35, fase: FASES.GRUPO, grupo: 'I', fecha: '2026-06-22', hora: '19:00', sede: SEDES.METLIFE, equipoLocal: 'Noruega', equipoVisitante: 'Senegal' },
  { numero: 36, fase: FASES.GRUPO, grupo: 'J', fecha: '2026-06-22', hora: '22:00', sede: SEDES.LEVIS, equipoLocal: 'Jordania', equipoVisitante: 'Argelia' },
  
  // Martes 23 jun 2026
  { numero: 37, fase: FASES.GRUPO, grupo: 'K', fecha: '2026-06-23', hora: '12:00', sede: SEDES.NRG, equipoLocal: 'Portugal', equipoVisitante: 'Uzbekistán' },
  { numero: 38, fase: FASES.GRUPO, grupo: 'L', fecha: '2026-06-23', hora: '15:00', sede: SEDES.GILLETTE, equipoLocal: 'Inglaterra', equipoVisitante: 'Ghana' },
  { numero: 39, fase: FASES.GRUPO, grupo: 'L', fecha: '2026-06-23', hora: '18:00', sede: SEDES.BMO, equipoLocal: 'Panamá', equipoVisitante: 'Croacia' },
  { numero: 40, fase: FASES.GRUPO, grupo: 'K', fecha: '2026-06-23', hora: '21:00', sede: SEDES.AKRON, equipoLocal: 'Colombia', equipoVisitante: 'RD Congo' },

  // === JORNADA 3 ===
  // Miércoles 24 jun 2026
  { numero: 41, fase: FASES.GRUPO, grupo: 'B', fecha: '2026-06-24', hora: '14:00', sede: SEDES.BC_PLACE, equipoLocal: 'Suiza', equipoVisitante: 'Canadá' },
  { numero: 42, fase: FASES.GRUPO, grupo: 'B', fecha: '2026-06-24', hora: '14:00', sede: SEDES.LUMEN, equipoLocal: 'Bosnia y Herzegovina', equipoVisitante: 'Catar' },
  { numero: 43, fase: FASES.GRUPO, grupo: 'C', fecha: '2026-06-24', hora: '17:00', sede: SEDES.HARD_ROCK, equipoLocal: 'Escocia', equipoVisitante: 'Brasil' },
  { numero: 44, fase: FASES.GRUPO, grupo: 'C', fecha: '2026-06-24', hora: '17:00', sede: SEDES.MERCEDES, equipoLocal: 'Marruecos', equipoVisitante: 'Haití' },
  { numero: 45, fase: FASES.GRUPO, grupo: 'A', fecha: '2026-06-24', hora: '20:00', sede: SEDES.AZTECA, equipoLocal: 'República Checa', equipoVisitante: 'México' },
  { numero: 46, fase: FASES.GRUPO, grupo: 'A', fecha: '2026-06-24', hora: '20:00', sede: SEDES.BBVA, equipoLocal: 'Sudáfrica', equipoVisitante: 'República de Corea' },
  
  // Jueves 25 jun 2026
  { numero: 47, fase: FASES.GRUPO, grupo: 'E', fecha: '2026-06-25', hora: '15:00', sede: SEDES.LINCOLN, equipoLocal: 'Curazao', equipoVisitante: 'Costa de Marfil' },
  { numero: 48, fase: FASES.GRUPO, grupo: 'E', fecha: '2026-06-25', hora: '15:00', sede: SEDES.METLIFE, equipoLocal: 'Ecuador', equipoVisitante: 'Alemania' },
  { numero: 49, fase: FASES.GRUPO, grupo: 'F', fecha: '2026-06-25', hora: '18:00', sede: SEDES.ATT, equipoLocal: 'Japón', equipoVisitante: 'Suecia' },
  { numero: 50, fase: FASES.GRUPO, grupo: 'F', fecha: '2026-06-25', hora: '18:00', sede: SEDES.ARROWHEAD, equipoLocal: 'Túnez', equipoVisitante: 'Países Bajos' },
  { numero: 51, fase: FASES.GRUPO, grupo: 'D', fecha: '2026-06-25', hora: '21:00', sede: SEDES.SOFI, equipoLocal: 'Turquía', equipoVisitante: 'Estados Unidos' },
  { numero: 52, fase: FASES.GRUPO, grupo: 'D', fecha: '2026-06-25', hora: '21:00', sede: SEDES.LEVIS, equipoLocal: 'Paraguay', equipoVisitante: 'Australia' },
  
  // Viernes 26 jun 2026
  { numero: 53, fase: FASES.GRUPO, grupo: 'I', fecha: '2026-06-26', hora: '14:00', sede: SEDES.GILLETTE, equipoLocal: 'Noruega', equipoVisitante: 'Francia' },
  { numero: 54, fase: FASES.GRUPO, grupo: 'I', fecha: '2026-06-26', hora: '14:00', sede: SEDES.BMO, equipoLocal: 'Senegal', equipoVisitante: 'Irak' },
  { numero: 55, fase: FASES.GRUPO, grupo: 'H', fecha: '2026-06-26', hora: '19:00', sede: SEDES.NRG, equipoLocal: 'Cabo Verde', equipoVisitante: 'Arabia Saudí' },
  { numero: 56, fase: FASES.GRUPO, grupo: 'H', fecha: '2026-06-26', hora: '19:00', sede: SEDES.AKRON, equipoLocal: 'Uruguay', equipoVisitante: 'España' },
  { numero: 57, fase: FASES.GRUPO, grupo: 'G', fecha: '2026-06-26', hora: '22:00', sede: SEDES.LUMEN, equipoLocal: 'Egipto', equipoVisitante: 'Irán' },
  { numero: 58, fase: FASES.GRUPO, grupo: 'G', fecha: '2026-06-26', hora: '22:00', sede: SEDES.BC_PLACE, equipoLocal: 'Nueva Zelanda', equipoVisitante: 'Bélgica' },
  
  // Sábado 27 jun 2026
  { numero: 59, fase: FASES.GRUPO, grupo: 'L', fecha: '2026-06-27', hora: '16:00', sede: SEDES.METLIFE, equipoLocal: 'Panamá', equipoVisitante: 'Inglaterra' },
  { numero: 60, fase: FASES.GRUPO, grupo: 'L', fecha: '2026-06-27', hora: '16:00', sede: SEDES.LINCOLN, equipoLocal: 'Croacia', equipoVisitante: 'Ghana' },
  { numero: 61, fase: FASES.GRUPO, grupo: 'K', fecha: '2026-06-27', hora: '18:30', sede: SEDES.HARD_ROCK, equipoLocal: 'Colombia', equipoVisitante: 'Portugal' },
  { numero: 62, fase: FASES.GRUPO, grupo: 'K', fecha: '2026-06-27', hora: '18:30', sede: SEDES.MERCEDES, equipoLocal: 'RD Congo', equipoVisitante: 'Uzbekistán' },
  { numero: 63, fase: FASES.GRUPO, grupo: 'J', fecha: '2026-06-27', hora: '21:00', sede: SEDES.ARROWHEAD, equipoLocal: 'Argelia', equipoVisitante: 'Austria' },
  { numero: 64, fase: FASES.GRUPO, grupo: 'J', fecha: '2026-06-27', hora: '21:00', sede: SEDES.ATT, equipoLocal: 'Jordania', equipoVisitante: 'Argentina' },
];

// ===========================================================================
// FASE ELIMINATORIA (32 partidos)
// Los equipos son PLACEHOLDERS que se resolverán en Fase 2 (auto-resolución)
// ===========================================================================
// Formato de placeholder:
//   { tipo: 'posicion', valor: '1A' }  → 1ro Grupo A
//   { tipo: 'posicion', valor: '2B' }  → 2do Grupo B
//   { tipo: 'mejor3', valor: 'ABCDF' } → Mejor 3ro de A/B/C/D/F
//   { tipo: 'ganador', valor: 73 }     → Ganador del partido 73
//   { tipo: 'perdedor', valor: 101 }   → Perdedor del partido 101 (3er puesto)
// ===========================================================================

const partidosFaseEliminatoria = [
  // === 16AVOS DE FINAL ===
  // Domingo 28 jun 2026
  { numero: 73, fase: FASES.R32, fecha: '2026-06-28', hora: '14:00', sede: SEDES.SOFI, equipoLocal: { tipo: 'posicion', valor: '2A' }, equipoVisitante: { tipo: 'posicion', valor: '2B' } },
  
  // Lunes 29 jun 2026
  { numero: 74, fase: FASES.R32, fecha: '2026-06-29', hora: '15:30', sede: SEDES.GILLETTE, equipoLocal: { tipo: 'posicion', valor: '1E' }, equipoVisitante: { tipo: 'mejor3', valor: 'ABCDF' } },
  { numero: 75, fase: FASES.R32, fecha: '2026-06-29', hora: '20:00', sede: SEDES.BBVA, equipoLocal: { tipo: 'posicion', valor: '1F' }, equipoVisitante: { tipo: 'posicion', valor: '2C' } },
  { numero: 76, fase: FASES.R32, fecha: '2026-06-29', hora: '12:00', sede: SEDES.NRG, equipoLocal: { tipo: 'posicion', valor: '1C' }, equipoVisitante: { tipo: 'posicion', valor: '2F' } },
  
  // Martes 30 jun 2026
  { numero: 77, fase: FASES.R32, fecha: '2026-06-30', hora: '16:00', sede: SEDES.METLIFE, equipoLocal: { tipo: 'posicion', valor: '1I' }, equipoVisitante: { tipo: 'mejor3', valor: 'CDFGH' } },
  { numero: 78, fase: FASES.R32, fecha: '2026-06-30', hora: '12:00', sede: SEDES.ATT, equipoLocal: { tipo: 'posicion', valor: '2E' }, equipoVisitante: { tipo: 'posicion', valor: '2I' } },
  { numero: 79, fase: FASES.R32, fecha: '2026-06-30', hora: '20:00', sede: SEDES.AZTECA, equipoLocal: { tipo: 'posicion', valor: '1A' }, equipoVisitante: { tipo: 'mejor3', valor: 'CEFHI' } },
  
  // Miércoles 1 jul 2026
  { numero: 80, fase: FASES.R32, fecha: '2026-07-01', hora: '11:00', sede: SEDES.MERCEDES, equipoLocal: { tipo: 'posicion', valor: '1L' }, equipoVisitante: { tipo: 'mejor3', valor: 'EHIJK' } },
  { numero: 81, fase: FASES.R32, fecha: '2026-07-01', hora: '19:00', sede: SEDES.LEVIS, equipoLocal: { tipo: 'posicion', valor: '1D' }, equipoVisitante: { tipo: 'mejor3', valor: 'BEFIJ' } },
  { numero: 82, fase: FASES.R32, fecha: '2026-07-01', hora: '15:00', sede: SEDES.LUMEN, equipoLocal: { tipo: 'posicion', valor: '1G' }, equipoVisitante: { tipo: 'mejor3', valor: 'AEHIJ' } },
  
  // Jueves 2 jul 2026
  { numero: 83, fase: FASES.R32, fecha: '2026-07-02', hora: '18:00', sede: SEDES.BMO, equipoLocal: { tipo: 'posicion', valor: '2K' }, equipoVisitante: { tipo: 'posicion', valor: '2L' } },
  { numero: 84, fase: FASES.R32, fecha: '2026-07-02', hora: '14:00', sede: SEDES.SOFI, equipoLocal: { tipo: 'posicion', valor: '1H' }, equipoVisitante: { tipo: 'posicion', valor: '2J' } },
  { numero: 85, fase: FASES.R32, fecha: '2026-07-02', hora: '22:00', sede: SEDES.BC_PLACE, equipoLocal: { tipo: 'posicion', valor: '1B' }, equipoVisitante: { tipo: 'mejor3', valor: 'EFGIJ' } },
  
  // Viernes 3 jul 2026
  { numero: 86, fase: FASES.R32, fecha: '2026-07-03', hora: '17:00', sede: SEDES.HARD_ROCK, equipoLocal: { tipo: 'posicion', valor: '1J' }, equipoVisitante: { tipo: 'posicion', valor: '2H' } },
  { numero: 87, fase: FASES.R32, fecha: '2026-07-03', hora: '20:30', sede: SEDES.ARROWHEAD, equipoLocal: { tipo: 'posicion', valor: '1K' }, equipoVisitante: { tipo: 'mejor3', valor: 'DEIJL' } },
  { numero: 88, fase: FASES.R32, fecha: '2026-07-03', hora: '13:00', sede: SEDES.ATT, equipoLocal: { tipo: 'posicion', valor: '2D' }, equipoVisitante: { tipo: 'posicion', valor: '2G' } },

  // === OCTAVOS DE FINAL ===
  // Sábado 4 jul 2026
  { numero: 89, fase: FASES.R16, fecha: '2026-07-04', hora: '16:00', sede: SEDES.LINCOLN, equipoLocal: { tipo: 'ganador', valor: 74 }, equipoVisitante: { tipo: 'ganador', valor: 77 } },
  { numero: 90, fase: FASES.R16, fecha: '2026-07-04', hora: '12:00', sede: SEDES.NRG, equipoLocal: { tipo: 'ganador', valor: 73 }, equipoVisitante: { tipo: 'ganador', valor: 75 } },
  
  // Domingo 5 jul 2026
  { numero: 91, fase: FASES.R16, fecha: '2026-07-05', hora: '15:00', sede: SEDES.METLIFE, equipoLocal: { tipo: 'ganador', valor: 76 }, equipoVisitante: { tipo: 'ganador', valor: 78 } },
  { numero: 92, fase: FASES.R16, fecha: '2026-07-05', hora: '19:00', sede: SEDES.AZTECA, equipoLocal: { tipo: 'ganador', valor: 79 }, equipoVisitante: { tipo: 'ganador', valor: 80 } },
  
  // Lunes 6 jul 2026
  { numero: 93, fase: FASES.R16, fecha: '2026-07-06', hora: '14:00', sede: SEDES.ATT, equipoLocal: { tipo: 'ganador', valor: 83 }, equipoVisitante: { tipo: 'ganador', valor: 84 } },
  { numero: 94, fase: FASES.R16, fecha: '2026-07-06', hora: '19:00', sede: SEDES.LUMEN, equipoLocal: { tipo: 'ganador', valor: 81 }, equipoVisitante: { tipo: 'ganador', valor: 82 } },
  
  // Martes 7 jul 2026
  { numero: 95, fase: FASES.R16, fecha: '2026-07-07', hora: '11:00', sede: SEDES.MERCEDES, equipoLocal: { tipo: 'ganador', valor: 86 }, equipoVisitante: { tipo: 'ganador', valor: 88 } },
  { numero: 96, fase: FASES.R16, fecha: '2026-07-07', hora: '15:00', sede: SEDES.BC_PLACE, equipoLocal: { tipo: 'ganador', valor: 85 }, equipoVisitante: { tipo: 'ganador', valor: 87 } },

  // === CUARTOS DE FINAL ===
  // Jueves 9 jul 2026
  { numero: 97, fase: FASES.CUARTOS, fecha: '2026-07-09', hora: '15:00', sede: SEDES.GILLETTE, equipoLocal: { tipo: 'ganador', valor: 89 }, equipoVisitante: { tipo: 'ganador', valor: 90 } },
  
  // Viernes 10 jul 2026
  { numero: 98, fase: FASES.CUARTOS, fecha: '2026-07-10', hora: '14:00', sede: SEDES.SOFI, equipoLocal: { tipo: 'ganador', valor: 93 }, equipoVisitante: { tipo: 'ganador', valor: 94 } },
  
  // Sábado 11 jul 2026
  { numero: 99, fase: FASES.CUARTOS, fecha: '2026-07-11', hora: '16:00', sede: SEDES.HARD_ROCK, equipoLocal: { tipo: 'ganador', valor: 91 }, equipoVisitante: { tipo: 'ganador', valor: 92 } },
  { numero: 100, fase: FASES.CUARTOS, fecha: '2026-07-11', hora: '20:00', sede: SEDES.ARROWHEAD, equipoLocal: { tipo: 'ganador', valor: 95 }, equipoVisitante: { tipo: 'ganador', valor: 96 } },

  // === SEMIFINALES ===
  // Martes 14 jul 2026
  { numero: 101, fase: FASES.SEMI, fecha: '2026-07-14', hora: '14:00', sede: SEDES.ATT, equipoLocal: { tipo: 'ganador', valor: 97 }, equipoVisitante: { tipo: 'ganador', valor: 98 } },
  
  // Miércoles 15 jul 2026
  { numero: 102, fase: FASES.SEMI, fecha: '2026-07-15', hora: '14:00', sede: SEDES.MERCEDES, equipoLocal: { tipo: 'ganador', valor: 99 }, equipoVisitante: { tipo: 'ganador', valor: 100 } },

  // === TERCER PUESTO ===
  // Sábado 18 jul 2026
  { numero: 103, fase: FASES.TERCERO, fecha: '2026-07-18', hora: '16:00', sede: SEDES.HARD_ROCK, equipoLocal: { tipo: 'perdedor', valor: 101 }, equipoVisitante: { tipo: 'perdedor', valor: 102 } },

  // === FINAL ===
  // Domingo 19 jul 2026
  { numero: 104, fase: FASES.FINAL, fecha: '2026-07-19', hora: '14:00', sede: SEDES.METLIFE, equipoLocal: { tipo: 'ganador', valor: 101 }, equipoVisitante: { tipo: 'ganador', valor: 102 } },
];

// === EXPORT FINAL: TODOS LOS PARTIDOS UNIDOS ===
export const partidosData = [...partidosFaseGrupos, ...partidosFaseEliminatoria];

// ============================================================================
// HELPER: Obtener nombre legible de un equipo (string o placeholder)
// ============================================================================
export function obtenerNombreEquipo(equipo) {
  // Si es string, devolver tal cual
  if (typeof equipo === 'string') return equipo;
  
  // Si es placeholder, formatearlo
  if (equipo && equipo.tipo) {
    if (equipo.tipo === 'posicion') {
      const numero = equipo.valor.charAt(0);
      const grupo = equipo.valor.charAt(1);
      const ordinal = numero === '1' ? '1ro' : numero === '2' ? '2do' : '3ro';
      return `${ordinal} Grupo ${grupo}`;
    }
    if (equipo.tipo === 'mejor3') {
      const grupos = equipo.valor.split('').join('/');
      return `Mejor 3ro de ${grupos}`;
    }
    if (equipo.tipo === 'ganador') {
      return `Ganador del partido ${equipo.valor}`;
    }
    if (equipo.tipo === 'perdedor') {
      return `Perdedor del partido ${equipo.valor}`;
    }
  }
  
  return 'Por definir';
}

// ============================================================================
// HELPER: Verificar si un equipo es un placeholder (no resuelto aún)
// ============================================================================
export function esPlaceholder(equipo) {
  return equipo && typeof equipo === 'object' && equipo.tipo;
}

// ============================================================================
// HELPER: Texto descriptivo de la fase
// ============================================================================
export function nombreFase(fase) {
  const nombres = {
    [FASES.GRUPO]: 'Fase de Grupos',
    [FASES.R32]: '16avos de Final',
    [FASES.R16]: 'Octavos de Final',
    [FASES.CUARTOS]: 'Cuartos de Final',
    [FASES.SEMI]: 'Semifinales',
    [FASES.TERCERO]: 'Tercer Puesto',
    [FASES.FINAL]: 'Final',
  };
  return nombres[fase] || fase;
}