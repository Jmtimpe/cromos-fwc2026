import React, { useState, useMemo } from 'react';
import { Calendar, Filter, X, Trophy, Sparkles } from 'lucide-react';
import { PARTIDOS_FWC2026 } from '../lib/partidosData';
import { 
  agruparPorFecha, 
  esPartidoHoy, 
  calcularProximoPartido,
  cuentaRegresiva,
  fechaFormateada
} from '../lib/fechasHelper';
import { EQUIPOS_INFO } from '../lib/equiposData';
import TarjetaPartido from './TarjetaPartido';

const FASES = [
  { value: 'TODOS', label: 'Todas las fases' },
  { value: 'GRUPO', label: 'Fase de Grupos' },
  { value: 'R32', label: '16avos' },
  { value: 'R16', label: 'Octavos' },
  { value: 'CUARTOS', label: 'Cuartos' },
  { value: 'SEMI', label: 'Semifinales' },
  { value: 'TERCERO', label: '3er puesto' },
  { value: 'FINAL', label: 'Final' },
];

function Calendario({ favoritos, onToggleFavorito, canalesPartidos }) {
  const [filtroFase, setFiltroFase] = useState('TODOS');
  const [filtroEquipo, setFiltroEquipo] = useState('TODOS');
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  // Lista de equipos únicos en partidos (solo los confirmados)
  const equiposUnicos = useMemo(() => {
    const set = new Set();
    PARTIDOS_FWC2026.forEach(p => {
      if (EQUIPOS_INFO[p.equipo1]) set.add(p.equipo1);
      if (EQUIPOS_INFO[p.equipo2]) set.add(p.equipo2);
    });
    return Array.from(set).sort();
  }, []);

  // Aplicar filtros
  const partidosFiltrados = useMemo(() => {
    return PARTIDOS_FWC2026.filter(p => {
      if (filtroFase !== 'TODOS' && p.fase !== filtroFase) return false;
      if (filtroEquipo !== 'TODOS' && p.equipo1 !== filtroEquipo && p.equipo2 !== filtroEquipo) return false;
      if (soloFavoritos && !favoritos.includes(p.numero)) return false;
      return true;
    });
  }, [filtroFase, filtroEquipo, soloFavoritos, favoritos]);

  // Próximo partido
  const proximoPartido = useMemo(() => calcularProximoPartido(PARTIDOS_FWC2026), []);
  const cuentaProximo = proximoPartido 
    ? cuentaRegresiva(proximoPartido.fecha, proximoPartido.horaLocal, proximoPartido.sede)
    : null;

  // Agrupar por fecha
  const partidosPorFecha = useMemo(() => agruparPorFecha(partidosFiltrados), [partidosFiltrados]);
  const fechasOrdenadas = Object.keys(partidosPorFecha);

  const limpiarFiltros = () => {
    setFiltroFase('TODOS');
    setFiltroEquipo('TODOS');
    setSoloFavoritos(false);
  };

  const hayFiltrosActivos = filtroFase !== 'TODOS' || filtroEquipo !== 'TODOS' || soloFavoritos;

  return (
    <div>
      {/* Header */}
      <div className="fwc-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-7 h-7 text-fwc-gold" />
          <h3 className="font-display font-bold text-2xl text-white">
            Calendario Mundial 2026
          </h3>
        </div>
        <p className="text-gray-400 text-sm">
          {PARTIDOS_FWC2026.length} partidos • Del 11 de junio al 19 de julio • Horarios Ecuador 🇪🇨
        </p>
      </div>

      {/* Banner Próximo Partido */}
      {proximoPartido && cuentaProximo && (
        <div className="fwc-card border-fwc-gold/40 p-5 mb-6 bg-gradient-to-r from-fwc-gold/10 to-fwc-neon/5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-fwc-gold" />
            <span className="text-fwc-gold text-xs uppercase tracking-widest font-bold">
              Próximo Partido
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display font-bold text-white text-lg">
                {proximoPartido.equipo1} <span className="text-fwc-gold mx-2">vs</span> {proximoPartido.equipo2}
              </p>
              <p className="text-gray-400 text-sm">
                {fechaFormateada(proximoPartido.fecha, proximoPartido.horaLocal, proximoPartido.sede)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs uppercase tracking-widest">Faltan</p>
              <p className="font-display font-black text-3xl text-fwc-neon">
                {cuentaProximo.texto}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="fwc-card p-4 mb-6 sticky top-32 z-10 backdrop-blur-md bg-fwc-card/95">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Fase */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filtroFase}
              onChange={(e) => setFiltroFase(e.target.value)}
              className="bg-fwc-bg border border-fwc-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-fwc-gold"
            >
              {FASES.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Equipo */}
          <select
            value={filtroEquipo}
            onChange={(e) => setFiltroEquipo(e.target.value)}
            className="bg-fwc-bg border border-fwc-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-fwc-gold flex-1 min-w-[150px]"
          >
            <option value="TODOS">Todos los equipos</option>
            {equiposUnicos.map(eq => (
              <option key={eq} value={eq}>{EQUIPOS_INFO[eq]?.nombre || eq}</option>
            ))}
          </select>

          {/* Solo favoritos */}
          <button
            onClick={() => setSoloFavoritos(!soloFavoritos)}
            className={`px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
              soloFavoritos 
                ? 'bg-fwc-gold text-fwc-bg border-fwc-gold' 
                : 'bg-fwc-bg text-gray-400 border-fwc-border hover:border-fwc-gold hover:text-fwc-gold'
            }`}
          >
            ⭐ Favoritos ({favoritos.length})
          </button>

          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="text-fwc-accent hover:text-red-400 text-xs uppercase tracking-wider font-bold flex items-center gap-1 ml-auto"
            >
              <X className="w-3 h-3" />
              Limpiar
            </button>
          )}
        </div>
        
        <p className="text-gray-500 text-xs mt-3">
          Mostrando <span className="text-fwc-gold font-bold">{partidosFiltrados.length}</span> de {PARTIDOS_FWC2026.length} partidos
        </p>
      </div>

      {/* Lista de partidos agrupados por fecha */}
      {fechasOrdenadas.length === 0 ? (
        <div className="fwc-card p-12 text-center">
          <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No hay partidos con esos filtros</p>
        </div>
      ) : (
        <div className="space-y-6">
          {fechasOrdenadas.map(fecha => (
            <div key={fecha}>
              <h4 className="font-display font-bold text-fwc-gold text-lg uppercase tracking-wider mb-3 sticky top-56 bg-fwc-bg py-2 z-[5]">
                📅 {fecha}
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {partidosPorFecha[fecha].map(partido => (
                  <TarjetaPartido
                    key={partido.numero}
                    partido={partido}
                    esFavorito={favoritos.includes(partido.numero)}
                    onToggleFavorito={onToggleFavorito}
                    canal={canalesPartidos[partido.numero]}
                    mostrarFase={true}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Calendario;