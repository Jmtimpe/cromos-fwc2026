import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, FileDown, Loader2 } from 'lucide-react';

function FiltrosBar({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  filtroTipo,
  setFiltroTipo,
  totalVisible,
  totalGeneral,
  onExportarPDF,
  generandoPDF,
}) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Contar filtros activos
  const filtrosActivos =
    (filtroEstado !== 'todos' ? 1 : 0) + (filtroTipo !== 'todos' ? 1 : 0);

  const limpiarFiltros = () => {
    setFiltroEstado('todos');
    setFiltroTipo('todos');
    setBusqueda('');
  };

  const hayFiltros = filtrosActivos > 0 || busqueda;

  return (
    <div className="sticky top-[105px] sm:top-[120px] z-10 bg-fwc-bg/95 backdrop-blur-md -mx-3 sm:-mx-6 px-3 sm:px-6 py-3 mb-4 border-b border-fwc-border">
      {/* Fila 1: Buscador + Botón filtros + Botón PDF */}
      <div className="flex items-center gap-2 mb-2">
        {/* Buscador */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-9 pr-9 py-2 bg-fwc-card border border-fwc-border rounded-lg text-white text-sm placeholder-gray-500 focus:border-fwc-gold focus:outline-none"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Botón filtros */}
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-display font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            filtrosActivos > 0
              ? 'bg-fwc-gold text-fwc-bg border-fwc-gold'
              : 'bg-fwc-card text-gray-400 border-fwc-border hover:border-fwc-gold hover:text-white'
          }`}
          title="Filtros"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filtros</span>
          {filtrosActivos > 0 && (
            <span
              className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] rounded-full font-mono ${
                filtrosActivos > 0 ? 'bg-fwc-bg text-fwc-gold' : 'bg-fwc-accent text-white'
              }`}
            >
              {filtrosActivos}
            </span>
          )}
        </button>
      </div>

      {/* Fila 2: Botón Exportar PDF */}
      <button
        onClick={onExportarPDF}
        disabled={generandoPDF}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-fwc-gold/10 to-fwc-neon/5 border border-fwc-gold/40 hover:border-fwc-gold hover:bg-fwc-gold/15 text-fwc-gold rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generandoPDF ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Generando PDF...
          </>
        ) : (
          <>
            <FileDown className="w-3.5 h-3.5" />
            Exportar Faltantes PDF
          </>
        )}
      </button>

      {/* Panel de filtros (colapsable) */}
      {mostrarFiltros && (
        <div className="mt-3 grid grid-cols-2 gap-2 animate-slide-down">
          {/* Filtro Estado */}
          <div>
            <label className="block text-[10px] font-display font-bold uppercase tracking-widest text-gray-500 mb-1">
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full bg-fwc-card border border-fwc-border text-white px-2 py-1.5 rounded-lg text-xs focus:border-fwc-gold focus:outline-none"
            >
              <option value="todos">Todos</option>
              <option value="faltantes">Faltantes</option>
              <option value="obtenidos">Obtenidos</option>
              <option value="repetidos">Repetidos</option>
            </select>
          </div>

          {/* Filtro Tipo */}
          <div>
            <label className="block text-[10px] font-display font-bold uppercase tracking-widest text-gray-500 mb-1">
              Tipo
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full bg-fwc-card border border-fwc-border text-white px-2 py-1.5 rounded-lg text-xs focus:border-fwc-gold focus:outline-none"
            >
              <option value="todos">Todos</option>
              <option value="NORMAL">Normal</option>
              <option value="BRILLANTE">Brillante</option>
              <option value="ESPECIAL">Especial</option>
            </select>
          </div>
        </div>
      )}

      {/* Indicador de resultados + limpiar */}
      {hayFiltros && (
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-[10px] text-gray-500 font-mono">
            Mostrando <span className="text-fwc-gold font-bold">{totalVisible}</span> de{' '}
            {totalGeneral}
          </p>
          <button
            onClick={limpiarFiltros}
            className="text-[10px] text-fwc-accent hover:underline uppercase tracking-wider font-bold flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
}

export default FiltrosBar;