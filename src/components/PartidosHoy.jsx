import React, { useMemo } from 'react';
import { Sun, Inbox } from 'lucide-react';
import { PARTIDOS_FWC2026 } from '../lib/partidosData';
import { esPartidoHoy } from '../lib/fechasHelper';
import TarjetaPartido from './TarjetaPartido';

function PartidosHoy({ favoritos, onToggleFavorito, canalesPartidos }) {
  // Filtrar partidos de hoy
  const partidosHoy = useMemo(() => {
    return PARTIDOS_FWC2026.filter(p => 
      esPartidoHoy(p.fecha, p.horaLocal, p.sede)
    );
  }, []);

  const fechaHoy = new Date().toLocaleDateString('es-EC', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    timeZone: 'America/Guayaquil'
  });

  return (
    <div>
      {/* Header */}
      <div className="fwc-card p-6 mb-6 bg-gradient-to-r from-fwc-gold/10 to-fwc-neon/5 border-fwc-gold/40">
        <div className="flex items-center gap-3 mb-2">
          <Sun className="w-7 h-7 text-fwc-gold" />
          <h3 className="font-display font-bold text-2xl text-white">
            Partidos de Hoy
          </h3>
        </div>
        <p className="text-gray-400 text-sm capitalize">
          {fechaHoy} 🇪🇨
        </p>
        <p className="text-fwc-gold font-display font-bold text-lg mt-2">
          {partidosHoy.length === 0 
            ? 'No hay partidos hoy' 
            : `${partidosHoy.length} ${partidosHoy.length === 1 ? 'partido' : 'partidos'} programados`
          }
        </p>
      </div>

      {/* Lista de partidos */}
      {partidosHoy.length === 0 ? (
        <div className="fwc-card p-12 text-center">
          <Inbox className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">
            Hoy es día de descanso ⚽
          </p>
          <p className="text-gray-600 text-sm">
            Aprovecha para revisar tu álbum o intercambiar cromos con tus amigos
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {partidosHoy.map(partido => (
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
      )}
    </div>
  );
}

export default PartidosHoy;