import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Gift,
  Inbox,
  Loader2 as Loading,
  ShoppingCart,
  Filter,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { fetchCatalog } from '../lib/seedCromos';
import { observeInventarioAmigo, procesarEntregaCromo } from '../lib/inventario';
import { getEquipoInfo } from '../lib/equiposData';
import { appCache } from '../lib/cache';
import {
  crearPedido,
  tienePedidoActivo,
  observarPedidosEnviados,
  marcarRecibido,
  cancelarPedido,
} from '../lib/pedidos';
import Bandera from './Bandera';

function VistaAmigo({ amigo, miInventario, miUsuario, onVolver }) {
  const [catalogo, setCatalogo] = useState([]);
  const [inventarioAmigo, setInventarioAmigo] = useState({});
  const [loading, setLoading] = useState(true);
  const [vistaActiva, setVistaActiva] = useState('matches'); // 'matches' | 'paraEl' | 'completo'
  const [seccionAbierta, setSeccionAbierta] = useState(null);
  const [equipoAbierto, setEquipoAbierto] = useState(null);
  const [soloMatches, setSoloMatches] = useState(false);
  const [pedidoEnCurso, setPedidoEnCurso] = useState(null);
  const [mensajePedido, setMensajePedido] = useState({ tipo: '', texto: '' });
  const [misPedidos, setMisPedidos] = useState([]);

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
    return () => {
      cancelado = true;
    };
  }, []);

  // Observar inventario del amigo en tiempo real
  useEffect(() => {
    if (!amigo?.uid) return;
    const unsubscribe = observeInventarioAmigo(amigo.uid, setInventarioAmigo);
    return () => unsubscribe();
  }, [amigo]);

  // Escuchar mis pedidos enviados (para saber el estado de cada uno)
  useEffect(() => {
    if (!miUsuario?.uid || !amigo?.uid) return;
    const unsub = observarPedidosEnviados(miUsuario.uid, (pedidos) => {
      // Filtrar solo los que son hacia este amigo
      const pedidosAEsteAmigo = pedidos.filter((p) => p.paraUsuarioId === amigo.uid);
      setMisPedidos(pedidosAEsteAmigo);
    });
    return () => unsub();
  }, [miUsuario?.uid, amigo?.uid]);

  // Análisis del inventario: matchmaking visual
  const analisis = useMemo(() => {
    if (!catalogo.length) {
      return {
        matchesParaMi: [],
        matchesParaEl: [],
        completo: catalogo,
      };
    }

    // Matches "para mí" = él tiene >=2, yo no lo tengo
    const matchesParaMi = catalogo.filter((c) => {
      const cantAmigo = inventarioAmigo[c.numero] || 0;
      const cantMia = miInventario[c.numero] || 0;
      return cantAmigo >= 2 && cantMia === 0;
    });

    // Matches "para él" = yo tengo >=2, él no lo tiene
    const matchesParaEl = catalogo.filter((c) => {
      const cantAmigo = inventarioAmigo[c.numero] || 0;
      const cantMia = miInventario[c.numero] || 0;
      return cantMia >= 2 && cantAmigo === 0;
    });

    return {
      matchesParaMi,
      matchesParaEl,
      completo: catalogo,
    };
  }, [catalogo, inventarioAmigo, miInventario]);

  // Stats del amigo
  const statsAmigo = useMemo(() => {
    const total = catalogo.length;
    const obtenidos = catalogo.filter((c) => (inventarioAmigo[c.numero] || 0) >= 1).length;
    const repes = catalogo.reduce((sum, c) => {
      const cant = inventarioAmigo[c.numero] || 0;
      return sum + (cant > 1 ? cant - 1 : 0);
    }, 0);
    const porcentaje = total > 0 ? Math.round((obtenidos / total) * 100) : 0;
    return { total, obtenidos, repes, porcentaje };
  }, [catalogo, inventarioAmigo]);

  // Obtener el pedido activo (pendiente o aprobado) para un cromo específico
  const obtenerPedidoActivo = (numeroCromo) => {
    return misPedidos.find(
      (p) =>
        p.cromoNumero === numeroCromo &&
        (p.estado === 'pendiente' || p.estado === 'aprobado')
    );
  };

  // Pedir un cromo (crear pedido nuevo)
  const handlePedirCromo = async (cromo) => {
    if (!miUsuario || !amigo) return;

    setPedidoEnCurso(cromo.numero);
    setMensajePedido({ tipo: '', texto: '' });

    // Verificar si ya tengo un pedido activo de este cromo
    const yaActivo = await tienePedidoActivo(miUsuario.uid, amigo.uid, cromo.numero);

    if (yaActivo) {
      setMensajePedido({
        tipo: 'info',
        texto: `Ya tienes un pedido activo de ${cromo.codigo}`,
      });
      setPedidoEnCurso(null);
      setTimeout(() => setMensajePedido({ tipo: '', texto: '' }), 3500);
      return;
    }

    const result = await crearPedido({
      deUsuario: miUsuario,
      paraUsuario: amigo,
      cromo,
    });

    if (result.success) {
      setMensajePedido({
        tipo: 'exito',
        texto: `¡Pediste ${cromo.codigo} a ${amigo.displayName}! 🎉`,
      });
    } else {
      setMensajePedido({ tipo: 'error', texto: result.error });
    }

    setPedidoEnCurso(null);
    setTimeout(() => setMensajePedido({ tipo: '', texto: '' }), 4000);
  };

  // Marcar un cromo como recibido (cuando el dueño me lo dio físicamente)
  const handleMarcarRecibido = async (cromo) => {
    const pedido = obtenerPedidoActivo(cromo.numero);
    if (!pedido) return;

    if (
      !window.confirm(
        `¿Confirmas que recibiste el cromo ${cromo.codigo} de ${amigo.displayName}?`
      )
    )
      return;

    setPedidoEnCurso(cromo.numero);

    // 1. Actualizar inventarios físicos
    const resultEntrega = await procesarEntregaCromo(
      pedido.paraUsuarioId, // dueño (el amigo)
      pedido.deUsuarioId, // receptor (yo)
      pedido.cromoNumero
    );

    if (resultEntrega.success) {
      // 2. Marcar pedido como completado
      await marcarRecibido(pedido.id);
      setMensajePedido({
        tipo: 'exito',
        texto: `¡${cromo.codigo} agregado a tu álbum! 🎉`,
      });
    } else {
      setMensajePedido({ tipo: 'error', texto: resultEntrega.error });
    }

    setPedidoEnCurso(null);
    setTimeout(() => setMensajePedido({ tipo: '', texto: '' }), 4000);
  };

  // Cancelar un pedido pendiente
  const handleCancelarPedido = async (cromo) => {
    const pedido = obtenerPedidoActivo(cromo.numero);
    if (!pedido) return;

    if (!window.confirm(`¿Cancelar tu pedido del cromo ${cromo.codigo}?`)) return;

    setPedidoEnCurso(cromo.numero);
    await cancelarPedido(pedido.id);
    setPedidoEnCurso(null);
  };

  // Agrupar catálogo por sección y equipo (para vista "completo")
  const catalogoAgrupado = useMemo(() => {
    const grupos = {};
    catalogo.forEach((cromo) => {
      const seccion = cromo.seccion || 'Sin sección';
      const equipo = cromo.equipo || 'Sin equipo';
      if (!grupos[seccion]) grupos[seccion] = {};
      if (!grupos[seccion][equipo]) grupos[seccion][equipo] = [];
      grupos[seccion][equipo].push(cromo);
    });
    return grupos;
  }, [catalogo]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loading className="w-10 h-10 text-fwc-gold animate-spin mb-4" />
        <p className="text-gray-400 text-sm uppercase tracking-widest">
          Cargando álbum...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header con info del amigo */}
      <div className="fwc-card p-4 sm:p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <button
            onClick={onVolver}
            className="p-2 border border-fwc-border hover:border-fwc-gold hover:text-fwc-gold rounded-lg transition-colors flex-shrink-0"
            title="Volver"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            {amigo.photoURL ? (
              <img
                src={amigo.photoURL}
                alt={amigo.displayName}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-fwc-gold flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-fwc-card border-2 border-fwc-gold flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-fwc-gold" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white truncate">
                {amigo.displayName}
              </h2>
              <p className="text-gray-500 text-xs font-mono truncate">
                {amigo.codigoInvitacion}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest">
              Progreso
            </p>
            <p className="font-display font-bold text-2xl sm:text-3xl text-fwc-gold">
              {statsAmigo.porcentaje}
              <span className="text-sm sm:text-lg">%</span>
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest">
              Tiene
            </p>
            <p className="font-display font-bold text-2xl sm:text-3xl text-white">
              {statsAmigo.obtenidos}
              <span className="text-sm sm:text-base text-gray-500">/{statsAmigo.total}</span>
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest">
              Sus repes
            </p>
            <p className="font-display font-bold text-2xl sm:text-3xl text-fwc-neon">
              {statsAmigo.repes}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest">
              ¡Para ti!
            </p>
            <p className="font-display font-bold text-2xl sm:text-3xl text-fwc-accent">
              {analisis.matchesParaMi.length}
            </p>
          </div>
        </div>
      </div>

      {/* Banner de match si hay coincidencias */}
      {analisis.matchesParaMi.length > 0 && analisis.matchesParaEl.length > 0 && (
        <div className="fwc-card p-5 mb-6 bg-gradient-to-r from-fwc-gold/10 to-fwc-neon/10 border-fwc-gold">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-fwc-gold" />
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
              ¡Intercambio Perfecto!
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-fwc-bg/50 rounded-lg p-3">
              <p className="text-fwc-gold text-xs uppercase tracking-wider mb-1">
                Te puede dar
              </p>
              <p className="font-display font-black text-3xl text-fwc-gold">
                {analisis.matchesParaMi.length}
              </p>
              <p className="text-gray-400 text-xs">cromos que necesitas</p>
            </div>
            <div className="bg-fwc-bg/50 rounded-lg p-3">
              <p className="text-fwc-neon text-xs uppercase tracking-wider mb-1">
                Le puedes dar
              </p>
              <p className="font-display font-black text-3xl text-fwc-neon">
                {analisis.matchesParaEl.length}
              </p>
              <p className="text-gray-400 text-xs">cromos que necesita</p>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de pedido */}
      {mensajePedido.texto && (
        <div
          className={`mb-4 rounded-lg p-3 text-sm flex items-center gap-2 ${
            mensajePedido.tipo === 'exito'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : mensajePedido.tipo === 'error'
              ? 'bg-red-500/10 border border-red-500/30 text-fwc-accent'
              : 'bg-fwc-neon/10 border border-fwc-neon/30 text-fwc-neon'
          }`}
        >
          {mensajePedido.tipo === 'exito' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {mensajePedido.texto}
        </div>
      )}

      {/* Tabs de vista */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setVistaActiva('completo')}
          className={`px-4 py-2 rounded-lg border font-display font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 ${
            vistaActiva === 'completo'
              ? 'bg-white text-fwc-bg border-white'
              : 'bg-fwc-card border-fwc-border text-gray-400 hover:border-fwc-gold hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Su álbum completo
        </button>
        <button
          onClick={() => setVistaActiva('matches')}
          className={`px-4 py-2 rounded-lg border font-display font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 ${
            vistaActiva === 'matches'
              ? 'bg-fwc-gold text-fwc-bg border-fwc-gold'
              : 'bg-fwc-card border-fwc-border text-gray-400 hover:border-fwc-gold hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Para ti ({analisis.matchesParaMi.length})
        </button>
        <button
          onClick={() => setVistaActiva('paraEl')}
          className={`px-4 py-2 rounded-lg border font-display font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 ${
            vistaActiva === 'paraEl'
              ? 'bg-fwc-neon text-fwc-bg border-fwc-neon'
              : 'bg-fwc-card border-fwc-border text-gray-400 hover:border-fwc-neon hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4" />
          Para él/ella ({analisis.matchesParaEl.length})
        </button>
      </div>

      {/* Filtro "solo matches" para vista completa */}
      {vistaActiva === 'completo' && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setSoloMatches(!soloMatches)}
            className={`px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
              soloMatches
                ? 'bg-fwc-gold text-fwc-bg border-fwc-gold'
                : 'bg-fwc-card text-gray-400 border-fwc-border hover:border-fwc-gold hover:text-fwc-gold'
            }`}
          >
            <Filter className="w-3 h-3" />
            Solo matches
          </button>
        </div>
      )}

      {/* Contenido según vista */}
      {vistaActiva === 'matches' ? (
        <ListaMatches
          cromos={analisis.matchesParaMi}
          inventarioRef={inventarioAmigo}
          tipo="paraMi"
          mensaje={`No hay cromos repetidos de ${amigo.displayName} que te falten`}
          onPedir={handlePedirCromo}
          onMarcarRecibido={handleMarcarRecibido}
          onCancelar={handleCancelarPedido}
          obtenerPedidoActivo={obtenerPedidoActivo}
          pidiendoEsteCromo={pedidoEnCurso}
        />
      ) : vistaActiva === 'paraEl' ? (
        <ListaMatches
          cromos={analisis.matchesParaEl}
          inventarioRef={miInventario}
          tipo="paraEl"
          mensaje={`No tienes cromos repetidos que ${amigo.displayName} necesite`}
        />
      ) : (
        // Vista álbum completo agrupado
        <div className="space-y-3">
          {Object.keys(catalogoAgrupado).map((seccion) => {
            // Calcular estadísticas de la sección
            let totalSeccion = 0;
            let tieneSeccion = 0;
            let matchesEnSeccion = 0;

            Object.values(catalogoAgrupado[seccion]).forEach((cromos) => {
              cromos.forEach((c) => {
                totalSeccion++;
                if ((inventarioAmigo[c.numero] || 0) >= 1) tieneSeccion++;
                if (
                  (inventarioAmigo[c.numero] || 0) >= 2 &&
                  (miInventario[c.numero] || 0) === 0
                ) {
                  matchesEnSeccion++;
                }
              });
            });

            // Si está activo "solo matches" y no hay matches en esta sección, no mostrar
            if (soloMatches && matchesEnSeccion === 0) return null;

            const seccionEstaAbierta = seccionAbierta === seccion;

            return (
              <div key={seccion} className="fwc-card overflow-hidden">
                <button
                  onClick={() =>
                    setSeccionAbierta(seccionEstaAbierta ? null : seccion)
                  }
                  className="w-full p-4 flex items-center justify-between hover:bg-fwc-bg/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-fwc-gold transition-transform ${
                        seccionEstaAbierta ? 'rotate-90' : ''
                      }`}
                    >
                      ▶
                    </span>
                    <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                      {seccion}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {matchesEnSeccion > 0 && (
                      <span className="bg-fwc-accent/20 border border-fwc-accent/40 text-fwc-accent text-xs font-bold px-2 py-1 rounded">
                        {matchesEnSeccion} para ti
                      </span>
                    )}
                    <span className="text-gray-400 text-sm font-mono">
                      {tieneSeccion}/{totalSeccion}
                    </span>
                  </div>
                </button>

                {seccionEstaAbierta && (
                  <div className="border-t border-fwc-border">
                    {Object.keys(catalogoAgrupado[seccion]).map((equipo) => {
                      const cromosEquipo = catalogoAgrupado[seccion][equipo];
                      const eqInfo = getEquipoInfo(equipo);

                      // Stats del equipo
                      let tieneEquipo = 0;
                      let matchesEquipo = 0;
                      cromosEquipo.forEach((c) => {
                        if ((inventarioAmigo[c.numero] || 0) >= 1) tieneEquipo++;
                        if (
                          (inventarioAmigo[c.numero] || 0) >= 2 &&
                          (miInventario[c.numero] || 0) === 0
                        ) {
                          matchesEquipo++;
                        }
                      });

                      // Si "solo matches" y no hay matches en este equipo, no mostrar
                      if (soloMatches && matchesEquipo === 0) return null;

                      const equipoEstaAbierto =
                        equipoAbierto === `${seccion}-${equipo}`;

                      return (
                        <div key={equipo} className="border-b border-fwc-border last:border-b-0">
                          <button
                            onClick={() =>
                              setEquipoAbierto(
                                equipoEstaAbierto ? null : `${seccion}-${equipo}`
                              )
                            }
                            className="w-full p-3 pl-8 flex items-center justify-between hover:bg-fwc-bg/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-fwc-neon text-xs transition-transform ${
                                  equipoEstaAbierto ? 'rotate-90' : ''
                                }`}
                              >
                                ▶
                              </span>
                              <Bandera iso={eqInfo.iso} size="sm" />
                              <span className="font-display font-bold text-white text-sm">
                                {eqInfo.nombre}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {matchesEquipo > 0 && (
                                <span className="bg-fwc-accent/20 border border-fwc-accent/40 text-fwc-accent text-xs font-bold px-1.5 py-0.5 rounded">
                                  {matchesEquipo}
                                </span>
                              )}
                              <span className="text-gray-500 text-xs font-mono">
                                {tieneEquipo}/{cromosEquipo.length}
                              </span>
                            </div>
                          </button>

                          {equipoEstaAbierto && (
                            <div className="px-4 pb-4">
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {cromosEquipo.map((cromo) => (
                                  <CromoVistaAmigo
                                    key={cromo.numero}
                                    cromo={cromo}
                                    cantidadAmigo={inventarioAmigo[cromo.numero] || 0}
                                    cantidadMia={miInventario[cromo.numero] || 0}
                                    onPedir={handlePedirCromo}
                                    onMarcarRecibido={handleMarcarRecibido}
                                    onCancelar={handleCancelarPedido}
                                    pedidoActivo={obtenerPedidoActivo(cromo.numero)}
                                    pidiendoEsteCromo={pedidoEnCurso === cromo.numero}
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
      )}
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

function ListaMatches({
  cromos,
  inventarioRef,
  tipo,
  mensaje,
  onPedir,
  onMarcarRecibido,
  onCancelar,
  obtenerPedidoActivo,
  pidiendoEsteCromo,
}) {
  if (cromos.length === 0) {
    return (
      <div className="fwc-card p-12 text-center">
        <Inbox className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">{mensaje}</p>
      </div>
    );
  }

  const porEquipo = cromos.reduce((acc, c) => {
    if (!acc[c.equipo]) acc[c.equipo] = [];
    acc[c.equipo].push(c);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.keys(porEquipo).map((equipo) => {
        const eqInfo = getEquipoInfo(equipo);
        const lista = porEquipo[equipo];
        return (
          <div key={equipo} className="fwc-card p-4">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-fwc-border">
              <Bandera iso={eqInfo.iso} size="lg" />
              <span className="font-display font-bold text-white text-base">
                {eqInfo.nombre}
              </span>
              <span
                className={`ml-auto text-xs font-bold px-2 py-1 rounded ${
                  tipo === 'paraMi'
                    ? 'bg-fwc-gold/20 border border-fwc-gold/40 text-fwc-gold'
                    : 'bg-fwc-neon/20 border border-fwc-neon/40 text-fwc-neon'
                }`}
              >
                {lista.length} {lista.length === 1 ? 'cromo' : 'cromos'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {lista.map((cromo) => (
                <CromoMatch
                  key={cromo.numero}
                  cromo={cromo}
                  cantidad={inventarioRef[cromo.numero] || 0}
                  tipo={tipo}
                  onPedir={onPedir}
                  onMarcarRecibido={onMarcarRecibido}
                  onCancelar={onCancelar}
                  pedidoActivo={
                    obtenerPedidoActivo ? obtenerPedidoActivo(cromo.numero) : null
                  }
                  pidiendoEsteCromo={pidiendoEsteCromo}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CromoMatch({
  cromo,
  cantidad,
  tipo,
  onPedir,
  onMarcarRecibido,
  onCancelar,
  pedidoActivo,
  pidiendoEsteCromo,
}) {
  const eqInfo = getEquipoInfo(cromo.equipo);
  const tienePedidoPendiente = pedidoActivo?.estado === 'pendiente';
  const tienePedidoAprobado = pedidoActivo?.estado === 'aprobado';

  let cardStyle;
  if (tienePedidoAprobado) {
    cardStyle =
      'bg-gradient-to-br from-green-500/15 to-fwc-gold/10 border-green-500 shadow-lg shadow-green-500/20';
  } else if (tienePedidoPendiente) {
    cardStyle = 'bg-fwc-card border-fwc-gold/40';
  } else if (tipo === 'paraMi') {
    cardStyle =
      'bg-gradient-to-br from-fwc-gold/20 to-fwc-accent/10 border-fwc-gold shadow-lg shadow-fwc-gold/20 animate-pulse-slow';
  } else {
    cardStyle =
      'bg-gradient-to-br from-fwc-neon/20 to-fwc-gold/5 border-fwc-neon shadow-lg shadow-fwc-neon/20';
  }

  return (
    <div className={`rounded-lg border p-3 transition-all ${cardStyle}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="font-display font-bold text-xs text-white px-2 py-0.5 bg-fwc-bg/50 rounded">
          {cromo.codigo}
        </span>
        <span className="text-gray-500 text-xs font-mono">
          #{String(cromo.numero).padStart(3, '0')}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Bandera iso={eqInfo.iso} size="md" />
        <p className="font-display font-bold text-sm text-white truncate">
          {eqInfo.nombre}
        </p>
      </div>
      {cromo.detalle && (
        <p className="text-xs text-gray-400 truncate mb-2">{cromo.detalle}</p>
      )}
      <div className="text-center pt-2 border-t border-fwc-border/50 mb-2">
        {tienePedidoAprobado ? (
          <span className="text-green-400 text-xs uppercase tracking-wider font-display font-bold">
            🎁 ¡Apartado!
          </span>
        ) : tienePedidoPendiente ? (
          <span className="text-fwc-gold text-xs uppercase tracking-wider font-display font-bold">
            ⏳ Esperando
          </span>
        ) : tipo === 'paraMi' ? (
          <span className="text-fwc-gold text-xs uppercase tracking-wider font-display font-bold">
            ⭐ ×{cantidad} disponibles
          </span>
        ) : (
          <span className="text-fwc-neon text-xs uppercase tracking-wider font-display font-bold">
            🎁 Tú ×{cantidad}
          </span>
        )}
      </div>

      {/* Botones según estado (solo para tipo paraMi) */}
      {tipo === 'paraMi' && (
        <>
          {tienePedidoAprobado && onMarcarRecibido && (
            <div className="space-y-1">
              <button
                onClick={() => onMarcarRecibido(cromo)}
                disabled={pidiendoEsteCromo === cromo.numero}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-display font-bold uppercase tracking-wider text-xs py-1.5 rounded transition-all flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {pidiendoEsteCromo === cromo.numero ? (
                  <Loading className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-3 h-3" />
                    Ya lo tengo
                  </>
                )}
              </button>
              <button
                onClick={() => onCancelar(cromo)}
                disabled={pidiendoEsteCromo === cromo.numero}
                className="w-full border border-fwc-border text-gray-400 hover:border-fwc-accent hover:text-fwc-accent font-display font-bold uppercase tracking-wider text-[10px] py-1 rounded transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          )}

          {tienePedidoPendiente && (
            <div className="space-y-1">
              <button
                disabled
                className="w-full bg-fwc-bg border border-fwc-gold/40 text-fwc-gold font-display font-bold uppercase tracking-wider text-xs py-1.5 rounded cursor-not-allowed"
              >
                ⏳ Solicitado
              </button>
              <button
                onClick={() => onCancelar(cromo)}
                disabled={pidiendoEsteCromo === cromo.numero}
                className="w-full border border-fwc-border text-gray-400 hover:border-fwc-accent hover:text-fwc-accent font-display font-bold uppercase tracking-wider text-[10px] py-1 rounded transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          )}

          {!pedidoActivo && onPedir && (
            <button
              onClick={() => onPedir(cromo)}
              disabled={pidiendoEsteCromo === cromo.numero}
              className="w-full bg-fwc-gold hover:bg-yellow-500 text-fwc-bg font-display font-bold uppercase tracking-wider text-xs py-1.5 rounded transition-all flex items-center justify-center gap-1 disabled:opacity-50"
            >
              {pidiendoEsteCromo === cromo.numero ? (
                <Loading className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3" />
                  Pedir
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function CromoVistaAmigo({
  cromo,
  cantidadAmigo,
  cantidadMia,
  onPedir,
  onMarcarRecibido,
  onCancelar,
  pedidoActivo,
  pidiendoEsteCromo,
}) {
  const equipoInfo = getEquipoInfo(cromo.equipo);
  const elLoTiene = cantidadAmigo >= 1;
  const elLoTieneRepe = cantidadAmigo >= 2;
  const yoNoLoTengo = cantidadMia === 0;
  const esMatch = elLoTieneRepe && yoNoLoTengo;

  // Determinar estado del pedido para este cromo
  const tienePedidoPendiente = pedidoActivo?.estado === 'pendiente';
  const tienePedidoAprobado = pedidoActivo?.estado === 'aprobado';

  let cardStyle = 'bg-fwc-bg/40 border-fwc-border opacity-50';
  if (tienePedidoAprobado) {
    cardStyle =
      'bg-gradient-to-br from-green-500/10 to-fwc-gold/10 border-green-500 shadow-lg shadow-green-500/20';
  } else if (tienePedidoPendiente) {
    cardStyle = 'bg-fwc-card border-fwc-gold/40';
  } else if (esMatch) {
    cardStyle =
      'bg-gradient-to-br from-fwc-gold/20 to-fwc-accent/10 border-fwc-gold shadow-lg shadow-fwc-gold/20 animate-pulse-slow';
  } else if (elLoTieneRepe) {
    cardStyle = 'bg-fwc-card border-fwc-neon/40';
  } else if (elLoTiene) {
    cardStyle = 'bg-fwc-card border-fwc-gold/30';
  }

  return (
    <div className={`rounded-lg border p-3 transition-all ${cardStyle}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="font-display font-bold text-xs text-white px-2 py-0.5 bg-fwc-bg/50 rounded">
          {cromo.codigo}
        </span>
        <span className="text-gray-500 text-xs font-mono">
          #{String(cromo.numero).padStart(3, '0')}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Bandera iso={equipoInfo.iso} size="md" />
        <p className="font-display font-bold text-sm text-white truncate">
          {equipoInfo.nombre}
        </p>
      </div>
      {cromo.detalle && (
        <p className="text-xs text-gray-400 truncate mb-2">{cromo.detalle}</p>
      )}
      <div className="text-center pt-2 border-t border-fwc-border/50 mb-2">
        {!elLoTiene ? (
          <span className="text-gray-500 text-xs uppercase tracking-wider">
            No lo tiene
          </span>
        ) : tienePedidoAprobado ? (
          <span className="text-green-400 text-xs uppercase tracking-wider font-display font-bold">
            🎁 ¡Apartado para ti!
          </span>
        ) : tienePedidoPendiente ? (
          <span className="text-fwc-gold text-xs uppercase tracking-wider font-display font-bold">
            ⏳ Esperando aprobación
          </span>
        ) : esMatch ? (
          <span className="text-fwc-gold text-xs uppercase tracking-wider font-display font-bold">
            ⭐ ¡Para ti!
          </span>
        ) : elLoTieneRepe ? (
          <span className="text-fwc-neon text-xs uppercase tracking-wider font-bold">
            ×{cantidadAmigo} repes
          </span>
        ) : (
          <span className="text-fwc-gold text-xs uppercase tracking-wider font-bold">
            ✓ Tiene 1
          </span>
        )}
      </div>

      {/* Botones según estado */}

      {/* Estado: Aprobado por el dueño → Botón "Ya lo tengo" */}
      {tienePedidoAprobado && onMarcarRecibido && (
        <div className="space-y-1">
          <button
            onClick={() => onMarcarRecibido(cromo)}
            disabled={pidiendoEsteCromo}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-display font-bold uppercase tracking-wider text-xs py-1.5 rounded transition-all flex items-center justify-center gap-1 disabled:opacity-50"
          >
            {pidiendoEsteCromo ? (
              <Loading className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-3 h-3" />
                Ya lo tengo
              </>
            )}
          </button>
          <button
            onClick={() => onCancelar(cromo)}
            disabled={pidiendoEsteCromo}
            className="w-full border border-fwc-border text-gray-400 hover:border-fwc-accent hover:text-fwc-accent font-display font-bold uppercase tracking-wider text-[10px] py-1 rounded transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Estado: Pendiente → Botón "Solicitado" deshabilitado + Cancelar */}
      {tienePedidoPendiente && (
        <div className="space-y-1">
          <button
            disabled
            className="w-full bg-fwc-bg border border-fwc-gold/40 text-fwc-gold font-display font-bold uppercase tracking-wider text-xs py-1.5 rounded flex items-center justify-center gap-1 cursor-not-allowed"
          >
            ⏳ Solicitado
          </button>
          <button
            onClick={() => onCancelar(cromo)}
            disabled={pidiendoEsteCromo}
            className="w-full border border-fwc-border text-gray-400 hover:border-fwc-accent hover:text-fwc-accent font-display font-bold uppercase tracking-wider text-[10px] py-1 rounded transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Estado: Sin pedido y es match → Botón "Pedir" */}
      {!pedidoActivo && esMatch && onPedir && (
        <button
          onClick={() => onPedir(cromo)}
          disabled={pidiendoEsteCromo}
          className="w-full bg-fwc-gold hover:bg-yellow-500 text-fwc-bg font-display font-bold uppercase tracking-wider text-xs py-1.5 rounded transition-all flex items-center justify-center gap-1 disabled:opacity-50"
        >
          {pidiendoEsteCromo ? (
            <Loading className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-3 h-3" />
              Pedir
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default VistaAmigo;