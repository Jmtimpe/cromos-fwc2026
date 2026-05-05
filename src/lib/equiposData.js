// Mapeo de equipos del Mundial 2026: códigos ISO + nombre legible
// Las claves están en formato del catálogo de cromos (MAYÚSCULAS sin acentos)
export const EQUIPOS_INFO = {
  'MEXICO':           { iso: 'mx', nombre: 'México' },
  'SOUTH AFRICA':     { iso: 'za', nombre: 'Sudáfrica' },
  'KOREA':            { iso: 'kr', nombre: 'Corea del Sur' },
  'REP. CHECA':       { iso: 'cz', nombre: 'Rep. Checa' },
  'CANADA':           { iso: 'ca', nombre: 'Canadá' },
  'BOSNIA-HERZEGOVINA': { iso: 'ba', nombre: 'Bosnia-Herzegovina' },
  'QATAR':            { iso: 'qa', nombre: 'Catar' },
  'SUIZA':            { iso: 'ch', nombre: 'Suiza' },
  'BRASIL':           { iso: 'br', nombre: 'Brasil' },
  'MARRUECOS':        { iso: 'ma', nombre: 'Marruecos' },
  'HAITI':            { iso: 'ht', nombre: 'Haití' },
  'ESCOCIA':          { iso: 'gb-sct', nombre: 'Escocia' },
  'USA':              { iso: 'us', nombre: 'Estados Unidos' },
  'PARAGUAY':         { iso: 'py', nombre: 'Paraguay' },
  'AUSTRALIA':        { iso: 'au', nombre: 'Australia' },
  'TUQUIA':           { iso: 'tr', nombre: 'Turquía' },
  'ALEMANIA':         { iso: 'de', nombre: 'Alemania' },
  'CURACAO':          { iso: 'cw', nombre: 'Curazao' },
  'COSTA DE MARFIL':  { iso: 'ci', nombre: 'Costa de Marfil' },
  'ECUADOR':          { iso: 'ec', nombre: 'Ecuador' },
  'PAISES BAJOS':     { iso: 'nl', nombre: 'Países Bajos' },
  'JAPON':            { iso: 'jp', nombre: 'Japón' },
  'SUECIA':           { iso: 'se', nombre: 'Suecia' },
  'TUNEZ':            { iso: 'tn', nombre: 'Túnez' },
  'BELGICA':          { iso: 'be', nombre: 'Bélgica' },
  'EGIPTO':           { iso: 'eg', nombre: 'Egipto' },
  'IRAN':             { iso: 'ir', nombre: 'Irán' },
  'NUEVA ZELANDA':    { iso: 'nz', nombre: 'Nueva Zelanda' },
  'ESPAÑA':           { iso: 'es', nombre: 'España' },
  'CABO VERDE':       { iso: 'cv', nombre: 'Cabo Verde' },
  'ARABIA SAUDITA':   { iso: 'sa', nombre: 'Arabia Saudita' },
  'URUGUAY':          { iso: 'uy', nombre: 'Uruguay' },
  'FRANCIA':          { iso: 'fr', nombre: 'Francia' },
  'SENEGAL':          { iso: 'sn', nombre: 'Senegal' },
  'IRAQ':             { iso: 'iq', nombre: 'Iraq' },
  'NORUEGA':          { iso: 'no', nombre: 'Noruega' },
  'ARGENTINA':        { iso: 'ar', nombre: 'Argentina' },
  'ARGELIA':          { iso: 'dz', nombre: 'Argelia' },
  'AUSTRIA':          { iso: 'at', nombre: 'Austria' },
  'JORDANIA':         { iso: 'jo', nombre: 'Jordania' },
  'PORTUGAL':         { iso: 'pt', nombre: 'Portugal' },
  'CONGO':            { iso: 'cd', nombre: 'RD Congo' },
  'UZBEKISTAN':       { iso: 'uz', nombre: 'Uzbekistán' },
  'COLOMBIA':         { iso: 'co', nombre: 'Colombia' },
  'INGLATERRA':       { iso: 'gb-eng', nombre: 'Inglaterra' },
  'CROACIA':          { iso: 'hr', nombre: 'Croacia' },
  'GHANA':            { iso: 'gh', nombre: 'Ghana' },
  'PANAMA':           { iso: 'pa', nombre: 'Panamá' },
  'FWC 2026':         { iso: 'FWC', nombre: 'FIFA World Cup 2026' },
  'FIFA HISTORY':     { iso: 'HIS', nombre: 'FIFA History' },
  'COCA COLA':        { iso: 'CC', nombre: 'Coca-Cola Stars' },
};

// ============================================================================
// ALIAS de nombres de equipos (para sincronizar con partidosData.js)
// Los partidos usan nombres con acentos. Esto los convierte al formato del catálogo.
// ============================================================================
const ALIAS_EQUIPOS = {
  // Acentos / variaciones
  'México': 'MEXICO',
  'Sudáfrica': 'SOUTH AFRICA',
  'República de Corea': 'KOREA',
  'Corea del Sur': 'KOREA',
  'República Checa': 'REP. CHECA',
  'Rep. Checa': 'REP. CHECA',
  'Canadá': 'CANADA',
  'Bosnia y Herzegovina': 'BOSNIA-HERZEGOVINA',
  'Bosnia-Herzegovina': 'BOSNIA-HERZEGOVINA',
  'Catar': 'QATAR',
  'Suiza': 'SUIZA',
  'Brasil': 'BRASIL',
  'Marruecos': 'MARRUECOS',
  'Haití': 'HAITI',
  'Escocia': 'ESCOCIA',
  'Estados Unidos': 'USA',
  'Paraguay': 'PARAGUAY',
  'Australia': 'AUSTRALIA',
  'Turquía': 'TUQUIA',
  'Alemania': 'ALEMANIA',
  'Curazao': 'CURACAO',
  'Costa de Marfil': 'COSTA DE MARFIL',
  'Ecuador': 'ECUADOR',
  'Países Bajos': 'PAISES BAJOS',
  'Japón': 'JAPON',
  'Suecia': 'SUECIA',
  'Túnez': 'TUNEZ',
  'Bélgica': 'BELGICA',
  'Egipto': 'EGIPTO',
  'Irán': 'IRAN',
  'Nueva Zelanda': 'NUEVA ZELANDA',
  'España': 'ESPAÑA',
  'Cabo Verde': 'CABO VERDE',
  'Arabia Saudí': 'ARABIA SAUDITA',
  'Arabia Saudita': 'ARABIA SAUDITA',
  'Uruguay': 'URUGUAY',
  'Francia': 'FRANCIA',
  'Senegal': 'SENEGAL',
  'Irak': 'IRAQ',
  'Iraq': 'IRAQ',
  'Noruega': 'NORUEGA',
  'Argentina': 'ARGENTINA',
  'Argelia': 'ARGELIA',
  'Austria': 'AUSTRIA',
  'Jordania': 'JORDANIA',
  'Portugal': 'PORTUGAL',
  'RD Congo': 'CONGO',
  'Congo': 'CONGO',
  'Uzbekistán': 'UZBEKISTAN',
  'Colombia': 'COLOMBIA',
  'Inglaterra': 'INGLATERRA',
  'Croacia': 'CROACIA',
  'Ghana': 'GHANA',
  'Panamá': 'PANAMA',
};

// ============================================================================
// Helper: obtener info de un equipo
// Acepta AMBOS formatos:
//   - "MEXICO" (formato del catálogo de cromos)
//   - "México" (formato de partidosData.js con acentos)
// ============================================================================
export const getEquipoInfo = (equipo) => {
  if (!equipo) return { iso: '?', nombre: 'Desconocido' };
  
  // 1. Intentar buscar directamente (formato del catálogo de cromos)
  if (EQUIPOS_INFO[equipo]) {
    return EQUIPOS_INFO[equipo];
  }
  
  // 2. Intentar buscar usando el alias (formato con acentos de partidos)
  const claveOficial = ALIAS_EQUIPOS[equipo];
  if (claveOficial && EQUIPOS_INFO[claveOficial]) {
    return EQUIPOS_INFO[claveOficial];
  }
  
  // 3. Fallback: devolver el nombre tal cual con ISO desconocido
  return { iso: '?', nombre: equipo };
};