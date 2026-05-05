import React, { useState } from 'react';
import { Trophy, Sparkles, LogIn, Loader2 } from 'lucide-react';
import { signInWithGoogle } from '../lib/auth';

function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    const result = await signInWithGoogle();

    // Si es exitoso pero con redirect, no hacemos nada
    // (el navegador va a redirigir y al volver, App.jsx detectará el cambio)
    if (result.redirect) {
      return;
    }

    // Si fue exitoso con popup, App.jsx detectará el cambio de auth
    if (result.success) {
      // No reseteamos loading porque la app va a navegar
      return;
    }

    // Si hubo error, mostrarlo
    setError(result.error || 'No se pudo iniciar sesión. Intenta nuevamente.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-fwc-bg flex items-center justify-center p-4 sm:p-6">
      <div className="fwc-card fwc-glow-gold p-6 sm:p-10 max-w-md w-full text-center">
        
        {/* Trofeo */}
        <div className="flex justify-center mb-6">
          <Trophy className="w-16 h-16 text-fwc-gold" />
        </div>
        
        {/* Título */}
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 tracking-widest">
          CROMOS
        </h1>
        <h2 className="text-4xl sm:text-5xl font-display font-black text-fwc-gold mb-4">
          FWC2026
        </h2>
        
        {/* Línea decorativa */}
        <div className="h-px bg-gradient-to-r from-transparent via-fwc-gold to-transparent my-6"></div>
        
        {/* Subtítulo */}
        <p className="text-fwc-neon text-sm uppercase tracking-widest mb-2">
          <Sparkles className="inline w-4 h-4 mr-1" />
          Mundial 2026
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Gestiona tu colección y haz match<br />con tus amigos para intercambiar
        </p>
        
        {/* Botón de Login */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-fwc-gold hover:bg-yellow-500 text-fwc-bg font-display font-bold uppercase tracking-wider py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-fwc-gold/50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Iniciando...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Entrar con Google
            </>
          )}
        </button>
        
        {/* Mensaje de error */}
        {error && (
          <p className="text-fwc-accent text-sm mt-4">
            {error}
          </p>
        )}
        
        {/* Footer */}
        <p className="text-gray-600 text-xs mt-8">
          Solo necesitas tu cuenta de Google
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;