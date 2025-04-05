import { Propriedade, propriedadesData } from '../data/propriedades';

// Simulate API latency
const SIMULATED_DELAY = 500;

// localStorage key
const PROPRIEDADES_STORAGE_KEY = 'ecobalance_propriedades';

// Initialize localStorage with sample data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(PROPRIEDADES_STORAGE_KEY)) {
    localStorage.setItem(PROPRIEDADES_STORAGE_KEY, JSON.stringify(propriedadesData));
  }
};

// Get all properties from storage
export const getPropriedades = async (): Promise<Propriedade[]> => {
  initializeStorage();
  return new Promise((resolve) => {
    setTimeout(() => {
      const propriedadesString = localStorage.getItem(PROPRIEDADES_STORAGE_KEY) || '[]';
      resolve(JSON.parse(propriedadesString));
    }, SIMULATED_DELAY);
  });
};

// Get property by ID
export const getPropriedadeById = async (id: string): Promise<Propriedade | undefined> => {
  initializeStorage();
  return new Promise((resolve) => {
    setTimeout(() => {
      const propriedadesString = localStorage.getItem(PROPRIEDADES_STORAGE_KEY) || '[]';
      const propriedades: Propriedade[] = JSON.parse(propriedadesString);
      const propriedade = propriedades.find(p => p.id === id);
      resolve(propriedade);
    }, SIMULATED_DELAY);
  });
};

// Create new property
export const createPropriedade = async (propriedade: Omit<Propriedade, 'id' | 'dataRegistro'>): Promise<Propriedade> => {
  initializeStorage();
  return new Promise((resolve) => {
    setTimeout(() => {
      const propriedadesString = localStorage.getItem(PROPRIEDADES_STORAGE_KEY) || '[]';
      const propriedades: Propriedade[] = JSON.parse(propriedadesString);
      
      // Generate new ID
      const newId = (parseInt(propriedades.length > 0 ? propriedades[propriedades.length - 1].id : '0') + 1).toString().padStart(3, '0');
      
      // Create new propriedade with ID and dataRegistro
      const newPropriedade: Propriedade = {
        ...propriedade,
        id: newId,
        dataRegistro: new Date().toLocaleDateString('pt-BR')
      };
      
      // Add to array and save
      propriedades.push(newPropriedade);
      localStorage.setItem(PROPRIEDADES_STORAGE_KEY, JSON.stringify(propriedades));
      
      resolve(newPropriedade);
    }, SIMULATED_DELAY);
  });
};

// Update existing property
export const updatePropriedade = async (propriedade: Propriedade): Promise<Propriedade> => {
  initializeStorage();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const propriedadesString = localStorage.getItem(PROPRIEDADES_STORAGE_KEY) || '[]';
      const propriedades: Propriedade[] = JSON.parse(propriedadesString);
      
      const index = propriedades.findIndex(p => p.id === propriedade.id);
      if (index === -1) {
        reject(new Error('Propriedade não encontrada'));
        return;
      }
      
      // Update property
      propriedades[index] = propriedade;
      localStorage.setItem(PROPRIEDADES_STORAGE_KEY, JSON.stringify(propriedades));
      
      resolve(propriedade);
    }, SIMULATED_DELAY);
  });
};

// Delete property
export const deletePropriedade = async (id: string): Promise<boolean> => {
  initializeStorage();
  return new Promise((resolve) => {
    setTimeout(() => {
      const propriedadesString = localStorage.getItem(PROPRIEDADES_STORAGE_KEY) || '[]';
      const propriedades: Propriedade[] = JSON.parse(propriedadesString);
      
      const filteredPropriedades = propriedades.filter(p => p.id !== id);
      localStorage.setItem(PROPRIEDADES_STORAGE_KEY, JSON.stringify(filteredPropriedades));
      
      resolve(true);
    }, SIMULATED_DELAY);
  });
}; 