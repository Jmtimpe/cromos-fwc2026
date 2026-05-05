// Configuración e inicialización de Firebase para Cromos FWC2026
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración del proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD2QLa_K2otTOSo3hpFKcmkYmwfQAtmZ7g",
  authDomain: "cromos-fwc2026.firebaseapp.com",
  projectId: "cromos-fwc2026",
  storageBucket: "cromos-fwc2026.firebasestorage.app",
  messagingSenderId: "44453621068",
  appId: "6c0d2cb70be90f4a1773e9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios que vamos a usar en la app
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;