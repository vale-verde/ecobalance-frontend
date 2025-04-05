import { Endereco, Documento } from './clientes';

export type Propriedade = {
  id: string;
  nome: string;
  matricula: string;
  ccir?: string;
  car?: string;
  numeroART?: string;
  comarca?: string;
  areaTotal?: number;
  valorPropriedade?: number;
  dataRegistro: string;
  observacoes?: string;
  endereco?: Endereco;
  documentos?: Documento[];
  clientesVinculados?: string[]; // Array de IDs de clientes
};

export const propriedadesData: Propriedade[] = [
  {
    id: '001',
    nome: 'Fazenda Boa Vista',
    matricula: 'MAT-12345',
    ccir: '123456789012',
    car: 'CAR-SP-1234567890123',
    numeroART: 'ART-987654',
    comarca: 'São Paulo',
    areaTotal: 120.5,
    valorPropriedade: 1200000,
    dataRegistro: '10/04/2023',
    observacoes: 'Propriedade com plantação de soja.',
    endereco: {
      cep: '14870-000',
      estado: 'SP',
      cidade: 'Jaboticabal',
      logradouro: 'Estrada Rural KM 15',
      bairro: 'Zona Rural'
    },
    clientesVinculados: ['001', '003']
  },
  {
    id: '002',
    nome: 'Sítio São João',
    matricula: 'MAT-67890',
    ccir: '987654321098',
    car: 'CAR-MG-0987654321098',
    comarca: 'Belo Horizonte',
    areaTotal: 35.8,
    valorPropriedade: 450000,
    dataRegistro: '15/04/2023',
    endereco: {
      cep: '32600-000',
      estado: 'MG',
      cidade: 'Betim',
      logradouro: 'Rodovia Rural, s/n',
      bairro: 'Interior'
    },
    clientesVinculados: ['002']
  },
  {
    id: '003',
    nome: 'Rancho Alegre',
    matricula: 'MAT-24680',
    ccir: '246810121416',
    car: 'CAR-GO-2468101214161',
    numeroART: 'ART-123456',
    comarca: 'Goiânia',
    areaTotal: 67.3,
    valorPropriedade: 780000,
    dataRegistro: '20/04/2023',
    observacoes: 'Criação de gado.',
    endereco: {
      cep: '75001-970',
      estado: 'GO',
      cidade: 'Anápolis',
      logradouro: 'Estrada do Campo, Km 5',
      bairro: 'Zona Rural'
    },
    clientesVinculados: ['005']
  },
  {
    id: '004',
    nome: 'Chácara Primavera',
    matricula: 'MAT-13579',
    ccir: '135792468101',
    car: 'CAR-RS-1357924681012',
    comarca: 'Porto Alegre',
    areaTotal: 12.6,
    valorPropriedade: 320000,
    dataRegistro: '25/04/2023',
    endereco: {
      cep: '92990-000',
      estado: 'RS',
      cidade: 'Eldorado do Sul',
      logradouro: 'Estrada dos Açudes, 200',
      bairro: 'Interior'
    }
  },
  {
    id: '005',
    nome: 'Fazenda Santa Luzia',
    matricula: 'MAT-86420',
    ccir: '864209753124',
    car: 'CAR-MT-8642097531240',
    numeroART: 'ART-654321',
    comarca: 'Cuiabá',
    areaTotal: 850.2,
    valorPropriedade: 4500000,
    dataRegistro: '30/04/2023',
    observacoes: 'Plantação de algodão e soja.',
    endereco: {
      cep: '78890-000',
      estado: 'MT',
      cidade: 'Sorriso',
      logradouro: 'Rodovia BR-163, Km 150',
      bairro: 'Zona Rural'
    },
    clientesVinculados: ['004', '005']
  }
]; 