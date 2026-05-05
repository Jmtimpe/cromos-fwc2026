import React, { useState, useEffect } from 'react';
import {
  Trophy,
  LogOut,
  User,
  Database,
  BookOpen,
  Users,
  ShoppingCart,
  Calendar,
  Sun,
  Code2,
} from 'lucide-react';
import { signOut } from '../lib/auth';
import { observeInventario } from '../lib/inventario';
import { observarPedidosRecibidos } from '../lib/pedidos';
import SeedPanel from './SeedPanel';
import Inventario from './Inventario';
import PantallaAmigos from './PantallaAmigos';
import VistaAmigo from './VistaAmigo';
import PantallaPedidos from './PantallaPedidos';
import Calendario from './Calendario';
import PartidosHoy from './PartidosHoy';

function HomeScreen({ user }) {
  const [showSeedPanel, setShowSeedPanel] = useState(false);
  const [pestañaActiva, setPestañaActiva] = useState('album');
  const [amigoVisualizando, setAmigoVisualizando] = useState(null);
  const [miInventario, setMiInventario] = useState({});
  const [pedidosPendientes, setPedidosPendientes] = useState(0);

  const [favoritos, setFavoritos] = useState(() => {
    try {
      const saved = localStorage.getItem(`favoritos_${user.uid}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [canalesPartidos] = useState({});

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = observeInventario(user.uid, setMiInventario);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = observarPedidosRecibidos(user.uid, (pedidos) => {
      const activos = pedidos.filter(
        (p) => p.estado === 'pendiente' || p.estado === 'aprobado'
      );
      setPedidosPendientes(activos.length);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(`favoritos_${user.uid}`, JSON.stringify(favoritos));
    } catch (e) {
      console.error('Error guardando favoritos:', e);
    }
  }, [favoritos, user.uid]);

  const handleToggleFavorito = (numero) => {
    setFavoritos((prev) =>
      prev.includes(numero) ? prev.filter((n) => n !== numero) : [...prev, numero]
    );
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-fwc-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-fwc-border bg-fwc-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Trophy className="w-7 h-7 text-fwc-gold" />
            <div>
              <h1 className="font-display font-bold text-white tracking-widest text-sm">
                CROMOS
              </h1>
              <h2 className="font-display font-black text-fwc-gold tracking-wider text-lg leading-none">
                FWC2026
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Panel de admin (solo visible para el creador) */}
            {user.email === 'jose.timpe@gmail.com' && (
              <button
                onClick={() => setShowSeedPanel(!showSeedPanel)}
                className="p-2 rounded-lg border border-fwc-border hover:border-fwc-neon hover:text-fwc-neon transition-colors"
                title="Panel de Administración"
              >
                <Database className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-fwc-gold"
                />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-fwc-card border-2 border-fwc-gold flex items-center justify-center">
                  <User className="w-5 h-5 text-fwc-gold" />
                </div>
              )}
              <div className="hidden md:block text-right">
                <p className="text-white text-sm font-semibold">
                  {user.displayName || 'Coleccionista'}
                </p>
                <p className="text-gray-500 text-xs">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg border border-fwc-border hover:border-fwc-accent hover:text-fwc-accent transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!showSeedPanel && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
            <PestañaBtn
              activa={pestañaActiva === 'album' && !amigoVisualizando}
              onClick={() => {
                setPestañaActiva('album');
                setAmigoVisualizando(null);
              }}
              icon={<BookOpen className="w-4 h-4" />}
              label="Mi Álbum"
            />
            <PestañaBtn
              activa={pestañaActiva === 'amigos' && !amigoVisualizando}
              onClick={() => {
                setPestañaActiva('amigos');
                setAmigoVisualizando(null);
              }}
              icon={<Users className="w-4 h-4" />}
              label="Amigos"
            />
            <PestañaBtn
              activa={pestañaActiva === 'pedidos' && !amigoVisualizando}
              onClick={() => {
                setPestañaActiva('pedidos');
                setAmigoVisualizando(null);
              }}
              icon={<ShoppingCart className="w-4 h-4" />}
              label="Pedidos"
              badge={pedidosPendientes > 0 ? pedidosPendientes : null}
            />
            <PestañaBtn
              activa={pestañaActiva === 'hoy' && !amigoVisualizando}
              onClick={() => {
                setPestañaActiva('hoy');
                setAmigoVisualizando(null);
              }}
              icon={<Sun className="w-4 h-4" />}
              label="Hoy"
            />
            <PestañaBtn
              activa={pestañaActiva === 'calendario' && !amigoVisualizando}
              onClick={() => {
                setPestañaActiva('calendario');
                setAmigoVisualizando(null);
              }}
              icon={<Calendar className="w-4 h-4" />}
              label="Calendario"
            />
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex-1 w-full">
        {showSeedPanel ? (
          <SeedPanel onClose={() => setShowSeedPanel(false)} />
        ) : amigoVisualizando ? (
          <VistaAmigo
            amigo={amigoVisualizando}
            miInventario={miInventario}
            miUsuario={user}
            onVolver={() => setAmigoVisualizando(null)}
          />
        ) : pestañaActiva === 'album' ? (
          <Inventario user={user} />
        ) : pestañaActiva === 'amigos' ? (
          <PantallaAmigos user={user} onVerAmigo={setAmigoVisualizando} />
        ) : pestañaActiva === 'pedidos' ? (
          <PantallaPedidos user={user} />
        ) : pestañaActiva === 'hoy' ? (
          <PartidosHoy
            favoritos={favoritos}
            onToggleFavorito={handleToggleFavorito}
            canalesPartidos={canalesPartidos}
          />
        ) : (
          <Calendario
            favoritos={favoritos}
            onToggleFavorito={handleToggleFavorito}
            canalesPartidos={canalesPartidos}
          />
        )}
      </main>

      {/* Footer con firma profesional */}
      <footer className="border-t border-fwc-border bg-fwc-card/30 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Trophy className="w-4 h-4 text-fwc-gold/60" />
              <span className="font-display tracking-wider uppercase">
                Cromos FWC2026
              </span>
              <span className="text-gray-700">•</span>
              <span>Mundial 2026 ⚽</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Code2 className="w-3.5 h-3.5 text-fwc-gold/60" />
              <span className="text-gray-500">Desarrollado y creado por</span>
              <span className="font-display font-bold text-fwc-gold tracking-wider">
                J. M. Timpe
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PestañaBtn({ activa, onClick, icon, label, badge }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 font-display font-bold text-xs sm:text-sm uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
        activa
          ? 'text-fwc-gold border-fwc-gold'
          : 'text-gray-500 border-transparent hover:text-white hover:border-fwc-border'
      }`}
    >
      {icon}
      {label}
      {badge && (
        <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 text-xs rounded-full bg-fwc-accent text-white font-mono">
          {badge}
        </span>
      )}
    </button>
  );
}

export default HomeScreen;