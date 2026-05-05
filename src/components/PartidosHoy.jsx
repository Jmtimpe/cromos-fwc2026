import React, { useMemo } from 'react';
import { Sun, Inbox, Trophy } from 'lucide-react';
import { partidosData } from '../lib/partidosData';
import TarjetaPartido from './TarjetaPartido';

function PartidosHoy({ favoritos, onToggleFavorito, canalesPartidos }) {
  // Obtener fecha de hoy en Ecuador
  const hoyEcuador = useMemo(() => {
    const ahora = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'America/Guayaquil',
    });
    return formatter.format(ahora); // "2026-06-11"
  }, []);

  // Filtrar partidos de hoy
  const partidosHoy = useMemo(() => {
    return partidosData
      .filter((p) => p.fecha === hoyEcuador)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }, [hoyEcuador]);

  // Detectar EN VIVO
  const ahora = new Date();
  const esEnVivo = (partido) => {
    const inicio = new Date(`${partido.fecha}T${partido.hora}:00-05:00`);
    const fin = new Date(inicio.getTime() + 2 * 60 * 60 * 1000);
    return ahora >= inicio && ahora <= fin;
  };

  // Formatear fecha en español
  const fechaFormateada = useMemo(() => {
    const [year, month, day] = hoyEcuador.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    return fecha.toLocaleDateString('es-EC', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [hoyEcuador]);

  return (
    <div>
      {/* Header */}
      <div className="fwc-card p-4 sm:p-6 mb-4 bg-gradient-to-r from-fwc-gold/10 to-fwc-neon/5 border-fwc-gold/40">
        <div className="flex items-center gap-3 mb-2">
          <Sun className="w-6 h-6 text-fwc-gold" />
          <h2 className="font-display font-bold text-2xl text-white">Partidos de Hoy</h2>
        </div>
        <p className="text-gray-400 text-sm capitalize">{fechaFormateada}</p>
      </div>

      {/* Lista de partidos */}
      {partidosHoy.length === 0 ? (
        <div className="fwc-card p-12 text-center">
          <Inbox className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="font-display font-bold text-white text-base mb-2">
            No hay partidos hoy
          </h3>
          <p className="text-gray-400 text-sm">
            Revisa el calendario completo para ver los próximos partidos
          </p>
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center gap-2 text-gray-400 text-sm">
            <Trophy className="w-4 h-4 text-fwc-gold" />
            <span>
              {partidosHoy.length} {partidosHoy.length === 1 ? 'partido' : 'partidos'} programados hoy
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {partidosHoy.map((partido) => (
              <TarjetaPartido
                key={partido.numero}
                partido={partido}
                esFavorito={favoritos.includes(partido.numero)}
                onToggleFavorito={onToggleFavorito}
                canal={canalesPartidos?.[partido.numero]}
                enVivo={esEnVivo(partido)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PartidosHoy;