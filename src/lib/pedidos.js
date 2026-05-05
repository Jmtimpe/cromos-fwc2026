// Funciones para gestionar pedidos de intercambio
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const PEDIDOS_COL = 'pedidos';

// Crear un pedido (yo le pido un cromo a un amigo)
export const crearPedido = async ({ 
  deUsuario, 
  paraUsuario, 
  cromo 
}) => {
  try {
    const ref = await addDoc(collection(db, PEDIDOS_COL), {
      deUsuarioId: deUsuario.uid,
      deUsuarioNombre: deUsuario.displayName,
      deUsuarioFoto: deUsuario.photoURL || null,
      paraUsuarioId: paraUsuario.uid,
      paraUsuarioNombre: paraUsuario.displayName,
      paraUsuarioFoto: paraUsuario.photoURL || null,
      cromoNumero: cromo.numero,
      cromoCodigo: cromo.codigo,
      cromoEquipo: cromo.equipo,
      cromoDetalle: cromo.detalle || '',
      cromoTipo: cromo.tipo,
      estado: 'pendiente', // pendiente | recibido | cancelado
      mensaje: '',
      fechaCreacion: serverTimestamp(),
      fechaCompletado: null,
    });
    return { success: true, id: ref.id };
  } catch (error) {
    console.error('Error creando pedido:', error);
    return { success: false, error: error.message };
  }
};

// Cancelar un pedido
export const cancelarPedido = async (pedidoId) => {
  try {
    await deleteDoc(doc(db, PEDIDOS_COL, pedidoId));
    return { success: true };
  } catch (error) {
    console.error('Error cancelando pedido:', error);
    return { success: false, error: error.message };
  }
};

// Marcar pedido como recibido (lo hace el solicitante)
// Esto descuenta el repe del dueño y suma 1 al receptor automáticamente
export const marcarRecibido = async (pedidoId) => {
  try {
    await updateDoc(doc(db, PEDIDOS_COL, pedidoId), {
      estado: 'recibido',
      fechaCompletado: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error marcando recibido:', error);
    return { success: false, error: error.message };
  }
};

// Escuchar mis pedidos ENVIADOS en tiempo real (los que yo he hecho)
export const observarPedidosEnviados = (miUid, callback) => {
  const q = query(
    collection(db, PEDIDOS_COL),
    where('deUsuarioId', '==', miUid)
  );
  return onSnapshot(q, (snapshot) => {
    const pedidos = [];
    snapshot.forEach(doc => {
      pedidos.push({ id: doc.id, ...doc.data() });
    });
    // Ordenar por fecha (más recientes primero)
    pedidos.sort((a, b) => {
      const fa = a.fechaCreacion?.seconds || 0;
      const fb = b.fechaCreacion?.seconds || 0;
      return fb - fa;
    });
    callback(pedidos);
  });
};

// Escuchar mis pedidos RECIBIDOS en tiempo real (los que me han pedido a mí)
export const observarPedidosRecibidos = (miUid, callback) => {
  const q = query(
    collection(db, PEDIDOS_COL),
    where('paraUsuarioId', '==', miUid)
  );
  return onSnapshot(q, (snapshot) => {
    const pedidos = [];
    snapshot.forEach(doc => {
      pedidos.push({ id: doc.id, ...doc.data() });
    });
    pedidos.sort((a, b) => {
      const fa = a.fechaCreacion?.seconds || 0;
      const fb = b.fechaCreacion?.seconds || 0;
      return fb - fa;
    });
    callback(pedidos);
  });
};

// Verificar si ya tengo un pedido pendiente de cierto cromo a cierto usuario
export const tienePedidoActivo = async (miUid, paraUsuarioId, cromoNumero) => {
  try {
    const q = query(
      collection(db, PEDIDOS_COL),
      where('deUsuarioId', '==', miUid),
      where('paraUsuarioId', '==', paraUsuarioId),
      where('cromoNumero', '==', cromoNumero),
      where('estado', '==', 'pendiente')
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error verificando pedido:', error);
    return false;
  }
};
// Aprobar un pedido (lo hace el DUEÑO)
// Esto significa "OK, te lo guardo, ven por él"
export const aprobarPedido = async (pedidoId) => {
  try {
    await updateDoc(doc(db, PEDIDOS_COL, pedidoId), {
      estado: 'aprobado',
      fechaAprobacion: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error aprobando pedido:', error);
    return { success: false, error: error.message };
  }
};