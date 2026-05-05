import React, { useState, useEffect, useMemo } from 'react';
import { 
  Loader2, BookOpen, ChevronDown, ChevronRight, 
  ArrowLeft, Eye, Inbox, Sparkles, Gift, ArrowRightLeft,
  Filter, X
} from 'lucide-react';
import { fetchCatalog } from '../lib/seedCromos';
import { observeInventarioAmigo } from '../lib/inventario';
import { getEquipoInfo } from '../lib/equiposData';
import Bandera from './Bandera';
import { ShoppingCart, Loader2 as Loading } from 'lucide-react';
import { crearPedido, tienePedidoActivo } from '../lib/pedidos';
import { appCache } from '../lib/cache';

function VistaAmigo({ amigo, miInventario, onVolver, miUsuario }) {
  const [catalogo, setCatalogo] = useState([]);
  const [inventarioAmigo, setInventarioAmigo] = useState({});
  const [loading, setLoading] = useState(true);
  const [seccionesAbiertas, setSeccionesAbiertas] = useState({});
  const [equiposAbiertos, setEquiposAbiertos] = useState({});
  const [vistaActiva, setVistaActiva] = useState('album'); // 'album' | 'matches'
  const [soloMatches, setSoloMatches] = useState(false);
  const [pedidoEnCurso, setPedidoEnCurso] = useState(null);
  const [mensajePedido, setMensajePedido] = useState({ tipo: '', texto: '' });

  const handlePedirCromo = async (cromo) => {
    setPedidoEnCurso(cromo.numero);
    
    // Verificar que no haya pedido activo
    const yaExiste = await tienePedidoActivo(miUsuario.uid, amigo.uid, cromo.numero);
    if (yaExiste) {
      setMensajePedido({ tipo: 'info', texto: `Ya tienes un pedido pendiente de ese cromo` });
      setPedidoEnCurso(null);
      setTimeout(() => setMensajePedido({ tipo: '', texto: '' }), 4000);
      return;
    }

    const result = await crearPedido({
      deUsuario: miUsuario,
      paraUsuario: amigo,
      cromo: cromo
    });

    if (result.success) {
      setMensajePedido({ 
        tipo: 'exito', 
        texto: `¡Pedido enviado! ${amigo.displayName.split(' ')[0]} verá tu solicitud del cromo ${cromo.codigo}` 
      });
    } else {
      setMensajePedido({ tipo: 'error', texto: result.error });
    }
    
    setPedidoEnCurso(null);
    setTimeout(() => setMensajePedido({ tipo: '', texto: '' }), 4000);
  };

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

  useEffect(() => {
    if (!amigo?.uid) return;
    const unsubscribe = observeInventarioAmigo(amigo.uid, setInventarioAmigo);
    return () => unsubscribe();
  }, [amigo]);

  const toggleSeccion = (s) => setSeccionesAbiertas(p => ({ ...p, [s]: !p[s] }));
  const toggleEquipo = (k) => setEquiposAbiertos(p => ({ ...p, [k]: !p[k] }));

  // ============= ANÁLISIS COMPLETO =============
  const analisis = useMemo(() => {
    // CROMOS QUE PUEDO PEDIRLE: él los tiene repetidos Y a mí me faltan
    const matchesParaMi = catalogo.filter(c => {
      const elTiene = (inventarioAmigo[c.numero] || 0) >= 2;
      const yoNoTengo = (miInventario[c.numero] || 0) === 0;
      return elTiene && yoNoTengo;
    });

    // CROMOS QUE LE PUEDO DAR: yo los tengo repetidos Y a él le faltan
    const matchesParaEl = catalogo.filter(c => {
      const yoTengo = (miInventario[c.numero] || 0) >= 2;
      const elNoTiene = (inventarioAmigo[c.numero] || 0) === 0;
      return yoTengo && elNoTiene;
    });

    // INTERCAMBIOS PERFECTOS: él tiene repe de algo que necesito Y yo tengo repe de algo que él necesita
    const intercambioPerfecto = matchesParaMi.length > 0 && matchesParaEl.length > 0;

    // Stats del amigo
    const obtenidos = catalogo.filter(c => (inventarioAmigo[c.numero] || 0) >= 1).length;
    const repes = catalogo.filter(c => (inventarioAmigo[c.numero] || 0) >= 2).length;
    const porc = catalogo.length > 0 ? Math.round((obtenidos / catalogo.length) * 100) : 0;

    return { 
      matchesParaMi, 
      matchesParaEl, 
      intercambioPerfecto,
      obtenidos, 
      repes, 
      porc 
    };
  }, [catalogo, inventarioAmigo, miInventario]);

  // ============= CROMOS FILTRADOS PARA MOSTRAR EN ÁLBUM =============
  const cromosParaMostrar = useMemo(() => {
    if (!soloMatches) return catalogo;
    // Solo mostrar matches (cromos que le puedo pedir)
    return analisis.matchesParaMi;
  }, [catalogo, analisis.matchesParaMi, soloMatches]);

  // Estructura: Sección → Equipo → Cromos
  const estructura = useMemo(() => {
    const result = {};
    cromosParaMostrar.forEach(cromo => {
      const sec = cromo.seccion;
      const eq = cromo.equipo;
      if (!result[sec]) result[sec] = {};
      if (!result[sec][eq]) result[sec][eq] = [];
      result[sec][eq].push(cromo);
    });
    return result;
  }, [cromosParaMostrar]);

  const ordenSecciones = [
    'ESPECIALES', 'MUNDIAL',
    'GRUPO A', 'GRUPO B', 'GRUPO C', 'GRUPO D',
    'GRUPO E', 'GRUPO F', 'GRUPO G', 'GRUPO H',
    'GRUPO I', 'GRUPO J', 'GRUPO K', 'GRUPO L'
  ];
  const seccionesVisibles = ordenSecciones.filter(s => estructura[s]);

  const getStatsSeccion = (cromos) => {
    const obt = cromos.filter(c => (inventarioAmigo[c.numero] || 0) >= 1).length;
    const matches = cromos.filter(c => {
      const el = (inventarioAmigo[c.numero] || 0) >= 2;
      const yo = (miInventario[c.numero] || 0) === 0;
      return el && yo;
    }).length;
    return { obtenidos: obt, matches, total: cromos.length };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-fwc-gold animate-spin mb-4" />
        <p className="text-gray-400 text-sm uppercase tracking-widest">
          Cargando álbum de {amigo.displayName}...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Mensaje de pedido */}
      {mensajePedido.texto && (
        <div className={`rounded-lg p-3 text-sm flex items-center gap-2 mb-4 ${
          mensajePedido.tipo === 'exito' ? 'bg-green-500/10 border border-green-500/30 text-green-400' :
          mensajePedido.tipo === 'error' ? 'bg-red-500/10 border border-red-500/30 text-fwc-accent' :
          'bg-fwc-neon/10 border border-fwc-neon/30 text-fwc-neon'
        }`}>
          <ShoppingCart className="w-4 h-4" />
          {mensajePedido.texto}
        </div>
      )}

      {/* Perfil del Amigo */}
      <div className="fwc-card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          {amigo.photoURL ? (
            <img 
              src={amigo.photoURL} 
              alt={amigo.displayName}
              className="w-16 h-16 rounded-full border-2 border-fwc-gold"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-fwc-card border-2 border-fwc-gold flex items-center justify-center">
              <Eye className="w-7 h-7 text-fwc-gold" />
            </div>
          )}
          <div>
            <h3 className="font-display font-bold text-2xl text-white">
              {amigo.displayName}
            </h3>
            <p className="text-gray-500 text-sm font-mono">
              {amigo.codigoInvitacion}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Progreso" value={`${analisis.porc}%`} color="gold" />
          <StatBox label="Tiene" value={`${analisis.obtenidos}/${catalogo.length}`} color="white" />
          <StatBox label="Sus repes" value={analisis.repes} color="neon" />
          <StatBox label="¡Para ti!" value={analisis.matchesParaMi.length} color="accent" highlight={analisis.matchesParaMi.length > 0} />
        </div>
      </div>

      {/* Banner de Intercambio Perfecto */}
      {analisis.intercambioPerfecto && (
        <div className="bg-gradient-to-r from-fwc-gold/20 via-fwc-accent/20 to-fwc-neon/20 border-2 border-fwc-gold rounded-xl p-6 mb-6 fwc-glow-gold">
          <div className="flex items-center gap-4 mb-3">
            <ArrowRightLeft className="w-8 h-8 text-fwc-gold" />
            <div>
              <h3 className="font-display font-black text-2xl text-fwc-gold tracking-wider">
                ¡INTERCAMBIO PERFECTO!
              </h3>
              <p className="text-white text-sm">
                Tienen cromos que se complementan mutuamente 🎯
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-fwc-bg/50 border border-fwc-gold/40 rounded-lg p-4">
              <p className="text-fwc-gold text-xs uppercase tracking-widest font-bold mb-1">
                Te puede dar
              </p>
              <p className="font-display font-black text-3xl text-fwc-gold">
                {analisis.matchesParaMi.length}
              </p>
              <p className="text-gray-400 text-xs">cromos que necesitas</p>
            </div>
            <div className="bg-fwc-bg/50 border border-fwc-neon/40 rounded-lg p-4">
              <p className="text-fwc-neon text-xs uppercase tracking-widest font-bold mb-1">
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

      {/* Si no hay intercambio perfecto pero sí matches para uno */}
      {!analisis.intercambioPerfecto && analisis.matchesParaMi.length > 0 && (
        <div className="bg-fwc-gold/10 border border-fwc-gold/40 rounded-lg p-4 mb-6">
          <p className="text-fwc-gold font-display font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {amigo.displayName.split(' ')[0]} tiene {analisis.matchesParaMi.length} {analisis.matchesParaMi.length === 1 ? 'cromo que te falta' : 'cromos que te faltan'}
          </p>
        </div>
      )}

      {!analisis.intercambioPerfecto && analisis.matchesParaEl.length > 0 && analisis.matchesParaMi.length === 0 && (
        <div className="bg-fwc-neon/10 border border-fwc-neon/40 rounded-lg p-4 mb-6">
          <p className="text-fwc-neon font-display font-bold flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Tienes {analisis.matchesParaEl.length} {analisis.matchesParaEl.length === 1 ? 'cromo' : 'cromos'} que {amigo.displayName.split(' ')[0]} necesita
          </p>
        </div>
      )}

      {/* Selector de vista */}
      <div className="flex flex-wrap gap-2 mb-4">
        <VistaBtn 
          activa={vistaActiva === 'album'} 
          onClick={() => setVistaActiva('album')}
          icon={<BookOpen className="w-4 h-4" />}
          label="Su álbum completo"
        />
        <VistaBtn 
          activa={vistaActiva === 'matches'} 
          onClick={() => setVistaActiva('matches')}
          icon={<Sparkles className="w-4 h-4" />}
          label={`Para ti (${analisis.matchesParaMi.length})`}
          color="gold"
        />
        <VistaBtn 
          activa={vistaActiva === 'paraEl'} 
          onClick={() => setVistaActiva('paraEl')}
          icon={<Gift className="w-4 h-4" />}
          label={`Para él/ella (${analisis.matchesParaEl.length})`}
          color="neon"
        />
      </div>

      {/* CONTENIDO SEGÚN VISTA */}
      {vistaActiva === 'matches' ? (
        <ListaMatches 
          cromos={analisis.matchesParaMi} 
          inventarioRef={inventarioAmigo}
          tipo="paraMi"
          mensaje={`No hay cromos repetidos de ${amigo.displayName} que te falten`}
          onPedir={handlePedirCromo}
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
        <>
          {/* Filtro "Solo matches" para vista de álbum */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setSoloMatches(!soloMatches)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
                soloMatches 
                  ? 'bg-fwc-gold text-fwc-bg border-fwc-gold' 
                  : 'bg-fwc-card text-gray-400 border-fwc-border hover:border-fwc-gold hover:text-fwc-gold'
              }`}
            >
              {soloMatches ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
              {soloMatches ? 'Mostrar todos' : 'Solo matches'}
            </button>
          </div>

          {/* Secciones del álbum */}
          <div className="space-y-4">
            {seccionesVisibles.map((seccion) => {
              const equipos = estructura[seccion];
              const equiposLista = Object.keys(equipos);
              const allCromos = Object.values(equipos).flat();
              const stSec = getStatsSeccion(allCromos);
              const abierta = seccionesAbiertas[seccion] ?? false;

              return (
                <div key={seccion} className="fwc-card overflow-hidden">
                  <button
                    onClick={() => toggleSeccion(seccion)}
                    className="w-full p-4 flex items-center justify-between hover:bg-fwc-bg/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {abierta ? <ChevronDown className="w-5 h-5 text-fwc-gold" /> : <ChevronRight className="w-5 h-5 text-fwc-gold" />}
                      <h4 className="font-display font-bold text-lg text-white tracking-wider">
                        {seccion}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3">
                      {stSec.matches > 0 && (
                        <span className="bg-fwc-accent/20 border border-fwc-accent/40 text-fwc-accent text-xs font-bold px-2 py-1 rounded">
                          {stSec.matches} para ti
                        </span>
                      )}
                      <span className="text-gray-400 text-sm font-mono">
                        {stSec.obtenidos}/{stSec.total}
                      </span>
                    </div>
                  </button>

                  {abierta && (
                    <div className="border-t border-fwc-border bg-fwc-bg/20">
                      {equiposLista.map((equipo) => {
                        const cromos = equipos[equipo];
                        const equipoInfo = getEquipoInfo(equipo);
                        const equipoKey = `${seccion}-${equipo}`;
                        const equipoAbierto = equiposAbiertos[equipoKey] ?? false;
                        const eqStats = getStatsSeccion(cromos);

                        return (
                          <div key={equipoKey} className="border-b border-fwc-border last:border-0">
                            <button
                              onClick={() => toggleEquipo(equipoKey)}
                              className="w-full px-4 py-3 flex items-center justify-between hover:bg-fwc-card/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {equipoAbierto ? <ChevronDown className="w-4 h-4 text-fwc-neon" /> : <ChevronRight className="w-4 h-4 text-fwc-neon" />}
                                <Bandera iso={equipoInfo.iso} size="lg" />
                                <span className="font-display font-bold text-white text-base">
                                  {equipoInfo.nombre}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                {eqStats.matches > 0 && (
                                  <span className="bg-fwc-accent/20 border border-fwc-accent/40 text-fwc-accent text-xs font-bold px-2 py-0.5 rounded">
                                    {eqStats.matches}
                                  </span>
                                )}
                                <span className="text-gray-400 text-xs font-mono">
                                  {eqStats.obtenidos}/{eqStats.total}
                                </span>
                              </div>
                            </button>

                            {equipoAbierto && (
                              <div className="px-4 pb-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                  {cromos.map((cromo) => (
                                    <CromoVistaAmigo
                                      key={cromo.numero}
                                      cromo={cromo}
                                      cantidadAmigo={inventarioAmigo[cromo.numero] || 0}
                                      cantidadMia={miInventario[cromo.numero] || 0}
                                      onPedir={handlePedirCromo}
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

          {seccionesVisibles.length === 0 && soloMatches && (
            <div className="fwc-card p-12 text-center">
              <Inbox className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                {amigo.displayName} no tiene cromos repetidos que te falten 😅
              </p>
            </div>
          )}

          {seccionesVisibles.length === 0 && !soloMatches && (
            <div className="fwc-card p-12 text-center">
              <Inbox className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                {amigo.displayName} aún no tiene cromos en su álbum
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============= SUB-COMPONENTES =============

function StatBox({ label, value, color, highlight }) {
  const colorClasses = {
    gold: 'text-fwc-gold',
    white: 'text-white',
    neon: 'text-fwc-neon',
    accent: 'text-fwc-accent',
  };
  
  return (
    <div className={highlight ? 'animate-pulse-slow rounded-lg p-2 -m-2' : ''}>
      <p className="text-gray-400 text-xs uppercase tracking-widest">{label}</p>
      <p className={`font-display font-bold text-3xl ${colorClasses[color]}`}>
        {value}
      </p>
    </div>
  );
}

function VistaBtn({ activa, onClick, icon, label, color = 'default' }) {
  const colors = {
    default: activa ? 'bg-white text-fwc-bg border-white' : 'bg-fwc-card text-gray-400 border-fwc-border hover:border-white hover:text-white',
    gold:    activa ? 'bg-fwc-gold text-fwc-bg border-fwc-gold' : 'bg-fwc-card text-gray-400 border-fwc-border hover:border-fwc-gold hover:text-fwc-gold',
    neon:    activa ? 'bg-fwc-neon text-fwc-bg border-fwc-neon' : 'bg-fwc-card text-gray-400 border-fwc-border hover:border-fwc-neon hover:text-fwc-neon',
  };
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${colors[color]}`}
    >
      {icon}
      {label}
    </button>
  );
}

function ListaMatches({ cromos, inventarioRef, tipo, mensaje, onPedir, pidiendoEsteCromo }) {
  if (cromos.length === 0) {
    return (
      <div className="fwc-card p-12 text-center">
        <Inbox className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">{mensaje}</p>
      </div>
    );
  }

  // Agrupar por equipo
  const porEquipo = cromos.reduce((acc, c) => {
    if (!acc[c.equipo]) acc[c.equipo] = [];
    acc[c.equipo].push(c);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.keys(porEquipo).map(equipo => {
        const eqInfo = getEquipoInfo(equipo);
        const lista = porEquipo[equipo];
        return (
          <div key={equipo} className="fwc-card p-4">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-fwc-border">
              <Bandera iso={eqInfo.iso} size="lg" />
              <span className="font-display font-bold text-white text-base">
                {eqInfo.nombre}
              </span>
              <span className={`ml-auto text-xs font-bold px-2 py-1 rounded ${
                tipo === 'paraMi' 
                  ? 'bg-fwc-gold/20 border border-fwc-gold/40 text-fwc-gold'
                  : 'bg-fwc-neon/20 border border-fwc-neon/40 text-fwc-neon'
              }`}>
                {lista.length} {lista.length === 1 ? 'cromo' : 'cromos'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {lista.map(cromo => (
                <CromoMatch 
                  key={cromo.numero} 
                  cromo={cromo} 
                  cantidad={inventarioRef[cromo.numero] || 0}
                  tipo={tipo}
                  onPedir={onPedir}
                  pidiendoEsteCromo={pidiendoEsteCromo === cromo.numero}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CromoMatch({ cromo, cantidad, tipo, onPedir, pidiendoEsteCromo }) {
  const eqInfo = getEquipoInfo(cromo.equipo);
  const cardStyle = tipo === 'paraMi'
    ? 'bg-gradient-to-br from-fwc-gold/20 to-fwc-accent/10 border-fwc-gold shadow-lg shadow-fwc-gold/20 animate-pulse-slow'
    : 'bg-gradient-to-br from-fwc-neon/20 to-fwc-gold/5 border-fwc-neon shadow-lg shadow-fwc-neon/20';

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
        <p className="text-xs text-gray-400 truncate mb-2">
          {cromo.detalle}
        </p>
      )}
      <div className="text-center pt-2 border-t border-fwc-border/50 mb-2">
        {tipo === 'paraMi' ? (
          <span className="text-fwc-gold text-xs uppercase tracking-wider font-display font-bold">
            ⭐ ×{cantidad} disponibles
          </span>
        ) : (
          <span className="text-fwc-neon text-xs uppercase tracking-wider font-display font-bold">
            🎁 Tú ×{cantidad}
          </span>
        )}
      </div>
      
      {/* Botón Pedir (solo si tipo === 'paraMi') */}
      {tipo === 'paraMi' && onPedir && (
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

function CromoVistaAmigo({ cromo, cantidadAmigo, cantidadMia, onPedir, pidiendoEsteCromo }) {
  const equipoInfo = getEquipoInfo(cromo.equipo);
  const elLoTiene = cantidadAmigo >= 1;
  const elLoTieneRepe = cantidadAmigo >= 2;
  const yoNoLoTengo = cantidadMia === 0;
  const esMatch = elLoTieneRepe && yoNoLoTengo;

  let cardStyle = 'bg-fwc-bg/40 border-fwc-border opacity-50';
  if (esMatch) {
    cardStyle = 'bg-gradient-to-br from-fwc-gold/20 to-fwc-accent/10 border-fwc-gold shadow-lg shadow-fwc-gold/20 animate-pulse-slow';
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
        <p className="text-xs text-gray-400 truncate mb-2">
          {cromo.detalle}
        </p>
      )}
      <div className="text-center pt-2 border-t border-fwc-border/50 mb-2">
        {!elLoTiene ? (
          <span className="text-gray-500 text-xs uppercase tracking-wider">
            No lo tiene
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

      {/* Botón Pedir solo aparece si es match (él tiene repe Y yo no tengo) */}
      {esMatch && onPedir && (
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