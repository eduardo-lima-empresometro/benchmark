# Calculadora React

Calculadora responsiva feita com React, TypeScript e Vite. Suporta as quatro operações básicas, números decimais, porcentagem, inversão de sinal, limpeza e entrada pelo teclado.

## Histórico

Cada cálculo concluído é salvo com a expressão, o resultado e a data e hora local. O histórico permanece disponível após recarregar a página por meio do `localStorage`. É possível reutilizar qualquer resultado clicando nele ou apagar todos os registros com **Limpar histórico**. Cálculos com erro não são salvos.

## Executar

Requer Node.js 20 ou mais recente.

```bash
npm install
npm run dev
```

## Validar

```bash
npm run build
npm run lint
npm test
```

Atalhos de teclado: números, `+`, `-`, `*`, `/`, `%`, ponto ou vírgula, `Enter` para calcular, `Backspace` para apagar e `Escape` para limpar.
