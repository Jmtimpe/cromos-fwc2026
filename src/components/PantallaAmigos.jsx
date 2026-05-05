import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, Copy, Check, X, 
  Loader2, AlertCircle, CheckCircle2, UserMinus, Eye
} from 'lucide-react';
import { obtenerMiPerfil, buscarPorCodigo } from '../lib/perfilUsuario';
import { agregarAmigo, eliminarAmigo, observarAmigos } from '../lib/amigos';

function PantallaAmigos({ user, onVerAmigo }) {
  const [miPerfil, setMiPerfil] = useState(null);
  const [amigos, setAmigos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [codigoCopiado, setCodigoCopiado] = useState(false);
  
  const [codigoBuscar, setCodigoBuscar] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    const cargar = async () => {
      const result = await obtenerMiPerfil(user.uid);
      if (result.success) {
        setMiPerfil(result.perfil);
      }
      setLoading(false);
    };
    cargar();
  }, [user.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = observarAmigos(user.uid, setAmigos);
    return () => unsubscribe();
  }, [user.uid]);

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(miPerfil.codigoInvitacion);
      setCodigoCopiado(true);
      setTimeout(() => setCodigoCopiado(false), 2000);
    } catch (error) {
      console.error('Error copiando:', error);
    }
  };

  const handleBuscar = async () => {
    if (!codigoBuscar.trim()) return;
    
    setBuscando(true);
    setResultadoBusqueda(null);
    setMensaje({ tipo: '', texto: '' });

    const result = await buscarPorCodigo(codigoBuscar);
    
    if (result.success) {
      if (result.usuario.uid === user.uid) {
        setMensaje({ tipo: 'error', texto: 'Ese es tu propio código 😄' });
      } 
      else if (amigos.some(a => a.uid === result.usuario.uid)) {
        setMensaje({ tipo: 'info', texto: `${result.usuario.displayName} ya está en tu red` });
      } 
      else {
        setResultadoBusqueda(result.usuario);
      }
    } else {
      setMensaje({ tipo: 'error', texto: result.error });
    }
    
    setBuscando(false);
  };

  const handleAgregar = async () => {
    if (!resultadoBusqueda || !miPerfil) return;
    
    const result = await agregarAmigo(
      user.uid, 
      resultadoBusqueda.uid, 
      miPerfil, 
      resultadoBusqueda
    );
    
    if (result.success) {
      setMensaje({ 
        tipo: 'exito', 
        texto: `¡${resultadoBusqueda.displayName} agregado a tu red! 🎉` 
      });
      setResultadoBusqueda(null);
      setCodigoBuscar('');
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 4000);
    } else {
      setMensaje({ tipo: 'error', texto: result.error });
    }
  };

  const handleEliminar = async (amigo) => {
    if (!window.confirm(`¿Quitar a ${amigo.displayName} de tu red?`)) return;
    await eliminarAmigo(user.uid, amigo.uid);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-fwc-gold animate-spin mb-4" />
        <p className="text-gray-400 text-sm uppercase tracking-widest">
          Cargando perfil...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Mi Perfil con Código de Invitación */}
      <div className="fwc-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-fwc-gold" />
          <h3 className="font-display font-bold text-xl text-white">
            Mi Red
          </h3>
        </div>

        <div className="bg-fwc-bg/50 border border-fwc-gold/30 rounded-lg p-5">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
            Tu código de invitación
          </p>
          <div className="flex items-center justify-between gap-3">
            <p className="font-display font-black text-3xl text-fwc-gold tracking-wider">
              {miPerfil?.codigoInvitacion || '...'}
            </p>
            <button
              onClick={copiarCodigo}
              className="p-3 bg-fwc-card border border-fwc-border hover:border-fwc-neon hover:text-fwc-neon rounded-lg transition-all"
              title="Copiar código"
            >
              {codigoCopiado ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-3">
            Comparte este código con tus amigos para que te agreguen a su red
          </p>
        </div>
      </div>

      {/* Agregar Amigo por Código */}
      <div className="fwc-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <UserPlus className="w-6 h-6 text-fwc-neon" />
          <h3 className="font-display font-bold text-xl text-white">
            Agregar a tu red
          </h3>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={codigoBuscar}
              onChange={(e) => setCodigoBuscar(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              placeholder="Pega aquí el código (ej: JOSE-7H2M)"
              className="w-full bg-fwc-bg border border-fwc-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-fwc-neon transition-colors font-mono"
            />
          </div>
          <button
            onClick={handleBuscar}
            disabled={buscando || !codigoBuscar.trim()}
            className="px-5 bg-fwc-neon hover:bg-cyan-400 text-fwc-bg font-display font-bold uppercase tracking-wider rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {buscando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Buscar
          </button>
        </div>

        {resultadoBusqueda && (
          <div className="bg-fwc-bg border border-fwc-neon/30 rounded-lg p-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {resultadoBusqueda.photoURL ? (
                <img 
                  src={resultadoBusqueda.photoURL} 
                  alt={resultadoBusqueda.displayName}
                  className="w-12 h-12 rounded-full border-2 border-fwc-neon"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-fwc-card border-2 border-fwc-neon flex items-center justify-center">
                  <Users className="w-5 h-5 text-fwc-neon" />
                </div>
              )}
              <div>
                <p className="font-display font-bold text-white">
                  {resultadoBusqueda.displayName}
                </p>
                <p className="text-gray-500 text-xs font-mono">
                  {resultadoBusqueda.codigoInvitacion}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAgregar}
                className="px-4 py-2 bg-fwc-gold hover:bg-yellow-500 text-fwc-bg font-display font-bold uppercase tracking-wider text-xs rounded-lg transition-all flex items-center gap-1"
              >
                <UserPlus className="w-4 h-4" />
                Agregar
              </button>
              <button
                onClick={() => setResultadoBusqueda(null)}
                className="p-2 border border-fwc-border rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {mensaje.texto && (
          <div className={`rounded-lg p-3 text-sm flex items-center gap-2 ${
            mensaje.tipo === 'exito' ? 'bg-green-500/10 border border-green-500/30 text-green-400' :
            mensaje.tipo === 'error' ? 'bg-red-500/10 border border-red-500/30 text-fwc-accent' :
            'bg-fwc-neon/10 border border-fwc-neon/30 text-fwc-neon'
          }`}>
            {mensaje.tipo === 'exito' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {mensaje.texto}
          </div>
        )}
      </div>

      {/* Lista de Amigos */}
      <div className="fwc-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-fwc-gold" />
            <h3 className="font-display font-bold text-xl text-white">
              Mis Amigos
            </h3>
          </div>
          <span className="bg-fwc-bg border border-fwc-border rounded-full px-3 py-1 text-fwc-gold text-sm font-display font-bold">
            {amigos.length}
          </span>
        </div>

        {amigos.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">Tu red está vacía</p>
            <p className="text-gray-600 text-sm">
              Comparte tu código de invitación con tus amigos<br />
              o agrega a alguien con su código.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {amigos.map((amigo) => (
              <div
                key={amigo.uid}
                className="bg-fwc-bg border border-fwc-border rounded-lg p-3 flex items-center justify-between hover:border-fwc-gold/40 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {amigo.photoURL ? (
                    <img 
                      src={amigo.photoURL} 
                      alt={amigo.displayName}
                      className="w-11 h-11 rounded-full border-2 border-fwc-gold/40"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-fwc-card border-2 border-fwc-gold/40 flex items-center justify-center">
                      <Users className="w-5 h-5 text-fwc-gold" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-display font-bold text-white truncate">
                      {amigo.displayName}
                    </p>
                    <p className="text-gray-500 text-xs font-mono truncate">
                      {amigo.codigoInvitacion}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onVerAmigo(amigo)}
                    className="px-3 py-2 bg-fwc-gold/20 border border-fwc-gold/40 text-fwc-gold hover:bg-fwc-gold hover:text-fwc-bg font-display font-bold uppercase tracking-wider text-xs rounded-lg transition-all flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Ver álbum
                  </button>
                  <button
                    onClick={() => handleEliminar(amigo)}
                    className="p-2 border border-fwc-border hover:border-fwc-accent hover:text-fwc-accent rounded-lg transition-colors"
                    title="Quitar de la red"
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PantallaAmigos;