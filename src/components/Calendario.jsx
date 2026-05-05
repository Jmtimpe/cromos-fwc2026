import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Filter, 
  X, 
  Search, 
  MapPin, 
  Trophy, 
  Heart,
  ChevronDown
} from 'lucide-react';
import { 
  partidosData, 
  FASES, 
  nombreFase, 
  SEDES,
  obtenerNombreEquipo,
  esPlaceholder
} from '../lib/partidosData';
import TarjetaPartido from './TarjetaPartido';

function Calendario({ favoritos, onToggleFavorito, canalesPartidos }) {
  const [filtroFase, setFiltroFase] = useState('TODOS');
  const [filtroEquipo, setFiltroEquipo] = useState('TODOS');
  const [filtroSede, setFiltroSede] = useState('TODOS');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Lista de equipos únicos (solo los que NO son placeholders)
  const equiposUnicos = useMemo(() => {
    const set = new Set();
    partidosData.forEach((p) => {
      if (!esPlaceholder(p.equipoLocal)) set.add(p.equipoLocal);
      if (!esPlaceholder(p.equipoVisitante)) set.add(p.equipoVisitante);
    });
    return Array.from(set).sort();
  }, []);

  // Lista de sedes únicas
  const sedesUnicas = useMemo(() => {
    return Object.values(SEDES).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, []);

  // Lista de fechas únicas
  const fechasUnicas = useMemo(() => {
    const set = new Set(partidosData.map((p) => p.fecha));
    return Array.from(set).sort();
  }, []);

  // Filtrar partidos
  const partidosFiltrados = useMemo(() => {
    return partidosData.filter((p) => {
      // Filtro por fase
      if (filtroFase !== 'TODOS' && p.fase !== filtroFase) return false;

      // Filtro por equipo
      if (filtroEquipo !== 'TODOS') {
        const localNombre = obtenerNombreEquipo(p.equipoLocal);
        const visitanteNombre = obtenerNombreEquipo(p.equipoVisitante);
        if (localNombre !== filtroEquipo && visitanteNombre !== filtroEquipo) return false;
      }

      // Filtro por sede
      if (filtroSede !== 'TODOS' && p.sede.id !== filtroSede) return false;

      // Filtro por fecha
      if (filtroFecha && p.fecha !== filtroFecha) return false;

      // Filtro por favoritos
      if (soloFavoritos && !favoritos.includes(p.numero)) return false;

      return true;
    });
  }, [filtroFase, filtroEquipo, filtroSede, filtroFecha, soloFavoritos, favoritos]);

  // Agrupar partidos por fecha
  const partidosAgrupados = useMemo(() => {
    const grupos = {};
    partidosFiltrados.forEach((p) => {
      if (!grupos[p.fecha]) grupos[p.fecha] = [];
      grupos[p.fecha].push(p);
    });
    return grupos;
  }, [partidosFiltrados]);

  // Determinar si un partido es "EN VIVO" o "PRÓXIMO"
  const ahora = new Date();

  const esEnVivo = (partido) => {
    const inicio = new Date(`${partido.fecha}T${partido.hora}:00-05:00`);
    const fin = new Date(inicio.getTime() + 2 * 60 * 60 * 1000); // 2 horas después
    return ahora >= inicio && ahora <= fin;
  };

  const proximoPartido = useMemo(() => {
    const futuros = partidosData.filter((p) => {
      const inicio = new Date(`${p.fecha}T${p.hora}:00-05:00`);
      return inicio > ahora;
    });
    futuros.sort((a, b) => {
      const aTime = new Date(`${a.fecha}T${a.hora}:00-05:00`).getTime();
      const bTime = new Date(`${b.fecha}T${b.hora}:00-05:00`).getTime();
      return aTime - bTime;
    });
    return futuros[0];
  }, [ahora]);

  const limpiarFiltros = () => {
    setFiltroFase('TODOS');
    setFiltroEquipo('TODOS');
    setFiltroSede('TODOS');
    setFiltroFecha('');
    setSoloFavoritos(false);
  };

  const filtrosActivos = 
    filtroFase !== 'TODOS' || 
    filtroEquipo !== 'TODOS' || 
    filtroSede !== 'TODOS' || 
    filtroFecha || 
    soloFavoritos;

  return (
    <div>
      {/* Header */}
      <div className="fwc-card p-4 sm:p-6 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6 text-fwc-gold" />
          <h2 className="font-display font-bold text-2xl text-white">Calendario Mundial 2026</h2>
        </div>
        <p className="text-gray-400 text-sm">
          {partidosFiltrados.length} {partidosFiltrados.length === 1 ? 'partido' : 'partidos'}
          {filtrosActivos && ' (filtrados)'} · 11 jun → 19 jul 2026
        </p>
      </div>

      {/* Banner próximo partido */}
      {proximoPartido && !filtrosActivos && (
        <BannerProximoPartido partido={proximoPartido} />
      )}

      {/* Botón mostrar filtros */}
      <button
        onClick={() => setMostrarFiltros(!mostrarFiltros)}
        className={`w-full mb-4 fwc-card p-3 flex items-center justify-between transition-all ${
          filtrosActivos ? 'border-fwc-gold' : 'border-fwc-border'
        }`}
      >
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${filtrosActivos ? 'text-fwc-gold' : 'text-gray-400'}`} />
          <span className={`font-display font-bold uppercase tracking-wider text-sm ${
            filtrosActivos ? 'text-fwc-gold' : 'text-white'
          }`}>
            Filtros {filtrosActivos && '(activos)'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${mostrarFiltros ? 'rotate-180' : ''}`} />
      </button>

      {/* Panel de filtros */}
      {mostrarFiltros && (
        <div className="fwc-card p-4 mb-4 space-y-3">
          {/* Filtro por fase */}
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              <Trophy className="w-3 h-3 inline mr-1" />
              Fase
            </label>
            <select
              value={filtroFase}
              onChange={(e) => setFiltroFase(e.target.value)}
              className="w-full bg-fwc-bg border border-fwc-border text-white px-3 py-2 rounded-lg text-sm focus:border-fwc-gold focus:outline-none"
            >
              <option value="TODOS">Todas las fases</option>
              <option value={FASES.GRUPO}>Fase de Grupos</option>
              <option value={FASES.R32}>16avos de Final</option>
              <option value={FASES.R16}>Octavos de Final</option>
              <option value={FASES.CUARTOS}>Cuartos de Final</option>
              <option value={FASES.SEMI}>Semifinales</option>
              <option value={FASES.TERCERO}>Tercer Puesto</option>
              <option value={FASES.FINAL}>Final</option>
            </select>
          </div>

          {/* Filtro por equipo */}
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              <Search className="w-3 h-3 inline mr-1" />
              Equipo
            </label>
            <select
              value={filtroEquipo}
              onChange={(e) => setFiltroEquipo(e.target.value)}
              className="w-full bg-fwc-bg border border-fwc-border text-white px-3 py-2 rounded-lg text-sm focus:border-fwc-gold focus:outline-none"
            >
              <option value="TODOS">Todos los equipos</option>
              {equiposUnicos.map((equipo) => (
                <option key={equipo} value={equipo}>{equipo}</option>
              ))}
            </select>
          </div>

          {/* Filtro por sede */}
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              <MapPin className="w-3 h-3 inline mr-1" />
              Sede
            </label>
            <select
              value={filtroSede}
              onChange={(e) => setFiltroSede(e.target.value)}
              className="w-full bg-fwc-bg border border-fwc-border text-white px-3 py-2 rounded-lg text-sm focus:border-fwc-gold focus:outline-none"
            >
              <option value="TODOS">Todas las sedes</option>
              {sedesUnicas.map((sede) => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre} - {sede.ciudad}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por fecha */}
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              <Calendar className="w-3 h-3 inline mr-1" />
              Fecha específica
            </label>
            <select
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="w-full bg-fwc-bg border border-fwc-border text-white px-3 py-2 rounded-lg text-sm focus:border-fwc-gold focus:outline-none"
            >
              <option value="">Todas las fechas</option>
              {fechasUnicas.map((fecha) => {
                const fechaObj = new Date(`${fecha}T12:00:00`);
                const fechaLabel = fechaObj.toLocaleDateString('es-EC', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  timeZone: 'America/Guayaquil'
                });
                return (
                  <option key={fecha} value={fecha}>{fechaLabel}</option>
                );
              })}
            </select>
          </div>

          {/* Filtro favoritos */}
          <button
            onClick={() => setSoloFavoritos(!soloFavoritos)}
            className={`w-full px-3 py-2 rounded-lg border text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              soloFavoritos 
                ? 'bg-fwc-accent/20 border-fwc-accent text-fwc-accent' 
                : 'bg-fwc-bg border-fwc-border text-gray-400 hover:border-fwc-accent hover:text-fwc-accent'
            }`}
          >
            <Heart className={`w-4 h-4 ${soloFavoritos ? 'fill-fwc-accent' : ''}`} />
            Solo favoritos
            {soloFavoritos && favoritos.length > 0 && ` (${favoritos.length})`}
          </button>

          {/* Limpiar filtros */}
          {filtrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="w-full px-3 py-2 rounded-lg border border-fwc-border text-gray-400 hover:border-fwc-gold hover:text-fwc-gold text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <X className="w-3 h-3" />
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Lista de partidos */}
      {partidosFiltrados.length === 0 ? (
        <div className="fwc-card p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No hay partidos con los filtros actuales</p>
          {filtrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="mt-4 text-fwc-gold text-sm hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(partidosAgrupados).sort().map((fecha) => {
            const fechaObj = new Date(`${fecha}T12:00:00`);
            const fechaLabel = fechaObj.toLocaleDateString('es-EC', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: 'America/Guayaquil'
            });
            return (
              <div key={fecha}>
                <h3 className="font-display font-bold text-fwc-gold text-sm uppercase tracking-widest mb-3 pl-1">
                  {fechaLabel}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {partidosAgrupados[fecha].map((partido) => (
                    <TarjetaPartido
                      key={partido.numero}
                      partido={partido}
                      esFavorito={favoritos.includes(partido.numero)}
                      onToggleFavorito={onToggleFavorito}
                      canal={canalesPartidos?.[partido.numero]}
                      enVivo={esEnVivo(partido)}
                      proximo={proximoPartido?.numero === partido.numero}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// === Sub-componente: Banner del próximo partido con cuenta regresiva ===
function BannerProximoPartido({ partido }) {
  const [tiempoRestante, setTiempoRestante] = React.useState('');

  React.useEffect(() => {
    const calcularTiempo = () => {
      const inicio = new Date(`${partido.fecha}T${partido.hora}:00-05:00`);
      const ahora = new Date();
      const diff = inicio.getTime() - ahora.getTime();

      if (diff <= 0) {
        setTiempoRestante('¡Ahora!');
        return;
      }

      const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (dias > 0) {
        setTiempoRestante(`${dias}d ${horas}h ${minutos}m`);
      } else if (horas > 0) {
        setTiempoRestante(`${horas}h ${minutos}m`);
      } else {
        setTiempoRestante(`${minutos}m`);
      }
    };

    calcularTiempo();
    const interval = setInterval(calcularTiempo, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, [partido]);

  const equipoLocal = obtenerNombreEquipo(partido.equipoLocal);
  const equipoVisitante = obtenerNombreEquipo(partido.equipoVisitante);

  return (
    <div className="fwc-card p-4 mb-4 bg-gradient-to-r from-fwc-gold/10 to-fwc-neon/5 border-fwc-gold/40">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-display font-bold uppercase tracking-widest text-fwc-gold mb-1">
            ⏰ Próximo partido
          </p>
          <p className="text-white font-bold text-base">
            {equipoLocal} <span className="text-gray-500 mx-1">vs</span> {equipoVisitante}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">
            {nombreFase(partido.fase)} {partido.fase === FASES.GRUPO && `· Grupo ${partido.grupo}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-display font-bold uppercase tracking-widest text-gray-500">Faltan</p>
          <p className="font-mono font-bold text-2xl text-fwc-gold">{tiempoRestante}</p>
        </div>
      </div>
    </div>
  );
}

export default Calendario;