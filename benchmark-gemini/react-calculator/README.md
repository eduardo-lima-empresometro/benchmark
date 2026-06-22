# Calculadora em React

Uma aplicação de calculadora simples e funcional desenvolvida com React, TypeScript e Vite.

## Visão Geral

Este projeto é uma calculadora web que suporta operações aritméticas básicas, manipulação de números decimais, e funcionalidades essenciais como limpar a entrada e apagar o último dígito. A interface é responsiva, adaptando-se a diferentes tamanhos de tela (desktop e mobile), e foi construída com foco em acessibilidade e usabilidade, suportando tanto cliques do mouse quanto entrada via teclado.

## Funcionalidades

- **Operações Básicas**: Soma, Subtração, Multiplicação e Divisão.
- **Funções Adicionais**: Porcentagem, troca de sinal (+/-).
- **Controle de Entrada**: Suporte a números decimais, limpar tudo (AC), e apagar último caractere (DEL).
- **Histórico Persistente**: Salva automaticamente os cálculos bem-sucedidos.
  - O histórico é mantido no `localStorage` e recarregado ao abrir a aplicação.
  - Permite reutilizar resultados anteriores com um clique.
  - Possui uma função para limpar todo o histórico.
- **Tratamento de Erro**: Exibe uma mensagem clara ao tentar dividir por zero.
- **Responsividade**: Layout adaptável para desktops e dispositivos móveis.
- **Acessibilidade**: Botões com rótulos claros, estados de foco visíveis e estrutura semântica.
- **Entrada Dupla**: Funciona com cliques do mouse e atalhos do teclado.

## Tecnologias Utilizadas

- **React**: Biblioteca para construção da interface de usuário.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Vite**: Ferramenta de build moderna e rápida para desenvolvimento frontend.
- **Vitest**: Framework de testes para projetos Vite.
- **React Testing Library**: Utilitários para testar componentes React.
- **ESLint**: Ferramenta para identificar e corrigir problemas no código.

## Instalação e Execução

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Pré-requisitos

- Node.js (versão 18.x ou superior)
- npm (geralmente instalado com o Node.js)

### Passos

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd react-calculator
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`.

## Scripts Disponíveis

O projeto vem com os seguintes scripts configurados no `package.json`:

- `npm run dev`: Inicia o servidor de desenvolvimento com Hot Module Replacement (HMR).
- `npm run build`: Compila o projeto para produção na pasta `dist`.
- `npm run test`: Executa os testes automatizados usando Vitest.
- `npm run lint`: Analisa o código em busca de erros de linting.

## Decisões Técnicas

- **Gerenciamento de Estado**: A lógica foi dividida em dois hooks customizados para manter a separação de responsabilidades:
  - `useCalculator`: Centraliza o estado da calculadora e toda a lógica de negócio das operações. O estado é "levantado" para o componente `App.js` para permitir que o input do teclado também interaja com a lógica.
  - `useHistory`: Gerencia o estado do histórico de cálculos, incluindo a persistência de dados no `localStorage`. Este hook é completamente desacoplado da lógica da calculadora.
- **Orquestração de Hooks**: O componente `App.tsx` atua como um orquestrador, inicializando ambos os hooks (`useCalculator` e `useHistory`) e gerenciando a comunicação entre eles através de callbacks. Quando um cálculo é bem-sucedido, `useCalculator` invoca um callback que aciona a adição do resultado ao `useHistory`.
- **Estilização**: Foi utilizado CSS puro com variáveis para o tema. A abordagem "CSS-in-CSS" (sem bibliotecas de CSS-in-JS) foi escolhida pela simplicidade e performance. O layout é baseado em Flexbox e CSS Grid para criar uma estrutura responsiva.
- **Testes**: A estratégia de testes combina testes de unidade para os hooks (`useCalculator` e `useHistory`) com testes de integração para os componentes React. Isso garante que tanto a lógica de negócio quanto a interação do usuário na UI funcionem como esperado. O `localStorage` é mockado nos testes de unidade para garantir um ambiente de teste determinístico.
- **Acessibilidade**: Foram aplicadas práticas básicas de acessibilidade, como o uso de botões (`<button>`) semanticamente corretos, atributos `aria-label` em seções importantes e estados de `:focus-visible` para navegação via teclado.

---
Feito com ❤️ por um assistente de IA.
