import React from 'react';
import { Trophy } from 'lucide-react';

// Mapeo especial para casos no-país (entidades, marcas, históricos)
const ICONOS_ESPECIALES = {
  'FWC':    '🏆',
  'HIS':    '📜',
  'CC':     '🥤',
  '?':      '⚽',
};

function Bandera({ iso, size = 'md', className = '' }) {
  // Tamaños predefinidos (clases Tailwind)
  const sizes = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  };

  const sizeClass = sizes[size] || sizes.md;

  // Si es ícono especial (FWC, HIS, CC), mostrar emoji en vez de bandera
  if (ICONOS_ESPECIALES[iso]) {
    return (
      <span className={`${sizeClass} leading-none ${className}`}>
        {ICONOS_ESPECIALES[iso]}
      </span>
    );
  }

  // Si no hay ISO válido, mostrar fallback
  if (!iso || iso === '?') {
    return (
      <span className={`${sizeClass} ${className}`}>
        <Trophy className="inline w-5 h-5 text-fwc-gold" />
      </span>
    );
  }

  // Manejo especial para regiones del Reino Unido
  // flag-icons las soporta nativamente como gb-eng, gb-sct, etc.
  const isoLimpio = iso.toLowerCase();

  // La librería flag-icons usa la clase "fi fi-{codigo}"
  return (
    <span 
      className={`fi fi-${isoLimpio} ${className}`}
      style={{
        display: 'inline-block',
        width: size === 'sm' ? '20px' : size === 'md' ? '28px' : size === 'lg' ? '36px' : '56px',
        height: size === 'sm' ? '15px' : size === 'md' ? '21px' : size === 'lg' ? '27px' : '42px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '2px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}
      title={iso.toUpperCase()}
    />
  );
}

export default Bandera;