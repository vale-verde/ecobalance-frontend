import { Cliente, clientesData } from '../data/clientes';

// Simulate API latency
const SIMULATED_DELAY = 500;

// localStorage key
const CLIENTES_STORAGE_KEY = 'ecobalance_clientes';

// Initialize localStorage with sample data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(CLIENTES_STORAGE_KEY)) {
    localStorage.setItem(CLIENTES_STORAGE_KEY, JSON.stringify(clientesData));
  }
};

// Get all clients from storage
export const getClientes = async (): Promise<Cliente[]> => {
  initializeStorage();
  return new Promise((resolve) => {
    setTimeout(() => {
      const clientesString = localStorage.getItem(CLIENTES_STORAGE_KEY) || '[]';
      resolve(JSON.parse(clientesString));
    }, SIMULATED_DELAY);
  });
};

// Get client by ID
export const getClienteById = async (id: string): Promise<Cliente | undefined> => {
  initializeStorage();
  return new Promise((resolve) => {
    setTimeout(() => {
      const clientesString = localStorage.getItem(CLIENTES_STORAGE_KEY) || '[]';
      const clientes: Cliente[] = JSON.parse(clientesString);
      const cliente = clientes.find(c => c.id === id);
      resolve(cliente);
    }, SIMULATED_DELAY);
  });
};

// Create new client
export const createCliente = async (cliente: Omit<Cliente, 'id' | 'timestamp'>): Promise<Cliente> => {
  initializeStorage();
  return new Promise((resolve) => {
    setTimeout(() => {
      const clientesString = localStorage.getItem(CLIENTES_STORAGE_KEY) || '[]';
      const clientes: Cliente[] = JSON.parse(clientesString);
      
      // Generate new ID
      const newId = (parseInt(clientes.length > 0 ? clientes[clientes.length - 1].id : '0') + 1).toString().padStart(3, '0');
      
      // Create new cliente with ID and timestamp
      const newCliente: Cliente = {
        ...cliente,
        id: newId,
        timestamp: new Date().toLocaleDateString('pt-BR')
      };
      
      // Add to array and save
      clientes.push(newCliente);
      localStorage.setItem(CLIENTES_STORAGE_KEY, JSON.stringify(clientes));
      
      resolve(newCliente);
    }, SIMULATED_DELAY);
  });
};

// Update existing client
export const updateCliente = async (cliente: Cliente): Promise<Cliente> => {
  initializeStorage();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const clientesString = localStorage.getItem(CLIENTES_STORAGE_KEY) || '[]';
      const clientes: Cliente[] = JSON.parse(clientesString);
      
      const index = clientes.findIndex(c => c.id === cliente.id);
      if (index === -1) {
        reject(new Error('Cliente não encontrado'));
        return;
      }
      
      // Update client
      clientes[index] = cliente;
      localStorage.setItem(CLIENTES_STORAGE_KEY, JSON.stringify(clientes));
      
      resolve(cliente);
    }, SIMULATED_DELAY);
  });
};

// Delete client
export const deleteCliente = async (id: string): Promise<boolean> => {
  initializeStorage();
  return new Promise((resolve) => {
    setTimeout(() => {
      const clientesString = localStorage.getItem(CLIENTES_STORAGE_KEY) || '[]';
      const clientes: Cliente[] = JSON.parse(clientesString);
      
      const filteredClientes = clientes.filter(c => c.id !== id);
      localStorage.setItem(CLIENTES_STORAGE_KEY, JSON.stringify(filteredClientes));
      
      resolve(true);
    }, SIMULATED_DELAY);
  });
}; 