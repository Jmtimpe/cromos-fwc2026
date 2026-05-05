import React, { useState, useEffect } from 'react';
import { 
  Inbox, Send, Package, CheckCircle2, XCircle, 
  Clock, ArrowDown, ArrowUp, Loader2, ShoppingCart,
  ThumbsUp, Gift
} from 'lucide-react';
import { 
  observarPedidosEnviados, 
  observarPedidosRecibidos,
  cancelarPedido,
  marcarRecibido,
  aprobarPedido
} from '../lib/pedidos';
import { procesarEntregaCromo } from '../lib/inventario';
import { getEquipoInfo } from '../lib/equiposData';
import Bandera from './Bandera';

function PantallaPedidos({ user }) {
  const [pedidosEnviados, setPedidosEnviados] = useState([]);
  const [pedidosRecibidos, setPedidosRecibidos] = useState([]);
  const [tabActiva, setTabActiva] = useState('recibidos');
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;
    let countCargas = 0;
    
    const unsubA = observarPedidosEnviados(user.uid, (data) => {
      setPedidosEnviados(data);
      countCargas++;
      if (countCargas >= 2) setLoading(false);
    });
    
    const unsubB = observarPedidosRecibidos(user.uid, (data) => {
      setPedidosRecibidos(data);
      countCargas++;
      if (countCargas >= 2) setLoading(false);
    });
    
    // Fallback: quitar loading después de 2 segundos
    const timeout = setTimeout(() => setLoading(false), 2000);
    
    return () => {
      unsubA();
      unsubB();
      clearTimeout(timeout);
    };
  }, [user]);

  const handleCancelar = async (pedido) => {
    if (!window.confirm(`¿Cancelar el pedido del cromo ${pedido.cromoCodigo}?`)) return;
    setProcesando(pedido.id);
    await cancelarPedido(pedido.id);
    setProcesando(null);
  };

  const handleMarcarRecibido = async (pedido) => {
    if (!window.confirm(`¿Confirmas que recibiste el cromo ${pedido.cromoCodigo} de ${pedido.paraUsuarioNombre}?`)) return;
    setProcesando(pedido.id);
    
    // 1. Procesar la entrega física (mover el cromo en inventarios)
    const resultEntrega = await procesarEntregaCromo(
      pedido.paraUsuarioId,  // dueño
      pedido.deUsuarioId,    // receptor (yo)
      pedido.cromoNumero
    );
    
    if (resultEntrega.success) {
      // 2. Marcar el pedido como completado
      await marcarRecibido(pedido.id);
    } else {
      alert('Error: ' + resultEntrega.error);
    }
    
    setProcesando(null);
  };
  const handleAprobar = async (pedido) => {
    if (!window.confirm(`¿Apartar el cromo ${pedido.cromoCodigo} para ${pedido.deUsuarioNombre}?`)) return;
    setProcesando(pedido.id);
    await aprobarPedido(pedido.id);
    setProcesando(null);
  };

  // Filtrar solo pendientes para los contadores
  const recibidosPendientes = pedidosRecibidos.filter(p => p.estado === 'pendiente');
  const enviadosPendientes = pedidosEnviados.filter(p => p.estado === 'pendiente');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-fwc-gold animate-spin mb-4" />
        <p className="text-gray-400 text-sm uppercase tracking-widest">
          Cargando pedidos...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="fwc-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="w-7 h-7 text-fwc-gold" />
          <h3 className="font-display font-bold text-2xl text-white">
            Centro de Intercambios
          </h3>
        </div>
        <p className="text-gray-400 text-sm">
          Aquí gestionas todos los pedidos de cromos entre tu red de amigos
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <TabBtn
          activa={tabActiva === 'recibidos'}
          onClick={() => setTabActiva('recibidos')}
          icon={<ArrowDown className="w-4 h-4" />}
          label="Me piden"
          count={recibidosPendientes.length}
          color="gold"
        />
        <TabBtn
          activa={tabActiva === 'enviados'}
          onClick={() => setTabActiva('enviados')}
          icon={<ArrowUp className="w-4 h-4" />}
          label="Yo pedí"
          count={enviadosPendientes.length}
          color="neon"
        />
      </div>

      {/* Lista de pedidos según tab */}
      {tabActiva === 'recibidos' ? (
        <ListaPedidos
          pedidos={pedidosRecibidos}
          tipo="recibidos"
          onCancelar={handleCancelar}
          onAprobar={handleAprobar}
          procesando={procesando}
        />
      ) : (
        <ListaPedidos
          pedidos={pedidosEnviados}
          tipo="enviados"
          onCancelar={handleCancelar}
          onMarcarRecibido={handleMarcarRecibido}
          procesando={procesando}
        />
      )}
    </div>
  );
}

function TabBtn({ activa, onClick, icon, label, count, color = 'gold' }) {
  const colors = {
    gold: activa ? 'bg-fwc-gold text-fwc-bg border-fwc-gold' : 'bg-fwc-card text-gray-400 border-fwc-border hover:border-fwc-gold hover:text-fwc-gold',
    neon: activa ? 'bg-fwc-neon text-fwc-bg border-fwc-neon' : 'bg-fwc-card text-gray-400 border-fwc-border hover:border-fwc-neon hover:text-fwc-neon',
  };

  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-bold uppercase tracking-wider transition-all ${colors[color]}`}
    >
      {icon}
      {label}
      {count > 0 && (
        <span className={`ml-1 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs rounded-full font-mono ${
          activa ? 'bg-fwc-bg/30 text-current' : 'bg-fwc-accent text-white'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function ListaPedidos({ pedidos, tipo, onCancelar, onMarcarRecibido, onAprobar, procesando }) {
  if (pedidos.length === 0) {
    return (
      <div className="fwc-card p-12 text-center">
        <Inbox className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg mb-1">
          {tipo === 'recibidos' 
            ? 'Nadie te ha pedido cromos todavía' 
            : 'Aún no has pedido ningún cromo'}
        </p>
        <p className="text-gray-600 text-sm">
          {tipo === 'recibidos'
            ? 'Cuando un amigo solicite uno de tus repetidos, aparecerá aquí'
            : 'Ve al álbum de tus amigos para pedir sus repetidos'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pedidos.map(pedido => (
        <PedidoCard
        key={pedido.id}
        pedido={pedido}
        tipo={tipo}
        onCancelar={onCancelar}
        onMarcarRecibido={onMarcarRecibido}
        onAprobar={onAprobar}
        procesando={procesando === pedido.id}
      />
      ))}
    </div>
  );
}

fufunction PedidoCard({ pedido, tipo, onCancelar, onMarcarRecibido, onAprobar, procesando }) {
  const eqInfo = getEquipoInfo(pedido.cromoEquipo);
  const persona = tipo === 'recibidos' ? pedido.deUsuarioNombre : pedido.paraUsuarioNombre;
  const personaFoto = tipo === 'recibidos' ? pedido.deUsuarioFoto : pedido.paraUsuarioFoto;

  // Estilos según estado
  const estadoStyles = {
    pendiente: { 
      borderColor: 'border-fwc-gold/40',
      icon: <Clock className="w-4 h-4" />,
      label: 'Pendiente',
      color: 'text-fwc-gold'
    },
    aprobado: { 
      borderColor: 'border-fwc-neon/40',
      icon: <Gift className="w-4 h-4" />,
      label: 'Apartado',
      color: 'text-fwc-neon'
    },
    recibido: { 
      borderColor: 'border-green-500/40',
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: 'Completado',
      color: 'text-green-400'
    },
    cancelado: { 
      borderColor: 'border-fwc-accent/40',
      icon: <XCircle className="w-4 h-4" />,
      label: 'Cancelado',
      color: 'text-fwc-accent'
    },
  };

  const estilo = estadoStyles[pedido.estado] || estadoStyles.pendiente;

  return (
    <div className={`fwc-card p-4 border-2 ${estilo.borderColor}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        
        {/* Cromo */}
        <div className="flex items-center gap-3 flex-1">
          <Bandera iso={eqInfo.iso} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display font-bold text-xs text-white px-2 py-0.5 bg-fwc-bg/50 rounded">
                {pedido.cromoCodigo}
              </span>
              <span className="text-gray-500 text-xs font-mono">
                #{String(pedido.cromoNumero).padStart(3, '0')}
              </span>
            </div>
            <p className="font-display font-bold text-white text-base truncate">
              {eqInfo.nombre}
            </p>
            {pedido.cromoDetalle && (
              <p className="text-gray-400 text-xs truncate">{pedido.cromoDetalle}</p>
            )}
          </div>
        </div>

        {/* Persona */}
        <div className="flex items-center gap-3 sm:border-l sm:border-fwc-border sm:pl-4">
          {personaFoto ? (
            <img src={personaFoto} alt={persona} className="w-10 h-10 rounded-full border border-fwc-border" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-fwc-card border border-fwc-border flex items-center justify-center">
              <span className="text-gray-400 text-xs">{persona[0]}</span>
            </div>
          )}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">
              {tipo === 'recibidos' ? 'Lo pidió' : 'Se lo pediste a'}
            </p>
            <p className="font-display font-bold text-white text-sm">
              {persona}
            </p>
          </div>
        </div>

        {/* Estado y acciones */}
        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
          <div className={`flex items-center gap-1 ${estilo.color} text-xs uppercase tracking-wider font-bold`}>
            {estilo.icon}
            {estilo.label}
          </div>

          {/* Botones según contexto y estado */}
          <div className="flex flex-wrap gap-2 justify-end">
            
            {/* PENDIENTE en recibidos: dueño puede APROBAR o CANCELAR */}
            {pedido.estado === 'pendiente' && tipo === 'recibidos' && (
              <>
                <button
                  onClick={() => onAprobar(pedido)}
                  disabled={procesando}
                  className="px-3 py-1.5 bg-fwc-neon/20 border border-fwc-neon/40 text-fwc-neon hover:bg-fwc-neon hover:text-fwc-bg font-display font-bold uppercase tracking-wider text-xs rounded-lg transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  {procesando ? <Loader2 className="w-3 h-3 animate-spin" /> : <ThumbsUp className="w-3 h-3" />}
                  Aprobar
                </button>
                <button
                  onClick={() => onCancelar(pedido)}
                  disabled={procesando}
                  className="px-3 py-1.5 border border-fwc-border text-gray-400 hover:border-fwc-accent hover:text-fwc-accent font-display font-bold uppercase tracking-wider text-xs rounded-lg transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <XCircle className="w-3 h-3" />
                  Rechazar
                </button>
              </>
            )}

            {/* APROBADO en recibidos: dueño espera */}
            {pedido.estado === 'aprobado' && tipo === 'recibidos' && (
              <button
                onClick={() => onCancelar(pedido)}
                disabled={procesando}
                className="px-3 py-1.5 border border-fwc-border text-gray-400 hover:border-fwc-accent hover:text-fwc-accent font-display font-bold uppercase tracking-wider text-xs rounded-lg transition-all flex items-center gap-1 disabled:opacity-50"
              >
                <XCircle className="w-3 h-3" />
                Cancelar
              </button>
            )}

            {/* PENDIENTE en enviados: solo cancelar */}
            {pedido.estado === 'pendiente' && tipo === 'enviados' && (
              <button
                onClick={() => onCancelar(pedido)}
                disabled={procesando}
                className="px-3 py-1.5 border border-fwc-border text-gray-400 hover:border-fwc-accent hover:text-fwc-accent font-display font-bold uppercase tracking-wider text-xs rounded-lg transition-all flex items-center gap-1 disabled:opacity-50"
              >
                {procesando ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                Cancelar
              </button>
            )}

            {/* APROBADO en enviados: el receptor puede confirmar que ya lo tiene */}
            {pedido.estado === 'aprobado' && tipo === 'enviados' && (
              <>
                <button
                  onClick={() => onMarcarRecibido(pedido)}
                  disabled={procesando}
                  className="px-3 py-1.5 bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500 hover:text-white font-display font-bold uppercase tracking-wider text-xs rounded-lg transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  {procesando ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                  Ya lo tengo
                </button>
                <button
                  onClick={() => onCancelar(pedido)}
                  disabled={procesando}
                  className="px-3 py-1.5 border border-fwc-border text-gray-400 hover:border-fwc-accent hover:text-fwc-accent font-display font-bold uppercase tracking-wider text-xs rounded-lg transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <XCircle className="w-3 h-3" />
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PantallaPedidos;