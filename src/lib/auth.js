// Funciones de autenticación con Google
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { appCache } from './cache';

// Iniciar sesión con Google (abre popup)
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    console.error('Error en login:', error);
    return { user: null, error: error.message };
  }
};

// Cerrar sesión
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    appCache.limpiar(); // Limpiar caché al cerrar sesión
    return { error: null };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { error: error.message };
  }
};

// Observador del estado de autenticación
// Se ejecuta cada vez que el usuario inicia o cierra sesión
export const observeAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};