import React from 'react';
import { Search, X, CheckCircle2, Copy, Layers } from 'lucide-react';

function FiltrosBar({ 
  busqueda, 
  setBusqueda, 
  filtroEstado, 
  setFiltroEstado, 
  filtroTipo, 
  setFiltroTipo,
  totalVisible,
  totalGeneral
}) {

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('todos');
    setFiltroTipo('todos');
  };

  const hayFiltrosActivos = busqueda || filtroEstado !== 'todos' || filtroTipo !== 'todos';

  return (
    <div className="fwc-card p-4 mb-6 sticky top-20 z-10 backdrop-blur-md bg-fwc-card/90">
      
      {/* Buscador */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por país, código o detalle..."
          className="w-full bg-fwc-bg border border-fwc-border rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-fwc-gold transition-colors"
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filtros de estado */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-gray-400 text-xs uppercase tracking-widest font-bold self-center mr-2">
          Estado:
        </span>
        <FiltroBtn
          activo={filtroEstado === 'todos'}
          onClick={() => setFiltroEstado('todos')}
          icon={<Layers className="w-3 h-3" />}
          label="Todos"
        />
        <FiltroBtn
          activo={filtroEstado === 'faltantes'}
          onClick={() => setFiltroEstado('faltantes')}
          icon={<X className="w-3 h-3" />}
          label="Faltantes"
          color="accent"
        />
        <FiltroBtn
          activo={filtroEstado === 'obtenidos'}
          onClick={() => setFiltroEstado('obtenidos')}
          icon={<CheckCircle2 className="w-3 h-3" />}
          label="Obtenidos"
          color="gold"
        />
        <FiltroBtn
          activo={filtroEstado === 'repetidos'}
          onClick={() => setFiltroEstado('repetidos')}
          icon={<Copy className="w-3 h-3" />}
          label="Repetidos"
          color="neon"
        />
      </div>

      {/* Filtros de tipo */}
      <div className="flex flex-wrap gap-2">
        <span className="text-gray-400 text-xs uppercase tracking-widest font-bold self-center mr-2">
          Tipo:
        </span>
        <FiltroBtn
          activo={filtroTipo === 'todos'}
          onClick={() => setFiltroTipo('todos')}
          label="Todos"
        />
        <FiltroBtn
          activo={filtroTipo === 'NORMAL'}
          onClick={() => setFiltroTipo('NORMAL')}
          label="Normal"
        />
        <FiltroBtn
          activo={filtroTipo === 'BRILLANTE'}
          onClick={() => setFiltroTipo('BRILLANTE')}
          label="Brillante"
          color="gold"
        />
        <FiltroBtn
          activo={filtroTipo === 'ESPECIAL'}
          onClick={() => setFiltroTipo('ESPECIAL')}
          label="Especial"
          color="accent"
        />
      </div>

      {/* Footer con contador y botón limpiar */}
      {hayFiltrosActivos && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-fwc-border">
          <p className="text-gray-400 text-xs">
            Mostrando <span className="text-fwc-gold font-bold">{totalVisible}</span> de {totalGeneral} cromos
          </p>
          <button
            onClick={limpiarFiltros}
            className="text-fwc-accent hover:text-red-400 text-xs uppercase tracking-wider font-bold flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}

// Sub-componente para cada botón de filtro
function FiltroBtn({ activo, onClick, icon, label, color = 'default' }) {
  const colors = {
    default: activo ? 'bg-white text-fwc-bg' : 'bg-fwc-bg text-gray-400 hover:text-white',
    gold:    activo ? 'bg-fwc-gold text-fwc-bg' : 'bg-fwc-bg text-gray-400 hover:text-fwc-gold',
    neon:    activo ? 'bg-fwc-neon text-fwc-bg' : 'bg-fwc-bg text-gray-400 hover:text-fwc-neon',
    accent:  activo ? 'bg-fwc-accent text-white' : 'bg-fwc-bg text-gray-400 hover:text-fwc-accent',
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border border-fwc-border transition-all flex items-center gap-1 ${colors[color]}`}
    >
      {icon}
      {label}
    </button>
  );
}

export default FiltrosBar;