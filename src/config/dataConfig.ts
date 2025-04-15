
/**
 * Configurazione del data store
 * Questo file definisce la modalità di gestione dei dati dell'applicazione
 */

export type DataStoreMode = 'supabase' | 'json';

interface DataConfig {
  /**
   * Modalità di archiviazione dati
   * - 'supabase': utilizza Supabase come database
   * - 'json': utilizza il file locale Experience.json
   */
  mode: DataStoreMode;
  
  // Configurazione Supabase (utilizzata solo in modalità 'supabase')
  supabase: {
    url: string;
    key: string;
  };
  
  // Percorso del file JSON (utilizzato solo in modalità 'json')
  jsonFilePath: string;
}

// Configurazione predefinita
const dataConfig: DataConfig = {
  // Modalità predefinita: 'json'
  mode: 'json',
  
  // Configurazione Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://kryuzmimyqqthpbxwnkn.supabase.co',
    key: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeXV6bWlteXFxdGhwYnh3bmtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDM3NDgxNiwiZXhwIjoyMDU5OTUwODE2fQ.gOR8swThSI--ZnymXiMhB5NIizLhtl3b8kJ8_SNB2ZY',
  },
  
  // Percorso del file JSON
  jsonFilePath: '/Experience.json'
};

export default dataConfig;
