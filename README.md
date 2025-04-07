# EcoBalance

<div align="center">
  <img src="public/ecobalance-logo.svg" alt="EcoBalance Logo" width="200"/>
  <p><strong>Sistema de Gestão Ambiental para Propriedades Rurais</strong></p>
</div>

[![React](https://img.shields.io/badge/React-18.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![MUI Joy UI](https://img.shields.io/badge/MUI%20Joy%20UI-5.0.0-007FFF?logo=mui)](https://mui.com/joy-ui/getting-started/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Execução](#instalação-e-execução)
- [Documentação](#documentação)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🌟 Visão Geral

EcoBalance é um sistema completo para gestão de processos de ratificação ambiental de propriedades rurais em áreas de fronteira, conforme a Lei Federal nº 13.178/2015. A plataforma automatiza e organiza o processo de regularização, permitindo que produtores rurais cumpram a legislação ambiental de forma eficiente.

**Principais benefícios:**

- Gerenciamento centralizado de propriedades rurais e processos de ratificação
- Acompanhamento detalhado do status de cada ratificação
- Organização e validação de documentos necessários
- Interface intuitiva que simplifica processos burocráticos complexos
- Alertas e notificações sobre prazos importantes

## 🚀 Funcionalidades

### Gestão de Ratificações

- **Criação e acompanhamento**: Processo guiado para criação de novas ratificações com acompanhamento de status (Rascunho, Ajuste, Revisão, Aprovada, Pendente, Protocolada)
- **Indicadores visuais**: Barras de progresso e indicadores de status para fácil visualização
- **Prazos e alertas**: Notificações sobre datas-limite conforme a Lei 13.178/2015
- **Revisão de documentação**: Sistema de checklist para garantir conformidade documental

### Gerenciamento de Clientes

- Cadastro completo de clientes com informações de contato
- Histórico de ratificações por cliente
- Perfis de acesso personalizados
- Filtros e busca avançada

### Cadastro de Propriedades

- Registro detalhado de propriedades rurais com geolocalização
- Identificação automática de propriedades em faixa de fronteira
- Armazenamento de documentação relacionada à propriedade
- Integração com dados geográficos

### Sistema de Usuários

- **Níveis de acesso**: Administrador, Desenvolvedor e Membro
- **Perfil personalizado**: Gerenciamento de informações pessoais e preferências
- **Controle de permissões**: Acesso granular às funcionalidades do sistema
- **Histórico de atividades**: Registro de ações realizadas no sistema

### Suporte e Documentação

- Base de conhecimento integrada
- Seção de Perguntas Frequentes
- Tutoriais passo a passo
- Documentação sobre a legislação pertinente

## 🛠️ Tecnologias

- **Frontend**:
  - React 18
  - TypeScript
  - MUI Joy UI (componentes e sistema de design)
  - React Router (navegação)
  
- **Gerenciamento de Estado**:
  - React Context API
  - LocalStorage para persistência (simulando backend)

- **Visualização de Dados**:
  - Gráficos e indicadores visuais
  - Tabelas interativas com filtros

- **UI/UX**:
  - Design responsivo (mobile, tablet e desktop)
  - Tema claro/escuro personalizável
  - Padrões de acessibilidade WCAG

## 📁 Estrutura do Projeto

```
ecobalance/
├── public/               # Recursos estáticos
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── novaRatificacao/  # Componentes do processo de ratificação
│   │   └── ...
│   ├── data/             # Modelos de dados e mock data
│   ├── pages/            # Páginas da aplicação
│   ├── services/         # Serviços e APIs
│   ├── utils/            # Funções utilitárias
│   ├── App.tsx           # Componente principal
│   └── index.tsx         # Ponto de entrada
├── package.json          # Dependências e scripts
└── README.md             # Documentação
```

### Principais Módulos

- **Dashboard**: Visão geral do sistema com KPIs e atividades recentes
- **Ratificações**: Listagem e gerenciamento de processos de ratificação
- **Nova Ratificação**: Fluxo guiado para criação de novas ratificações
- **Clientes**: Gerenciamento de clientes e contatos
- **Propriedades**: Cadastro e detalhamento de propriedades rurais
- **Usuários**: Gerenciamento de usuários do sistema
- **Suporte**: Documentação e recursos de ajuda
- **Configurações**: Personalização do sistema

## 🚦 Instalação e Execução

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/sua-empresa/ecobalance.git
   cd ecobalance
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   # ou
   yarn start
   ```

4. Acesse a aplicação em `http://localhost:3000`

### Build para Produção

```bash
npm run build
# ou
yarn build
```

## 📚 Documentação

### Processo de Ratificação

A ratificação de propriedades rurais em faixa de fronteira (até 150km do território nacional) é uma exigência legal conforme a Lei Federal nº 13.178/2015. O não cumprimento pode resultar na perda do direito de propriedade.

O EcoBalance guia o usuário por todas as etapas desse processo:

1. **Cadastro de propriedade**: Informações básicas e geolocalização
2. **Dados dos proprietários**: Identificação dos responsáveis legais
3. **Documentação**: Upload e organização dos documentos necessários
4. **Revisão e envio**: Verificação final e submissão para aprovação
5. **Acompanhamento**: Monitoramento do status do processo

### Prazo Legal

⚠️ **IMPORTANTE**: O prazo para ratificação de propriedades rurais em faixa de fronteira termina em **22 de outubro de 2025**, conforme estabelecido pela legislação vigente.

## 👥 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Convenções de Código

- Utilize TypeScript para todos os componentes
- Siga o padrão de nomenclatura PascalCase para componentes
- Mantenha a documentação atualizada
- Escreva testes para novas funcionalidades

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

---

<div align="center">
  <p>Desenvolvido por <a href="https://v2carbon.com">V2Carbon</a> © 2025</p>
  <p>
    <a href="mailto:contato@v2carbon.com">contato@v2carbon.com</a> | 
    <a href="https://v2carbon.com">www.v2carbon.com</a>
  </p>
</div> 