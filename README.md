# Calculadoras do benchmark

O runner da raiz executa os projetos Codex e Gemini em paralelo, mantendo as saídas identificadas no mesmo terminal.

## Instalar, compilar e iniciar

```bash
npm start
```

- Codex: <http://localhost:5173>
- Gemini: <http://localhost:5174>

Use `Ctrl+C` para encerrar os dois servidores.

## Comandos disponíveis

```bash
npm run install:all  # instala dependências nos dois projetos
npm run build:all    # gera os dois builds
npm run test:all     # executa os testes uma vez
npm run lint:all     # executa lint
npm run validate     # executa lint, testes e build
npm run dev          # inicia ambos sem instalar ou compilar
```
