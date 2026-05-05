// Funciones para gestionar el inventario personal del usuario
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  onSnapshot,
  query
} from 'firebase/firestore';
import { db } from './firebase';

// Obtiene la referencia a la colección del inventario del usuario actual
const getInventarioRef = (userId) => {
  return collection(db, 'usuarios', userId, 'inventario');
};

// Actualiza el estado de un cromo específico
// estado: 0 = Faltante, 1 = Obtenido, 2+ = Repetidas (cantidad total)
export const updateCromoEstado = async (userId, numeroCromo, estado) => {
  try {
    const docId = String(numeroCromo).padStart(4, '0');
    const ref = doc(db, 'usuarios', userId, 'inventario', docId);
    
    if (estado === 0) {
      // Si está en 0, lo guardamos pero también podríamos borrarlo
      await setDoc(ref, { 
        numero: numeroCromo, 
        cantidad: 0,
        actualizado: new Date().toISOString()
      });
    } else {
      await setDoc(ref, { 
        numero: numeroCromo, 
        cantidad: estado,
        actualizado: new Date().toISOString()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error actualizando cromo:', error);
    return { success: false, error: error.message };
  }
};

// Obtiene todo el inventario del usuario (una sola vez)
export const fetchInventario = async (userId) => {
  try {
    const snapshot = await getDocs(getInventarioRef(userId));
    const inventario = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      inventario[data.numero] = data.cantidad;
    });
    return inventario;
  } catch (error) {
    console.error('Error leyendo inventario:', error);
    return {};
  }
};

// Escucha cambios en el inventario en tiempo real
export const observeInventario = (userId, callback) => {
  return onSnapshot(getInventarioRef(userId), (snapshot) => {
    const inventario = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      inventario[data.numero] = data.cantidad;
    });
    callback(inventario);
  });
};
// Obtener el inventario de un amigo (lectura)
export const fetchInventarioAmigo = async (amigoUid) => {
  try {
    const snapshot = await getDocs(collection(db, 'usuarios', amigoUid, 'inventario'));
    const inventario = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      inventario[data.numero] = data.cantidad;
    });
    return { success: true, inventario };
  } catch (error) {
    console.error('Error leyendo inventario del amigo:', error);
    return { success: false, error: error.message, inventario: {} };
  }
};

// Escuchar inventario de un amigo en tiempo real
export const observeInventarioAmigo = (amigoUid, callback) => {
  return onSnapshot(
    collection(db, 'usuarios', amigoUid, 'inventario'),
    (snapshot) => {
      const inventario = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        inventario[data.numero] = data.cantidad;
      });
      callback(inventario);
    }
  );
};
// Procesar la entrega física de un cromo entre 2 usuarios
// Usa lectura previa para no duplicar/restar mal
export const procesarEntregaCromo = async (deUsuarioId, paraUsuarioId, numeroCromo) => {
  try {
    const docId = String(numeroCromo).padStart(4, '0');
    
    // Leer cantidad actual del DUEÑO (deUsuario)
    const refDueno = doc(db, 'usuarios', deUsuarioId, 'inventario', docId);
    const snapDueno = await getDoc(refDueno);
    const cantDueno = snapDueno.exists() ? (snapDueno.data().cantidad || 0) : 0;
    
    // Leer cantidad actual del RECEPTOR (paraUsuario)
    const refRec = doc(db, 'usuarios', paraUsuarioId, 'inventario', docId);
    const snapRec = await getDoc(refRec);
    const cantRec = snapRec.exists() ? (snapRec.data().cantidad || 0) : 0;
    
    // Solo procesar si el dueño aún tiene repes (cantidad >= 2)
    if (cantDueno < 2) {
      return { success: false, error: 'El dueño ya no tiene repetidos de ese cromo' };
    }
    
    // Restar 1 al dueño
    await setDoc(refDueno, {
      numero: numeroCromo,
      cantidad: cantDueno - 1,
      actualizado: new Date().toISOString()
    });
    
    // Sumar 1 al receptor (si era 0 → ahora 1, si tenía 1 → ahora 2 repe)
    await setDoc(refRec, {
      numero: numeroCromo,
      cantidad: cantRec + 1,
      actualizado: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error procesando entrega:', error);
    return { success: false, error: error.message };
  }
};