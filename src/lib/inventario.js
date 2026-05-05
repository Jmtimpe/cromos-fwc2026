// Gestión del inventario de cromos del usuario
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const USUARIOS_COL = 'usuarios';
const INVENTARIO_SUBCOL = 'inventario';

// Actualizar la cantidad de un cromo en el inventario del usuario
export const actualizarCantidad = async (userId, numeroCromo, cantidad) => {
  try {
    const cromoId = String(numeroCromo).padStart(4, '0');
    const inventarioRef = doc(
      db,
      USUARIOS_COL,
      userId,
      INVENTARIO_SUBCOL,
      cromoId
    );

    await setDoc(
      inventarioRef,
      {
        numero: numeroCromo,
        cantidad: cantidad,
        actualizado: serverTimestamp(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (error) {
    console.error('Error actualizando cantidad:', error);
    return { success: false, error: error.message };
  }
};

// Sumar 1 al inventario (cuando el receptor confirma "ya lo tengo")
export const sumarUnoAlInventario = async (userId, numeroCromo) => {
  try {
    const cromoId = String(numeroCromo).padStart(4, '0');
    const inventarioRef = doc(
      db,
      USUARIOS_COL,
      userId,
      INVENTARIO_SUBCOL,
      cromoId
    );

    // Leer cantidad actual
    const snap = await getDoc(inventarioRef);
    const cantidadActual = snap.exists() ? snap.data().cantidad || 0 : 0;

    await setDoc(
      inventarioRef,
      {
        numero: numeroCromo,
        cantidad: cantidadActual + 1,
        actualizado: serverTimestamp(),
      },
      { merge: true }
    );

    return { success: true, cantidadNueva: cantidadActual + 1 };
  } catch (error) {
    console.error('Error sumando al inventario:', error);
    return { success: false, error: error.message };
  }
};

// Restar 1 del inventario (cuando el dueño aprueba un pedido)
export const restarUnoDelInventario = async (userId, numeroCromo) => {
  try {
    const cromoId = String(numeroCromo).padStart(4, '0');
    const inventarioRef = doc(
      db,
      USUARIOS_COL,
      userId,
      INVENTARIO_SUBCOL,
      cromoId
    );

    // Leer cantidad actual
    const snap = await getDoc(inventarioRef);
    const cantidadActual = snap.exists() ? snap.data().cantidad || 0 : 0;

    if (cantidadActual <= 0) {
      return { success: false, error: 'No tienes ese cromo en tu inventario' };
    }

    await setDoc(
      inventarioRef,
      {
        numero: numeroCromo,
        cantidad: cantidadActual - 1,
        actualizado: serverTimestamp(),
      },
      { merge: true }
    );

    return { success: true, cantidadNueva: cantidadActual - 1 };
  } catch (error) {
    console.error('Error restando del inventario:', error);
    return { success: false, error: error.message };
  }
};

// Observador en tiempo real del inventario propio
export const observeInventario = (userId, callback) => {
  const inventarioRef = collection(
    db,
    USUARIOS_COL,
    userId,
    INVENTARIO_SUBCOL
  );

  const unsubscribe = onSnapshot(inventarioRef, (snapshot) => {
    const inventario = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      inventario[data.numero] = data.cantidad;
    });
    callback(inventario);
  });

  return unsubscribe;
};

// Observador del inventario de un amigo (read-only)
export const observeInventarioAmigo = (amigoUid, callback) => {
  const inventarioRef = collection(
    db,
    USUARIOS_COL,
    amigoUid,
    INVENTARIO_SUBCOL
  );

  const unsubscribe = onSnapshot(inventarioRef, (snapshot) => {
    const inventario = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      inventario[data.numero] = data.cantidad;
    });
    callback(inventario);
  });

  return unsubscribe;
};