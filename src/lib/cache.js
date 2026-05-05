// Sistema simple de caché global para datos que no cambian frecuentemente
// Evita tener que pedirlos a Firebase cada vez que se cambia de pantalla

class AppCache {
  constructor() {
    this.catalogo = null;
    this.catalogoPromise = null; // Para evitar cargas duplicadas simultáneas
  }

  // Catálogo de cromos (se carga UNA sola vez por sesión)
  async getCatalogo(fetchFn) {
    // Si ya está cacheado, devolverlo de inmediato
    if (this.catalogo) {
      return this.catalogo;
    }
    
    // Si ya hay una carga en progreso, esperar a que termine
    if (this.catalogoPromise) {
      return this.catalogoPromise;
    }
    
    // Iniciar carga
    this.catalogoPromise = fetchFn().then(data => {
      this.catalogo = data;
      this.catalogoPromise = null;
      return data;
    }).catch(error => {
      this.catalogoPromise = null;
      throw error;
    });
    
    return this.catalogoPromise;
  }

  // Invalidar el caché (por si el panel admin recarga)
  invalidarCatalogo() {
    this.catalogo = null;
    this.catalogoPromise = null;
  }

  // Limpiar todo (al cerrar sesión)
  limpiar() {
    this.catalogo = null;
    this.catalogoPromise = null;
  }
}

// Instancia única (Singleton pattern)
export const appCache = new AppCache();