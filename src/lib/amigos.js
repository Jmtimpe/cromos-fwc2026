// Funciones para gestionar la red de amigos
import { 
  doc, 
  setDoc, 
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { obtenerMiPerfil } from './perfilUsuario';

// Agregar un amigo (relación bidireccional)
// Cuando agregas a alguien, también te agregas a su lista
export const agregarAmigo = async (miUid, amigoUid, miPerfil, amigoPerfil) => {
  try {
    // No te puedes agregar a ti mismo
    if (miUid === amigoUid) {
      return { success: false, error: 'No puedes agregarte a ti mismo' };
    }

    const fecha = new Date().toISOString();

    // Agregar amigo a MI lista
    const miRef = doc(db, 'usuarios', miUid, 'amigos', amigoUid);
    await setDoc(miRef, {
      uid: amigoPerfil.uid,
      displayName: amigoPerfil.displayName,
      photoURL: amigoPerfil.photoURL,
      codigoInvitacion: amigoPerfil.codigoInvitacion,
      agregadoEn: fecha,
    });

    // Agregar mi perfil a SU lista (bidireccional)
    const suRef = doc(db, 'usuarios', amigoUid, 'amigos', miUid);
    await setDoc(suRef, {
      uid: miPerfil.uid,
      displayName: miPerfil.displayName,
      photoURL: miPerfil.photoURL,
      codigoInvitacion: miPerfil.codigoInvitacion,
      agregadoEn: fecha,
    });

    return { success: true };
  } catch (error) {
    console.error('Error agregando amigo:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar un amigo (también bidireccional)
export const eliminarAmigo = async (miUid, amigoUid) => {
  try {
    await deleteDoc(doc(db, 'usuarios', miUid, 'amigos', amigoUid));
    await deleteDoc(doc(db, 'usuarios', amigoUid, 'amigos', miUid));
    return { success: true };
  } catch (error) {
    console.error('Error eliminando amigo:', error);
    return { success: false, error: error.message };
  }
};

// Obtener mi lista de amigos (una sola vez)
export const obtenerAmigos = async (miUid) => {
  try {
    const snapshot = await getDocs(collection(db, 'usuarios', miUid, 'amigos'));
    const amigos = [];
    snapshot.forEach(doc => {
      amigos.push(doc.data());
    });
    return amigos;
  } catch (error) {
    console.error('Error obteniendo amigos:', error);
    return [];
  }
};

// Escuchar mi lista de amigos en tiempo real
export const observarAmigos = (miUid, callback) => {
  return onSnapshot(
    collection(db, 'usuarios', miUid, 'amigos'), 
    (snapshot) => {
      const amigos = [];
      snapshot.forEach(doc => {
        amigos.push(doc.data());
      });
      callback(amigos);
    }
  );
};