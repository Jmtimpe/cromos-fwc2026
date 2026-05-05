import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { observeAuth } from './lib/auth';
import { crearOActualizarPerfil } from './lib/perfilUsuario';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = observeAuth(async (firebaseUser) => {
      if (firebaseUser) {
        // Cuando el usuario inicia sesión, creamos/actualizamos su perfil
        await crearOActualizarPerfil(firebaseUser);
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-fwc-bg flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-fwc-gold animate-spin" />
      </div>
    );
  }

  return user ? <HomeScreen user={user} /> : <LoginScreen />;
}

export default App;