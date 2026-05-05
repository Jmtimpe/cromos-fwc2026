import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Send,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowDown,
  ArrowUp,
  Loader2,
  ShoppingCart,
  ThumbsUp,
  Gift,
} from 'lucide-react';
import {
  observarPedidosEnviados,
  observarPedidosRecibidos,
  cancelarPedido,
  marcarRecibido,
  aprobarPedido,
} from '../lib/pedidos';
import {
  sumarUnoAlInventario,
  restarUnoDelInventario,
} from '../lib/inventario';
import { getEquipoInfo } from '../lib/equiposData';
import Bandera from './Bandera';

function PantallaPedidos({ user }) {
  const [pedidosRecibidos, setPedidosRecibidos] = useState([]);
  const [pedidosEnviados, setPedidosEnviados] = useState([]);
  const [tabActiva, setTabActiva] = useState('recibidos');
  const [procesando, setProcesando] = useState(null);

  // Listener: pedidos que me han hecho a mí
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = observarPedidosRecibidos(user.uid, setPedidosRecibidos);
    return () => unsub();
  }, [user?.uid]);

  // Listener: pedidos que yo he enviado
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = observarPedidosEnviados(user.uid, setPedidosEnviados);
    return () => unsub();
  }, [user?.uid]);

  // El DUEÑO aprueba un pedido (resta -1 de su inventario)
  const handleAprobar = async (pedido) => {
    if (
      !window.confirm(
        `¿Apartar el cromo ${pedido.cromoCodigo} para ${pedido.deUsuarioNombre}? Se descontará de tu inventario.`
      )
    )
      return;

    setProcesando(pedido.id);

    // 1. Restar -1 de MI inventario (yo soy el dueño)
    const resultRestar = await restarUnoDelInventario(
      user.uid,
      pedido.cromoNumero
    );

    if (!resultRestar.success) {
      alert('Error: ' + resultRestar.error);
      setProcesando(null);
      return;
    }

    // 2. Marcar pedido como aprobado
    await aprobarPedido(pedido.id);
    setProcesando(null);
  };

  // El DUEÑO o RECEPTOR cancela un pedido
  const handleCancelar = async (pedido, soyDueño) => {
    if (!window.confirm(`¿Cancelar este pedido?`)) return;

    setProcesando(pedido.id);

    // Si el pedido ya fue APROBADO, hay que devolver el cromo al dueño
    if (pedido.estado === 'aprobado' && soyDueño) {
      const resultSumar = await sumarUnoAlInventario(
        user.uid,
        pedido.cromoNumero
      );
      if (!resultSumar.success) {
        alert('Error devolviendo cromo: ' + resultSumar.error);
        setProcesando(null);
        return;
      }
    }

    await cancelarPedido(pedido.id);
    setProcesando(null);
  };

  // El RECEPTOR confirma "ya lo tengo" (suma +1 a su inventario)
  const handleMarcarRecibido = async (pedido) => {
    if (
      !window.confirm(
        `¿Confirmas que recibiste el cromo ${pedido.cromoCodigo} de ${pedido.paraUsuarioNombre}?`
      )
    )
      return;

    setProcesando(pedido.id);

    // Sumar +1 a MI inventario (yo soy el receptor)
    const resultSumar = await sumarUnoAlInventario(
      user.uid,
      pedido.cromoNumero
    );

    if (!resultSumar.success) {
      alert('Error: ' + resultSumar.error);
      setProcesando(null);
      return;
    }

    await marcarRecibido(pedido.id);
    setProcesando(null);
  };

  // Filtrar solo pedidos activos (no completados ni cancelados)
  const pedidosRecibidosActivos = pedidosRecibidos.filter(
    (p) => p.estado === 'pendiente' || p.estado === 'aprobado'
  );
  const pedidosEnviadosActivos = pedidosEnviados.filter(
    (p) => p.estado === 'pendiente' || p.estado === 'aprobado'
  );

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
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setTabActiva('recibidos')}
          className={`p-4 rounded-lg border font-display font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 ${
            tabActiva === 'recibidos'
              ? 'bg-fwc-gold text-fwc-bg border-fwc-gold'
              : 'bg-fwc-card text-gray-400 border-fwc-border hover:border-fwc-gold hover:text-fwc-gold'
          }`}
        >
          <ArrowDown className="w-4 h-4" />
          Me piden
          {pedidosRecibidosActivos.length > 0 && (
            <span
              className={`ml-1 inline-flex items-center justify-center min-w-[24px] h-[24px] px-1.5 text-xs rounded-full font-mono ${
                tabActiva === 'recibidos'
                  ? 'bg-fwc-bg text-fwc-gold'
                  : 'bg-fwc-accent text-white'
              }`}
            >
              {pedidosRecibidosActivos.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTabActiva('enviados')}
          className={`p-4 rounded-lg border font-display font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 ${
            tabActiva === 'enviados'
              ? 'bg-fwc-neon text-fwc-bg border-fwc-neon'
              : 'bg-fwc-card text-gray-400 border-fwc-border hover:border-fwc-neon hover:text-fwc-neon'
          }`}
        >
          <ArrowUp className="w-4 h-4" />
          Yo pedí
          {pedidosEnviadosActivos.length > 0 && (
            <span
              className={`ml-1 inline-flex items-center justify-center min-w-[24px] h-[24px] px-1.5 text-xs rounded-full font-mono ${
                tabActiva === 'enviados'
                  ? 'bg-fwc-bg text-fwc-neon'
                  : 'bg-fwc-neon text-fwc-bg'
              }`}
            >
              {pedidosEnviadosActivos.length}
            </span>
          )}
        </button>
      </div>

      {/* Contenido */}
      {tabActiva === 'recibidos' ? (
        <ListaPedidos
          pedidos={pedidosRecibidosActivos}
          tipo="recibidos"
          onCancelar={(p) => handleCancelar(p, true)}
          onAprobar={handleAprobar}
          procesando={procesando}
        />
      ) : (
        <ListaPedidos
          pedidos={pedidosEnviadosActivos}
          tipo="enviados"
          onCancelar={(p) => handleCancelar(p, false)}
          onMarcarRecibido={handleMarcarRecibido}
          procesando={procesando}
        />
      )}
    </div>
  );
}

function ListaPedidos({ pedidos, tipo, onCancelar, onMarcarRecibido, onAprobar, procesando }) {
  if (pedidos.length === 0) {
    return (
      <div className="fwc-card p-12 text-center">
        <Inbox className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg mb-2">
          {tipo === 'recibidos' ? 'Nadie te ha pedido cromos' : 'No has pedido cromos aún'}
        </p>
        <p className="text-gray-600 text-sm">
          {tipo === 'recibidos'
            ? 'Cuando alguien te pida un cromo, lo verás aquí'
            : 'Ve al perfil de un amigo y pide los que te faltan'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pedidos.map((pedido) => (
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

function PedidoCard({ pedido, tipo, onCancelar, onMarcarRecibido, onAprobar, procesando }) {
  const eqInfo = getEquipoInfo(pedido.cromoEquipo);
  const persona = tipo === 'recibidos' ? pedido.deUsuarioNombre : pedido.paraUsuarioNombre;
  const personaFoto = tipo === 'recibidos' ? pedido.deUsuarioFoto : pedido.paraUsuarioFoto;

  const estadoStyles = {
    pendiente: {
      borderColor: 'border-fwc-gold/40',
      icon: <Clock className="w-4 h-4" />,
      label: 'Pendiente',
      color: 'text-fwc-gold',
    },
    aprobado: {
      borderColor: 'border-fwc-neon/40',
      icon: <Gift className="w-4 h-4" />,
      label: 'Apartado',
      color: 'text-fwc-neon',
    },
  };

  const estilo = estadoStyles[pedido.estado] || estadoStyles.pendiente;

  return (
    <div className={`fwc-card p-4 border-2 ${estilo.borderColor}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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

        <div className="flex items-center gap-3 sm:border-l sm:border-fwc-border sm:pl-4">
          {personaFoto ? (
            <img
              src={personaFoto}
              alt={persona}
              className="w-10 h-10 rounded-full border border-fwc-border"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-fwc-card border border-fwc-border flex items-center justify-center">
              <span className="text-gray-400 text-xs">{persona[0]}</span>
            </div>
          )}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">
              {tipo === 'recibidos' ? 'Lo pidió' : 'Se lo pediste a'}
            </p>
            <p className="font-display font-bold text-white text-sm">{persona}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
          <div
            className={`flex items-center gap-1 ${estilo.color} text-xs uppercase tracking-wider font-bold`}
          >
            {estilo.icon}
            {estilo.label}
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            {/* PENDIENTE en recibidos: dueño puede APROBAR o RECHAZAR */}
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

            {/* APROBADO en recibidos: solo cancelar (devuelve cromo) */}
            {pedido.estado === 'aprobado' && tipo === 'recibidos' && (
              <button
                onClick={() => onCancelar(pedido)}
                disabled={procesando}
                className="px-3 py-1.5 border border-fwc-border text-gray-400 hover:border-fwc-accent hover:text-fwc-accent font-display font-bold uppercase tracking-wider text-xs rounded-lg transition-all flex items-center gap-1 disabled:opacity-50"
              >
                {procesando ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
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

            {/* APROBADO en enviados: confirmar recibido o cancelar */}
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