export type Endereco = {
  cep?: string;
  estado?: string;
  cidade?: string;
  logradouro?: string;
  bairro?: string;
  complemento?: string;
};

export type Documento = {
  id: string;
  nome: string;
  arquivo: string; // URL or base64
  tipo: string;
  dataUpload: string;
};

export type Socio = {
  id: string;
  nome: string;
  cpf: string;
  rg?: string;
  nacionalidade?: string;
  dataNascimento?: string;
  administrador: boolean;
  endereco?: Endereco;
};

export type Conjuge = {
  nome: string;
  cpf?: string;
  rg?: string;
  nacionalidade?: string;
  dataNascimento?: string;
  documentos?: Documento[];
};

export type Cliente = {
  id: string;
  nome: string;
  documento: string;
  tipoCliente: 'PF' | 'PJ';
  timestamp: string;
  // Campos comuns
  observacoes?: string;
  endereco?: Endereco;
  documentos?: Documento[];
  
  // Campos específicos para PF
  cpf?: string;
  rg?: string;
  dataNascimento?: string;
  nacionalidade?: string;
  estadoCivil?: 'Solteiro' | 'Casado' | 'Divorciado' | 'Viúvo' | 'União Estável';
  conjuge?: Conjuge;
  
  // Campos específicos para PJ
  cnpj?: string;
  razaoSocial?: string;
  numeroMinimoAssinaturas?: number;
  socios?: Socio[];
};

export const clientesData: Cliente[] = [
  {
    id: '001',
    nome: 'João Silva',
    documento: 'CPF: 123.456.789-00',
    tipoCliente: 'PF',
    timestamp: '10/04/2023',
    cpf: '123.456.789-00',
    rg: '22.333.444-5',
    dataNascimento: '1980-05-15',
    nacionalidade: 'Brasileira',
    estadoCivil: 'Casado',
    endereco: {
      cep: '01310-100',
      estado: 'SP',
      cidade: 'São Paulo',
      logradouro: 'Av. Paulista, 1000',
      bairro: 'Bela Vista',
      complemento: 'Apto 123'
    },
    conjuge: {
      nome: 'Ana Silva',
      cpf: '987.654.321-00',
      rg: '11.222.333-4',
      nacionalidade: 'Brasileira',
      dataNascimento: '1982-08-21'
    },
    observacoes: 'Cliente desde 2020.'
  },
  {
    id: '002',
    nome: 'Maria Souza',
    documento: 'CPF: 987.654.321-00',
    tipoCliente: 'PF',
    timestamp: '15/04/2023',
    cpf: '987.654.321-00',
    rg: '33.444.555-6',
    dataNascimento: '1975-10-20',
    nacionalidade: 'Brasileira',
    estadoCivil: 'Solteiro',
    endereco: {
      cep: '22460-030',
      estado: 'RJ',
      cidade: 'Rio de Janeiro',
      logradouro: 'Rua das Palmeiras, 50',
      bairro: 'Botafogo',
      complemento: 'Bloco B'
    }
  },
  {
    id: '003',
    nome: 'Tech Solutions Ltda',
    documento: 'CNPJ: 12.345.678/0001-90',
    tipoCliente: 'PJ',
    timestamp: '20/04/2023',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Tech Solutions Tecnologia Ltda',
    numeroMinimoAssinaturas: 2,
    endereco: {
      cep: '04538-132',
      estado: 'SP',
      cidade: 'São Paulo',
      logradouro: 'Rua Tecnologia, 200',
      bairro: 'Itaim Bibi',
      complemento: 'Andar 10'
    },
    socios: [
      {
        id: '101',
        nome: 'Pedro Mendes',
        cpf: '111.222.333-44',
        rg: '10.111.222-3',
        nacionalidade: 'Brasileira',
        dataNascimento: '1970-01-10',
        administrador: true,
        endereco: {
          cep: '01452-000',
          estado: 'SP',
          cidade: 'São Paulo',
          logradouro: 'Rua dos Pinheiros, 100',
          bairro: 'Pinheiros'
        }
      },
      {
        id: '102',
        nome: 'Mariana Costa',
        cpf: '555.666.777-88',
        rg: '22.333.444-5',
        nacionalidade: 'Brasileira',
        dataNascimento: '1985-05-15',
        administrador: false
      }
    ],
    observacoes: 'Empresa de tecnologia especializada em soluções web.'
  },
  {
    id: '004',
    nome: 'Carlos Ferreira',
    documento: 'CPF: 456.789.123-00',
    tipoCliente: 'PF',
    timestamp: '25/04/2023',
    cpf: '456.789.123-00',
    rg: '44.555.666-7',
    dataNascimento: '1990-12-05',
    nacionalidade: 'Brasileira',
    estadoCivil: 'Divorciado',
    endereco: {
      cep: '90050-170',
      estado: 'RS',
      cidade: 'Porto Alegre',
      logradouro: 'Rua dos Andradas, 500',
      bairro: 'Centro'
    }
  },
  {
    id: '005',
    nome: 'Eco Agro S.A.',
    documento: 'CNPJ: 98.765.432/0001-10',
    tipoCliente: 'PJ',
    timestamp: '30/04/2023',
    cnpj: '98.765.432/0001-10',
    razaoSocial: 'Eco Agro Sustentabilidade S.A.',
    numeroMinimoAssinaturas: 1,
    endereco: {
      cep: '70070-120',
      estado: 'DF',
      cidade: 'Brasília',
      logradouro: 'SBS Quadra 2, Bloco E',
      bairro: 'Asa Sul'
    },
    socios: [
      {
        id: '201',
        nome: 'Roberto Almeida',
        cpf: '222.333.444-55',
        nacionalidade: 'Brasileira',
        dataNascimento: '1965-07-22',
        administrador: true
      }
    ],
    observacoes: 'Empresa focada em soluções sustentáveis para o agronegócio.'
  }
]; 