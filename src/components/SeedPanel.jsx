import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, Loader2, Upload } from 'lucide-react';
import { isCatalogLoaded, seedCatalog } from '../lib/seedCromos';
import { TOTAL_CROMOS } from '../lib/cromosData';

function SeedPanel({ onClose }) {
  const [checking, setChecking] = useState(true);
  const [alreadyLoaded, setAlreadyLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const check = async () => {
      const loaded = await isCatalogLoaded();
      setAlreadyLoaded(loaded);
      setChecking(false);
    };
    check();
  }, []);

  const handleSeed = async () => {
    setLoading(true);
    setProgress(0);
    setResult(null);

    const res = await seedCatalog((uploaded, total) => {
      setProgress(Math.round((uploaded / total) * 100));
    });

    setResult(res);
    setLoading(false);

    if (res.success) {
      setAlreadyLoaded(true);
    }
  };

  return (
    <div className="fwc-card p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-8 h-8 text-fwc-neon" />
        <div>
          <h3 className="font-display font-bold text-xl text-white">
            Panel de Administración
          </h3>
          <p className="text-gray-400 text-sm">
            Carga inicial del catálogo de cromos
          </p>
        </div>
      </div>

      <div className="bg-fwc-bg/50 rounded-lg p-4 mb-6 border border-fwc-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">Cromos a cargar</span>
          <span className="text-fwc-gold font-bold font-display text-2xl">
            {TOTAL_CROMOS}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Estado del catálogo</span>
          {checking ? (
            <span className="text-gray-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Verificando...
            </span>
          ) : alreadyLoaded ? (
            <span className="text-green-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Cargado en Firestore
            </span>
          ) : (
            <span className="text-fwc-accent flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              No cargado todavía
            </span>
          )}
        </div>
      </div>

      {loading && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Subiendo cromos...</span>
            <span className="text-fwc-neon font-bold">{progress}%</span>
          </div>
          <div className="h-3 bg-fwc-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-fwc-gold to-fwc-neon transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {result && (
        <div className={`p-4 rounded-lg mb-6 ${result.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          {result.success ? (
            <p className="text-green-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              ¡Carga exitosa! Se subieron {result.total} cromos.
            </p>
          ) : (
            <p className="text-fwc-accent flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Error: {result.error}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSeed}
          disabled={loading || alreadyLoaded || checking}
          className="flex-1 bg-fwc-gold hover:bg-yellow-500 text-fwc-bg font-display font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Cargando...
            </>
          ) : alreadyLoaded ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Ya cargado
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Cargar catálogo
            </>
          )}
        </button>

        <button
          onClick={onClose}
          className="px-6 py-3 border border-fwc-border rounded-lg text-gray-400 hover:text-white hover:border-white transition-colors"
        >
          Cerrar
        </button>
      </div>

      <p className="text-gray-500 text-xs mt-6 text-center">
        ⚠️ Este panel solo debe usarse una vez. Después se desactivará.
      </p>
    </div>
  );
}

export default SeedPanel;