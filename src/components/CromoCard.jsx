import React from 'react';
import { Plus, Minus, Star, Sparkles, Award } from 'lucide-react';
import { getEquipoInfo } from '../lib/equiposData';
import Bandera from './Bandera';

function CromoCard({ cromo, cantidad, onUpdate }) {
  const obtenido = cantidad >= 1;
  const repetido = cantidad >= 2;
  const equipoInfo = getEquipoInfo(cromo.equipo);

  const getTipoStyle = () => {
    switch (cromo.tipo) {
      case 'ESPECIAL':
        return { 
          icon: <Award className="w-3 h-3" />, 
          color: 'text-fwc-accent',
          border: 'border-fwc-accent/30'
        };
      case 'BRILLANTE':
        return { 
          icon: <Sparkles className="w-3 h-3" />, 
          color: 'text-fwc-gold',
          border: 'border-fwc-gold/30'
        };
      default:
        return { 
          icon: <Star className="w-3 h-3" />, 
          color: 'text-gray-500',
          border: 'border-fwc-border'
        };
    }
  };

  const tipoStyle = getTipoStyle();

  const cardStyle = obtenido 
    ? (repetido 
      ? 'bg-fwc-card border-fwc-neon/50 shadow-lg shadow-fwc-neon/10' 
      : 'bg-fwc-card border-fwc-gold/40')
    : 'bg-fwc-bg/40 border-fwc-border opacity-70';

  const handleIncrement = () => {
    onUpdate(cromo.numero, cantidad + 1);
  };

  const handleDecrement = () => {
    if (cantidad > 0) {
      onUpdate(cromo.numero, cantidad - 1);
    }
  };

  return (
    <div className={`rounded-lg border p-3 transition-all ${cardStyle}`}>
      {/* Header con código y tipo */}
      <div className="flex justify-between items-start mb-2">
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded border ${tipoStyle.border}`}>
          <span className={tipoStyle.color}>{tipoStyle.icon}</span>
          <span className="font-display font-bold text-xs text-white">
            {cromo.codigo}
          </span>
        </div>
        <span className="text-gray-500 text-xs font-mono">
          #{String(cromo.numero).padStart(3, '0')}
        </span>
      </div>

      {/* Bandera + Equipo */}
      <div className="flex items-center gap-2 mb-1">
        <Bandera iso={equipoInfo.iso} size="md" />
        <p className="font-display font-bold text-sm text-white truncate">
          {equipoInfo.nombre}
        </p>
      </div>

      {/* Detalle */}
      {cromo.detalle && (
        <p className="text-xs text-gray-400 truncate mb-3">
          {cromo.detalle}
        </p>
      )}

      {/* Controles */}
      {/* Controles */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 mt-2">
        <button
          onClick={handleDecrement}
          disabled={cantidad === 0}
          className="w-9 h-9 sm:w-8 sm:h-8 rounded bg-fwc-bg border border-fwc-border hover:border-fwc-accent hover:text-fwc-accent active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="flex-1 text-center min-w-0">
          {cantidad === 0 ? (
            <span className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              Faltante
            </span>
          ) : cantidad === 1 ? (
            <span className="text-fwc-gold text-xs sm:text-sm font-display font-bold uppercase tracking-wider">
              ✓ Obt.
            </span>
          ) : (
            <span className="text-fwc-neon text-xs sm:text-sm font-display font-bold uppercase tracking-wider">
              ×{cantidad} Repe
            </span>
          )}
        </div>

        <button
          onClick={handleIncrement}
          className="w-9 h-9 sm:w-8 sm:h-8 rounded bg-fwc-gold hover:bg-yellow-500 active:scale-95 text-fwc-bg transition-all flex items-center justify-center flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default CromoCard;