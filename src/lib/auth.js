import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './firebase';
import { appCache } from './cache';

const googleProvider = new GoogleAuthProvider();

// Configurar el provider de Google con scopes adicionales
googleProvider.setCustomParameters({
  prompt: 'select_account', // Permite elegir cuenta cada vez
});

/**
 * Detecta si el navegador es Safari iOS
 * Safari iOS tiene problemas con signInWithRedirect debido a ITP
 */
function esSafariIOS() {
  const ua = navigator.userAgent;
  const esIOS = /iPad|iPhone|iPod/.test(ua);
  const esSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);
  return esIOS && esSafari;
}

/**
 * Detecta si la app está corriendo como PWA instalada
 */
function esPWAInstalada() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

/**
 * Inicia sesión con Google
 * - Para Safari iOS y PWAs instaladas: usa popup (más compatible)
 * - Para otros navegadores: usa popup también (más rápido y mejor UX)
 */
export const signInWithGoogle = async () => {
  try {
    // Siempre usamos popup ahora — funciona en TODOS los navegadores
    // y evita el problema de Safari iOS con sessionStorage
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Error en signInWithGoogle:', error);
    
    // Si el popup fue bloqueado, intentar con redirect como fallback
    if (
      error.code === 'auth/popup-blocked' ||
      error.code === 'auth/popup-closed-by-user'
    ) {
      // Si fue cerrado por el usuario, no hacemos nada
      if (error.code === 'auth/popup-closed-by-user') {
        return { 
          success: false, 
          error: 'Cerraste la ventana de Google. Intenta nuevamente.' 
        };
      }
      
      // Si fue bloqueado, intentar redirect como último recurso
      try {
        await signInWithRedirect(auth, googleProvider);
        return { success: true, redirect: true };
      } catch (redirectError) {
        return { 
          success: false, 
          error: 'No pudimos abrir la ventana de Google. Verifica que tu navegador permita popups.' 
        };
      }
    }
    
    return { 
      success: false, 
      error: 'Error al iniciar sesión. Intenta nuevamente.' 
    };
  }
};

/**
 * Cierra sesión y limpia el caché
 */
export const signOut = async () => {
  try {
    appCache.clear();
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Observa cambios en el estado de autenticación
 */
export const observeAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};