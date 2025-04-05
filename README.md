# EcoBalance

EcoBalance é um sistema de gestão ambiental que permite o controle de propriedades, clientes, ratificações e gerenciamento de usuários.

## Funcionalidades

O sistema possui as seguintes funcionalidades principais:

### Gerenciamento de Clientes
- Cadastro de clientes
- Listagem com filtros e ordenação
- Edição e exclusão de clientes

### Gestão de Propriedades
- Cadastro de propriedades associadas a clientes
- Listagem com filtros e ordenação
- Edição e exclusão de propriedades

### Ratificações
- Sistema de tracking de ratificações ambientais
- Visualização por status (Rascunho, Ajuste, Revisão, Aprovada, Pendente, Protocolada)
- Indicadores de progresso e métricas
- Design responsivo (tabela em desktop, cards em mobile)

### Gerenciamento de Usuários
- Três níveis de acesso: Administrador, Desenvolvedor e Membro
- Meu Perfil: gerenciamento de informações pessoais e preferências
- Criar Novo Usuário: interface para cadastro de novos usuários
- Usuários do Sistema: listagem de todos os usuários com controle de status

### Configurações
- Configurações gerais do sistema
- Configurações de segurança
- Configurações de email
- Limites e cotas
- Gerenciamento de funções e permissões

## Tecnologias

- React
- TypeScript
- MUI Joy UI
- LocalStorage para persistência de dados (simula API)

## Estrutura do Projeto

### Diretórios Principais

- `src/components`: Componentes reutilizáveis da aplicação
- `src/data`: Modelos de dados e mock data
- `src/pages`: Páginas da aplicação
- `src/services`: Camada de serviço que conecta aos dados

### Páginas

- Dashboard: Visão geral do sistema
- Clientes: Gerenciamento de clientes
- Propriedades: Gerenciamento de propriedades
- Ratificações: Gerenciamento de ratificações ambientais
- Meu Perfil: Gerenciamento de perfil do usuário
- Novo Usuário: Criação de novos usuários
- Usuários: Listagem e gestão de usuários
- Configurações: Configurações do sistema

## Iniciar a Aplicação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
``` 