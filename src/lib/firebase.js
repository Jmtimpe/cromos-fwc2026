// Configuración e inicialización de Firebase para Cromos FWC2026
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración del proyecto Firebase
// En producción usa las variables de entorno de Vercel
// En desarrollo (StackBlitz) usa los valores fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD2QLa_K2otTOSo3hpFKcmkYmwfQAtmZ7g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cromos-fwc2026.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cromos-fwc2026",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cromos-fwc2026.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "44453621068",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:44453621068:web:6c0d2cb70be90f4a1773e9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;