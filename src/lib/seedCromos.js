// Script para cargar el catálogo maestro de cromos a Firestore
// SOLO SE EJECUTA UNA VEZ — después se desactiva
import { collection, doc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { CROMOS_FWC2026 } from './cromosData';

const CATALOG_COLLECTION = 'catalogo_cromos';

// Verifica si el catálogo ya fue cargado
export const isCatalogLoaded = async () => {
  try {
    const snapshot = await getDocs(collection(db, CATALOG_COLLECTION));
    return snapshot.size > 0;
  } catch (error) {
    console.error('Error verificando catálogo:', error);
    return false;
  }
};

// Carga los 994 cromos a Firestore en lotes (más eficiente)
export const seedCatalog = async (onProgress) => {
  try {
    const total = CROMOS_FWC2026.length;
    const BATCH_SIZE = 400; // Firestore permite 500 max por batch
    let uploaded = 0;

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const slice = CROMOS_FWC2026.slice(i, i + BATCH_SIZE);

      slice.forEach((cromo) => {
        // Usar el código como ID (ej: "MEX-01") para evitar duplicados
        const docId = `${cromo.numero}`.padStart(4, '0');
        const ref = doc(db, CATALOG_COLLECTION, docId);
        batch.set(ref, cromo);
      });

      await batch.commit();
      uploaded += slice.length;
      
      if (onProgress) onProgress(uploaded, total);
    }

    return { success: true, total: uploaded };
  } catch (error) {
    console.error('Error cargando catálogo:', error);
    return { success: false, error: error.message };
  }
};

// Lee el catálogo completo desde Firestore
export const fetchCatalog = async () => {
  try {
    const snapshot = await getDocs(collection(db, CATALOG_COLLECTION));
    const cromos = [];
    snapshot.forEach((doc) => {
      cromos.push({ id: doc.id, ...doc.data() });
    });
    // Ordenar por número
    cromos.sort((a, b) => a.numero - b.numero);
    return cromos;
  } catch (error) {
    console.error('Error leyendo catálogo:', error);
    return [];
  }
};