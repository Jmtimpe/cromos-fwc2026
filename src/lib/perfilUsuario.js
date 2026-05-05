// Funciones para gestionar el perfil público de cada usuario
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

// Genera un código único de invitación basado en el nombre del usuario
// Formato: NOMBRE-XXXX (ej: JOSE-7H2M)
const generarCodigoInvitacion = (displayName, uid) => {
  // Tomar las primeras letras del nombre (max 5)
  const nombreBase = (displayName || 'CRACK')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 5) || 'USER';
  
  // Tomar 4 caracteres del UID para hacer único el código
  const sufijo = uid.slice(-4).toUpperCase();
  
  return `${nombreBase}-${sufijo}`;
};

// Crea o actualiza el perfil público del usuario
// Esta función se llama automáticamente al iniciar sesión
export const crearOActualizarPerfil = async (user) => {
  try {
    const ref = doc(db, 'usuarios', user.uid);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      // Primera vez: crear perfil completo
      const nuevoPerfil = {
        uid: user.uid,
        displayName: user.displayName || 'Coleccionista',
        email: user.email,
        photoURL: user.photoURL || null,
        codigoInvitacion: generarCodigoInvitacion(user.displayName, user.uid),
        creadoEn: new Date().toISOString(),
        ultimoAcceso: new Date().toISOString(),
      };
      await setDoc(ref, nuevoPerfil);
      return { success: true, perfil: nuevoPerfil, esNuevo: true };
    } else {
      // Ya existe: solo actualizar último acceso y datos básicos por si cambiaron
      await updateDoc(ref, {
        displayName: user.displayName || 'Coleccionista',
        photoURL: user.photoURL || null,
        ultimoAcceso: new Date().toISOString(),
      });
      return { success: true, perfil: snapshot.data(), esNuevo: false };
    }
  } catch (error) {
    console.error('Error creando/actualizando perfil:', error);
    return { success: false, error: error.message };
  }
};

// Obtiene el perfil del usuario actual
export const obtenerMiPerfil = async (uid) => {
  try {
    const ref = doc(db, 'usuarios', uid);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      return { success: true, perfil: snapshot.data() };
    } else {
      return { success: false, error: 'Perfil no encontrado' };
    }
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return { success: false, error: error.message };
  }
};

// Busca un usuario por su código de invitación
export const buscarPorCodigo = async (codigo) => {
  try {
    const codigoLimpio = codigo.trim().toUpperCase();
    const q = query(
      collection(db, 'usuarios'),
      where('codigoInvitacion', '==', codigoLimpio)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: false, error: 'No encontramos a nadie con ese código' };
    }
    
    const usuarioEncontrado = snapshot.docs[0].data();
    return { success: true, usuario: usuarioEncontrado };
  } catch (error) {
    console.error('Error buscando usuario:', error);
    return { success: false, error: error.message };
  }
};