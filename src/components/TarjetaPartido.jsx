import React from 'react';
import { Trophy, MapPin, Tv, Star, Clock } from 'lucide-react';
import { getEquipoInfo } from '../lib/equiposData';
import { SEDES } from '../lib/partidosData';
import { horaEcuador, cuentaRegresiva } from '../lib/fechasHelper';
import Bandera from './Bandera';

// Mapeo legible para fases
const FASES_NOMBRE = {
  GRUPO: 'Fase de Grupos',
  R32: '16avos de Final',
  R16: 'Octavos de Final',
  CUARTOS: 'Cuartos de Final',
  SEMI: 'Semifinal',
  TERCERO: '3er Puesto',
  FINAL: 'FINAL'
};

const FASES_COLOR = {
  GRUPO: 'text-gray-400',
  R32: 'text-fwc-neon',
  R16: 'text-fwc-neon',
  CUARTOS: 'text-fwc-gold',
  SEMI: 'text-fwc-gold',
  TERCERO: 'text-fwc-accent',
  FINAL: 'text-fwc-gold',
};

function TarjetaPartido({ partido, esFavorito, onToggleFavorito, canal, mostrarFase = false }) {
  const sede = SEDES[partido.sede];
  const eq1Info = getEquipoInfo(partido.equipo1);
  const eq2Info = getEquipoInfo(partido.equipo2);
  const horaEc = horaEcuador(partido.fecha, partido.horaLocal, partido.sede);
  const cuenta = cuentaRegresiva(partido.fecha, partido.horaLocal, partido.sede);
  
  // Si los equipos son códigos (W74, 1A, etc.) significa que aún no se conoce
  const eq1Conocido = !partido.equipo1.match(/^[WL]?\d|^\d[A-Z]/);
  const eq2Conocido = !partido.equipo2.match(/^[WL]?\d|^\d[A-Z]/);
  
  const esFinal = partido.fase === 'FINAL';
  const enVivo = cuenta?.enVivo;
  
  return (
    <div className={`fwc-card p-4 transition-all hover:border-fwc-gold/40 ${
      esFinal ? 'border-fwc-gold border-2 bg-gradient-to-br from-fwc-gold/10 to-fwc-accent/5' : ''
    } ${enVivo ? 'border-fwc-accent border-2 animate-pulse-slow' : ''}`}>
      
      {/* Header: Fase + Hora + Favorito */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-fwc-border gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 flex-wrap">
          {mostrarFase && (
            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${FASES_COLOR[partido.fase]}`}>
              {FASES_NOMBRE[partido.fase]}
            </span>
          )}
          {partido.grupo && (
            <span className="bg-fwc-bg/50 border border-fwc-border text-gray-400 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded">
              Grupo {partido.grupo}
            </span>
          )}
          {enVivo && (
            <span className="bg-fwc-accent text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded animate-pulse">
              🔴 EN VIVO
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-fwc-gold text-sm font-display font-bold">
            <Clock className="w-3 h-3" />
            {horaEc}
          </div>
          
          <button
            onClick={() => onToggleFavorito(partido.numero)}
            className={`p-1.5 rounded transition-colors ${
              esFavorito 
                ? 'text-fwc-gold' 
                : 'text-gray-600 hover:text-fwc-gold'
            }`}
            title={esFavorito ? 'Quitar de favoritos' : 'Marcar favorito'}
          >
            <Star className={`w-4 h-4 ${esFavorito ? 'fill-fwc-gold' : ''}`} />
          </button>
        </div>
      </div>

      {/* Equipos */}
      <div className="grid grid-cols-3 items-center gap-1 sm:gap-2 mb-3">
        {/* Equipo 1 */}
        <div className="flex flex-col items-center text-center">
          {eq1Conocido ? (
            <>
              <Bandera iso={eq1Info.iso} size="xl" />
              <p className="font-display font-bold text-white text-xs sm:text-sm mt-2 truncate w-full">
                {eq1Info.nombre}
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-12 bg-fwc-bg/50 border border-fwc-border rounded flex items-center justify-center">
                <Trophy className="w-6 h-6 text-gray-600" />
              </div>
              <p className="font-display font-bold text-gray-500 text-xs mt-2 truncate w-full">
                {partido.equipo1}
              </p>
            </>
          )}
        </div>
        
        {/* VS */}
        <div className="text-center">
          <p className="font-display font-black text-fwc-gold text-xl sm:text-2xl">VS</p>
          {cuenta && !cuenta.enVivo && cuenta.dias < 7 && (
            <p className="text-fwc-neon text-xs font-mono mt-1">
              {cuenta.texto}
            </p>
          )}
        </div>
        
        {/* Equipo 2 */}
        <div className="flex flex-col items-center text-center">
          {eq2Conocido ? (
            <>
              <Bandera iso={eq2Info.iso} size="xl" />
              <p className="font-display font-bold text-white text-xs sm:text-sm mt-2 truncate w-full">
                {eq2Info.nombre}
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-12 bg-fwc-bg/50 border border-fwc-border rounded flex items-center justify-center">
                <Trophy className="w-6 h-6 text-gray-600" />
              </div>
              <p className="font-display font-bold text-gray-500 text-xs mt-2 truncate w-full">
                {partido.equipo2}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Footer: Sede + Canal */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 pt-3 border-t border-fwc-border">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{sede?.ciudad || partido.sede}</span>
        </div>
        <div className="flex items-center gap-1">
          <Tv className="w-3 h-3" />
          <span className={canal ? 'text-fwc-neon font-bold' : 'text-gray-500'}>
            {canal || 'Canal por confirmar'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TarjetaPartido;