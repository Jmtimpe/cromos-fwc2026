import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, BookOpen, ChevronDown, ChevronRight, Inbox } from 'lucide-react';
import { fetchCatalog } from '../lib/seedCromos';
import { observeInventario, updateCromoEstado } from '../lib/inventario';
import { getEquipoInfo } from '../lib/equiposData';
import CromoCard from './CromoCard';
import Bandera from './Bandera';
import FiltrosBar from './FiltrosBar';
import { appCache } from '../lib/cache';

function Inventario({ user }) {
  const [catalogo, setCatalogo] = useState([]);
  const [inventario, setInventario] = useState({});
  const [loading, setLoading] = useState(true);
  const [seccionesAbiertas, setSeccionesAbiertas] = useState({});
  const [equiposAbiertos, setEquiposAbiertos] = useState({});

  // Estados de filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  // Cargar catálogo (con caché)
  useEffect(() => {
    let cancelado = false;
    const load = async () => {
      try {
        const data = await appCache.getCatalogo(fetchCatalog);
        if (!cancelado) {
          setCatalogo(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error cargando catálogo:', error);
        if (!cancelado) setLoading(false);
      }
    };
    load();
    return () => { cancelado = true; };
  }, []);

  // Listener del inventario en tiempo real
  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = observeInventario(user.uid, (data) => {
      setInventario(data);
    });
    return () => unsubscribe();
  }, [user]);

  const handleUpdate = async (numeroCromo, nuevaCantidad) => {
    setInventario(prev => ({ ...prev, [numeroCromo]: nuevaCantidad }));
    await updateCromoEstado(user.uid, numeroCromo, nuevaCantidad);
  };

  const toggleSeccion = (seccion) => {
    setSeccionesAbiertas(prev => ({ ...prev, [seccion]: !prev[seccion] }));
  };

  const toggleEquipo = (equipoKey) => {
    setEquiposAbiertos(prev => ({ ...prev, [equipoKey]: !prev[equipoKey] }));
  };

  // ============= FILTRADO =============
  const cromosFiltrados = useMemo(() => {
    return catalogo.filter(cromo => {
      // Filtro por búsqueda
      if (busqueda) {
        const q = busqueda.toLowerCase();
        const equipoInfo = getEquipoInfo(cromo.equipo);
        const matchBusqueda = 
          cromo.codigo.toLowerCase().includes(q) ||
          cromo.equipo.toLowerCase().includes(q) ||
          equipoInfo.nombre.toLowerCase().includes(q) ||
          (cromo.detalle && cromo.detalle.toLowerCase().includes(q));
        if (!matchBusqueda) return false;
      }

      // Filtro por estado
      const cant = inventario[cromo.numero] || 0;
      if (filtroEstado === 'faltantes' && cant !== 0) return false;
      if (filtroEstado === 'obtenidos' && cant < 1) return false;
      if (filtroEstado === 'repetidos' && cant < 2) return false;

      // Filtro por tipo
      if (filtroTipo !== 'todos' && cromo.tipo !== filtroTipo) return false;

      return true;
    });
  }, [catalogo, inventario, busqueda, filtroEstado, filtroTipo]);

  // ============= AGRUPACIÓN: Sección → Equipo → Cromos =============
  const estructura = useMemo(() => {
    const result = {};
    cromosFiltrados.forEach(cromo => {
      const sec = cromo.seccion;
      const eq = cromo.equipo;
      if (!result[sec]) result[sec] = {};
      if (!result[sec][eq]) result[sec][eq] = [];
      result[sec][eq].push(cromo);
    });
    return result;
  }, [cromosFiltrados]);

  // Stats globales (sobre TODO el catálogo, no solo filtrado)
  const totalObtenidos = catalogo.filter(c => (inventario[c.numero] || 0) >= 1).length;
  const totalRepes = catalogo.filter(c => (inventario[c.numero] || 0) >= 2).length;
  const porcentaje = catalogo.length > 0 ? Math.round((totalObtenidos / catalogo.length) * 100) : 0;

  // Stats por sección (sobre filtrado)
  const getStatsSeccion = (seccion) => {
    const cromosSec = catalogo.filter(c => c.seccion === seccion);
    const obt = cromosSec.filter(c => (inventario[c.numero] || 0) >= 1).length;
    const rep = cromosSec.filter(c => (inventario[c.numero] || 0) >= 2).length;
    return { obtenidos: obt, repetidos: rep, total: cromosSec.length };
  };

  // Stats por equipo dentro de sección
  const getStatsEquipo = (cromos) => {
    const obt = cromos.filter(c => (inventario[c.numero] || 0) >= 1).length;
    const rep = cromos.filter(c => (inventario[c.numero] || 0) >= 2).length;
    return { obtenidos: obt, repetidos: rep, total: cromos.length };
  };

  // Orden de secciones
  const ordenSecciones = [
    'ESPECIALES', 'MUNDIAL',
    'GRUPO A', 'GRUPO B', 'GRUPO C', 'GRUPO D',
    'GRUPO E', 'GRUPO F', 'GRUPO G', 'GRUPO H',
    'GRUPO I', 'GRUPO J', 'GRUPO K', 'GRUPO L'
  ];
  const seccionesVisibles = ordenSecciones.filter(s => estructura[s]);

  // Solo mostrar loading si NO hay catálogo en caché y aún se está cargando
  if (loading && catalogo.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-fwc-gold animate-spin mb-4" />
        <p className="text-gray-400 text-sm uppercase tracking-widest">
          Cargando catálogo...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats globales */}
      <div className="fwc-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-fwc-gold" />
          <h3 className="font-display font-bold text-xl text-white">
            Mi Álbum
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest">Progreso</p>
            <p className="font-display font-bold text-2xl sm:text-3xl text-fwc-gold">
              {porcentaje}<span className="text-sm sm:text-lg">%</span>
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest">Obtenidos</p>
            <p className="font-display font-bold text-2xl sm:text-3xl text-white">
              {totalObtenidos}<span className="text-sm sm:text-base text-gray-500">/{catalogo.length}</span>
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest">Repetidos</p>
            <p className="font-display font-bold text-2xl sm:text-3xl text-fwc-neon">
              {totalRepes}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest">Faltan</p>
            <p className="font-display font-bold text-2xl sm:text-3xl text-fwc-accent">
              {catalogo.length - totalObtenidos}
            </p>
          </div>
        </div>

        <div className="h-3 bg-fwc-bg rounded-full overflow-hidden border border-fwc-border">
          <div
            className="h-full bg-gradient-to-r from-fwc-gold to-fwc-neon transition-all duration-500"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>

      {/* Filtros */}
      <FiltrosBar
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        totalVisible={cromosFiltrados.length}
        totalGeneral={catalogo.length}
      />

      {/* Mensaje si no hay resultados */}
      {seccionesVisibles.length === 0 && (
        <div className="fwc-card p-12 text-center">
          <Inbox className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            No se encontraron cromos con esos filtros
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Prueba ajustando la búsqueda o limpiando filtros
          </p>
        </div>
      )}

      {/* Secciones */}
      <div className="space-y-4">
        {seccionesVisibles.map((seccion) => {
          const equipos = estructura[seccion];
          const equiposLista = Object.keys(equipos);
          const stats = getStatsSeccion(seccion);
          const abierta = seccionesAbiertas[seccion] ?? false;

          return (
            <div key={seccion} className="fwc-card overflow-hidden">
              {/* Header de sección */}
              <button
                onClick={() => toggleSeccion(seccion)}
                className="w-full p-4 flex items-center justify-between hover:bg-fwc-bg/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {abierta ? (
                    <ChevronDown className="w-5 h-5 text-fwc-gold" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-fwc-gold" />
                  )}
                  <h4 className="font-display font-bold text-lg text-white tracking-wider">
                    {seccion}
                  </h4>
                  <span className="text-gray-500 text-xs">
                    ({equiposLista.length} {equiposLista.length === 1 ? 'equipo' : 'equipos'})
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {stats.repetidos > 0 && (
                    <span className="text-fwc-neon text-sm font-mono hidden sm:inline">
                      +{stats.repetidos} repes
                    </span>
                  )}
                  <span className="text-gray-400 text-sm font-mono">
                    {stats.obtenidos}/{stats.total}
                  </span>
                </div>
              </button>

              {/* Equipos dentro de la sección */}
              {abierta && (
                <div className="border-t border-fwc-border bg-fwc-bg/20">
                  {equiposLista.map((equipo) => {
                    const cromos = equipos[equipo];
                    const equipoInfo = getEquipoInfo(equipo);
                    const equipoKey = `${seccion}-${equipo}`;
                    const equipoAbierto = equiposAbiertos[equipoKey] ?? false;
                    const eqStats = getStatsEquipo(cromos);

                    return (
                      <div key={equipoKey} className="border-b border-fwc-border last:border-0">
                        {/* Header del equipo */}
                        <button
                          onClick={() => toggleEquipo(equipoKey)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-fwc-card/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {equipoAbierto ? (
                              <ChevronDown className="w-4 h-4 text-fwc-neon" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-fwc-neon" />
                            )}
                            <Bandera iso={equipoInfo.iso} size="lg" />
                            <span className="font-display font-bold text-white text-base">
                              {equipoInfo.nombre}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {eqStats.repetidos > 0 && (
                              <span className="text-fwc-neon text-xs font-mono">
                                +{eqStats.repetidos}
                              </span>
                            )}
                            <span className="text-gray-400 text-xs font-mono">
                              {eqStats.obtenidos}/{eqStats.total}
                            </span>
                          </div>
                        </button>

                        {/* Cromos del equipo */}
                        {equipoAbierto && (
                          <div className="px-4 pb-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                              {cromos.map((cromo) => (
                                <CromoCard
                                  key={cromo.numero}
                                  cromo={cromo}
                                  cantidad={inventario[cromo.numero] || 0}
                                  onUpdate={handleUpdate}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Inventario;