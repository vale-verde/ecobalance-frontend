export type Cliente = {
  id: string;
  nome: string;
  documento: string;
  tipoCliente: 'PF' | 'PJ';
  timestamp: string;
};

export const clientesData: Cliente[] = [
  {
    id: '001',
    nome: 'João Silva',
    documento: 'CPF: 123.456.789-00',
    tipoCliente: 'PF',
    timestamp: '10/04/2023'
  },
  {
    id: '002',
    nome: 'Maria Souza',
    documento: 'CPF: 987.654.321-00',
    tipoCliente: 'PF',
    timestamp: '15/04/2023'
  },
  {
    id: '003',
    nome: 'Tech Solutions Ltda',
    documento: 'CNPJ: 12.345.678/0001-90',
    tipoCliente: 'PJ',
    timestamp: '20/04/2023'
  },
  {
    id: '004',
    nome: 'Carlos Ferreira',
    documento: 'CPF: 456.789.123-00',
    tipoCliente: 'PF',
    timestamp: '25/04/2023'
  },
  {
    id: '005',
    nome: 'Eco Agro S.A.',
    documento: 'CNPJ: 98.765.432/0001-10',
    tipoCliente: 'PJ',
    timestamp: '30/04/2023'
  }
]; 