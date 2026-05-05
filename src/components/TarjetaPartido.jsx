import React from 'react';
import { Heart, Tv, Clock, MapPin, Star, Trophy } from 'lucide-react';
import { 
  obtenerNombreEquipo, 
  esPlaceholder, 
  nombreFase,
  FASES 
} from '../lib/partidosData';
import { getEquipoInfo } from '../lib/equiposData';
import Bandera from './Bandera';

function TarjetaPartido({ 
  partido, 
  esFavorito, 
  onToggleFavorito, 
  canal,
  enVivo = false,
  proximo = false 
}) {
  const equipoLocalNombre = obtenerNombreEquipo(partido.equipoLocal);
  const equipoVisitanteNombre = obtenerNombreEquipo(partido.equipoVisitante);
  
  const localEsPlaceholder = esPlaceholder(partido.equipoLocal);
  const visitanteEsPlaceholder = esPlaceholder(partido.equipoVisitante);
  
  // Solo obtenemos info del equipo si NO es placeholder (tiene un nombre real)
  const equipoLocalInfo = !localEsPlaceholder ? getEquipoInfo(equipoLocalNombre) : null;
  const equipoVisitanteInfo = !visitanteEsPlaceholder ? getEquipoInfo(equipoVisitanteNombre) : null;

  // Detectar si Ecuador juega
  const ecuadorJuega = equipoLocalNombre === 'Ecuador' || equipoVisitanteNombre === 'Ecuador';
  
  // Es la final?
  const esFinal = partido.fase === FASES.FINAL;
  const esSemi = partido.fase === FASES.SEMI;
  const esEliminatoria = partido.fase !== FASES.GRUPO;
  
  // Color del badge según fase
  const colorFase = {
    [FASES.GRUPO]: 'bg-fwc-card text-gray-400 border-fwc-border',
    [FASES.R32]: 'bg-fwc-neon/10 text-fwc-neon border-fwc-neon/40',
    [FASES.R16]: 'bg-fwc-neon/15 text-fwc-neon border-fwc-neon/40',
    [FASES.CUARTOS]: 'bg-fwc-gold/15 text-fwc-gold border-fwc-gold/40',
    [FASES.SEMI]: 'bg-fwc-gold/20 text-fwc-gold border-fwc-gold/50',
    [FASES.TERCERO]: 'bg-fwc-accent/15 text-fwc-accent border-fwc-accent/40',
    [FASES.FINAL]: 'bg-gradient-to-r from-fwc-gold/30 to-fwc-accent/20 text-fwc-gold border-fwc-gold',
  };

  // Formatear fecha en español
  const fechaFormateada = new Date(`${partido.fecha}T12:00:00`).toLocaleDateString('es-EC', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'America/Guayaquil'
  });

  return (
    <div className={`fwc-card p-4 transition-all hover:border-fwc-gold/50 relative ${
      esFinal ? 'border-fwc-gold shadow-lg shadow-fwc-gold/20' :
      ecuadorJuega ? 'border-fwc-gold/40' :
      'border-fwc-border'
    }`}>
      
      {/* Badge EN VIVO o PRÓXIMO */}
      {enVivo && (
        <div className="absolute -top-2 left-3 bg-fwc-accent text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
          🔴 EN VIVO
        </div>
      )}
      {proximo && !enVivo && (
        <div className="absolute -top-2 left-3 bg-fwc-neon text-fwc-bg text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          ⏰ PRÓXIMO
        </div>
      )}

      {/* Header: Fase + Favorito */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {esFinal && <Trophy className="w-4 h-4 text-fwc-gold" />}
          {esSemi && <Star className="w-3.5 h-3.5 text-fwc-gold" />}
          <span className={`text-[10px] font-display font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${colorFase[partido.fase]}`}>
            {partido.fase === FASES.GRUPO 
              ? `Grupo ${partido.grupo}` 
              : nombreFase(partido.fase)}
          </span>
          {ecuadorJuega && (
            <span className="text-base">🇪🇨</span>
          )}
        </div>
        
        <button
          onClick={() => onToggleFavorito(partido.numero)}
          className="p-1 transition-colors hover:scale-110"
          title={esFavorito ? 'Quitar favorito' : 'Marcar favorito'}
        >
          <Heart 
            className={`w-4 h-4 ${
              esFavorito 
                ? 'fill-fwc-accent text-fwc-accent' 
                : 'text-gray-500 hover:text-fwc-accent'
            }`} 
          />
        </button>
      </div>

      {/* Equipos */}
      <div className="space-y-2 mb-3">
        {/* Equipo Local */}
        <div className={`flex items-center gap-3 ${localEsPlaceholder ? 'opacity-60' : ''}`}>
          {!localEsPlaceholder && equipoLocalInfo ? (
            <Bandera iso={equipoLocalInfo.iso} size="md" />
          ) : (
            <div className="w-7 h-5 bg-fwc-card border border-fwc-border rounded flex items-center justify-center">
              <span className="text-[10px] text-gray-500 font-mono">?</span>
            </div>
          )}
          <span className={`flex-1 truncate font-display font-bold text-sm ${
            localEsPlaceholder ? 'text-gray-500 italic' :
            equipoLocalNombre === 'Ecuador' ? 'text-fwc-gold' : 'text-white'
          }`}>
            {!localEsPlaceholder && equipoLocalInfo ? equipoLocalInfo.nombre : equipoLocalNombre}
          </span>
        </div>

        {/* VS divisor */}
        <div className="flex items-center gap-2 pl-10">
          <div className="flex-1 h-px bg-fwc-border" />
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">vs</span>
          <div className="flex-1 h-px bg-fwc-border" />
        </div>

        {/* Equipo Visitante */}
        <div className={`flex items-center gap-3 ${visitanteEsPlaceholder ? 'opacity-60' : ''}`}>
          {!visitanteEsPlaceholder && equipoVisitanteInfo ? (
            <Bandera iso={equipoVisitanteInfo.iso} size="md" />
          ) : (
            <div className="w-7 h-5 bg-fwc-card border border-fwc-border rounded flex items-center justify-center">
              <span className="text-[10px] text-gray-500 font-mono">?</span>
            </div>
          )}
          <span className={`flex-1 truncate font-display font-bold text-sm ${
            visitanteEsPlaceholder ? 'text-gray-500 italic' :
            equipoVisitanteNombre === 'Ecuador' ? 'text-fwc-gold' : 'text-white'
          }`}>
            {!visitanteEsPlaceholder && equipoVisitanteInfo ? equipoVisitanteInfo.nombre : equipoVisitanteNombre}
          </span>
        </div>
      </div>

      {/* Footer: Fecha, Hora, Sede, TV */}
      <div className="border-t border-fwc-border pt-3 space-y-1.5">
        {/* Fecha y hora */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-mono uppercase">
            {fechaFormateada}
          </span>
          <div className="flex items-center gap-1 text-fwc-gold font-mono font-bold">
            <Clock className="w-3 h-3" />
            <span>{partido.hora}</span>
          </div>
        </div>

        {/* Sede */}
        <div className="flex items-start gap-1.5 text-xs text-gray-500">
          <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <span className="truncate">
            {partido.sede.nombre} <span className="text-gray-600">- {partido.sede.ciudad}</span>
          </span>
        </div>

        {/* Canal TV */}
        {canal && (
          <div className="flex items-center gap-1.5 text-xs text-fwc-neon">
            <Tv className="w-3 h-3" />
            <span className="font-bold uppercase tracking-wider">{canal}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TarjetaPartido;